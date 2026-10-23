"use client";
import { getAssetUrl } from "@/utils/paths";
import React, { useState, useEffect, useRef } from "react";

export default function ClientModelViewer({ 
  glbUrl, 
  lang = "pl" 
}: { 
  glbUrl: string; 
  lang?: "pl" | "en"; 
}) {
  const [scriptMounted, setScriptMounted] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const viewerRef = useRef<any>(null);

  // 1. Sprawdzenie typu urządzenia (dotykowe vs mysz)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // 2. Dołączenie skryptu Google model-viewer
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!customElements.get("model-viewer")) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
        script.onload = () => setScriptMounted(true);
        document.head.appendChild(script);
      } else {
        setScriptMounted(true);
      }
    }
  }, []);

  // 3. Nasłuchiwanie postępu pobierania geometrii i tekstur PBR
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      const raw = event.detail?.totalProgress ?? 0;
      const pct = Math.min(Math.max(Math.round(raw * 100), 5), 100);
      setProgress(pct);
    };

    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => setModelLoaded(true), 150);
    };

    viewer.addEventListener("progress", handleProgress);
    viewer.addEventListener("load", handleLoad);

    return () => {
      viewer.removeEventListener("progress", handleProgress);
      viewer.removeEventListener("load", handleLoad);
    };
  }, [scriptMounted, glbUrl]);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-[#07040e] border border-white/10 group">
      <div className="w-full h-[400px] sm:h-[460px] md:h-[560px] relative">
        {scriptMounted && (
          React.createElement("model-viewer", {
            ref: viewerRef,
            src: getAssetUrl(glbUrl),
            "camera-controls": true,
            "auto-rotate": true,
            "touch-action": "pan-y",
            "shadow-intensity": "1.2",
            "shadow-softness": "0.8",
            "environment-image": "neutral",
            exposure: "1.05",
            loading: "eager",
            style: { 
              width: "100%", 
              height: "100%", 
              backgroundColor: "#07040e",
              outline: "none"
            },
          })
        )}

        {/* 4. Wizualny pasek i ekran ładowania modelu 3D */}
        <div 
          className={`absolute inset-0 bg-[#07040e]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all duration-500 z-20 ${
            modelLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Cyber-spinner z animowanym pierścieniem */}
          <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
            <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <svg className="w-4 h-4 text-cyanlight animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
          </div>

          {/* Tytuł ładowania */}
          <h4 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase mb-1">
            {lang === "pl" ? "Wczytywanie modelu 3D..." : "Loading 3D Model..."}
          </h4>

          {/* Subtelny opis */}
          <p className="text-[11px] sm:text-xs text-slate-400 font-light mb-4 text-center max-w-xs">
            {lang === "pl" 
              ? "Pobieranie geometrii, materiałów i tekstur PBR" 
              : "Downloading geometry, materials & PBR textures"}
          </p>

          {/* Pasek postępu */}
          <div className="w-56 sm:w-64 h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan to-cyanlight rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Wartość procentowa */}
          <span className="text-xs font-mono font-bold text-cyanlight mt-2 tracking-wider">
            {progress}%
          </span>
        </div>
      </div>

      {/* 5. Etykieta ze wskazówką interakcji po załadowaniu */}
      <div 
        className={`absolute bottom-4 left-4 pointer-events-none text-xs font-semibold text-cyanlight bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan/30 shadow-lg transition-opacity duration-300 z-10 ${
          modelLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {isTouchDevice ? (
          lang === "pl" 
            ? "👆 Dotknij i przeciągnij (360°) • Uszczypnij, aby przybliżyć" 
            : "👆 Touch & drag to rotate (360°) • Pinch to zoom"
        ) : (
          lang === "pl" 
            ? "🖱️ Obracaj model myszką (360°) • Rolka przybliża" 
            : "🖱️ Drag mouse to rotate (360°) • Scroll to zoom"
        )}
      </div>
    </div>
  );
}
