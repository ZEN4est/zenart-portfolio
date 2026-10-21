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
  const glbUrl = project.modelGlb || project.externalGlbUrl;

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
      glbUrl={glbUrl}
    />
  );
}
