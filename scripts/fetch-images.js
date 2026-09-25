/**
 * fetch-images.js
 * ---------------------------------------------------------------------------
 * Downloads PLACEHOLDER photography for the build from Openverse, filtered to
 * images that are licensed for commercial use, and records the creator and
 * licence for every single file in assets/images/credits.json (surfaced on the
 * /image-credits/ page).
 *
 * ⚠  These are stand-ins. Replace them with the property's own photography
 *    before launch: drop real files into assets/images/src/ using the same
 *    file names and run `npm run images:optimize`. Nothing else changes.
 *
 * Usage:  npm run images:fetch          (skips anything already downloaded)
 *         npm run images:fetch -- --force   (re-downloads everything)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PLACEHOLDER_QUERIES } from '../src/data/images.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'assets', 'images', 'src');
const CREDITS = path.join(ROOT, 'assets', 'images', 'credits.json');
const FORCE = process.argv.includes('--force');
const ONLY = (() => {
  const i = process.argv.indexOf('--only');
  return i > -1 && process.argv[i + 1] ? new Set(process.argv[i + 1].split(',')) : null;
})();

const API = 'https://api.openverse.org/v1/images/';
const MIN_WIDTH = 1200;

/** Built from src/data/images.js so the key list can never drift. */
const MANIFEST = Object.entries(PLACEHOLDER_QUERIES)
  .map(([key, cfg]) => (Array.isArray(cfg) ? { key, queries: cfg } : { key, ...cfg }))
  .filter((e) => !ONLY || ONLY.has(e.key));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query) {
  const url = `${API}?q=${encodeURIComponent(query)}&license_type=commercial&page_size=20&mature=false`;
  const res = await fetch(url, { headers: { 'User-Agent': 'RaalmaduWilpattuSiteBuild/1.0' } });
  if (!res.ok) throw new Error(`Openverse ${res.status} for "${query}"`);
  const json = await res.json();
  return json.results || [];
}

/**
 * Wikimedia Commons provider.
 *
 * Commons is far better curated than a general CC index for regional subjects
 * (Sri Lankan wildlife, food and landscape), and every file on it is under a
 * free licence that permits commercial reuse. Searching the File namespace
 * directly, and asking for a 2000px rendering, avoids the tiny-thumbnail
 * problem that limits other sources.
 */
async function searchCommons(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6',
    gsrlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '2000',
    origin: '*',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': 'RaalmaduWilpattuSiteBuild/1.0 (site build)' },
  });
  if (!res.ok) throw new Error(`Commons ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages || {};

  return Object.values(pages)
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const meta = ii.extmetadata || {};
      const strip = (v) => (v ? String(v.value).replace(/<[^>]*>/g, '').trim() : '');
      return {
        url: ii.thumburl || ii.url,
        width: ii.thumbwidth || ii.width,
        height: ii.thumbheight || ii.height,
        title: p.title.replace(/^File:/, ''),
        creator: strip(meta.Artist) || 'Unknown',
        creator_url: '',
        license: strip(meta.LicenseShortName) || 'See source',
        license_url: strip(meta.LicenseUrl),
        foreign_landing_url: ii.descriptionurl,
        provider: 'wikimedia',
      };
    })
    .filter((x) => x && x.width >= MIN_WIDTH);
}

/**
 * Wikimedia Commons category listing.
 *
 * Free-text search over Commons matches file descriptions, which produces
 * wild misses (an aircraft for "restaurant terrace"). Categories are curated
 * by hand, so "Category:Wilpattu National Park" returns only Wilpattu.
 * Landscape-orientation files are preferred, since every slot on the site is
 * wider than it is tall apart from two.
 */
async function listCommonsCategory(category) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'categorymembers',
    gcmtitle: category.startsWith('Category:') ? category : `Category:${category}`,
    gcmtype: 'file',
    gcmlimit: '60',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '2000',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': 'RaalmaduWilpattuSiteBuild/1.0 (site build)' },
  });
  if (!res.ok) throw new Error(`Commons category ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages || {};

  return Object.values(pages)
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const meta = ii.extmetadata || {};
      const strip = (v) => (v ? String(v.value).replace(/<[^>]*>/g, '').trim() : '');
      return {
        url: ii.thumburl || ii.url,
        width: ii.thumbwidth || ii.width,
        height: ii.thumbheight || ii.height,
        title: p.title.replace(/^File:/, ''),
        creator: strip(meta.Artist) || 'Unknown',
        creator_url: '',
        license: strip(meta.LicenseShortName) || 'See source',
        license_url: strip(meta.LicenseUrl),
        foreign_landing_url: ii.descriptionurl,
        provider: 'wikimedia',
      };
    })
    .filter((x) => x && x.width >= MIN_WIDTH)
    .sort((a, b) => {
      const land = (i) => (i.width / i.height >= 1.25 ? 1 : 0);
      return land(b) - land(a) || b.width - a.width;
    });
}

/**
 * Rank candidates. Openverse often omits width/height, so unknown-size results
 * are kept as lower-priority candidates and validated with sharp after the
 * download instead of being discarded up front.
 */
function rank(results) {
  return results
    .filter((r) => r.url)
    .map((r) => ({ ...r, _w: r.width || 0 }))
    .sort((a, b) => {
      const aKnown = a._w >= MIN_WIDTH ? 2 : a._w === 0 ? 1 : 0;
      const bKnown = b._w >= MIN_WIDTH ? 2 : b._w === 0 ? 1 : 0;
      return bKnown - aKnown || b._w - a._w;
    })
    .slice(0, 6);
}

/**
 * Flickr serves several sizes from the same base name (_b = 1024, _h = 1600,
 * _k = 2048). Openverse usually returns _b, so try the larger variants first.
 */
function urlVariants(url) {
  const m = url.match(/^(https?:\/\/live\.staticflickr\.com\/.+?)_(?:b|c|z|h|k|o)(\.[a-z]+)$/i);
  if (!m) return [url];
  return [`${m[1]}_k${m[2]}`, `${m[1]}_h${m[2]}`, `${m[1]}_b${m[2]}`, url];
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'RaalmaduWilpattuSiteBuild/1.0' } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error('file suspiciously small');

  // Validate real dimensions before accepting the file.
  const meta = await sharp(buf).metadata();
  if ((meta.width || 0) < MIN_WIDTH) {
    throw new Error(`too small (${meta.width}x${meta.height})`);
  }

  await fs.writeFile(dest, buf);
  return { bytes: buf.length, width: meta.width, height: meta.height };
}

async function main() {
  await fs.mkdir(SRC_DIR, { recursive: true });

  let credits = {};
  try {
    credits = JSON.parse(await fs.readFile(CREDITS, 'utf8'));
  } catch {
    /* first run */
  }

  const existing = new Set(await fs.readdir(SRC_DIR).catch(() => []));
  let fetched = 0;
  let skipped = 0;
  const failures = [];

  for (const entry of MANIFEST) {
    const already = [...existing].find((f) => f.startsWith(`${entry.key}.`));
    if (already && !FORCE) {
      skipped++;
      continue;
    }

    let done = false;
    for (const query of entry.queries) {
      if (done) break;
      let candidates = [];
      try {
        if (query.startsWith('Category:')) {
          candidates = (await listCommonsCategory(query)).slice(0, 10);
        } else if (entry.provider === 'commons') {
          candidates = (await searchCommons(query)).slice(0, 8);
        } else {
          candidates = rank(await search(query));
        }
        await sleep(350); // be polite to the API
      } catch {
        continue;
      }

      for (const hit of candidates) {
        try {
          const ext = (hit.url.split('.').pop() || 'jpg').split('?')[0].toLowerCase();
          const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
          const file = `${entry.key}.${safeExt}`;
          let got = null;
          for (const candidateUrl of urlVariants(hit.url)) {
            try {
              got = await download(candidateUrl, path.join(SRC_DIR, file));
              break;
            } catch {
              /* try the next size variant */
            }
          }
          if (!got) throw new Error('no usable size variant');
          const { bytes, width, height } = got;

          credits[entry.key] = {
            file,
            title: hit.title || entry.key,
            creator: hit.creator || 'Unknown',
            creatorUrl: hit.creator_url || '',
            license:
              hit.provider === 'wikimedia'
                ? hit.license
                : `CC ${String(hit.license || '').toUpperCase()} ${hit.license_version || ''}`.trim(),
            licenseUrl: hit.license_url || '',
            source: hit.foreign_landing_url || hit.url,
            provider: hit.provider || '',
            width,
            height,
            query,
          };

          console.log(
            `  ✓ ${entry.key.padEnd(18)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  ${width}x${height}  ${hit.creator || 'Unknown'} (${credits[entry.key].license})`,
          );
          fetched++;
          done = true;
          break;
        } catch {
          // try the next candidate
        }
      }
    }
    if (!done) {
      failures.push(entry.key);
      console.log(`  ✗ ${entry.key.padEnd(18)} no suitable commercially-licensed result`);
    }
  }

  await fs.writeFile(CREDITS, `${JSON.stringify(credits, null, 2)}\n`);

  console.log(`\nFetched ${fetched}, skipped ${skipped} already present.`);
  if (failures.length) {
    console.log(`Missing: ${failures.join(', ')} — a generated placeholder will be used instead.`);
  }
  console.log(`Credits written to assets/images/credits.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
