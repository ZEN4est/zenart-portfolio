import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import PortfolioClient from '../components/PortfolioClient'

// Ta jedna linijka naprawia błąd prerenderingu w Next.js 15+
export const instant = false;

export default async function HomePage() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const settings = await reader.singletons.siteSettings.read();
  const rawCategories = await reader.collections.categories.all();
  const rawProjects = await reader.collections.projects.all();

  const categories = rawCategories.sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));
  const projects = rawProjects.sort((a, b) => (a.entry.order || 99) - (b.entry.order || 99));

  if (!settings) return null;

  return (
    <PortfolioClient settings={settings} categories={categories} projects={projects} />
  );
}