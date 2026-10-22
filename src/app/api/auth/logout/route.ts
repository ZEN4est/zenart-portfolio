import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/utils/auth";
import { getAssetUrl } from "@/utils/paths";

export const dynamic = "force-dynamic";

/**
 * Bezpośrednie wylogowanie przez zapytanie GET (działa nawet przy zablokowanym JS w przeglądarce)
 */
export async function GET(req: NextRequest) {
  const referer = req.headers.get("referer");
  let redirectPath = "/";
  if (referer && referer.includes("/upload")) {
    redirectPath = "/upload";
  } else if (referer && referer.includes("/keystatic")) {
    redirectPath = "/keystatic";
  }

  const targetUrl = new URL(getAssetUrl(redirectPath), req.url);
  const res = NextResponse.redirect(targetUrl);

  // Usunięcie ciasteczka sesyjnego
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return res;
}

