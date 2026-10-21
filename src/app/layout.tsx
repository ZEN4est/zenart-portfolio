import type { Metadata } from "next";
import { Mulish, Syncopate, Michroma } from "next/font/google";
import siteSettings from "@/content/settings/site.json";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-mulish",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-syncopate",
});

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-michroma",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenart3d.atoma.pl/test";

const ogImageUrl = (siteSettings as any)?.ogImage
  ? `${siteUrl}${(siteSettings as any).ogImage}`
  : `${siteUrl}/uploads/categories/modelling/coverImage.png`;

const iconUrl = (siteSettings as any)?.favicon
  ? `${siteUrl}${(siteSettings as any).favicon}`
  : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: iconUrl ? { icon: iconUrl, apple: iconUrl } : undefined,
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
        url: ogImageUrl,
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
    images: [ogImageUrl],
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
    image: ogImageUrl,
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
    <html lang="pl" className={`${mulish.variable} ${syncopate.variable} ${michroma.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-void font-sans min-h-screen selection:bg-cyan selection:text-black relative overflow-x-hidden">
        {/* Żywe, zoptymalizowane poświaty w tle (Ultra-efficient radial-gradient bez ciężkiego filtru blur) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="ambient-orb-1 absolute -top-32 -right-20 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent)_18%,transparent)_0%,color-mix(in_srgb,var(--accent)_5%,transparent)_40%,transparent_70%)] opacity-80" />
          <div className="ambient-orb-2 absolute top-[35%] -left-32 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(136,19,55,0.15)_0%,rgba(136,19,55,0.04)_40%,transparent_70%)] opacity-80" />
          <div className="ambient-orb-3 absolute -bottom-32 left-[25%] w-[550px] sm:w-[800px] h-[550px] sm:h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.18)_0%,rgba(88,28,135,0.05)_40%,transparent_70%)] opacity-80" />
        </div>
        
        {/* Główna treść strony */}
        {children}
      </body>
    </html>
  );
}
