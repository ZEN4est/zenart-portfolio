import { MetadataRoute } from "next";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { getAllProjects } from "@/utils/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenart3d.atoma.pl";

  let projectUrls: MetadataRoute.Sitemap = [];
  try {
    const reader = createReader(process.cwd(), keystaticConfig);
    const projects = await getAllProjects(process.cwd(), reader);
    projectUrls = projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error("Błąd generowania sitemap dla projektów:", e);
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
