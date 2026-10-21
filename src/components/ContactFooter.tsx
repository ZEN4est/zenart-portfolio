"use client";
import React, { useState } from "react";

export default function ContactFooter({ settings, lang }: { settings: any, lang: "pl" | "en" }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const projectTags = lang === "pl" ? [
    "Wizualizacje Produktowe",
    "Animacja 3D",
    "Assety do Gier",
    "Modelowanie Hard-Surface",
    "Inny projekt"
  ] : [
    "Product Visuals",
    "3D Animation",
    "Game Assets",
    "Hard-Surface Modeling",
    "Other Project"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <footer id="contact" className="border-t border-white/10 bg-[#05020a] py-20 px-6 w-full relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Lewa kolumna: Proste, klasyczne dane kontaktowe */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-bold text-cyan uppercase tracking-widest block">
            {lang === "pl" ? "KONTAKT" : "CONTACT INFO"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {lang === "pl" ? "Porozmawiajmy" : "Let's Talk"}
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-sm font-light leading-relaxed">
            {lang === "pl" ? settings.contactIntroPl : (settings.contactIntroEn || settings.contactIntroPl)}
          </p>

          <div className="space-y-3.5 text-sm text-slate-300 pt-2">
            <p className="font-semibold flex items-center gap-2 text-white">
              <span>👤</span> Michał Piwowarczyk (<span style={{ fontFamily: "'Michroma', sans-serif" }} className="text-xs tracking-widest text-cyanlight">ZenArt_3D</span>)
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span> {settings.location}
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span>
              <a href={`mailto:${settings.email}`} className="text-cyanlight hover:underline font-semibold font-mono">
                {settings.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span>
              <a href={`tel:${settings.phone?.replace(/\s+/g, '')}`} className="hover:text-white transition">
                {settings.phone}
              </a>
            </p>
          </div>
        </div>

        {/* Prawa kolumna: Uproszczony formularz bez zbędnych ramek i kart */}
        <form 
          action={`https://formsubmit.co/${settings.email}`} 
          method="POST" 
          className="lg:col-span-7 space-y-6"
        >
          <input type="hidden" name="_subject" value={`Nowe zapytanie — ZenArt_3D (${selectedTags.join(', ') || 'Ogólne'})`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="project_scope" value={selectedTags.join(", ")} />

          {/* Wybór kategorii */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {lang === "pl" ? "Wybierz kategorię projektu:" : "Select project scope:"}
            </label>
            <div className="flex flex-wrap gap-2">
              {projectTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={(e) => { e.preventDefault(); toggleTag(tag); }}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-cyan text-black border-cyan font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "bg-white/5 text-slate-300 border-white/15 hover:border-cyan/50 hover:text-white"
                    }`}
                  >
                    {isSelected ? "✓ " : ""}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pola formularza w czystym, nowoczesnym stylu z pełnym wsparciem dostępności (WCAG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === "pl" ? "Imię / Nazwa firmy *" : "Full Name / Company *"}
              </label>
              <input 
                id="contact-name"
                type="text" 
                name="name" 
                required 
                aria-label={lang === "pl" ? "Imię lub Nazwa firmy" : "Full Name or Company"}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:border-cyan focus:outline-none transition" 
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === "pl" ? "Adres e-mail *" : "Email Address *"}
              </label>
              <input 
                id="contact-email"
                type="email" 
                name="email" 
                required 
                aria-label={lang === "pl" ? "Adres e-mail" : "Email Address"}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:border-cyan focus:outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {lang === "pl" ? "Wiadomość / Opis projektu *" : "Message / Project details *"}
            </label>
            <textarea 
              id="contact-message"
              name="message" 
              rows={4} 
              required 
              aria-label={lang === "pl" ? "Wiadomość lub opis projektu" : "Message or project details"}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:border-cyan focus:outline-none transition resize-y" 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="px-8 py-3.5 rounded-full bg-cyan hover:bg-cyanlight text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95"
            >
              {lang === "pl" ? "Wyślij wiadomość →" : "Send Message →"}
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}
