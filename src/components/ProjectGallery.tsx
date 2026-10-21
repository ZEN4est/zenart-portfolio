"use client";
import { getAssetUrl } from "@/utils/paths";
import { getOptimizedImageUrl } from "@/utils/images";
import React, { useState } from "react";

export default function ProjectGallery({ images }: { images: { url: string; caption: string }[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* Czysty, organiczny układ galerii - bez sztywnych kwadratowych kafelek i bez grubych obramowań */}
      <div className="columns-1 sm:columns-2 gap-8 space-y-8">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setLightboxIndex(idx)}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(6,182,212,0.15)] active:scale-[0.98]"
          >
            {/* Zdjęcie w galerii ładuje się w zoptymalizowanym, ultra-lekkim formacie WebP */}
            <img 
              src={getOptimizedImageUrl(img.url, 1080)} 
              alt={img.caption || `Ujęcie ${idx + 1}`} 
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out" 
            />
            
            {/* Subtelny gradient i ikona powiększenia po najechaniu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              {img.caption && (
                <span className="text-xs font-semibold text-white/90 drop-shadow mb-1">
                  {img.caption}
                </span>
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyanlight flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                Powiększ ujęcie
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox do powiększania */}
      {lightboxIndex !== null && (
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
        >
          <button 
            onClick={() => setLightboxIndex(null)} 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 cursor-pointer z-50"
            aria-label="Zamknij"
          >
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img 
            src={getAssetUrl(images[lightboxIndex].url)} 
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl cursor-default" 
            alt="Powiększone ujęcie" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
