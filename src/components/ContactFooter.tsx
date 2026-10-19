"use client";
import React from "react";

export default function ContactFooter({ settings, lang }: { settings: any, lang: "pl" | "en" }) {
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#05020a] py-16 md:py-20 px-6 mt-12 w-full">
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');` }} />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-bold text-cyan uppercase tracking-widest">
            {lang === "pl" ? "KONTAKT" : "CONTACT INFO"}
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            {lang === "pl" ? "Porozmawiajmy" : "Let's Talk"}
          </h2>
          <p className="text-sm text-slate-400 max-w-sm">
            {lang === "pl" ? settings.contactIntroPl : (settings.contactIntroEn || settings.contactIntroPl)}
          </p>
          <div className="space-y-3 text-sm text-slate-300 pt-2">
            <p className="font-semibold flex items-center gap-1.5">
              👤 Michał Piwowarczyk (<span style={{ fontFamily: "'Michroma', sans-serif" }} className="text-xs tracking-widest">ZenArt_3D</span>)
            </p>
            <p>📍 {settings.location}</p>
            <p className="text-cyanlight font-semibold">✉️ {settings.email}</p>
            <p>📞 {settings.phone}</p>
          </div>
        </div>

        <form action={`https://formsubmit.co/${settings.email}`} method="POST" className="lg:col-span-7 bg-surface/90 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === "pl" ? "Imię i nazwisko" : "Full Name"}
              </label>
              <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl bg-void border border-white/10 text-sm text-white focus:border-cyan focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === "pl" ? "Adres e-mail *" : "Email Address *"}
              </label>
              <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-void border border-white/10 text-sm text-white focus:border-cyan focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {lang === "pl" ? "Wiadomość / Opis projektu" : "Message / Project details"}
            </label>
            <textarea name="message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-void border border-white/10 text-sm text-white focus:border-cyan focus:outline-none" />
          </div>
          <button type="submit" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan hover:bg-cyanlight text-black font-extrabold text-sm transition">
            {lang === "pl" ? "Wyślij wiadomość →" : "Send Message →"}
          </button>
        </form>
      </div>
    </footer>
  );
}