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
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');` }} />
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl rounded-full bg-[#0e071c]/85 backdrop-blur-xl border border-white/10 px-6 py-3.5 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <Link href="/" style={{ fontFamily: "'Michroma', sans-serif" }} className="tracking-wider text-sm md:text-base flex items-center gap-2.5 text-left cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]"></span>
          <span>ZenArt<span className="text-cyanlight">_3D</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/" className="hover:text-cyanlight transition cursor-pointer">Home</Link>
          {categories.map((cat: any) => (
            <Link key={cat.slug} href={`/`} className="hover:text-cyanlight transition uppercase">
              {lang === "pl" ? cat.entry.titlePl : (cat.entry.titleEn || cat.entry.titlePl)}
            </Link>
          ))}
          <a href="#contact" className="hover:text-cyanlight transition cursor-pointer">
            {lang === "pl" ? "Kontakt" : "Contact"}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "pl" ? "en" : "pl")} className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-cyan/50 transition cursor-pointer">
            {lang === "pl" ? <>PL | <span className="text-slate-400">EN</span></> : <><span className="text-slate-400">PL</span> | EN</>}
          </button>
          <a href="#contact" className="hidden sm:inline-block px-4 py-1.5 rounded-full bg-cyan hover:bg-cyanlight text-black font-bold text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer uppercase">
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
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-left text-sm font-bold uppercase py-2 border-b border-white/10">
            {lang === "pl" ? "Kontakt" : "Contact"}
          </a>
        </div>
      )}
    </>
  );
}