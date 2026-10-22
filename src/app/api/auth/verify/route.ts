import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  generateSessionToken,
  getExpectedPassword,
  isAuthorizedAdmin,
  verifyPassword,
} from "@/utils/auth";

export const dynamic = "force-dynamic";

/**
 * Logowanie administratora - weryfikuje hasło i ustawia bezpieczne ciasteczko sesyjne
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = (body.password || "").trim();

    if (!password) {
      return NextResponse.json({ ok: false, error: "Wprowadź hasło." }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { ok: false, error: "Nieprawidłowe hasło dostępu." },
        { status: 401 }
      );
    }

    const token = generateSessionToken(getExpectedPassword());
    const res = NextResponse.json({ ok: true, message: "Zalogowano pomyślnie." });

    // Ustawienie ciasteczka sesyjnego (Path=/test lub / w zależności od basePath)
    res.cookies.set(COOKIE_NAME, token, {
      path: "/",
      httpOnly: false, // pozwala sprawdzić stan w JS
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Błąd serwera." },
      { status: 500 }
    );
  }
}

/**
 * Sprawdzanie stanu autoryzacji sesji
 */
export async function GET(req: NextRequest) {
  const authenticated = isAuthorizedAdmin(req);
  return NextResponse.json({ authenticated });
}

/**
 * Wylogowanie - usuwa ciasteczko sesyjne
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: "Wylogowano." });
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });
  return res;
}

