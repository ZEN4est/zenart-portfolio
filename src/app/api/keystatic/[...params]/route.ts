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
    let pathname = url.pathname;
    if (pathname.startsWith("/test/api/keystatic")) {
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
          const callbackUrl = `${publicOrigin}/test/api/keystatic/github/oauth/callback`;
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
      else if (newLocation.startsWith("/keystatic")) {
        newLocation = `/test${newLocation}`;
      }
      // 3. Jeśli to pełny URL wskazujący na 127.0.0.1:3000 lub localhost:
      else if (newLocation.includes("127.0.0.1") || newLocation.includes("localhost")) {
        try {
          const locUrl = new URL(newLocation);
          let locPath = locUrl.pathname;
          if (!locPath.startsWith("/test")) {
            locPath = `/test${locPath}`;
          }
          newLocation = `${publicOrigin}${locPath}${locUrl.search}${locUrl.hash}`;
        } catch (e) {
          console.error("Błąd parsowania lokalnego URL przekierowania:", e);
        }
      }

      if (newLocation !== location) {
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Location", newLocation);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }
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
