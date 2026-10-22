"use client";
import React, { useState } from "react";
import { getAssetUrl } from "@/utils/paths";

export default function ContactFooter({ settings, lang }: { settings: any; lang: "pl" | "en" }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch(getAssetUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          project_scope: selectedTags.join(", ") || (lang === "pl" ? "Ogólne" : "General"),
          _subject: `Nowe zapytanie — ZenArt 3D (${selectedTags.join(", ") || (lang === "pl" ? "Wycena" : "Quote")})`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setSelectedTags([]);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Błąd wysyłania formularza:", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="border-t border-white/10 bg-[#05020a] py-20 px-6 w-full relative z-10 scroll-mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Lewa kolumna: Dane kontaktowe i social media */}
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
              <span>👤</span> Michał Piwowarczyk
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span> {lang === "pl" ? (settings.locationPl || settings.location) : (settings.locationEn || settings.locationPl || settings.location)}
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

            {/* Odnośniki do LinkedIn i Instagram */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan/50 text-xs font-bold text-slate-200 hover:text-cyanlight transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.32a1.64 1.64 0 0 0-1.66 1.64 1.63 1.63 0 0 0 1.66 1.63 1.63 1.63 0 0 0 1.64-1.63c0-.9-.74-1.64-1.64-1.64Z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan/50 text-xs font-bold text-slate-200 hover:text-cyanlight transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Prawa kolumna: Formularz z wysyłką AJAX i powiadomieniem */}
        <form 
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-6"
        >
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

          {/* Pola formularza */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === "pl" ? "Imię / Nazwa firmy *" : "Full Name / Company *"}
              </label>
              <input 
                id="contact-name"
                type="text" 
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required 
                placeholder={lang === "pl" ? "Twoje imię lub firma..." : "Your name or company..."}
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
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required 
                placeholder="twoj@email.com"
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
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required 
              placeholder={lang === "pl" ? "Opisz krótko swój projekt, oczekiwany termin i szczegóły..." : "Briefly describe your project, timeline, and details..."}
              aria-label={lang === "pl" ? "Wiadomość lub opis projektu" : "Message or project details"}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:border-cyan focus:outline-none transition resize-y" 
            />
          </div>

          {/* Powiadomienie o sukcesie */}
          {status === "success" && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in shadow-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-bold">
                  {lang === "pl" ? "Wiadomość została wysłana pomyślnie!" : "Message sent successfully!"}
                </p>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  {lang === "pl" 
                    ? "Dziękuję za kontakt. Odpowiem najszybciej jak to możliwe." 
                    : "Thank you for reaching out. I will get back to you as soon as possible."}
                </p>
              </div>
            </div>
          )}

          {/* Powiadomienie o błędzie */}
          {status === "error" && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">
                  {lang === "pl" ? "Nie udało się wysłać wiadomości." : "Failed to send message."}
                </p>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  {lang === "pl" 
                    ? "Napisz bezpośrednio na adres: " 
                    : "Please send an email directly to: "}
                  <a href={`mailto:${settings.email}?subject=${encodeURIComponent("Zapytanie ZenArt 3D - " + (formData.name || "Projekt"))}&body=${encodeURIComponent(formData.message || "")}`} className="underline font-bold text-white hover:text-cyanlight ml-1">
                    {settings.email}
                  </a>
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className={`px-8 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] ${
                submitting
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan hover:bg-cyanlight text-black cursor-pointer active:scale-95"
              }`}
            >
              {submitting 
                ? (lang === "pl" ? "Wysyłanie..." : "Sending...") 
                : (lang === "pl" ? "Wyślij wiadomość →" : "Send Message →")}
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}
