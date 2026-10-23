"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Wyłącz domyślne przywracanie pozycji przewijania w przeglądarce (iOS Safari, Chrome gesty)
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handlePopState = () => {
      // Przy cofnięciu gestem lub przyciskiem wstecz na telefonie - natychmiast przewiń na górę
      if (typeof window !== "undefined" && !window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        requestAnimationFrame(() => {
          if (!window.location.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 2. Przy każdej zmianie ścieżki (wejście w projekt, powrót, zmiana kategorii w URL)
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      // Natychmiastowy skok na samą górę
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      // Wywołanie w kolejnej klatce animacji (gdy React zrenderuje nowe drzewo DOM)
      requestAnimationFrame(() => {
        if (!window.location.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      });

      // Zabezpieczenie po 50ms na wypadek asynchronicznego skurczenia/rozszerzenia layoutu
      const timeoutId = setTimeout(() => {
        if (!window.location.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams]);

  return null;
}

