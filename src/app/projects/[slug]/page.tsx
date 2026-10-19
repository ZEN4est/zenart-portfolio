import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../../keystatic.config";
import { notFound } from "next/navigation";
import ProjectClientView from '../../../components/ProjectClientView'
export const instant = false;

export async function generateStaticParams() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const slugs = await reader.collections.projects.list();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const reader = createReader(process.cwd(), keystaticConfig);
  const project = await reader.collections.projects.read(slug);
  if (!project) notFound();

  const settings = await reader.singletons.siteSettings.read();
  const rawCategories = await reader.collections.categories.all();
  const categories = rawCategories.sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));

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
      settings={settings}
      categories={categories}
      allImages={allImages}
      mainThumb={mainThumb}
      glbUrl={glbUrl}
    />
  );
}