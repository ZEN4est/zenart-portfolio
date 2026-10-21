import { MetadataRoute } from "next";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Docelowy adres domeny
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenart3d.atoma.pl/test";

  let projectUrls: MetadataRoute.Sitemap = [];
  try {
    const reader = createReader(process.cwd(), keystaticConfig);
    const slugs = await reader.collections.projects.list();
    projectUrls = slugs.map((slug) => ({
      url: `${siteUrl}/projects/${slug}`,
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

