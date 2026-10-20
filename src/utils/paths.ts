const BASE_PATH = '/test';

/**
 * Zwraca poprawny URL do asetu (grafika, wideo, model 3D)
 * z uwzględnieniem basePath w Next.js na środowisku produkcyjnym (/test).
 */
export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === BASE_PATH || clean.startsWith(`${BASE_PATH}/`)) {
    return clean;
  }
  return `${BASE_PATH}${clean}`;
}

