import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZENART 3D – Michał Piwowarczyk | 3D Artist Portfolio",
  description: "Fotorealistyczne wizualizacje 3D, modele Hard-Surface, assety do gier (UE5/Unity) oraz animacje produktowe w Blenderze.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "ProfessionalService"],
    name: "ZENART 3D - Michał Piwowarczyk",
    jobTitle: "3D Artist",
    email: "michalpiwowarczyk3d@gmail.com",
    telephone: "+48795757323",
    address: { "@type": "PostalAddress", addressCountry: "PL" },
  };

  return (
  <html lang="pl" className="dark scroll-smooth" suppressHydrationWarning data-scroll-behavior="smooth">
        <head>
        {/* Czcionki Google: Mulish oraz Syncopate (identycznie jak w mockupie) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&family=Syncopate:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Silnik Tailwind + konfiguracja Twoich kolorów i czcionek w jednym miejscu */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      void: '#07040e',
                      surface: '#110921',
                      surfaceLight: '#1a0f30',
                      cyan: 'var(--accent)',
                      cyanlight: 'var(--accent-light)',
                      crimsonSubtle: '#881337'
                    },
                    fontFamily: {
                      sans: ['Mulish', 'sans-serif'],
                      logo: ['Syncopate', 'sans-serif']
                    }
                  }
                }
              }
            `,
          }}
        />
        {/* Google Model Viewer dla interaktywnych modeli 3D (.GLB) */}
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-ambient font-sans min-h-screen selection:bg-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}