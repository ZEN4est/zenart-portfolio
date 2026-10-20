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
    const url = new URL(req.url);
    let normalizedReq = req;

    // Obcinamy /test, aby Keystatic wewnętrznie rozpoznał /api/keystatic/...
    if (url.pathname.startsWith("/test/api/keystatic")) {
      const cleanUrl = new URL(req.url);
      cleanUrl.pathname = cleanUrl.pathname.replace(/^\/test/, "");
      normalizedReq = new Request(cleanUrl.toString(), req);
    }

    const response = await handler(normalizedReq);

    const location = response.headers.get("Location");
    if (location) {
      let newLocation = location;

      // Przekierowanie po pomyślnym logowaniu: Location: /keystatic -> /test/keystatic
      if (newLocation.startsWith("/keystatic")) {
        newLocation = `/test${newLocation}`;
      }

      // Przekierowanie do GitHub OAuth: upewniamy się, że callback URL zawiera /test
      if (newLocation.includes("github.com/login/oauth/authorize")) {
        newLocation = newLocation.replace(
          "/api/keystatic/github/oauth/callback",
          "/test/api/keystatic/github/oauth/callback"
        );
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

