"use client";

import { makePage } from "@keystatic/next/ui/app";
import rawConfig from "../../../../keystatic.config";

// Klientowy interceptor sieciowy i routingu dla działania w podfolderze /test
if (typeof window !== "undefined") {
  // 1. Zabezpieczenie zapytań fetch
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === "string") {
      if (input.startsWith("/api/keystatic")) {
        input = "/test" + input;
      }
    } else if (input instanceof URL) {
      if (input.pathname.startsWith("/api/keystatic")) {
        input.pathname = "/test" + input.pathname;
      }
    }
    return originalFetch.call(this, input, init);
  };

  // 2. Zabezpieczenie historii przeglądarki (pushState / replaceState)
  const origPushState = window.history.pushState;
  window.history.pushState = function (data, unused, url) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = "/test" + url;
    }
    return origPushState.call(this, data, unused, url);
  };

  const origReplaceState = window.history.replaceState;
  window.history.replaceState = function (data, unused, url) {
    if (typeof url === "string" && url.startsWith("/keystatic")) {
      url = "/test" + url;
    }
    return origReplaceState.call(this, data, unused, url);
  };
}

// Zabezpieczenie przed podwójnym .default w Turbopacku / Webpacku:
const config = (rawConfig as any).default || rawConfig;

const Keystatic = makePage(config);

export default function Page() {
  return <Keystatic />;
}
