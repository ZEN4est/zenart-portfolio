import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../keystatic.config";

export async function GET() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const settings = await reader.singletons.siteSettings.read();
  const projects = await reader.collections.projects.all();

  const body = `# ZENART 3D - Michał Piwowarczyk (3D Artist Portfolio)
> ${settings?.heroSubPl}

## Contact
- Email: ${settings?.email}
- Phone: ${settings?.phone}
- Location: ${settings?.location}

## 3D Portfolio Projects
${projects
  .map(
    (p) =>
      `- **${p.entry.titlePl}** (${p.entry.category}):${p.entry.descriptionPl} | Tools: ${p.entry.tools} \vert{} Polycount:${p.entry.polycount || "N/A"}`
  )
  .join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}