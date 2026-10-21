"use client";
import { getAssetUrl } from "@/utils/paths";
import React, { useState, useEffect } from "react";

export default function ClientModelViewer({ glbUrl, lang = "pl" }: { glbUrl: string; lang?: "pl" | "en" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!customElements.get("model-viewer")) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
        script.onload = () => setMounted(true);
        document.head.appendChild(script);
      } else {
        setMounted(true);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-void h-[380px] md:h-[540px] flex items-center justify-center">
        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">
          {lang === "pl" ? "Ładowanie modelu 3D..." : "Loading 3D model..."}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-void">
      <div className="w-full h-[380px] md:h-[540px]">
        {React.createElement("model-viewer", {
          src: getAssetUrl(glbUrl),
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
