import fs from 'fs/promises';
import path from 'path';

export interface ProjectEntry {
  slug: string;
  titlePl: string;
  titleEn: string;
  category: string;
  aspectRatio: 'square' | 'video' | 'vertical';
  descriptionPl: string;
  descriptionEn: string;
  tools?: string;
  polycount?: string;
  client?: string;
  completedDate?: string;
  thumbnail?: string | null;
  externalThumbnailUrl?: string;
  gallery?: Array<{
    image?: string | null;
    externalUrl?: string;
    captionPl?: string;
    captionEn?: string;
  }>;
  models?: Array<{
    titlePl?: string;
    titleEn?: string;
    modelFile?: string | null;
    externalUrl?: string;
  }>;
  videos?: Array<{
    titlePl?: string;
    titleEn?: string;
    videoFile?: string | null;
    externalUrl?: string;
  }>;
  wireframeComparisons?: Array<{
    mainImage?: string | null;
    wireframeImage?: string | null;
    title?: string;
  }>;
}

export interface ProjectItem {
  slug: string;
  entry: ProjectEntry;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ąćęłńóśźż]/g, (m) => {
      const map: Record<string, string> = {
        ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z'
      };
      return map[m] || m;
    })
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Pobiera wszystkie projekty ze wszystkich 3 kategorii (Modelowanie, Animacje, Wizualizacje),
 * zachowując dokładnie taką kolejność, jaką ustawiono przeciąganiem myszką w Keystatic.
 */
export async function getAllProjects(rootDir: string, reader?: any): Promise<ProjectItem[]> {
  const categories = [
    { key: 'projectsModelling', file: 'modelling', category: 'modelling' },
    { key: 'projectsAnimating', file: 'animating', category: 'animating' },
    { key: 'projectsVisualizations', file: 'visualizations', category: 'visualizations' },
  ];

  const allProjects: ProjectItem[] = [];

  for (const cat of categories) {
    let projs: any[] = [];

    if (reader && reader.singletons && reader.singletons[cat.key]) {
      try {
        const data = await reader.singletons[cat.key].read();
        if (data && Array.isArray(data.projects)) {
          projs = data.projects;
        }
      } catch (err) {
        // cichy fallback do czytania z dysku
      }
    }

    if (projs.length === 0) {
      try {
        const filePath = path.join(rootDir, `src/content/projects-data/${cat.file}.json`);
        const raw = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects)) {
          projs = parsed.projects;
        }
      } catch (err) {
        // kategoria może być pusta
      }
    }

    for (const p of projs) {
      const cleanSlug = p.slug && p.slug.trim() ? p.slug.trim() : slugify(p.titlePl || 'projekt');
      allProjects.push({
        slug: cleanSlug,
        entry: {
          ...p,
          category: cat.category,
        },
      });
    }
  }

  return allProjects;
}

