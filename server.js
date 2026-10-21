// Załaduj zmienne środowiskowe z pliku .env (natywnie w Node.js 20+)
const path = require('path');

// Krytyczne dla LiteSpeed / cPanel CloudLinux Passenger:
// 1. Zmiana katalogu roboczego procesu (process.cwd()) na katalog fizyczny server.js
process.chdir(__dirname);
process.env.PROJECT_DIR = __dirname;
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
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// Wskazanie dir: __dirname zapobiega szukaniu .next w domyślnym katalogu LiteSpeed (/home/user)
const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error: ' + (err?.message || 'unknown'));
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('[server.js] app.prepare error:', err);
  process.exit(1);
});
