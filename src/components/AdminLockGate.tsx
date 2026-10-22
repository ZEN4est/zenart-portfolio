"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAssetUrl } from "@/utils/paths";

interface AdminLockGateProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLockGate({
  children,
  title = "Panel Administratora",
}: AdminLockGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Sprawdzenie stanu zalogowania przy załadowaniu komponentu
  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      try {
        const res = await fetch(getAssetUrl("/api/auth/verify"), {
          method: "GET",
          cache: "no-store",
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(!!data.authenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        if (isMounted) setIsAuthenticated(false);
      }
    };
    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Wprowadź hasło dostępu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(getAssetUrl("/api/auth/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Zapisujemy hasło do sessionStorage na potrzeby bezpośredniego uploadera (opcjonalnie)
        try {
          sessionStorage.setItem("zenart_admin_pass", password.trim());
        } catch {}
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(data.error || "Nieprawidłowe hasło administratora.");
      }
    } catch {
      setError("Błąd połączenia z serwerem. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(getAssetUrl("/api/auth/verify"), {
        method: "DELETE",
      });
    } catch {}
    try {
      sessionStorage.removeItem("zenart_admin_pass");
      localStorage.removeItem("zenart_upload_pass");
    } catch {}
    setIsAuthenticated(false);
    setPassword("");
  };

  // 1. Ekran ładowania / weryfikacji wstępnej
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07040e] flex flex-col items-center justify-center text-slate-300 p-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/30 animate-pulse flex items-center justify-center shadow-lg shadow-cyan/10">
            <svg
              className="w-8 h-8 text-cyan animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Weryfikacja uprawnień...
        </p>
      </div>
    );
  }

  // 2. Ekran Blokady (Brak autoryzacji)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07040e] flex items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Tło ambientowe z poświatą */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#100720]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple/10">
          {/* Nagłówek z ikoną tarczy */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan/20 to-purple/20 border border-cyan/40 flex items-center justify-center shadow-lg shadow-cyan/20">
              <svg
                className="w-8 h-8 text-cyan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyanlight">
                ZenArt 3D • Bezpieczeństwo
              </span>
              <h1 className="mt-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Dostęp do tego modułu jest zastrzeżony. Wprowadź hasło administratora, aby zarządzać projektami i zasobami.
              </p>
            </div>
          </div>

          {/* Formularz odblokowania */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Hasło Administratora
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wpisz hasło..."
                  autoFocus
                  disabled={isLoading}
                  className="w-full bg-[#080312] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan to-purple text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-cyan/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Weryfikacja...</span>
                </>
              ) : (
                <>
                  <span>Odblokuj Panel</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Powrót do strony portfolio */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan transition-colors"
            >
              <span>← Powrót do strony ZenArt 3D</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Ekran Odblokowany (Użytkownik zalogowany)
  return (
    <>
      {/* Pływający widget statusu administratora (nie koliduje z żadnym layoutem Keystatic ani Uploaderem) */}
      <div
        className="fixed bottom-4 right-4 z-[99999] select-none font-sans"
        style={{ pointerEvents: "auto" }}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            title="Rozwiń pasek administratora"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#100720]/90 backdrop-blur-md border border-cyan/30 text-white shadow-xl shadow-cyan/10 hover:border-cyan transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyanlight">Admin</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-2xl bg-[#100720]/95 backdrop-blur-md border border-white/15 text-white shadow-2xl shadow-purple/20 text-xs">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200 hidden sm:inline">
                Admin: {title}
              </span>
            </div>

            <div className="h-3 w-px bg-white/10" />

            {/* Szybkie skróty */}
            <div className="flex items-center gap-2">
              <Link
                href="/keystatic"
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan transition-colors text-[11px] font-medium"
              >
                Keystatic
              </Link>
              <Link
                href="/upload"
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan transition-colors text-[11px] font-medium"
              >
                Uploader
              </Link>
              <Link
                href="/"
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan transition-colors text-[11px] font-medium hidden md:inline"
              >
                Strona główna
              </Link>
            </div>

            <div className="h-3 w-px bg-white/10" />

            {/* Wyloguj */}
            <button
              onClick={handleLogout}
              title="Zablokuj panel i wyloguj"
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-[11px] font-medium flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Wyloguj</span>
            </button>

            {/* Zwiń */}
            <button
              onClick={() => setIsMinimized(true)}
              title="Zwiń pasek"
              className="text-slate-500 hover:text-white transition-colors p-0.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {children}
    </>
  );
}

