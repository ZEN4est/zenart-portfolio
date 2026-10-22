import { makeRouteHandler } from "@keystatic/next/route-handler";
import rawConfig from "../../../../../keystatic.config";

const config = (rawConfig as any).default || rawConfig;

let handlePost: any = null;
let handleGet: any = null;
let initError: any = null;

try {
  const handler = makeRouteHandler({
    config,
    clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret: process.env.KEYSTATIC_SECRET,
  });
  handlePost = handler.POST;
  handleGet = handler.GET;
} catch (err: any) {
  initError = err;
}

async function wrapHandler(handler: ((req: Request) => Promise<Response>) | null, req: Request) {
  if (initError || !handler) {
    return Response.json(
      {
        error: "Błąd inicjalizacji Keystatic API",
        message: initError?.message || "Handler nie został zainicjalizowany",
        missingEnv: {
          KEYSTATIC_GITHUB_CLIENT_ID: !process.env.KEYSTATIC_GITHUB_CLIENT_ID,
          KEYSTATIC_GITHUB_CLIENT_SECRET: !process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
          KEYSTATIC_SECRET: !process.env.KEYSTATIC_SECRET,
        },
      },
      { status: 500 }
    );
  }

  try {
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "zenart3d.atoma.pl";
    const publicOrigin = `${proto}://${host}`;

    const url = new URL(req.url);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    let pathname = url.pathname;
    if (basePath && pathname.startsWith(`${basePath}/api/keystatic`)) {
      pathname = pathname.slice(basePath.length);
    } else if (pathname.startsWith("/test/api/keystatic")) {
      pathname = pathname.replace(/^\/test/, "");
    }

    // Używamy publicOrigin zamiast wewnętrznego 127.0.0.1:3000
    const cleanUrl = new URL(`${publicOrigin}${pathname}${url.search}`);
    const normalizedReq = new Request(cleanUrl.toString(), req);

    const response = await handler(normalizedReq);

    const location = response.headers.get("Location");
    if (location) {
      let newLocation = location;

      // 1. Jeśli to przekierowanie na autoryzację GitHub OAuth:
      if (newLocation.includes("github.com/login/oauth/authorize")) {
        try {
          const authUrl = new URL(newLocation);
          const callbackUrl = `${publicOrigin}${basePath}/api/keystatic/github/oauth/callback`;
          authUrl.searchParams.set("redirect_uri", callbackUrl);
          if (!authUrl.searchParams.has("scope")) {
            authUrl.searchParams.set("scope", "repo");
          }
          newLocation = authUrl.toString();
        } catch (e) {
          console.error("Błąd parsowania OAuth authorize URL:", e);
        }
      }
      // 2. Jeśli to wewnętrzne przekierowanie do /keystatic (np. po pomyślnym zalogowaniu):
      else if (basePath && newLocation.startsWith("/keystatic")) {
        newLocation = `${basePath}${newLocation}`;
      }
      // 3. Jeśli to pełny URL wskazujący na 127.0.0.1:3000 lub localhost:
      else if (newLocation.includes("127.0.0.1") || newLocation.includes("localhost")) {
        try {
          const locUrl = new URL(newLocation);
          let locPath = locUrl.pathname;
          if (basePath && !locPath.startsWith(basePath)) {
            locPath = `${basePath}${locPath}`;
          }
          newLocation = `${publicOrigin}${locPath}${locUrl.search}${locUrl.hash}`;
        } catch (e) {
          console.error("Błąd parsowania lokalnego URL przekierowania:", e);
        }
      }

      if (newLocation !== location) {
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Location", newLocation);

        // Usuń nagromadzone ciasteczka ks- przy powrocie z autoryzacji do panelu keystatic
        const cookieHeader = req.headers.get("cookie") || "";
        const ksCookies = cookieHeader
          .split(";")
          .map((c) => c.trim().split("=")[0])
          .filter((name) => name.startsWith("ks-") && name !== "keystatic-gh-access-token");

        for (const cName of ksCookies) {
          newHeaders.append("Set-Cookie", `${cName}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
        }

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }
    }

    // Dodatkowe zabezpieczenie: jeśli w jakimkolwiek zapytaniu nagromadziło się więcej niż 2 ciasteczka ks-,
    // wyczyść nadmiarowe, aby zapobiec przekroczeniu limitu nagłówków LiteSpeed (błąd 500)
    const cookieHeader = req.headers.get("cookie") || "";
    const ksCookies = cookieHeader
      .split(";")
      .map((c) => c.trim().split("=")[0])
      .filter((name) => name.startsWith("ks-") && name !== "keystatic-gh-access-token");

    if (ksCookies.length > 2) {
      const newHeaders = new Headers(response.headers);
      for (let i = 0; i < ksCookies.length - 1; i++) {
        newHeaders.append("Set-Cookie", `${ksCookies[i]}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  } catch (err: any) {
    return Response.json(
      {
        error: "Błąd wykonania zapytania Keystatic",
        message: err?.message || String(err),
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}

export const GET = (req: Request) => wrapHandler(handleGet, req);
export const POST = (req: Request) => wrapHandler(handlePost, req);
