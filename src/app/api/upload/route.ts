import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Dozwolone rozszerzenia plików
const ALLOWED_EXTENSIONS = new Set([
  // Modele 3D i archiwa
  ".glb",
  ".gltf",
  ".fbx",
  ".obj",
  ".blend",
  ".zip",
  ".rar",
  ".7z",
  // Wideo
  ".mp4",
  ".webm",
  ".mov",
  // Grafiki
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
]);

// Usuwanie polskich znaków i znaków specjalnych z nazwy pliku
function sanitizeFileName(name: string): string {
  const plMap: Record<string, string> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
    Ą: "A", Ć: "C", Ę: "E", Ł: "L", Ń: "N", Ó: "O", Ś: "S", Ź: "Z", Ż: "Z",
  };
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext);

  const cleanBase = base
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (c) => plMap[c] || c)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${cleanBase || "file"}${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const rootDir = process.env.PROJECT_DIR || process.cwd();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const password = (formData.get("password") as string | null) || "";
    const requestedFolder = (formData.get("folder") as string | null) || "auto";

    // Sprawdzenie hasła dostępu (domyślnie 'zenart3d' lub zmienna środowiskowa UPLOAD_SECRET)
    const expectedSecret = process.env.UPLOAD_SECRET || "zenart3d";
    if (password !== expectedSecret) {
      return NextResponse.json(
        { error: "Nieprawidłowe hasło dostępu do uploadera. Domyślne hasło: zenart3d" },
        { status: 401 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Nie wybrano pliku." }, { status: 400 });
    }

    const originalName = file.name || "upload.bin";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `Niedozwolony format pliku (${ext}). Dozwolone: .glb, .gltf, .fbx, .obj, .mp4, .webm, .mov, .png, .jpg, .webp, .zip`,
        },
        { status: 400 }
      );
    }

    // Automatyczne wykrywanie folderu docelowego
    let folder = requestedFolder;
    if (folder === "auto") {
      if (ext === ".glb" || ext === ".gltf" || ext === ".fbx" || ext === ".obj" || ext === ".blend") {
        folder = "models";
      } else if (ext === ".mp4" || ext === ".webm" || ext === ".mov") {
        folder = "videos";
      } else {
        folder = "projects";
      }
    }

    // Bezpieczeństwo - dozwolone tylko wybrane podkatalogi
    if (!["models", "videos", "projects"].includes(folder)) {
      folder = "models";
    }

    const targetDir = path.join(rootDir, "public", "uploads", folder);
    await fs.mkdir(targetDir, { recursive: true });

    let cleanName = sanitizeFileName(originalName);
    let targetFilePath = path.join(targetDir, cleanName);

    // Jeśli plik już istnieje, dodajemy unikalny znacznik czasu
    try {
      await fs.access(targetFilePath);
      const extOnly = path.extname(cleanName);
      const baseOnly = path.basename(cleanName, extOnly);
      const timestamp = Date.now().toString().slice(-4);
      cleanName = `${baseOnly}_${timestamp}${extOnly}`;
      targetFilePath = path.join(targetDir, cleanName);
    } catch {
      // Plik nie istnieje - zachowujemy oryginalną czystą nazwę
    }

    // Zapis bufora pliku na dysku serwera
    const bytes = await file.arrayBuffer();
    await fs.writeFile(targetFilePath, Buffer.from(bytes));

    const publicPath = `/uploads/${folder}/${cleanName}`;

    return NextResponse.json({
      success: true,
      url: publicPath,
      fileName: cleanName,
      size: file.size,
      folder,
    });
  } catch (error: any) {
    console.error("[API Upload Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Wystąpił błąd podczas zapisywania pliku na serwerze." },
      { status: 500 }
    );
  }
}

// Pobieranie listy wgranych plików na serwerze (do wygodnego kopiowania linków)
export async function GET() {
  try {
    const rootDir = process.env.PROJECT_DIR || process.cwd();
    const uploadsDir = path.join(rootDir, "public", "uploads");

    const getFolderFiles = async (folderName: string) => {
      const dirPath = path.join(uploadsDir, folderName);
      try {
        const files = await fs.readdir(dirPath);
        const results = [];
        for (const f of files) {
          const filePath = path.join(dirPath, f);
          const stat = await fs.stat(filePath);
          if (stat.isFile()) {
            results.push({
              name: f,
              url: `/uploads/${folderName}/${f}`,
              size: stat.size,
              mtime: stat.mtime.toISOString(),
            });
          }
        }
        return results.sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());
      } catch {
        return [];
      }
    };

    const models = await getFolderFiles("models");
    const videos = await getFolderFiles("videos");

    return NextResponse.json({
      models,
      videos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

