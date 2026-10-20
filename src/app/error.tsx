'use client';

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
        <p className="text-sm text-zinc-300 font-mono bg-black/50 p-3 rounded border border-zinc-800 break-words">
          {error.name}: {error.message}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-sm"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}

