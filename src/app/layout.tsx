import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenart3d.atoma.pl/test";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZENART 3D – Michał Piwowarczyk | 3D Artist & Inżynier",
    template: "%s | ZENART 3D",
  },
  description: "Fotorealistyczne wizualizacje 3D, zaawansowane modele Hard-Surface, animacje reklamowe oraz assety do gier (Unreal Engine 5 / Unity). Usługi B2B, faktury VAT 23%, Kraków i współpraca zdalna.",
  keywords: [
    "3D Artist",
    "Michał Piwowarczyk",
    "ZenArt 3D",
    "Wizualizacje 3D Kraków",
    "Grafik 3D Kraków",
    "Modelowanie 3D",
    "Hard Surface 3D",
    "Animacje 3D Blender",
    "Substance 3D Painter",
    "Assety do gier",
    "Wizualizacje produktowe",
    "Wizualizacje architektoniczne",
    "Faktura VAT 3D B2B"
  ],
  authors: [{ name: "Michał Piwowarczyk", url: siteUrl }],
  creator: "Michał Piwowarczyk",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "ZENART 3D Portfolio",
    title: "ZENART 3D – Michał Piwowarczyk | 3D Artist & Inżynier",
    description: "Fotorealistyczne wizualizacje 3D, modele Hard-Surface, animacje reklamowe oraz zoptymalizowane assety gamedev.",
    images: [
      {
        url: `${siteUrl}/uploads/categories/modelling/coverImage.png`,
        width: 1200,
        height: 630,
        alt: "ZENART 3D – Michał Piwowarczyk Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZENART 3D – Michał Piwowarczyk | 3D Artist",
    description: "Fotorealistyczne wizualizacje 3D, modele Hard-Surface i animacje produktowe w Blenderze.",
    images: [`${siteUrl}/uploads/categories/modelling/coverImage.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "ProfessionalService"],
    name: "ZENART 3D - Michał Piwowarczyk",
    alternateName: "ZenArt_3D",
    url: siteUrl,
    image: `${siteUrl}/uploads/categories/modelling/coverImage.png`,
    jobTitle: "3D Artist & Inżynier Oprogramowania",
    email: "michalpiwowarczyk3d@gmail.com",
    telephone: "+48795757323",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Akademia Górniczo-Hutnicza im. Stanisława Staszica w Krakowie (AGH)",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kraków",
      addressRegion: "Małopolskie",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "50.0647",
      longitude: "19.9450",
    },
    areaServed: [
      { "@type": "Country", name: "Polska" },
      { "@type": "AdministrativeArea", name: "Kraków" },
      { "@type": "AdministrativeArea", name: "Unia Europejska" },
      { "@type": "Place", name: "Worldwide / Remote" },
    ],
    knowsAbout: [
      "3D Modeling",
      "Hard-Surface Modeling",
      "Blender",
      "Substance 3D Painter",
      "PBR Texturing",
      "Photorealistic Rendering",
      "Product Visualization",
      "Game Assets Optimization",
      "Cycles & Eevee",
      "Computer Graphics",
    ],
    priceRange: "$$",
  };

  return (
    <html lang="pl" className="dark scroll-smooth" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Optymalizacja sieciowa pobierania czcionek Google (Preconnect) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&family=Syncopate:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-void font-sans min-h-screen selection:bg-cyan selection:text-black relative overflow-x-hidden">
        {/* Żywe, zoptymalizowane poświaty w tle (Ultra-efficient radial-gradient + lekkie blur-2xl zamiast ciężkiego blur-100px) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="ambient-orb-1 absolute -top-32 -right-20 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent)_20%,transparent)_0%,color-mix(in_srgb,var(--accent)_6%,transparent)_45%,transparent_70%)] blur-2xl opacity-80" />
          <div className="ambient-orb-2 absolute top-[35%] -left-32 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(136,19,55,0.16)_0%,rgba(136,19,55,0.05)_45%,transparent_70%)] blur-2xl opacity-80" />
          <div className="ambient-orb-3 absolute -bottom-32 left-[25%] w-[550px] sm:w-[800px] h-[550px] sm:h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.20)_0%,rgba(88,28,135,0.06)_45%,transparent_70%)] blur-2xl opacity-80" />
        </div>
        
        {/* Główna treść strony */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
