export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    cwd: process.cwd(),
    projectDir: process.env.PROJECT_DIR || null,
    nodeEnv: process.env.NODE_ENV,
    has_NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID: !!process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID,
    has_KEYSTATIC_GITHUB_CLIENT_ID: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    has_KEYSTATIC_GITHUB_CLIENT_SECRET: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    has_KEYSTATIC_SECRET: !!process.env.KEYSTATIC_SECRET,
    clientIdPrefix: process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? process.env.KEYSTATIC_GITHUB_CLIENT_ID.slice(0, 5) + '...'
      : null,
  });
}

