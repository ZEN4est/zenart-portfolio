import crypto from "crypto";
import type { NextRequest } from "next/server";

export const COOKIE_NAME = "zenart_admin_session";

export function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || process.env.UPLOAD_SECRET || "zenart3d";
}

/**
 * Generuje unikalny token sesji powiązany z obecnym hasłem administratora
 */
export function generateSessionToken(password: string): string {
  const secret = getExpectedPassword();
  return crypto.createHmac("sha256", secret).update(`admin-session:${password}`).digest("hex");
}

/**
 * Weryfikuje czy podane hasło jest poprawne (czasowo odporne na timing attacks)
 */
export function verifyPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  const expected = getExpectedPassword();
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return password === expected;
  }
}

/**
 * Weryfikuje czy żądanie HTTP pochodzi od autoryzowanego administratora
 * (sprawdza ciasteczko sesyjne, nagłówek x-admin-password lub hasło formularza)
 */
export function isAuthorizedAdmin(req: NextRequest, bodyPassword?: string | null): boolean {
  // 1. Sprawdzenie hasła z body lub nagłówka
  if (bodyPassword && verifyPassword(bodyPassword)) {
    return true;
  }
  const headerPass = req.headers.get("x-admin-password") || req.headers.get("x-upload-password");
  if (headerPass && verifyPassword(headerPass)) {
    return true;
  }

  // 2. Sprawdzenie ciasteczka sesyjnego
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (sessionCookie) {
    const expectedToken = generateSessionToken(getExpectedPassword());
    try {
      const a = Buffer.from(sessionCookie);
      const b = Buffer.from(expectedToken);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch {
      return sessionCookie === expectedToken;
    }
  }

  return false;
}
