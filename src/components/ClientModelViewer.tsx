"use client";
import React, { useState, useEffect } from "react";

export default function ClientModelViewer({ glbUrl, lang = "pl" }: { glbUrl: string; lang?: "pl" | "en" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full relative rounded-2xl overflow-hidden border border-white/15 bg-void h-[380px] md:h-[540px] flex items-center justify-center">
        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">
          {lang === "pl" ? "Ładowanie modelu 3D..." : "Loading 3D model..."}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-white/15 bg-void">
      <div className="w-full h-[380px] md:h-[540px]">
        {React.createElement("model-viewer", {
          src: glbUrl,
          "camera-controls": true,
          "auto-rotate": true,
          "shadow-intensity": "1",
          "environment-image": "neutral",
          style: { width: "100%", height: "100%", backgroundColor: "#090514" },
        })}
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none text-xs font-semibold text-cyanlight bg-black/80 px-3.5 py-2 rounded-xl border border-cyan/30">
        {lang === "pl" ? "🖱️ Obracaj model (360°) • Przybliżaj rolką" : "🖱️ Rotate model (360°) • Scroll to zoom"}
      </div>
    </div>
  );
}