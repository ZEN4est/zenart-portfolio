"use client";
import Link from "next/link";
import { getAssetUrl } from "@/utils/paths";
import React, { useState, useEffect } from "react";
import ProjectGallery from "@/components/ProjectGallery";
import WireframeSlider from "@/components/WireframeSlider";
import ClientModelViewer from "@/components/ClientModelViewer";
import ProjectVideoPlayer from "@/components/ProjectVideoPlayer";
import ProjectHeader from "@/components/ProjectHeader";
import ContactFooter from "@/components/ContactFooter";

export default function ProjectClientView({
  project,
  settings,
  categories,
  allImages,
  mainThumb,
  models = [],
  videos = [],
  wireframes = [],
  glbUrl,
}: any) {
  const [lang, setLang] = useState<"pl" | "en">("pl");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zenart_lang") as "pl" | "en";
    if (saved) setLang(saved);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const catObj = categories?.find((c: any) => c.slug === project.category);
  const backHref = project.category ? `/?category=${project.category}` : "/";

  const t = {
    back: lang === "pl" ? "← Wróć do kategorii" : "← Back to category",
    client: lang === "pl" ? "Klient:" : "Client:",
    completed: lang === "pl" ? "Ukończono:" : "Completed:",
    modelTitle: lang === "pl" ? "Model 3D (Interaktywny)" : "3D Model (Interactive)",
    videoTitle: lang === "pl" ? "Prezentacja Wideo" : "Video Presentation",
    wireframeTitle: lang === "pl" ? "Siatka modelu (Wireframe)" : "Model Wireframe",
    galleryTitle: lang === "pl" ? "Galeria Projektu" : "Project Gallery"
  };

  // Bezpieczne zestawienie modeli (tablica z props lub fallback)
  const displayModels = models.length > 0
    ? models
    : (glbUrl ? [{ url: glbUrl, titlePl: "", titleEn: "" }] : []);

  // Bezpieczne zestawienie wideo (tablica z props lub fallback)
  const displayVideos = videos.length > 0
    ? videos
    : (project.videoUrl ? [{ url: project.videoUrl, titlePl: "", titleEn: "" }] : []);

  // Bezpieczne zestawienie porównań wireframe (tablica z props lub fallback)
  const displayWireframes = wireframes.length > 0
    ? wireframes
    : (project.wireframeImage && mainThumb ? [{ mainImage: mainThumb, wireframeImage: project.wireframeImage, titlePl: "", titleEn: "" }] : []);

  return (
    <>
      <ProjectHeader categories={categories} settings={settings} />

      <article className="pt-32 pb-24 max-w-6xl mx-auto px-6">
        <Link 
          href={backHref} 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyanlight hover:underline mb-8 cursor-pointer active:scale-95 transition-transform"
        >
          {t.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 mb-12 border-b border-white/10 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              {lang === "pl" ? project.titlePl : (project.titleEn || project.titlePl)}
            </h1>
            {(project.descriptionPl || project.descriptionEn) && (
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                {lang === "pl" ? project.descriptionPl : (project.descriptionEn || project.descriptionPl)}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 space-y-3 text-sm pt-2">
            {project.tools && (
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Tools:</span>
                <span className="font-bold text-white text-right">{project.tools}</span>
              </div>
            )}
            {project.polycount && (
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Polycount:</span>
                <span className="font-bold text-cyanlight text-right">{project.polycount}</span>
              </div>
            )}
            {project.client && (
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">{t.client}</span>
                <span className="font-bold text-white text-right">{project.client}</span>
              </div>
            )}
            {project.completedDate && (
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">{t.completed}</span>
                <span className="font-bold text-white text-right">{project.completedDate}</span>
              </div>
            )}
          </div>
        </div>

        {allImages.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-extrabold uppercase tracking-wider mb-6 text-slate-200 border-b border-white/10 pb-4">
              {t.galleryTitle}
            </h2>
            <ProjectGallery images={allImages} lang={lang} />
          </div>
        )}

        {/* Modele 3D (wsparcie dla wielu modeli bez sztucznych numerków 1/2/3) */}
        {displayModels.length > 0 && (
          <div className="mb-16 space-y-12">
            {displayModels.map((m: any, idx: number) => {
              const modelTitle = lang === "pl" ? m.titlePl : (m.titleEn || m.titlePl);
              const headingText = modelTitle || (idx === 0 ? t.modelTitle : null);

              return (
                <div key={idx} className="space-y-4">
                  {headingText && (
                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-slate-200 border-b border-white/10 pb-4">
                      {headingText}
                    </h2>
                  )}
                  <ClientModelViewer glbUrl={m.url} lang={lang} />
                </div>
              );
            })}
          </div>
        )}

        {/* Porównania Wireframe (wsparcie dla wielu suwaków bez numeracji) */}
        {displayWireframes.map((wf: any, idx: number) => {
          const wfTitle = lang === "pl" ? wf.titlePl : (wf.titleEn || wf.titlePl);
          return (
            <WireframeSlider
              key={idx}
              mainImage={wf.mainImage}
              wireframeImage={wf.wireframeImage}
              title={wfTitle || (idx === 0 ? t.wireframeTitle : null)}
              lang={lang}
            />
          );
        })}

        {/* Prezentacje Wideo (wsparcie dla wielu wideo bez sztucznych numerków 1/2/3) */}
        {displayVideos.length > 0 && (
          <div className="mb-16 space-y-12">
            {displayVideos.map((vid: any, idx: number) => {
              const vidTitle = lang === "pl" ? vid.titlePl : (vid.titleEn || vid.titlePl);
              const headingText = vidTitle || (idx === 0 ? t.videoTitle : null);

              return (
                <div key={idx} className="space-y-4">
                  {headingText && (
                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-slate-200 border-b border-white/10 pb-4">
                      {headingText}
                    </h2>
                  )}
                  <ProjectVideoPlayer url={vid.url} />
                </div>
              );
            })}
          </div>
        )}
      </article>

      <ContactFooter settings={settings} lang={lang} />
    </>
  );
}
