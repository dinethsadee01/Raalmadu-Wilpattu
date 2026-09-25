/**
 * Minimal static server for previewing dist/ locally.
 *
 * It mirrors production routing: /rooms/ serves rooms/index.html, unknown
 * paths return the real 404 page with a 404 status, and a missing trailing
 * slash redirects rather than 404-ing — so what you see locally matches what
 * the host will do.
 *
 * Run: npm run serve   (or npm run dev to build first)
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const read = async (p) => {
  try {
    const stat = await fs.stat(p);
    if (!stat.isFile()) return null;
    return await fs.readFile(p);
  } catch {
    return null;
  }
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  // Block traversal outside dist/.
  const target = path.normalize(path.join(DIST, pathname));
  if (!target.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let file = null;
  let status = 200;

  if (pathname.endsWith('/')) {
    file = await read(path.join(target, 'index.html'));
    if (file) pathname += 'index.html';
  } else {
    file = await read(target);
    // Extension-less path that maps to a directory → redirect to the slash form.
    if (!file && !path.extname(pathname)) {
      if (await read(path.join(target, 'index.html'))) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
        return;
      }
    }
  }

  if (!file) {
    status = 404;
    file = (await read(path.join(DIST, '404.html'))) || Buffer.from('Not found');
    pathname = '404.html';
  }

  const type = TYPES[path.extname(pathname).toLowerCase()] || 'application/octet-stream';
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': file.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(file);
});

server.listen(PORT, () => {
  console.log(`\nRaalmadu Wilpattu preview → http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop.\n');
});
