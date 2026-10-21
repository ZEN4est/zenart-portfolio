import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../../keystatic.config";
import { notFound } from "next/navigation";
import ProjectClientView from '../../../components/ProjectClientView';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const rootDir = process.env.PROJECT_DIR || process.cwd();
  try {
    const reader = createReader(rootDir, keystaticConfig);
    const slugs = await reader.collections.projects.list();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const rootDir = process.env.PROJECT_DIR || process.cwd();

  const reader = createReader(rootDir, keystaticConfig);
  let project: any = null;
  let settings: any = null;
  let rawCategories: any[] = [];

  try {
    project = await reader.collections.projects.read(slug);
  } catch (err) {
    console.error(`[ProjectPage] Error reading project ${slug} via reader:`, err);
  }

  // Fallback z dysku jeśli reader nie znalazł projektu
  if (!project) {
    try {
      const projPath = path.join(rootDir, `src/content/projects/${slug}.json`);
      const raw = await fs.readFile(projPath, 'utf-8');
      project = JSON.parse(raw);
    } catch {}
  }

  if (!project) notFound();

  try {
    settings = await reader.singletons.siteSettings.read();
  } catch {}

  if (!settings) {
    try {
      const siteJsonPath = path.join(rootDir, 'src/content/settings/site.json');
      const raw = await fs.readFile(siteJsonPath, 'utf-8');
      settings = JSON.parse(raw);
    } catch {}
  }

  try {
    rawCategories = await reader.collections.categories.all();
  } catch {}

  const categories = (rawCategories || []).sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));

  const mainThumb = project.thumbnail || project.externalThumbnailUrl;
  const legacyGlb = project.modelGlb || project.externalGlbUrl;

  // Pobieranie wszystkich modeli 3D (nowa tablica + archiwalne pojedyncze pole)
  const models: { titlePl?: string; titleEn?: string; url: string }[] = [];
  if (Array.isArray(project.models)) {
    project.models.forEach((m: any) => {
      const url = m.modelFile || m.externalUrl;
      if (url) {
        models.push({
          titlePl: m.titlePl || "",
          titleEn: m.titleEn || "",
          url,
        });
      }
    });
  }
  if (legacyGlb && !models.some((m) => m.url === legacyGlb)) {
    models.push({
      titlePl: "",
      titleEn: "",
      url: legacyGlb,
    });
  }

  // Pobieranie wszystkich wideo (nowa tablica + archiwalne pole)
  const videos: { titlePl?: string; titleEn?: string; url: string }[] = [];
  if (Array.isArray(project.videos)) {
    project.videos.forEach((v: any) => {
      const url = v.videoFile || v.externalUrl;
      if (url) {
        videos.push({
          titlePl: v.titlePl || "",
          titleEn: v.titleEn || "",
          url,
        });
      }
    });
  }
  const legacyVideo = project.videoUrl || project.externalVideoUrl;
  if (legacyVideo && !videos.some((v) => v.url === legacyVideo)) {
    videos.push({
      titlePl: "",
      titleEn: "",
      url: legacyVideo,
    });
  }

  // Pobieranie porównań siatek (nowa tablica + archiwalne pojedyncze pole)
  const wireframes: { titlePl?: string; titleEn?: string; mainImage: string; wireframeImage: string }[] = [];
  if (Array.isArray(project.wireframeComparisons)) {
    project.wireframeComparisons.forEach((wf: any) => {
      const main = wf.mainImage || wf.externalMainImageUrl || mainThumb;
      const wire = wf.wireframeImage || wf.externalWireframeUrl;
      if (main && wire) {
        wireframes.push({
          titlePl: wf.titlePl || "",
          titleEn: wf.titleEn || "",
          mainImage: main,
          wireframeImage: wire,
        });
      }
    });
  }
  const legacyWireframe = project.wireframeImage || project.externalWireframeUrl;
  if (legacyWireframe && mainThumb && !wireframes.some((wf) => wf.wireframeImage === legacyWireframe)) {
    wireframes.push({
      titlePl: "",
      titleEn: "",
      mainImage: mainThumb,
      wireframeImage: legacyWireframe,
    });
  }

  const allImages: { url: string; caption: string }[] = [];
  if (mainThumb) {
    allImages.push({ url: mainThumb, caption: "Ujęcie Główne" });
  }
  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((item: any) => {
      const imgUrl = item.image || item.externalUrl;
      if (imgUrl) allImages.push({ url: imgUrl, caption: item.captionPl || "" });
    });
  }

  return (
    <ProjectClientView
      project={project}
      settings={settings || {}}
      categories={categories}
      allImages={allImages}
      mainThumb={mainThumb}
      models={models}
      videos={videos}
      wireframes={wireframes}
      glbUrl={legacyGlb}
    />
  );
}
