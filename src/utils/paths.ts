const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Zwraca poprawny URL do asetu (grafika, wideo, model 3D)
 * z uwzględnieniem ewentualnego basePath w Next.js.
 */
export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!BASE_PATH) {
    return clean;
  }
  if (clean === BASE_PATH || clean.startsWith(`${BASE_PATH}/`)) {
    return clean;
  }
  return `${BASE_PATH}${clean}`;
}

