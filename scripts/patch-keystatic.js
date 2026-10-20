const fs = require('fs');
const path = require('path');

function patchFile(relativePath, replacements) {
  const fullPath = path.resolve(relativePath);
  if (!fs.existsSync(fullPath)) {
    console.log('Skipping (file not found):', relativePath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replaceAll(search, replace);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Successfully patched:', relativePath);
  } else {
    console.log('No matches or already patched:', relativePath);
  }
}

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
    'basePath: "/keystatic"',
    'basePath: "/test/keystatic"'
  ]
]);

// 2. UI in core ui
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

// 3. API route handlers
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
  ]
]);

patchFile('node_modules/@keystatic/core/dist/keystatic-core-api-generic.js', [
  [
    "url.pathname.replace(/^\\/api\\/keystatic\\/?/, '')",
    "url.pathname.replace(/^(\\/test)?\\/api\\/keystatic\\/?/, '')"
  ]
]);

