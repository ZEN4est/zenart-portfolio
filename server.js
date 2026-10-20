// Załaduj zmienne środowiskowe z pliku .env (natywnie w Node.js 20+)
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
    console.log('[server.js] Załadowano plik .env');
  } catch (e) {
    console.log('[server.js] Brak pliku .env lub błąd ładowania:', e.message);
  }
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error: ' + (err?.message || 'unknown'));
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
