"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { getAssetUrl } from "@/utils/paths";

function ClientDefaultIcon({ name }: { name: string }) {
  const n = name.toUpperCase();
  if (n.includes("HC")) return <svg className="w-10 h-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /><path d="M9 12h6M9 9v6M15 9v6" /></svg>;
  if (n.includes("NEUTREA")) return <svg className="w-10 h-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M9 15V9l6 6V9" /></svg>;
  if (n.includes("KALSI")) return <svg className="w-10 h-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8" /></svg>;
  if (n.includes("7PUNKT")) return <span className="text-2xl font-black tracking-tighter text-white/85">7p<span className="text-cyan">::</span></span>;
  if (n.includes("IRONSHIELD")) return <svg className="w-10 h-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (n.includes("SPI")) return <span className="text-xl font-extrabold border-2 border-white/70 px-2 py-0.5 rounded text-white/85">SPI55</span>;
  return <svg className="w-10 h-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10l4-4 4 4" /></svg>;
}

export default function PortfolioClient({ settings, categories, projects }: any) {
  const [lang, setLangState] = useState<"pl" | "en">("pl");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("zenart_lang") as "pl" | "en";
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLang = (newLang: "pl" | "en") => {
    setLangState(newLang);
    localStorage.setItem("zenart_lang", newLang);
  };

  const filteredProjects = !activeCategory || activeCategory === "all" 
      ? projects : projects.filter((p: any) => p.entry.category === activeCategory);

  const aspectClass = (ratio: string) => {
    if (ratio === "vertical") return "aspect-[3/4]";
    if (ratio === "video") return "aspect-video";
    return "aspect-square";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');` }} />
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl rounded-full bg-[#0e071c]/85 backdrop-blur-xl border border-white/10 px-6 py-3.5 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <Link href="/" style={{ fontFamily: "'Michroma', sans-serif" }} className="tracking-wider text-sm md:text-base flex items-center gap-2.5 text-left cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" />
          <span>ZenArt<span className="text-cyanlight">_3D</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/" className="hover:text-cyanlight transition cursor-pointer">
            Home
          </Link>
          {categories.map((cat: any) => (
            <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} className="hover:text-cyanlight transition cursor-pointer uppercase">
              {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
            </button>
          ))}
          <a href="#contact" className="hover:text-cyanlight transition">
            {lang === "pl" ? "Kontakt" : "Contact"}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "pl" ? "en" : "pl")} className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-cyan/50 transition cursor-pointer">
            {lang === "pl" ? <>PL | <span className="text-slate-400">EN</span></> : <><span className="text-slate-400">PL</span> | EN</>}
          </button>
          <a href="#contact" className="hidden sm:inline-block px-4 py-1.5 rounded-full bg-cyan hover:bg-cyanlight text-black font-bold text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.35)] uppercase">
            {lang === "pl" ? settings.ctaButtonPl : (settings.ctaButtonEn || settings.ctaButtonPl)}
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden px-2.5 py-1 rounded-lg border border-white/15 text-xs">
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-22 z-40 rounded-2xl bg-[#110921]/95 backdrop-blur-xl border border-white/15 p-6 flex flex-col gap-4 md:hidden shadow-2xl">
          <Link href="/" className="text-left text-sm font-bold uppercase py-2 border-b border-white/10">Home</Link>
          {categories.map((cat: any) => (
            <button key={cat.slug} onClick={() => { setActiveCategory(cat.slug); setMobileMenuOpen(false); }} className="text-left text-sm font-bold uppercase py-2 border-b border-white/10 text-cyanlight">
              {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
            </button>
          ))}
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-left text-sm font-bold uppercase py-2 border-b border-white/10">
            {lang === "pl" ? "Kontakt" : "Contact"}
          </a>
        </div>
      )}

      {!activeCategory && (
        <main>
          <section className="relative min-h-[95vh] flex items-end pb-16 pt-32 px-6 md:px-16 overflow-hidden border-b border-white/5">
            {settings.showreelUrl && (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105">
                <source src={getAssetUrl(settings.showreelUrl)} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/65 to-[#1f0618]/35" />

            <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div>
                <p className="text-cyanlight text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  {lang === "pl" ? settings.brandSubheaderPl : (settings.brandSubheaderEn || settings.brandSubheaderPl)}
                </p>
                <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl leading-[1.1] mb-5">
                  {lang === "pl" ? settings.heroTitlePl : (settings.heroTitleEn || settings.heroTitlePl)}
                </h1>
                <p className="text-slate-300 max-w-2xl text-base md:text-lg font-light leading-relaxed">
                  {lang === "pl" ? settings.heroSubPl : (settings.heroSubEn || settings.heroSubPl)}
                </p>
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat: any) => {
                const imgSrc = cat.entry.coverImage || cat.entry.externalCoverUrl;
                return (
                  <div key={cat.slug} onClick={() => { setActiveCategory(cat.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="category-square aspect-square group cursor-pointer rounded-2xl overflow-hidden relative flex items-end p-8 bg-surface">
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                      <rect 
                        x="0" y="0" width="100%" height="100%" rx="16" 
                        fill="none" stroke="#22d3ee" strokeWidth="6" 
                        pathLength="100" strokeDasharray="100" 
                        className="[stroke-dashoffset:100] lg:group-hover:[stroke-dashoffset:0] transition-all duration-[600ms] ease-[cubic-bezier(.7,0,.32,1)]" 
                        style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.8))" }} 
                      />
                    </svg>
                    <div className="absolute inset-0 bg-cyan/10 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-[600ms] ease-out pointer-events-none z-10" />

                    {imgSrc && <img src={getAssetUrl(imgSrc)} alt={cat.entry.titlePl} className="absolute inset-0 w-full h-full object-cover opacity-65 lg:group-hover:scale-105 lg:group-hover:opacity-85 transition duration-700" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                    <div className="relative z-10 w-full">
                      <div className="w-8 h-0.5 bg-cyan mb-3 lg:group-hover:w-16 transition-all duration-300 shadow-[0_0_10px_#22d3ee]" />
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
                        {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="py-16 border-t border-white/10 overflow-hidden relative">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-12">
              {lang === "pl" ? "Klienci i współpraca" : "Clients & Collaborations"}
            </p>
            <div className="relative max-w-7xl mx-auto overflow-hidden">
              <div className="animate-marquee gap-12 items-center flex" style={{ animationPlayState: 'running' }}>
                {[...settings.clients, ...settings.clients].map((client: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center justify-center w-40 shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-surface/80 border border-white/10 flex items-center justify-center mb-3">
                      {client.logoImage ? <img src={getAssetUrl(client.logoImage)} alt={client.name} className="max-h-12 max-w-full object-contain" /> : <ClientDefaultIcon name={client.name} />}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 tracking-wider">{client.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {activeCategory && (
        <section className="pt-32 pb-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 mb-10 border-b border-white/10">
            <div>
              <button onClick={() => setActiveCategory(null)} className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cyanlight hover:underline mb-2 cursor-pointer">
                ← {lang === "pl" ? "Wróć do strony głównej" : "Back to Home"}
              </button>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                {activeCategory === "all" 
                  ? (lang === "pl" ? "Wszystkie Projekty" : "All Projects") 
                  : (lang === "pl" ? categories.find((c: any) => c.slug === activeCategory)?.entry.titlePl : (categories.find((c: any) => c.slug === activeCategory)?.entry.titleEn || categories.find((c: any) => c.slug === activeCategory)?.entry.titlePl))
                }
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
              <button onClick={() => setActiveCategory("all")} className={`px-4 py-2 rounded-full transition cursor-pointer ${activeCategory === "all" ? "bg-cyan text-black font-extrabold" : "border border-white/10 bg-surface text-slate-300 hover:border-cyan/40"}`}>
                {lang === "pl" ? "Wszystkie" : "All"}
              </button>
              {categories.map((cat: any) => (
                <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} className={`px-4 py-2 rounded-full transition cursor-pointer ${activeCategory === cat.slug ? "bg-cyan text-black font-extrabold" : "border border-white/10 bg-surface text-slate-300 hover:border-cyan/40"}`}>
                  {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
                </button>
              ))}
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProjects.map((proj: any) => {
              const thumb = proj.entry.thumbnail || proj.entry.externalThumbnailUrl;
              return (
                <Link href={`/projects/${proj.slug}`} key={proj.slug} className={`block break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-surface ${aspectClass(proj.entry.aspectRatio)}`}>
                  
                  <img src={getAssetUrl(thumb)} alt={proj.entry.titlePl} className="w-full h-full object-cover lg:group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-black/70 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
                      {lang === "pl" ? proj.entry.titlePl : (proj.entry.titleEn || proj.entry.titlePl)}
                    </h3>
                  </div>

                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ContactFooter settings={settings} lang={lang} />
    </>
  );
}