// Załaduj zmienne środowiskowe z pliku .env (natywnie w Node.js 20+)
const path = require('path');

process.env.NODE_ENV = 'production';

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
    console.log('[server.js] Załadowano plik .env z', path.join(__dirname, '.env'));
  } catch (e) {
    console.log('[server.js] Brak pliku .env lub błąd ładowania:', e.message);
  }
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
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
