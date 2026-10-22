import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, project_scope } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Wszystkie wymagane pola muszą być wypełnione." },
        { status: 400 }
      );
    }

    const lead = {
      receivedAt: new Date().toISOString(),
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      project_scope: String(project_scope || "Ogólne").trim(),
    };

    // 1. Bezpieczny zapis zlecenia na serwerze (nigdy nie tracimy klienta)
    try {
      const inquiriesDir = path.join(process.cwd(), "data", "inquiries");
      if (!fs.existsSync(inquiriesDir)) {
        fs.mkdirSync(inquiriesDir, { recursive: true });
      }
      const safeDate = new Date().toISOString().replace(/[:.]/g, "-");
      const safeName = lead.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      const filePath = path.join(inquiriesDir, `${safeDate}_${safeName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(lead, null, 2), "utf-8");
      console.log(`✓ Zapisano zapytanie ofertowe od ${lead.name} (${lead.email}) do ${filePath}`);
    } catch (saveErr) {
      console.error("Błąd zapisu zapytania ofertowego do folderu data/inquiries:", saveErr);
    }

    // 2. Jeśli skonfigurowano klucz Web3Forms, wyślij natychmiast e-mail przez API Web3Forms
    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (web3formsKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey,
            from_name: lead.name,
            email: lead.email,
            subject: `Nowe zapytanie z portfolio ZenArt 3D (${lead.project_scope})`,
            message: `Od: ${lead.name} <${lead.email}>\nKategoria: ${lead.project_scope}\n\nWiadomość:\n${lead.message}`,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (e) {
        console.warn("Web3Forms forward warning:", e);
      }
    }

    // 3. Zwracamy status sukcesu
    return NextResponse.json({
      success: true,
      message: "Wiadomość została przyjęta pomyślnie.",
    });
  } catch (error: any) {
    console.error("Błąd obsługi API kontaktu:", error);
    return NextResponse.json(
      { success: false, error: "Wystąpił błąd serwera." },
      { status: 500 }
    );
  }
}

