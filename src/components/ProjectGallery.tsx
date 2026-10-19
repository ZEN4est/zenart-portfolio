"use client";
import React, { useState } from "react";

export default function ProjectGallery({ images }: { images: { url: string; caption: string }[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setLightboxIndex(idx)}
            className="aspect-square cursor-pointer rounded-xl overflow-hidden border border-white/10 group bg-surface relative"
          >
            <img src={img.url} alt={img.caption || `Ujęcie ${idx + 1}`} className="w-full h-full object-cover md:group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/50 transition flex items-center justify-center pointer-events-none">
              <span className="text-white opacity-0 md:group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button onClick={() => setLightboxIndex(null)} className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 cursor-pointer z-50">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img src={images[lightboxIndex].url} className="max-w-full max-h-[85vh] rounded-xl object-contain relative z-40" alt="Powiększone ujęcie" />
        </div>
      )}
    </div>
  );
}