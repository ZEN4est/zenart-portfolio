"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";

// Zabezpieczenie przed podwójnym .default w Turbopacku:
const config = (rawConfig as any).default || rawConfig;

// PATCH DLA KEYSTATIC UI W PODFOLDERZE /test
if (typeof window !== "undefined") {
  const SUBPATH = "/test";

  // 1. Kluczowy patch na prototypie URL - działa na WSZYSTKIE instancje URL w aplikacji
  try {
    const originalDesc = Object.getOwnPropertyDescriptor(URL.prototype, "pathname");
    if (originalDesc && originalDesc.get) {
      const originalGetter = originalDesc.get;
      Object.defineProperty(URL.prototype, "pathname", {
        get() {
          const orig = originalGetter.call(this);
          if (orig.startsWith(`${SUBPATH}/keystatic`)) {
            return orig.slice(SUBPATH.length);
          }
          if (orig.startsWith(`${SUBPATH}/api/keystatic`)) {
            return orig.slice(SUBPATH.length);
          }
          return orig;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (err) {
    console.error("Błąd podczas patchowania URL.prototype:", err);
  }

  // 2. Patch dla history.pushState i replaceState
  const origPushState = window.history.pushState;
  window.history.pushState = function (data: any, unused: string, url?: string | URL | null) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = SUBPATH + url;
    }
    return origPushState.call(this, data, unused, url);
  };

  const origReplaceState = window.history.replaceState;
  window.history.replaceState = function (data: any, unused: string, url?: string | URL | null) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = SUBPATH + url;
    }
    return origReplaceState.call(this, data, unused, url);
  };

  // 3. Patch dla fetch (zapytania API Keystatica)
  const origFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === "string" && input.startsWith("/api/keystatic")) {
      input = SUBPATH + input;
    } else if (input instanceof URL && input.pathname.startsWith("/api/keystatic")) {
      input = new URL(SUBPATH + input.pathname + input.search, input.origin);
    }
    return origFetch.call(this, input, init);
  };

  // 4. Przechwytywanie kliknięć w linki logowania do /api/keystatic
  window.addEventListener(
    "click",
    (e) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target && target.getAttribute("href")?.startsWith("/api/keystatic")) {
        e.preventDefault();
        window.location.href = SUBPATH + target.getAttribute("href");
      }
    },
    true
  );
}

const Keystatic = makePage(config);

export default function Page() {
  return <Keystatic />;
}
