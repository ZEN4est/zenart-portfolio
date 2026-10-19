import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#07040e",         // Głęboki ciemny fiolet - tło główne
        surface: "#110921",      // Ciemny fiolet - tło kart
        surfaceLight: "#1a0f30", // Jaśniejszy fiolet dla plakietek
        cyan: "#06b6d4",         // Główny akcent cyjanowy
        cyanlight: "#22d3ee",    // Rozświetlony cyjan (hover)
        crimsonSubtle: "#881337" // Stonowana czerwień dla subtelnych akcentów
      },
      fontFamily: {
        sans: ["var(--font-main)", "sans-serif"],
        logo: ["var(--font-logo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;