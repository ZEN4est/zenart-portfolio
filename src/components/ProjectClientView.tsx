"use client";
import Link from "next/link";
import { getAssetUrl } from "@/utils/paths";
import React, { useState, useEffect } from "react";
import ProjectGallery from "@/components/ProjectGallery";
import WireframeSlider from "@/components/WireframeSlider";
import ClientModelViewer from "@/components/ClientModelViewer";
import ProjectHeader from "@/components/ProjectHeader";
import ContactFooter from "@/components/ContactFooter";

export default function ProjectClientView({ project, settings, categories, allImages, mainThumb, glbUrl }: any) {
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
    galleryTitle: lang === "pl" ? "Galeria Projektu" : "Project Gallery"
  };

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
            <ProjectGallery images={allImages} />
          </div>
        )}

        {glbUrl && (
          <div className="mb-16">
            <h2 className="text-xl font-extrabold uppercase tracking-wider mb-6 text-slate-200 border-b border-white/10 pb-4">
              {t.modelTitle}
            </h2>
            <ClientModelViewer glbUrl={glbUrl} lang={lang} />
          </div>
        )}

        {project.wireframeImage && mainThumb && (
          <WireframeSlider mainImage={mainThumb} wireframeImage={project.wireframeImage} lang={lang} />
        )}

        {project.videoUrl && (
          <div className="mb-16">
            <h2 className="text-xl font-extrabold uppercase tracking-wider mb-6 text-slate-200 border-b border-white/10 pb-4">
              {t.videoTitle}
            </h2>
            <video controls className="w-full rounded-3xl shadow-2xl bg-black max-h-[75vh]">
              <source src={getAssetUrl(project.videoUrl)} type="video/mp4" />
            </video>
          </div>
        )}
      </article>

      <ContactFooter settings={settings} lang={lang} />
    </>
  );
}
