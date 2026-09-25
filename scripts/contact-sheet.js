/**
 * contact-sheet.js — renders every site image into one labelled grid.
 *
 * The fastest way to spot a wrong, ugly or mismatched photo, and the first
 * thing to run after dropping the property's real photography into
 * assets/images/src/ and re-optimising.
 *
 * Run: npm run images:sheet   → .qa/contact-sheet.jpg
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGES } from '../src/data/images.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.qa');
const CW = 300;
const CH = 200;
const COLS = 5;

const keys = Object.keys(IMAGES);
const rows = Math.ceil(keys.length / COLS);
const tiles = [];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const [i, key] of keys.entries()) {
  let buf;
  try {
    buf = await sharp(path.join(ROOT, 'public', 'assets', 'img', `${key}-800.jpg`))
      .resize(CW, CH, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch {
    buf = await sharp({ create: { width: CW, height: CH, channels: 3, background: '#333' } })
      .jpeg()
      .toBuffer();
  }
  const label = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="24">` +
      `<rect width="${CW}" height="24" fill="black" fill-opacity="0.8"/>` +
      `<text x="6" y="17" font-family="monospace" font-size="15" fill="white">${key}</text></svg>`,
  );
  tiles.push({
    input: await sharp(buf).composite([{ input: label, top: CH - 24, left: 0 }]).toBuffer(),
    top: Math.floor(i / COLS) * CH,
    left: (i % COLS) * CW,
  });
}

const out = path.join(OUT_DIR, 'contact-sheet.jpg');
await sharp({ create: { width: CW * COLS, height: CH * rows, channels: 3, background: '#111' } })
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile(out);

console.log(`Contact sheet: ${keys.length} images → .qa/contact-sheet.jpg`);
