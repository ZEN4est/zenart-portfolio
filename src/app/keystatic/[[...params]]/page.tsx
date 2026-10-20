"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";

// Zabezpieczenie przed podwójnym .default w Turbopacku:
const config = (rawConfig as any).default || rawConfig;

// PATCH DLA KEYSTATIC UI W PODFOLDERZE /test
if (typeof window !== "undefined") {
  const SUBPATH = "/test";

  // 1. Patch dla window.URL używanego przez Router w Keystatic
  const OriginalURL = window.URL;
  class PatchedURL extends OriginalURL {
    constructor(url: string | URL, base?: string | URL) {
      super(url, base);
    }

    get pathname() {
      const orig = super.pathname;
      if (orig.startsWith(`${SUBPATH}/keystatic`)) {
        return orig.slice(SUBPATH.length);
      }
      if (orig.startsWith(`${SUBPATH}/api/keystatic`)) {
        return orig.slice(SUBPATH.length);
      }
      return orig;
    }
  }
  // @ts-ignore
  window.URL = PatchedURL;

  // 2. Patch dla history.pushState i replaceState
  const origPushState = window.history.pushState;
  window.history.pushState = function (data: any, unused: string, url?: string | URL | null) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = SUBPATH + url;
    } else if (url && typeof url.toString === "function") {
      const s = url.toString();
      if (s.includes("/keystatic") && !s.includes(`${SUBPATH}/keystatic`)) {
        url = s.replace("/keystatic", `${SUBPATH}/keystatic`);
      }
    }
    return origPushState.call(this, data, unused, url);
  };

  const origReplaceState = window.history.replaceState;
  window.history.replaceState = function (data: any, unused: string, url?: string | URL | null) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = SUBPATH + url;
    } else if (url && typeof url.toString === "function") {
      const s = url.toString();
      if (s.includes("/keystatic") && !s.includes(`${SUBPATH}/keystatic`)) {
        url = s.replace("/keystatic", `${SUBPATH}/keystatic`);
      }
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

}