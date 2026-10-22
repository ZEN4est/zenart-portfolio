import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../keystatic.config";
import { getAllProjects } from "@/utils/projects";

export async function GET() {
  const reader = createReader(process.cwd(), keystaticConfig);
  let settings: any = null;
  try {
    settings = await reader.singletons.siteSettings.read();
  } catch {}

  const projects = await getAllProjects(process.cwd(), reader);

  const body = `# ZENART 3D - Michał Piwowarczyk (3D Artist Portfolio)
> ${settings?.heroSubPl || ""}

## Contact
- Email: ${settings?.email || ""}
- Phone: ${settings?.phone || ""}
- Location: ${settings?.locationPl || settings?.locationEn || "Radom / Zdalnie, Polska"}

## 3D Portfolio Projects
${projects
  .map(
    (p) =>
      `- **${p.entry.titlePl}** (${p.entry.category}): ${p.entry.descriptionPl} | Tools: ${p.entry.tools || "Blender"} | Polycount: ${p.entry.polycount || "N/A"}`
  )
  .join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
