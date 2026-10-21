"use client";
import { getOptimizedImageUrl } from "@/utils/images";
import React, { useState } from "react";

export default function WireframeSlider({ mainImage, wireframeImage, lang = "pl" }: { mainImage: string; wireframeImage: string; lang?: "pl" | "en" }) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="mb-16">
      <h2 className="text-xl font-extrabold uppercase tracking-wider mb-6 text-slate-200 border-b border-white/10 pb-4">
        {lang === "pl" ? "Siatka modelu (Wireframe)" : "Model Wireframe"}
      </h2>
      
      {/* Dodane ograniczenie max-h-[75vh], wyśrodkowanie margin-x-auto, a szerokość dopasowuje się do obrazka wewnątrz (w-auto/inline-block) */}
      <div className="relative w-full max-w-max mx-auto rounded-3xl overflow-hidden shadow-2xl group select-none">
        
        {/* max-h-[75vh] upewnia się, że obrazek nigdy nie będzie wyższy niż 75% wysokości ekranu, w-auto zapobiega rozciągnięciu w poziomie */}
        <img 
          src={getOptimizedImageUrl(mainImage, 1200)} 
          alt="Main render" 
          loading="lazy"
          decoding="async"
          className="block max-h-[75vh] w-auto h-auto object-contain" 
        />
        
        {/* Kontener z siatką przykrywa obrazek bazowy */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}>
          <img 
            src={getOptimizedImageUrl(wireframeImage, 1200)} 
            alt="Wireframe" 
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover" 
          />
        </div>

        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderValue} 
          aria-label={lang === "pl" ? "Porównanie siatki modelu z renderem" : "Compare wireframe with render"}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
        
        <div className="absolute top-0 bottom-0 w-1 bg-cyan pointer-events-none z-10" style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cyan rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
            </svg>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-10 pointer-events-none px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
          {lang === "pl" ? "Przeciągnij by porównać" : "Drag to compare"}
        </div>
      </div>
    </div>
  );
}
