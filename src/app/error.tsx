'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-xl w-full p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold text-red-400">Wystąpił błąd aplikacji</h2>
        <div className="text-sm text-zinc-300 font-mono bg-black/60 p-4 rounded border border-zinc-800 space-y-2 break-words">
          <p className="text-zinc-400">Komunikat:</p>
          <p className="text-red-300">{error.name}: {error.message}</p>
          {error.digest && (
            <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
              Digest błędu (kod w logach): <span className="text-cyan">{error.digest}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-sm cursor-pointer"
          >
            Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-800 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-700 transition text-sm inline-block"
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}
