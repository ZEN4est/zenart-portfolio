const fs = require('fs');
const path = require('path');

const isTestBasePath = process.env.NEXT_PUBLIC_BASE_PATH === '/test';

function patchFile(relativePath, replacements) {
  const fullPath = path.resolve(relativePath);
  if (!fs.existsSync(fullPath)) {
    console.log('Skipping (file not found):', relativePath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const item of replacements) {
    const search = isTestBasePath ? item[0] : item[1];
    const replace = isTestBasePath ? item[1] : item[0];
    if (content.includes(search)) {
      content = content.replaceAll(search, replace);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Successfully ${isTestBasePath ? 'patched (/test)' : 'restored (root)'}:`, relativePath);
  } else {
    console.log(`Already in correct state (${isTestBasePath ? '/test' : 'root'}):`, relativePath);
  }
}

console.log(`[patch-keystatic] Mode: ${isTestBasePath ? 'SUBPATH /test' : 'ROOT DOMAIN /'}`);

// 1. Router in core bundle
patchFile('node_modules/@keystatic/core/dist/index-5d64e651.js', [
  [
    'parsedUrl.pathname.replace(/^\\/keystatic\\/?/, "")',
    'parsedUrl.pathname.replace(/^(\\/test)?\\/keystatic\\/?/, "")'
  ],
  [
    '!newUrl.pathname.startsWith("/keystatic")',
    '!newUrl.pathname.replace(/^\\/test/, "").startsWith("/keystatic")'
  ],
  [
    'const newUrl = new URL(url_0, window.location.href);',
    'const newUrl = new URL(typeof url_0 === "string" && url_0.startsWith("/keystatic") ? "/test" + url_0 : url_0, window.location.href);'
  ],
  [
    "fetch('/api/keystatic/github/refresh-token'",
    "fetch('/test/api/keystatic/github/refresh-token'"
  ],
  [
    "fetch('/api/keystatic/tree'",
    "fetch('/test/api/keystatic/tree'"
  ],
  [
    "window.location.href = `/api/keystatic/github/login?from=${router.params.map(encodeURIComponent).join('/')}`;",
    "window.location.href = `/test/api/keystatic/github/login?from=${router.params.map(encodeURIComponent).join('/')}`;"
  ],
  [
    "window.location.href = `/api/keystatic/github/repo-not-found?from=${router.params.map(encodeURIComponent).join('/')}`;",
    "window.location.href = `/test/api/keystatic/github/repo-not-found?from=${router.params.map(encodeURIComponent).join('/')}`;"
  ]
]);

// 2. Logout link in index-3c244051.js
patchFile('node_modules/@keystatic/core/dist/index-3c244051.js', [
  [
    '"/api/keystatic/github/logout"',
    '"/test/api/keystatic/github/logout"'
  ]
]);

// 3. UI in core ui
patchFile('node_modules/@keystatic/core/dist/keystatic-core-ui.js', [
  [
    'basePath = `/keystatic/branch/${encodeURIComponent(branch)}`',
    'basePath = `/test/keystatic/branch/${encodeURIComponent(branch)}`'
  ],
  [
    'basePath = "/keystatic"',
    'basePath = "/test/keystatic"'
  ],
  [
    "window.location.href = '/api/keystatic/github/login'",
    "window.location.href = '/test/api/keystatic/github/login'"
  ],
  [
    'window.location.href = "/api/keystatic/github/login"',
    'window.location.href = "/test/api/keystatic/github/login"'
  ],
  [
    'window.location.href = "/api/keystatic/github/repo-not-found";',
    'window.location.href = "/test/api/keystatic/github/repo-not-found";'
  ],
  [
    "const t2 = `/api/keystatic/github/login",
    "const t2 = `/test/api/keystatic/github/login"
  ],
  [
    "fetch('/api/keystatic/",
    "fetch('/test/api/keystatic/"
  ],
  [
    "fetch(`/api/keystatic/",
    "fetch(`/test/api/keystatic/"
  ]
]);

// 4. API route handlers
patchFile('node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js', [
  [
    "url.pathname.replace(/^\\/api\\/keystatic\\/?/, '')",
    "url.pathname.replace(/^(\\/test)?\\/api\\/keystatic\\/?/, '')"
  ],
  [
    "redirect('/keystatic/setup')",
    "redirect('/test/keystatic/setup')"
  ],
  [
    "return redirect(`/keystatic",
    "return redirect(`/test/keystatic"
  ],
  [
    "`${reqUrl.origin}/api/keystatic/github/oauth/callback`",
    "`${reqUrl.origin}/test/api/keystatic/github/oauth/callback`"
  ]
]);

patchFile('node_modules/@keystatic/core/dist/keystatic-core-api-generic.js', [
  [
    "url.pathname.replace(/^\\/api\\/keystatic\\/?/, '')",
    "url.pathname.replace(/^(\\/test)?\\/api\\/keystatic\\/?/, '')"
  ],
  [
    "`${reqUrl.origin}/api/keystatic/github/oauth/callback`",
    "`${reqUrl.origin}/test/api/keystatic/github/oauth/callback`"
  ]
]);
