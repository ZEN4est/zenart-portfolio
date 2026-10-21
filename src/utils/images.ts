import { getAssetUrl } from "./paths";

/**
 * Automatyczna optymalizacja obrazów (konwersja do WebP, skalowanie i kompresja w locie)
 * Wykorzystuje wbudowany silnik Next.js Image Optimization zintegrowany z biblioteką Sharp.
 * 
 * Zapewnia, że użytkownik wgrywając do Keystatic oryginalne, bezstratne rendery PNG/JPG (nawet 10-20 MB),
 * otrzymuje na stronie lekki, błyskawiczny plik WebP o wadze ~20-80 KB, a pełna jakość zachowywana
 * jest do widoku powiększenia (lightbox).
 *
 * @param src - ścieżka do pliku (/uploads/...) lub URL zewnętrzny
 * @param width - dozwolone szerokości urządzeń: 256, 384, 640, 750, 828, 1080, 1200, 1920
 * @param quality - jakość kompresji (domyślnie 75)
 */
export function getOptimizedImageUrl(
  src: string | null | undefined,
  width: 256 | 384 | 640 | 750 | 828 | 1080 | 1200 | 1920 = 1080,
  quality: 75 = 75
): string {
  if (!src) return "";

  // Linki zewnętrzne (np. Unsplash)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    if (src.includes("unsplash.com") && !src.includes("&w=")) {
      return `${src}&w=${width}&q=${quality}&auto=format`;
    }
    return src;
  }

  // Wektorowe SVG oraz animowane GIFy nie wymagają kompresji rastrowej
  if (src.endsWith(".svg") || src.endsWith(".gif")) {
    return getAssetUrl(src);
  }

  const assetUrl = getAssetUrl(src);

  // Wbudowany endpoint Next.js Image:
  // automatycznie generuje WebP/AVIF dostosowany do przeglądarki i keszuje go na serwerze
  const basePath = "/test";
  return `${basePath}/_next/image?url=${encodeURIComponent(assetUrl)}&w=${width}&q=${quality}`;
}

