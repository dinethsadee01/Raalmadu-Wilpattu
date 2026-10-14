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
const LOGO_SRC = path.join(ROOT, 'assets', 'brand', 'logo.png');

// The logo's white artwork (leopard, lettering) is transparent in the source
// file, so every use sits it on a white disc, inset slightly so no white
// fringe shows round the black rim.
const whiteDisc = (d) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}">
    <circle cx="${d / 2}" cy="${d / 2}" r="${d / 2 - Math.max(1, d * 0.012)}" fill="#fff"/>
  </svg>`);

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

  const logo = await sharp(whiteDisc(168))
    .composite([{ input: await sharp(LOGO_SRC).resize(168, 168).toBuffer() }])
    .png()
    .toBuffer();

  await sharp(photo)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logo, top: 64, left: 72 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'og-default.jpg'));

  return { width: W, height: H, path: '/assets/img/og-default.jpg' };
}

/**
 * Favicons, apple-touch icon, PWA icons and the header/footer logo, all cut
 * from the one tracked source: assets/brand/logo.png (a round badge on a
 * transparent background).
 */
async function buildIcons() {
  const iconDir = path.join(ROOT, 'public', 'assets', 'icons');
  await fs.mkdir(iconDir, { recursive: true });
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const black = { r: 0, g: 0, b: 0, alpha: 1 };

  // The badge itself, scaled to `size` and centred on a `size × size` canvas.
  // `scale` < 1 leaves margin (the maskable safe zone); `bg` fills the corners.
  const badge = async (size, { scale = 1, bg = clear } = {}) => {
    const inner = Math.round(size * scale);
    const logo = await sharp(LOGO_SRC).resize(inner, inner, { fit: 'contain', background: clear }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: whiteDisc(inner), gravity: 'centre' }, { input: logo, gravity: 'centre' }]);
  };

  for (const size of [16, 32, 192, 512]) {
    await (await badge(size)).png().toFile(path.join(iconDir, `icon-${size}.png`));
  }
  await (await badge(32)).png().toFile(path.join(iconDir, 'favicon.png'));
  // iOS fills transparency with black anyway; make it explicit so the
  // home-screen tile is a clean black square with the badge inside.
  await (await badge(180, { scale: 0.92, bg: black })).png().toFile(path.join(iconDir, 'icon-180.png'));
  // Maskable icon needs its content inside the central 80% safe zone.
  await (await badge(512, { scale: 0.78, bg: black })).png().toFile(path.join(iconDir, 'icon-maskable-512.png'));

  // Header (≈52 px) and footer (≈96 px) logo at 1× and 2×–3× densities.
  for (const size of [96, 192, 288]) {
    const img = await badge(size);
    await img.clone().webp({ quality: 88 }).toFile(path.join(iconDir, `logo-${size}.webp`));
    await img.clone().png({ compressionLevel: 9 }).toFile(path.join(iconDir, `logo-${size}.png`));
  }

  // SVG favicon wrapping a 64 px raster of the badge — the artwork is a
  // bitmap, so this simply gives SVG-preferring browsers a crisp 2× icon.
  const fav = (await (await badge(64)).png().toBuffer()).toString('base64');
  await fs.writeFile(
    path.join(ROOT, 'public', 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
  <image width="64" height="64" href="data:image/png;base64,${fav}" xlink:href="data:image/png;base64,${fav}"/>
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
