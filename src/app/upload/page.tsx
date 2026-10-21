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

export default function DirectUploaderPage() {
  const [password, setPassword] = useState("zenart3d");
  const [folder, setFolder] = useState<"auto" | "models" | "videos">("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Lista plików na serwerze
  const [serverFiles, setServerFiles] = useState<{ models: ServerFile[]; videos: ServerFile[] }>({
    models: [],
    videos: [],
  });
  const [activeTab, setActiveTab] = useState<"models" | "videos">("models");
  const [copiedListItem, setCopiedListItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wczytaj zapamiętane hasło z localStorage
  useEffect(() => {
    const saved = localStorage.getItem("zenart_upload_pass");
    if (saved) setPassword(saved);
    fetchServerFiles();
  }, []);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    localStorage.setItem("zenart_upload_pass", val);
  };

  const fetchServerFiles = async () => {
    try {
      const res = await fetch(getAssetUrl("/api/upload"));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg(null);
      setUploadedUrl(null);
      setCopied(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMsg(null);
      setUploadedUrl(null);
      setCopied(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMsg("Wybierz plik do wgrania.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("password", password);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", getAssetUrl("/api/upload"), true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && response.success) {
          setUploadedUrl(response.url);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          fetchServerFiles();
        } else {
          setErrorMsg(response.error || "Wystąpił błąd podczas wgrywania pliku.");
        }
      } catch {
        setErrorMsg(`Błąd serwera (kod ${xhr.status}).`);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setErrorMsg("Błąd połączenia z serwerem. Upewnij się, że plik nie przekracza limitów serwera.");
    };

    xhr.send(formData);
  };

  const copyToClipboard = (text: string, isFromList: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isFromList) {
      setCopiedListItem(text);
      setTimeout(() => setCopiedListItem(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Nawigacja i Nagłówek */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyanlight text-xs font-bold uppercase tracking-wider mb-2">
              ⚡ Direct Media Uploader
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Wgrywarka Mediów (FTP / Serwer)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Wgrywaj duże modele 3D (.glb) oraz wideo (.mp4) z pominięciem limitów GitHuba (45 MB) i Keystatic.
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
          </div>
        </div>

        {/* Hasło i ustawienia folderu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#110921] border border-white/10 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Klucz dostępu (Hasło)</span>
              <span className="text-[10px] text-cyanlight lowercase">domyślne: zenart3d</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Wpisz hasło..."
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
                Modele (.glb)
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

        {/* Pole Uploadu Drag & Drop */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-cyan/60 rounded-3xl p-8 sm:p-12 text-center bg-[#110921]/60 hover:bg-[#110921] transition-all cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".glb,.gltf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyanlight mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {selectedFile ? selectedFile.name : "Przeciągnij i upuść plik tutaj lub kliknij, aby wybrać"}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Obsługuje modele 3D (.glb, .gltf), filmy i animacje (.mp4, .webm, .mov) oraz grafiki w wysokiej rozdzielczości.
          </p>

          {selectedFile && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan/20 border border-cyan/40 text-cyanlight text-xs font-bold">
              <span>Rozmiar: {formatBytes(selectedFile.size)}</span>
              <span>•</span>
              <span>Typ: {selectedFile.type || "plik binarny"}</span>
            </div>
          )}
        </div>

        {/* Pasek postępu i przycisk startu */}
        {selectedFile && !uploadedUrl && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              disabled={uploading}
              onClick={handleUpload}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all ${
                uploading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan hover:bg-cyanlight text-black shadow-xl shadow-cyan/20 cursor-pointer active:scale-95"
              }`}
            >
              {uploading ? `Wgrywanie... ${progress}%` : "🚀 Rozpocznij Wgrywanie"}
            </button>

            {uploading && (
              <div className="w-full flex-1 space-y-1">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-cyan h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-xs text-slate-400 font-bold">{progress}%</div>
              </div>
            )}
          </div>
        )}

        {/* Błąd */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sukces - Gotowy link do skopiowania */}
        {uploadedUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Plik został pomyślnie zapisany na serwerze!
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Ścieżka do wklejenia w Keystatic:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={uploadedUrl}
                  className="flex-1 bg-[#07040e] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-cyanlight font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(uploadedUrl)}
                  className="px-6 py-2.5 rounded-xl bg-cyan hover:bg-cyanlight text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {copied ? "✓ Skopiowano!" : "📋 Kopiuj ścieżkę"}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              💡 <strong>Co teraz zrobić?</strong> Przejdź do panelu Keystatic, otwórz projekt i wklej tę ścieżkę w polu{" "}
              <code className="text-cyanlight bg-black/40 px-1.5 py-0.5 rounded">LUB ścieżka do pliku .glb</code> lub{" "}
              <code className="text-cyanlight bg-black/40 px-1.5 py-0.5 rounded">LUB link do wideo</code>.
            </p>

            <button
              type="button"
              onClick={() => {
                setUploadedUrl(null);
                setSelectedFile(null);
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white underline cursor-pointer pt-2"
            >
              + Wgraj kolejny plik
            </button>
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

