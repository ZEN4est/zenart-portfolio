"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { getAssetUrl } from "@/utils/paths";
import { getOptimizedImageUrl } from "@/utils/images";

function ClientDefaultIcon({ name }: { name: string }) {
  const n = name.toUpperCase();
  if (n.includes("HC")) return <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /><path d="M9 12h6M9 9v6M15 9v6" /></svg>;
  if (n.includes("NEUTREA")) return <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M9 15V9l6 6V9" /></svg>;
  if (n.includes("KALSI")) return <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8" /></svg>;
  if (n.includes("7PUNKT")) return <span className="text-4xl font-black tracking-tighter text-white/95">7p<span className="text-cyan">::</span></span>;
  if (n.includes("IRONSHIELD")) return <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (n.includes("SPI")) return <span className="text-3xl font-extrabold border-2 border-white/80 px-3 py-1 rounded text-white/95">SPI55</span>;
  return <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10l4-4 4 4" /></svg>;
}

export default function PortfolioClient({ settings, categories, projects }: any) {
  const [lang, setLangState] = useState<"pl" | "en">("pl");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("zenart_lang") as "pl" | "en";
    if (savedLang) setLangState(savedLang);

    // Sprawdź czy w adresie URL przekazano parametr ?category=slug
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setActiveCategory(catParam);
      }
    }

    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get("category"));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setLang = (newLang: "pl" | "en") => {
    setLangState(newLang);
    localStorage.setItem("zenart_lang", newLang);
  };

  const selectCategory = (slug: string | null) => {
    setMobileMenuOpen(false);
    setActiveCategory(slug);
    if (typeof window !== "undefined") {
      const newUrl = slug ? `?category=${slug}` : window.location.pathname;
      window.history.pushState({}, '', newUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredProjects = !activeCategory || activeCategory === "all" 
      ? projects : projects.filter((p: any) => p.entry.category === activeCategory);

  const aspectClass = (ratio: string) => {
    if (ratio === "vertical") return "aspect-[3/4]";
    if (ratio === "video") return "aspect-video";
    return "aspect-square";
  };

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    if (activeCategory) {
      selectCategory(null);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clientList = settings.clients || [];
  const marqueeClients = [...clientList, ...clientList, ...clientList];

  return (
    <>
      {/* Pasek nawigacji u góry: Ujednolicona wielkość liter (UPPERCASE) */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-6 md:px-12 py-5 flex items-center justify-between bg-[#07040e]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <Link 
          href="/" 
          onClick={() => selectCategory(null)}
          style={{ fontFamily: "'Michroma', sans-serif" }} 
          className="tracking-wider text-base md:text-lg flex items-center gap-2.5 text-left cursor-pointer active:scale-95 transition-transform"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_var(--accent-light)]" />
          <span>ZenArt<span className="text-cyanlight">_3D</span></span>
        </Link>

        {/* Menu na desktopie: Ujednolicone napisy wielkimi literami */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-xs lg:text-sm font-bold tracking-wider uppercase text-slate-300">
          <button 
            type="button"
            onClick={() => selectCategory(null)} 
            className="hover:text-cyanlight transition cursor-pointer"
          >
            HOME
          </button>
          
          {categories.map((cat: any) => (
            <button 
              type="button"
              key={cat.slug} 
              onClick={() => selectCategory(cat.slug)} 
              className="hover:text-cyanlight transition cursor-pointer"
            >
              {lang === "pl" ? cat.entry.titlePl.toUpperCase() : (cat.entry.titleEn || cat.entry.titlePl).toUpperCase()}
            </button>
          ))}

          <button 
            type="button"
            onClick={() => handleNavClick("about")} 
            className="hover:text-cyanlight transition cursor-pointer"
          >
            {lang === "pl" ? "O MNIE" : "ABOUT"}
          </button>

          <button 
            type="button"
            onClick={() => handleNavClick("contact")} 
            className="hover:text-cyanlight transition cursor-pointer"
          >
            {lang === "pl" ? "KONTAKT" : "CONTACT"}
          </button>
        </nav>

        {/* Prawa strona paska */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setLang(lang === "pl" ? "en" : "pl")} 
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-cyan/50 transition cursor-pointer active:scale-95"
          >
            {lang === "pl" ? <>PL | <span className="text-slate-400">EN</span></> : <><span className="text-slate-400">PL</span> | EN</>}
          </button>

          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick("contact"); }}
            className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-cyan hover:bg-cyanlight text-black font-bold text-xs uppercase transition shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95"
          >
            {lang === "pl" ? settings.ctaButtonPl : (settings.ctaButtonEn || settings.ctaButtonPl)}
          </a>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)} 
            className="md:hidden px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer active:scale-90 transition"
            aria-label="Otwórz menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Menu mobilne: Pełnoekranowy, nowoczesny i spójny overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#07040e]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-6 md:hidden">
          {/* Górna belka w menu mobilnym */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span style={{ fontFamily: "'Michroma', sans-serif" }} className="tracking-wider text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_var(--accent-light)]" />
              <span>ZenArt<span className="text-cyanlight">_3D</span></span>
            </span>
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-lg text-white active:scale-90 transition cursor-pointer"
              aria-label="Zamknij menu"
            >
              ✕
            </button>
          </div>

          {/* Główne linki w menu mobilnym */}
          <div className="flex flex-col gap-3 py-8">
            <button 
              type="button"
              onClick={() => selectCategory(null)} 
              className="text-left text-3xl font-black uppercase tracking-tight text-white hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              HOME
            </button>
            
            {categories.map((cat: any) => (
              <button 
                type="button"
                key={cat.slug} 
                onClick={() => selectCategory(cat.slug)} 
                className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
              >
                {lang === "pl" ? cat.entry.titlePl.toUpperCase() : (cat.entry.titleEn || cat.entry.titlePl).toUpperCase()}
              </button>
            ))}

            <button 
              type="button"
              onClick={() => handleNavClick("about")} 
              className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              {lang === "pl" ? "O MNIE" : "ABOUT"}
            </button>

            <button 
              type="button"
              onClick={() => handleNavClick("contact")} 
              className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              {lang === "pl" ? "KONTAKT" : "CONTACT"}
            </button>
          </div>

          {/* Dolny pasek menu mobilnego */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <button 
              type="button"
              onClick={() => setLang(lang === "pl" ? "en" : "pl")} 
              className="font-bold px-4 py-2 rounded-full border border-white/20 text-white active:scale-95"
            >
              {lang === "pl" ? "JĘZYK: PL" : "LANGUAGE: EN"}
            </button>
            <a href={`mailto:${settings.email}`} className="text-cyanlight font-mono truncate max-w-[180px]">
              {settings.email}
            </a>
          </div>
        </div>
      )}

      {/* Widok strony głównej */}
      {!activeCategory && (
        <main>
          {/* Sekcja Hero: Zapełnia całą stronę (100vh) + spokojny, elegancki fade-in napisów */}
          <section className="relative h-screen min-h-screen w-full flex items-end pb-16 md:pb-24 pt-24 px-6 md:px-16 overflow-hidden border-b border-white/5">
            {settings.showreelUrl && (
              <video
                key={settings.showreelUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 w-full h-full object-cover opacity-40 scale-100"
              >
                <source src={`${getAssetUrl(settings.showreelUrl)}?v=2`} type="video/mp4" />
                <track kind="captions" srcLang="pl" label="Wideo w tle bez lektora" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/25 pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <p className="animate-hero-sub text-cyanlight text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-4">
                  {lang === "pl" ? settings.brandSubheaderPl : (settings.brandSubheaderEn || settings.brandSubheaderPl)}
                </p>
                <h1 className="animate-hero-title text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-[1.08] mb-6 tracking-tight text-white drop-shadow-md">
                  {lang === "pl" ? settings.heroTitlePl : (settings.heroTitleEn || settings.heroTitlePl)}
                </h1>
                <p className="animate-hero-desc text-slate-200 max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-8">
                  {lang === "pl" ? settings.heroSubPl : (settings.heroSubEn || settings.heroSubPl)}
                </p>

                {/* Przyciski z animacją wejścia i bezpośrednimi kotwicami */}
                <div className="animate-hero-buttons flex flex-wrap items-center gap-4">
                  <a 
                    href="#categories"
                    onClick={(e) => { e.preventDefault(); handleNavClick("categories"); }}
                    className="px-6 py-3.5 rounded-xl bg-cyan hover:bg-cyanlight text-black font-extrabold text-xs tracking-wider uppercase transition shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 cursor-pointer"
                  >
                    {lang === "pl" ? "Przeglądaj kategorie ↓" : "Explore categories ↓"}
                  </a>
                  <a 
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick("contact"); }}
                    className="px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:border-cyan/50 text-white font-bold text-xs tracking-wider uppercase transition active:scale-95 cursor-pointer"
                  >
                    {lang === "pl" ? "Wycena projektu" : "Request a quote"}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Sekcja KATEGORIE: 
              - Komputer: Sklejony, panoramiczny pasek na pełną szerokość z rozszerzaniem na hover
              - Telefon: Płynny horyzontalny snap slider (peek carousel) bez pustego bloku
          */}
          <section id="categories" className="pt-16 pb-20 md:py-24 w-full overflow-hidden">
            <div className="px-6 md:px-16 mb-6 max-w-7xl mx-auto flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyanlight">
                {lang === "pl" ? (settings.categoriesTitlePl || "KATEGORIE") : (settings.categoriesTitleEn || "CATEGORIES")}
              </h2>
              <span className="md:hidden text-[11px] font-mono text-slate-500">
                {lang === "pl" ? "Przesuń →" : "Swipe →"}
              </span>
            </div>

            {/* Wersja na DESKTOP (od md wzwyż): Panoramiczny sklejony pasek rozszerzający się na hover */}
            <div className="hidden md:flex flex-row h-[520px] lg:h-[600px] w-full overflow-hidden">
              {categories.map((cat: any) => {
                const imgSrc = cat.entry.coverImage || cat.entry.externalCoverUrl;

                return (
                  <div 
                    key={cat.slug} 
                    onClick={() => selectCategory(cat.slug)}
                    className="flex-1 hover:flex-[2.6] transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden cursor-pointer group border-r border-white/10 last:border-none"
                  >
                    {imgSrc && (
                      <img 
                        src={getOptimizedImageUrl(imgSrc, 1080)} 
                        alt={cat.entry.titlePl} 
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent group-hover:via-void/25 transition-all duration-500" />

                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-xl group-hover:text-cyanlight transition-colors duration-300">
                        {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
                      </h3>
                      
                      <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-out">
                        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-cyanlight pt-1">
                          {lang === "pl" ? "Przeglądaj galerię" : "Explore gallery"} →
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 h-1 bg-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_var(--accent-light)]" />
                  </div>
                );
              })}
            </div>

            {/* Wersja na TELEFONY (poniżej md): Płynny horyzontalny snap slider dotykowy */}
            <div className="flex md:hidden flex-row gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 no-scrollbar">
              {categories.map((cat: any) => {
                const imgSrc = cat.entry.coverImage || cat.entry.externalCoverUrl;

                return (
                  <div 
                    key={cat.slug} 
                    role="button"
                    tabIndex={0}
                    onClick={() => selectCategory(cat.slug)}
                    className="w-[82vw] max-w-[340px] h-[450px] shrink-0 snap-center relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl active:scale-[0.98] transition-all bg-[#0e071c] text-left block"
                  >
                    {imgSrc && (
                      <img 
                        src={getOptimizedImageUrl(imgSrc, 384, 70)} 
                        alt={cat.entry.titlePl} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-75" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />

                    <div className="absolute bottom-6 inset-x-6 z-10">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-3 drop-shadow-lg">
                        {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
                      </h3>
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyanlight bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                        {lang === "pl" ? "Otwórz kategorię" : "Open category"} →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sekcja KLIENCI: Zoptymalizowane odstępy i prędkość na telefonach */}
          <section className="py-16 md:py-20 border-t border-white/10 overflow-hidden relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-48 bg-gradient-to-r from-void via-void/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-48 bg-gradient-to-l from-void via-void/80 to-transparent z-10" />

            <div className="px-6 md:px-16 mb-8 md:mb-12 text-center max-w-7xl mx-auto">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyanlight">
                {lang === "pl" ? (settings.clientsTitlePl || "KLIENCI I WSPÓŁPRACA") : (settings.clientsTitleEn || "CLIENTS & COLLABORATIONS")}
              </h2>
            </div>

            <div className="w-full overflow-hidden">
              <div className="animate-marquee gap-6 sm:gap-14 md:gap-20 items-center flex py-2" style={{ animationPlayState: 'running' }}>
                {marqueeClients.map((client: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center justify-center shrink-0 w-32 sm:w-44 md:w-56 group px-2 cursor-pointer"
                  >
                    <div className="h-20 sm:h-28 md:h-36 w-full flex items-center justify-center mb-2 sm:mb-3">
                      {client.logoImage ? (
                        <img 
                          src={getOptimizedImageUrl(client.logoImage, 128)} 
                          alt={client.name} 
                          loading="lazy"
                          decoding="async"
                          width={112}
                          height={64}
                          className="max-h-16 sm:max-h-28 md:max-h-32 max-w-full object-contain filter brightness-110 contrast-125 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" 
                          style={{ imageRendering: "-webkit-optimize-contrast" }}
                        />
                      ) : (
                        <ClientDefaultIcon name={client.name} />
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyanlight transition-colors text-center line-clamp-1">
                      {client.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sekcja O MNIE */}
          <section id="about" className="py-24 px-6 md:px-16 border-t border-white/10 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
              
              <div className="max-w-3xl mb-12">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyanlight mb-3">
                  {lang === "pl" ? (settings.aboutTitlePl || "O MNIE") : (settings.aboutTitleEn || "ABOUT ME")}
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                  {lang === "pl" ? (settings.aboutSubtitlePl || "Michał Piwowarczyk — 3D Artist & Inżynier") : (settings.aboutSubtitleEn || "Michał Piwowarczyk — 3D Artist & Software Engineer")}
                </h3>
                <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                  {lang === "pl" ? settings.aboutBioPl : (settings.aboutBioEn || settings.aboutBioPl)}
                </p>
              </div>

              {/* Informacje merytoryczne w układzie kolumnowym */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-16 pt-8 border-t border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-cyanlight block mb-1">
                    {lang === "pl" ? "Wykształcenie" : "Education"}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {lang === "pl" ? settings.aboutEducationPl : (settings.aboutEducationEn || settings.aboutEducationPl)}
                  </h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {lang === "pl" 
                      ? "Akademia Górniczo-Hutnicza w Krakowie — wiedza z zakresu algorytmów grafiki, optymalizacji siatek i pipeline'u cyfrowego." 
                      : "AGH University of Krakow — computer graphics algorithms, geometry optimization, and digital pipelines."}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-cyanlight block mb-1">
                    {lang === "pl" ? "Doświadczenie" : "Experience"}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {settings.aboutExperienceYears || "4+"} {lang === "pl" ? "lat w branży 3D" : "years in 3D"}
                  </h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {lang === "pl" 
                      ? "Setki zrealizowanych modeli komercyjnych, wizualizacji produktowych, assetów gamedev oraz animacji w Blenderze." 
                      : "Hundreds of commercial 3D assets, product visualizations, game-ready models, and Blender animations."}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-cyanlight block mb-1">
                    {lang === "pl" ? "Działalność & B2B" : "Business & B2B"}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {lang === "pl" ? settings.aboutCompanyPl : (settings.aboutCompanyEn || settings.aboutCompanyPl)}
                  </h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {lang === "pl" 
                      ? "Własna zarejestrowana firma — faktury VAT 23%, bezpieczne umowy B2B i pełne prawa autorskie." 
                      : "Registered business entity — 23% VAT invoices, B2B agreements, and full copyright transfer."}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-cyanlight block mb-1">
                    {lang === "pl" ? "Pipeline & Narzędzia" : "Pipeline & Tools"}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    Blender • Substance 3D
                  </h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {lang === "pl" 
                      ? "Modelowanie hard-surface, teksturowanie PBR, silniki Cycles i Eevee oraz optymalizacja pod silniki gier." 
                      : "Hard-surface modeling, PBR texturing, Cycles & Eevee render engines, and real-time game engine optimization."}
                  </p>
                </div>
              </div>

              {/* Kluczowe umiejętności z możliwością edycji w Keystatic */}
              <div className="pt-6">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {lang === "pl" ? "Kluczowe umiejętności & technologie:" : "Key Skills & Technologies:"}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {(settings.aboutSkills || [
                    "Blender",
                    "Substance 3D Painter",
                    "Hard-Surface Modeling",
                    "PBR Texturing & Baking",
                    "Retopology & UVs",
                    "Cycles & Eevee",
                    "Product Animation",
                    "Game Assets (UE5 / Unity)"
                  ]).map((skill: string, i: number) => (
                    <span 
                      key={i} 
                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-slate-200 hover:border-cyan/50 hover:text-cyanlight transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </main>
      )}

      {/* Widok filtrowany po kategorii: 
          - Tytuł projektu pojawia się na grafice po najechaniu (desktop)
          - Na telefonach tytuł projektu jest widoczny cały czas
          - Przycisk Wróć do strony głównej resetuje parametr ?category
      */}
      {activeCategory && (
        <section className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 mb-12 border-b border-white/10">
            <div>
              <button 
                type="button"
                onClick={() => selectCategory(null)} 
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cyanlight hover:underline mb-3 cursor-pointer active:scale-95"
              >
                ← {lang === "pl" ? "Wróć do strony głównej" : "Back to Home"}
              </button>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {activeCategory === "all" 
                  ? (lang === "pl" ? "Wszystkie Projekty" : "All Projects") 
                  : (lang === "pl" ? categories.find((c: any) => c.slug === activeCategory)?.entry.titlePl : (categories.find((c: any) => c.slug === activeCategory)?.entry.titleEn || categories.find((c: any) => c.slug === activeCategory)?.entry.titlePl))
                }
              </h2>
            </div>
            
            {/* Przełączniki kategorii */}
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
              <button 
                type="button"
                onClick={() => selectCategory("all")} 
                className={`px-4 py-2 rounded-full transition cursor-pointer active:scale-95 ${activeCategory === "all" ? "bg-cyan text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan/40"}`}
              >
                {lang === "pl" ? "Wszystkie" : "All"}
              </button>
              {categories.map((cat: any) => (
                <button 
                  type="button"
                  key={cat.slug} 
                  onClick={() => selectCategory(cat.slug)} 
                  className={`px-4 py-2 rounded-full transition cursor-pointer active:scale-95 ${activeCategory === cat.slug ? "bg-cyan text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan/40"}`}
                >
                  {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
                </button>
              ))}
            </div>
          </div>

          {/* Galeria projektów: Tytuł pojawia się na grafice po najechaniu (desktop) / cały czas na telefonie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProjects.map((proj: any) => {
              const thumb = proj.entry.thumbnail || proj.entry.externalThumbnailUrl;
              return (
                <Link 
                  href={`/projects/${proj.slug}`} 
                  prefetch={false}
                  key={proj.slug} 
                  className="block group cursor-pointer active:scale-[0.98] transition-all duration-300"
                >
                  <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_45px_rgba(6,182,212,0.22)] ${aspectClass(proj.entry.aspectRatio)}`}>
                    <img 
                      src={getOptimizedImageUrl(thumb, 828)} 
                      alt={proj.entry.titlePl} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                    />
                    
                    {/* Tytuł projektu: Na telefonie ZAWSZE widoczny (opacity-100), na komputerze pojawia się po najechaniu (lg:opacity-0 lg:group-hover:opacity-100) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                        {lang === "pl" ? proj.entry.titlePl : (proj.entry.titleEn || proj.entry.titlePl)}
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyanlight mt-1.5 flex items-center gap-1.5">
                        {lang === "pl" ? "Zobacz projekt" : "View project"} →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Uproszczona stopka kontaktowa */}
      <ContactFooter settings={settings} lang={lang} />
    </>
  );
}
