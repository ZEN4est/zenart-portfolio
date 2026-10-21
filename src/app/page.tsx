import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import PortfolioClient from '../components/PortfolioClient';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const rootDir = process.env.PROJECT_DIR || process.cwd();
  const reader = createReader(rootDir, keystaticConfig);
  let settings: any = null;
  let categories: any[] = [];
  let projects: any[] = [];

  try {
    settings = await reader.singletons.siteSettings.read();
  } catch (err) {
    console.error("[HomePage] Error reading settings via keystatic reader:", err);
  }

  // Bezpieczny fallback z pliku JSON na wypadek błędu reader'a lub rozbieżności ścieżek
  if (!settings) {
    try {
      const siteJsonPath = path.join(rootDir, 'src/content/settings/site.json');
      const raw = await fs.readFile(siteJsonPath, 'utf-8');
      settings = JSON.parse(raw);
    } catch (fallbackErr) {
      console.error("[HomePage] Fallback site.json read failed:", fallbackErr);
    }
  }

  try {
    const rawCategories = await reader.collections.categories.all();
    categories = rawCategories.sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));
  } catch (err) {
    console.error("[HomePage] Error reading categories:", err);
  }

  try {
    const rawProjects = await reader.collections.projects.all();
    projects = rawProjects.sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));
  } catch (err) {
    console.error("[HomePage] Error reading projects:", err);
  }

  // Jeśli nawet plik nie istnieje, utwórz minimalny bezpieczny obiekt zamiast powodować błąd #441
  if (!settings) {
    settings = {
      heroTitlePl: "Fotorealistyczne Wizualizacje 3D, Animacje & Game Assets",
      heroTitleEn: "Photorealistic 3D Visuals, Animations & Game Assets",
      brandSubheaderPl: "MICHAŁ PIWOWARCZYK — 3D ARTIST",
      brandSubheaderEn: "MICHAŁ PIWOWARCZYK — 3D ARTIST",
      clients: []
    };
  }

  return (
    <PortfolioClient settings={settings} categories={categories} projects={projects} />
  );
}

