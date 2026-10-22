"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getAssetUrl } from "@/utils/paths";

interface ServerFile {
  name: string;
  url: string;
  size: number;
  mtime: string;
}

interface QueueItem {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  resultUrl?: string;
  error?: string;
}

export default function DirectUploaderPage() {
  const [password, setPassword] = useState("");
  const [folder, setFolder] = useState<"auto" | "models" | "videos">("auto");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Lista plików na serwerze
  const [serverFiles, setServerFiles] = useState<{ models: ServerFile[]; videos: ServerFile[] }>({
    models: [],
    videos: [],
  });
  const [activeTab, setActiveTab] = useState<"models" | "videos">("models");
  const [copiedListItem, setCopiedListItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem("zenart_admin_pass") || localStorage.getItem("zenart_upload_pass") || "";
    } catch {}
    if (saved) setPassword(saved);
    fetchServerFiles(saved);
  }, []);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    try {
      localStorage.setItem("zenart_upload_pass", val);
    } catch {}
  };

  const fetchServerFiles = async (passOverride?: string) => {
    try {
      const activePass = passOverride !== undefined ? passOverride : password;
      const headers: Record<string, string> = {};
      if (activePass) {
        headers["x-admin-password"] = activePass;
      }
      const res = await fetch(getAssetUrl("/api/upload"), {
        headers,
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setServerFiles({
          models: data.models || [],
          videos: data.videos || [],
        });
      }
    } catch (e) {
      console.error("Błąd pobierania listy plików:", e);
    }
  };

  const addFilesToQueue = (fileList: FileList | File[]) => {
    const newItems: QueueItem[] = Array.from(fileList).map((f) => ({
      id: `${f.name}_${f.size}_${Date.now()}_${Math.random()}`,
      file: f,
      status: "pending",
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    if (isUploadingAll) return;
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    if (isUploadingAll) return;
    setQueue([]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Sekwencyjny upload plik po pliku z dokładnym paskiem postępu dla każdego pliku
  const uploadSingleFile = (item: QueueItem): Promise<{ success: boolean; url?: string; error?: string }> => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("password", password);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", getAssetUrl("/api/upload"), true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
          );
        }
      };

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && response.success) {
            resolve({ success: true, url: response.url });
          } else {
            resolve({ success: false, error: response.error || "Błąd zapisu pliku." });
          }
        } catch {
          resolve({ success: false, error: `Błąd serwera (kod ${xhr.status}).` });
        }
      };

      xhr.onerror = () => {
        resolve({ success: false, error: "Błąd połączenia z serwerem." });
      };

      xhr.send(formData);
    });
  };

  const handleStartUpload = async () => {
    const pendingItems = queue.filter((i) => i.status === "pending" || i.status === "error");
    if (pendingItems.length === 0) return;

    setIsUploadingAll(true);
    let completedCount = 0;

    for (const item of queue) {
      if (item.status === "done") {
        completedCount++;
        continue;
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", progress: 0 } : q))
      );

      const res = await uploadSingleFile(item);

      if (res.success) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "done", progress: 100, resultUrl: res.url } : q
          )
        );
      } else {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "error", error: res.error } : q
          )
        );
      }

      completedCount++;
      setOverallProgress(Math.round((completedCount / queue.length) * 100));
    }

    setIsUploadingAll(false);
    fetchServerFiles();
  };

  const copyToClipboard = (text: string, isFromList: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isFromList) {
      setCopiedListItem(text);
      setTimeout(() => setCopiedListItem(null), 2000);
    } else {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 3000);
    }
  };

  const copyAllUploadedUrls = () => {
    const urls = queue.filter((i) => i.status === "done" && i.resultUrl).map((i) => i.resultUrl);
    if (urls.length > 0) {
      navigator.clipboard.writeText(urls.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    }
  };

  const doneCount = queue.filter((i) => i.status === "done").length;
  const pendingCount = queue.filter((i) => i.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#07040e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Nawigacja i Nagłówek */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyanlight text-xs font-bold uppercase tracking-wider mb-2">
              ⚡ Multi Direct Media Uploader
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Wgrywarka Mediów (Wiele plików naraz)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Wgrywaj wiele filmów wideo, modeli 3D i ujęć bezpośrednio na serwer FTP bez limitów GitHuba.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/keystatic"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all"
            >
              ← Panel Keystatic
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-cyan/20 hover:bg-cyan/30 border border-cyan/40 text-xs font-bold uppercase tracking-wider text-cyanlight transition-all"
            >
              Portfolio
            </Link>
            <a
              href={getAssetUrl("/api/auth/logout")}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-all flex items-center gap-1.5"
            >
              Wyloguj
            </a>
          </div>
        </div>

        {/* Box informacyjny o formatach 3D */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan/5 border border-cyan/20 space-y-2 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-cyanlight font-bold uppercase tracking-wider">
            <span>💡 Wskazówka: Formaty Modeli 3D (GLB vs FBX i OBJ)</span>
          </div>
          <p>
            Do <strong>interaktywnego obrotu 360° w przeglądarce</strong> standardem internetowym jest format <strong>.GLB</strong> (glTF 2.0). Pakuje on całą geometrię, materiały PBR, mapy tekstur oraz animacje w jeden lekki, binarny plik.
          </p>
          <p className="text-slate-400">
            Pliki <strong>.FBX</strong> i <strong>.OBJ</strong> nie wspierają bezpośredniego PBR w przeglądarkach bez osobnych plików tekstur. Jeśli masz model w FBX/OBJ, wystarczy w Blenderze kliknąć: <code className="bg-black/60 px-1.5 py-0.5 rounded text-cyanlight">Plik → Eksportuj → glTF 2.0 (.glb)</code>, a wyeksportowany plik wrzucić tutaj! (Możesz tu też wgrać spakowane archiwum .ZIP z plikami FBX/OBJ).
          </p>
        </div>

        {/* Hasło i ustawienia folderu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#110921] border border-white/10 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Klucz dostępu (Hasło)</span>
              <span className="text-[10px] text-emerald-400 font-semibold lowercase">● autoryzacja aktywna</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Hasło sesji aktywne..."
              className="w-full bg-[#07040e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#110921] border border-white/10 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Katalog docelowy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFolder("auto")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  folder === "auto"
                    ? "bg-cyan text-black shadow-lg shadow-cyan/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                Auto (wg typu)
              </button>
              <button
                type="button"
                onClick={() => setFolder("models")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  folder === "models"
                    ? "bg-cyan text-black shadow-lg shadow-cyan/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                Modele 3D
              </button>
              <button
                type="button"
                onClick={() => setFolder("videos")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  folder === "videos"
                    ? "bg-cyan text-black shadow-lg shadow-cyan/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                Wideo (.mp4)
              </button>
            </div>
          </div>
        </div>

        {/* Strefa Drag & Drop z obsługą wielu plików */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-cyan/60 rounded-3xl p-8 sm:p-12 text-center bg-[#110921]/60 hover:bg-[#110921] transition-all cursor-pointer group"
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".glb,.gltf,.fbx,.obj,.blend,.zip,.rar,.7z,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyanlight mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Przeciągnij i upuść pliki tutaj lub kliknij (możesz zaznaczyć wiele plików naraz)
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Wideo (.mp4, .webm, .mov), Modele (.glb, .gltf, .fbx, .obj) oraz archiwa zip bez ograniczeń 45 MB.
          </p>
        </div>

        {/* Kolejka wybranych plików */}
        {queue.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#110921] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Wybrane pliki do wgrania:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan/20 border border-cyan/30 text-cyanlight text-xs font-bold">
                  {queue.length}
                </span>
                {doneCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    ✓ Wgrano: {doneCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {doneCount > 1 && (
                  <button
                    type="button"
                    onClick={copyAllUploadedUrls}
                    className="px-3 py-1.5 rounded-xl bg-cyan/20 hover:bg-cyan/30 border border-cyan/40 text-cyanlight font-bold text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    {copiedAll ? "✓ Skopiowano wszystkie!" : "📋 Kopiuj wszystkie ścieżki"}
                  </button>
                )}
                {!isUploadingAll && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyanlight text-xs font-bold cursor-pointer transition-all"
                  >
                    + Dodaj kolejne pliki
                  </button>
                )}
                {!isUploadingAll && (
                  <button
                    type="button"
                    onClick={clearQueue}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    Wyczyść listę
                  </button>
                )}
              </div>
            </div>

            {/* Lista elementów kolejki */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#07040e] border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-base">
                        {item.file.name.match(/\.(mp4|webm|mov)$/i) ? "🎬" : "🧊"}
                      </span>
                      <span className="font-semibold text-white truncate">{item.file.name}</span>
                      <span className="text-slate-500">({formatBytes(item.file.size)})</span>
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {item.status === "pending" && (
                        <span className="text-slate-400 text-[11px] font-bold">Oczekuje</span>
                      )}
                      {item.status === "uploading" && (
                        <span className="text-cyanlight text-[11px] font-bold animate-pulse">
                          Wgrywanie {item.progress}%
                        </span>
                      )}
                      {item.status === "done" && (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          ✓ Gotowe
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="text-rose-400 text-[11px] font-bold">
                          ✕ {item.error || "Błąd"}
                        </span>
                      )}

                      {!isUploadingAll && item.status !== "uploading" && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          title="Usuń z kolejki"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pasek postępu dla wgrywanego pliku */}
                  {item.status === "uploading" && (
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan h-full transition-all duration-150"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Wynik po wgraniu: gotowa ścieżka z przyciskiem kopiowania */}
                  {item.status === "done" && item.resultUrl && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={item.resultUrl}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyanlight font-mono select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.resultUrl!)}
                        className="px-3 py-1 rounded-lg bg-cyan hover:bg-cyanlight text-black font-bold text-xs whitespace-nowrap cursor-pointer active:scale-95 transition-all"
                      >
                        {copiedUrl === item.resultUrl ? "✓ Skopiowano" : "Kopiuj"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Przycisk startu wgrywania kolejki */}
            {pendingCount > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  disabled={isUploadingAll}
                  onClick={handleStartUpload}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all cursor-pointer ${
                    isUploadingAll
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-cyan hover:bg-cyanlight text-black shadow-xl shadow-cyan/20 active:scale-95"
                  }`}
                >
                  {isUploadingAll
                    ? `Wgrywanie plików... (${overallProgress}%)`
                    : `🚀 Wgraj ${pendingCount} ${pendingCount === 1 ? "plik" : "pliki"} na serwer`}
                </button>

                {isUploadingAll && (
                  <div className="w-full flex-1 space-y-1">
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-cyan h-full transition-all duration-300"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lista plików już wgranych na serwerze */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Pliki na serwerze</h2>
              <p className="text-xs text-slate-400">
                Możesz w każdej chwili skopiować ścieżkę do wgranych wcześniej assetów.
              </p>
            </div>

            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("models")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "models" ? "bg-cyan text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Modele ({serverFiles.models.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("videos")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "videos" ? "bg-cyan text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Wideo ({serverFiles.videos.length})
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#110921] border border-white/10 divide-y divide-white/5 overflow-hidden max-h-80 overflow-y-auto">
            {(serverFiles[activeTab] || []).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Brak plików w tym folderze na serwerze.
              </div>
            ) : (
              serverFiles[activeTab].map((item) => (
                <div
                  key={item.url}
                  className="p-3.5 px-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {item.url} • {formatBytes(item.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.url, true)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    {copiedListItem === item.url ? "✓ Skopiowano" : "Kopiuj"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
