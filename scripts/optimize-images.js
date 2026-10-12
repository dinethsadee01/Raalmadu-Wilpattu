/**
 * optimize-images.js
 * ---------------------------------------------------------------------------
 * Turns everything in assets/images/src/ into a responsive, heavily compressed
 * image set in public/assets/img/, and writes src/data/image-manifest.json so
 * the build can emit correct width/height attributes (which is what keeps
 * Cumulative Layout Shift at zero).
 *
 * For every source image it produces:
 *   • AVIF + WebP + JPEG at each breakpoint width (never upscaling)
 *   • a tiny blurred LQIP data-URI used as the CSS background while loading
 *   • real intrinsic dimensions recorded in the manifest
 *
 * It also generates the Open Graph image, the favicons and the PWA icons.
 *
 * Any image key declared in src/data/images.js with no source file gets a
 * generated brand-coloured placeholder, so the site always builds cleanly.
 *
 * Usage: npm run images:optimize
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { IMAGES, WIDTHS } from '../src/data/images.js';
import { site } from '../src/data/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'assets', 'images', 'src');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'img');
const MANIFEST_OUT = path.join(ROOT, 'src', 'data', 'image-manifest.json');

// Brand palette, mirrored from the CSS custom properties.
const BRAND = { ink: '#435c14', moss: '#587619', clay: '#c9a55a', sand: '#f8f6ef' };

const QUALITY = { avif: 52, webp: 74, jpeg: 78 };

async function findSource(key) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tif', 'tiff']) {
    const p = path.join(SRC_DIR, `${key}.${ext}`);
    try {
      await fs.access(p);
      return p;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

/** A calm, brand-coloured stand-in for any photo that is not supplied yet. */
async function generatePlaceholder(key, aspect) {
  const w = 2000;
  const h = Math.round(w / aspect);
  const label = key.replace(/^(gal|exp|room)-/, '').replace(/-/g, ' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${BRAND.moss}"/>
        <stop offset="55%" stop-color="${BRAND.ink}"/>
        <stop offset="100%" stop-color="#2f4210"/>
      </linearGradient>
      <radialGradient id="v" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stop-color="${BRAND.clay}" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="${BRAND.ink}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${h}" fill="url(#v)"/>
    <g fill="none" stroke="${BRAND.sand}" stroke-opacity="0.14" stroke-width="2">
      <circle cx="${w * 0.5}" cy="${h * 0.44}" r="${h * 0.20}"/>
      <circle cx="${w * 0.5}" cy="${h * 0.44}" r="${h * 0.30}"/>
    </g>
    <text x="50%" y="${h * 0.46}" text-anchor="middle" font-family="Georgia,serif"
          font-size="${Math.round(h * 0.075)}" fill="${BRAND.sand}" fill-opacity="0.92"
          letter-spacing="2">Raalmadu Wilpattu</text>
    <text x="50%" y="${h * 0.56}" text-anchor="middle" font-family="Georgia,serif"
          font-size="${Math.round(h * 0.034)}" fill="${BRAND.sand}" fill-opacity="0.55"
          letter-spacing="6">${label.toUpperCase()}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer();
}

/** 20px-wide blurred data-URI, inlined as a background so nothing flashes white. */
async function makeLqip(input) {
  const buf = await sharp(input).resize(20).blur(1.2).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processImage(key, meta, stats) {
  const srcPath = await findSource(key);
  const input = srcPath || (await generatePlaceholder(key, meta.aspect));
  if (!srcPath) stats.generated.push(key);

  const image = sharp(input, { failOn: 'none' });
  const { width: srcW, height: srcH } = await image.metadata();

  // Crop to the aspect ratio the layout expects, so the manifest dimensions and
  // the rendered box always agree.
  const targetW = Math.min(srcW, Math.max(...WIDTHS));
  const targetH = Math.round(targetW / meta.aspect);

  const base = sharp(input, { failOn: 'none' })
    .rotate()
    .resize(targetW, targetH, { fit: 'cover', position: meta.position || 'attention' });

  const baseBuf = await base.toBuffer();
  const widths = WIDTHS.filter((w) => w <= targetW);
  if (!widths.includes(targetW)) widths.push(targetW);

  for (const w of widths) {
    const h = Math.round(w / meta.aspect);
    const resized = sharp(baseBuf).resize(w, h, { fit: 'cover' });
    await Promise.all([
      resized.clone().avif({ quality: QUALITY.avif, effort: 5 }).toFile(path.join(OUT_DIR, `${key}-${w}.avif`)),
      resized.clone().webp({ quality: QUALITY.webp }).toFile(path.join(OUT_DIR, `${key}-${w}.webp`)),
      resized.clone().jpeg({ quality: QUALITY.jpeg, mozjpeg: true, progressive: true }).toFile(path.join(OUT_DIR, `${key}-${w}.jpg`)),
    ]);
    stats.files += 3;
  }

  const lqip = await makeLqip(baseBuf);
  stats.processed.push(key);

  return {
    key,
    widths: widths.sort((a, b) => a - b),
    width: targetW,
    height: targetH,
    aspect: meta.aspect,
    alt: meta.alt,
    lqip,
    source: srcPath ? path.basename(srcPath) : null,
    generated: !srcPath,
    originalWidth: srcW,
    originalHeight: srcH,
  };
}

/** 1200×630 Open Graph card, built from the hero shot with a legible overlay. */
async function buildOgImage(manifest) {
  const heroKey = manifest['hero-lodge'] ? 'hero-lodge' : Object.keys(manifest)[0];
  const heroSrc = (await findSource(heroKey)) || (await generatePlaceholder(heroKey, 1.6));

  const W = 1200;
  const H = 630;
  const photo = await sharp(heroSrc, { failOn: 'none' })
    .rotate()
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .toBuffer();

  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="s" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#0c1a13" stop-opacity="0.92"/>
        <stop offset="55%" stop-color="#0c1a13" stop-opacity="0.42"/>
        <stop offset="100%" stop-color="#0c1a13" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#s)"/>
    <rect x="72" y="486" width="64" height="3" fill="${BRAND.clay}"/>
    <text x="72" y="452" font-family="Georgia,serif" font-size="30" fill="#f4f0e8" fill-opacity="0.72" letter-spacing="7">SRI LANKA</text>
    <text x="72" y="546" font-family="Georgia,serif" font-size="66" fill="#fdfcf9">Raalmadu Wilpattu</text>
    <text x="72" y="588" font-family="Georgia,serif" font-size="27" fill="#f4f0e8" fill-opacity="0.80">A jungle lodge on the edge of Wilpattu National Park</text>
  </svg>`);

  await sharp(photo)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'og-default.jpg'));

  return { width: W, height: H, path: '/assets/img/og-default.jpg' };
}

/** Favicons, apple-touch icon and maskable PWA icons, drawn from the monogram. */
async function buildIcons() {
  const iconDir = path.join(ROOT, 'public', 'assets', 'icons');
  await fs.mkdir(iconDir, { recursive: true });

  const mark = (size, pad) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${pad ? 0 : size * 0.22}" fill="${BRAND.ink}"/>
    <text x="50%" y="50%" dy="${size * 0.125}" text-anchor="middle" font-family="Georgia,serif"
          font-size="${size * (pad ? 0.42 : 0.54)}" fill="${BRAND.sand}">R</text>
    <rect x="${size * (pad ? 0.34 : 0.28)}" y="${size * 0.72}" width="${size * (pad ? 0.32 : 0.44)}" height="${size * 0.035}" fill="${BRAND.clay}"/>
  </svg>`);

  for (const size of [16, 32, 180, 192, 512]) {
    await sharp(mark(size, false)).png().toFile(path.join(iconDir, `icon-${size}.png`));
  }
  // Maskable icon needs its content inside the safe zone.
  await sharp(mark(512, true)).png().toFile(path.join(iconDir, 'icon-maskable-512.png'));
  await sharp(mark(32, false)).png().toFile(path.join(iconDir, 'favicon.png'));

  await fs.writeFile(
    path.join(ROOT, 'public', 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BRAND.ink}"/>
  <text x="32" y="42" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="${BRAND.sand}">R</text>
  <rect x="18" y="47" width="28" height="2.4" fill="${BRAND.clay}"/>
</svg>\n`,
  );
}

async function dirSize(dir) {
  let total = 0;
  for (const f of await fs.readdir(dir)) {
    total += (await fs.stat(path.join(dir, f))).size;
  }
  return total;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  // Start clean so removed images do not linger in the deploy.
  for (const f of await fs.readdir(OUT_DIR).catch(() => [])) {
    await fs.rm(path.join(OUT_DIR, f), { force: true });
  }

  const stats = { files: 0, processed: [], generated: [] };
  const manifest = {};

  for (const [key, meta] of Object.entries(IMAGES)) {
    manifest[key] = await processImage(key, meta, stats);
    process.stdout.write(`  ${manifest[key].generated ? '◻' : '✓'} ${key}\n`);
  }

  const og = await buildOgImage(manifest);
  await buildIcons();

  await fs.writeFile(
    MANIFEST_OUT,
    `${JSON.stringify({ images: manifest, og, generatedAt: new Date().toISOString(), site: site.url }, null, 2)}\n`,
  );

  const bytes = await dirSize(OUT_DIR);
  console.log(`\n${stats.processed.length} images → ${stats.files} derivatives in AVIF/WebP/JPEG`);
  if (stats.generated.length) {
    console.log(`Generated placeholders (awaiting real photography): ${stats.generated.join(', ')}`);
  }
  console.log(`Total optimized payload: ${(bytes / 1024 / 1024).toFixed(1)} MB across all breakpoints/formats`);
  console.log(`Manifest → src/data/image-manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
