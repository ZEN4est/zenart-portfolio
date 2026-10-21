"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function ProjectHeader({ categories, settings }: any) {
  const [lang, setLangState] = useState<"pl" | "en">("pl");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zenart_lang") as "pl" | "en";
    if (saved) setLangState(saved);
  }, []);

  const setLang = (newLang: "pl" | "en") => {
    setLangState(newLang);
    localStorage.setItem("zenart_lang", newLang);
    window.location.reload();
  };

  return (
    <>
      {/* Pasek nawigacji na górze */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-6 md:px-12 py-5 flex items-center justify-between bg-[#07040e]/95 backdrop-blur-sm border-b border-white/5 transition-all">
        <Link 
          href="/" 
          style={{ fontFamily: "'Michroma', sans-serif" }} 
          className="tracking-wider text-base md:text-lg flex items-center gap-2.5 text-left cursor-pointer active:scale-95 transition-transform"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_var(--accent-light)]"></span>
          <span>ZenArt<span className="text-cyanlight">_3D</span></span>
        </Link>

        {/* Menu na desktopie z odnośnikami do konkretnych kategorii */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-xs lg:text-sm font-bold tracking-wider uppercase text-slate-300">
          <Link href="/" className="hover:text-cyanlight transition cursor-pointer">
            HOME
          </Link>
          {categories.map((cat: any) => (
            <Link key={cat.slug} href={`/?category=${cat.slug}`} className="hover:text-cyanlight transition">
              {lang === "pl" ? cat.entry.titlePl.toUpperCase() : (cat.entry.titleEn || cat.entry.titlePl).toUpperCase()}
            </Link>
          ))}
          <Link href="/#about" className="hover:text-cyanlight transition">
            {lang === "pl" ? "O MNIE" : "ABOUT"}
          </Link>
          <a href="#contact" className="hover:text-cyanlight transition cursor-pointer">
            {lang === "pl" ? "KONTAKT" : "CONTACT"}
          </a>
        </nav>

        {/* Prawa strona */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setLang(lang === "pl" ? "en" : "pl")} 
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-cyan/50 transition cursor-pointer active:scale-95"
          >
            {lang === "pl" ? <>PL | <span className="text-slate-400">EN</span></> : <><span className="text-slate-400">PL</span> | EN</>}
          </button>
          <a href="#contact" className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-cyan hover:bg-cyanlight text-black font-bold text-xs uppercase transition shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95">
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

      {/* Menu mobilne pełnoekranowe */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#07040e]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-6 md:hidden">
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

          <div className="flex flex-col gap-3 py-8">
            <Link 
              href="/" 
              className="text-left text-3xl font-black uppercase tracking-tight text-white hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              HOME
            </Link>
            {categories.map((cat: any) => (
              <Link 
                key={cat.slug} 
                href={`/?category=${cat.slug}`}
                className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
              >
                {lang === "pl" ? cat.entry.titlePl.toUpperCase() : (cat.entry.titleEn || cat.entry.titlePl).toUpperCase()}
              </Link>
            ))}
            <Link 
              href="/#about" 
              className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              {lang === "pl" ? "O MNIE" : "ABOUT"}
            </Link>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-3xl font-black uppercase tracking-tight text-white/90 hover:text-cyanlight active:text-cyanlight transition py-2"
            >
              {lang === "pl" ? "KONTAKT" : "CONTACT"}
            </a>
          </div>

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
    </>
  );
}
