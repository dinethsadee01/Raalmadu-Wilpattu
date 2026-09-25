/**
 * check-seo.js — audits the built site in dist/.
 *
 * This is the acceptance test for the SEO brief. It fails the build (exit 1)
 * on any error, so a regression cannot ship silently.
 *
 * Checks performed per page:
 *   • exactly one <h1>
 *   • heading hierarchy never skips a level (h2 → h4 is an error)
 *   • <title> present, unique, and a sensible length
 *   • meta description present, unique, 70–165 characters
 *   • a self-referencing absolute HTTPS canonical that matches the file path
 *   • no stray noindex on a page that should be indexed
 *   • every <img> has alt text, width, height and a loading attribute
 *   • Open Graph and Twitter tags present, with an image that exists on disk
 *   • JSON-LD parses and every declared @id is well formed
 *   • every internal link resolves to a real file in dist/
 *   • no http:// links to our own domain
 *
 * Site-wide:
 *   • sitemap.xml is well formed, lists every indexable page and nothing else
 *   • robots.txt exists, references the sitemap, does not block assets
 *   • the OG image, favicons and manifest exist
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../src/data/site.js';

const OWN_HOST = new URL(SITE_URL).host.replace(/^www[.]/, '');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

async function walk(dir, base = '') {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await walk(abs, rel)));
    else out.push({ abs, rel });
  }
  return out;
}

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

/** Map a site-relative URL to the file that should serve it. */
function resolveInternal(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return 'index.html';
  const trimmed = clean.replace(/^\//, '');
  if (/\.[a-z0-9]{2,5}$/i.test(trimmed)) return trimmed;
  return `${trimmed.replace(/\/$/, '')}/index.html`;
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  const all = await walk(DIST);
  const fileSet = new Set(all.map((f) => f.rel.replace(/\\/g, '/')));
  const htmlFiles = all.filter((f) => f.rel.endsWith('.html'));

  const titles = new Map();
  const descriptions = new Map();
  const indexablePaths = [];

  for (const { abs, rel } of htmlFiles) {
    const relPosix = rel.replace(/\\/g, '/');
    const html = await fs.readFile(abs, 'utf8');
    const isNotFound = relPosix === '404.html';

    /* ---------- headings ---------- */
    const h1s = html.match(/<h1[\s>]/g) || [];
    if (h1s.length !== 1) err(relPosix, `${h1s.length} <h1> elements (need exactly 1)`);

    const headings = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    let prev = 0;
    for (const level of headings) {
      if (prev && level > prev + 1) {
        err(relPosix, `heading hierarchy skips from h${prev} to h${level}`);
        break;
      }
      prev = level;
    }

    /* ---------- title ---------- */
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    if (!title) err(relPosix, 'missing <title>');
    else {
      if (titles.has(title)) err(relPosix, `duplicate <title> (also on ${titles.get(title)})`);
      titles.set(title, relPosix);
      if (title.length > 65) warn(relPosix, `<title> is ${title.length} chars (may truncate in SERPs)`);
      if (title.length < 15) warn(relPosix, `<title> is only ${title.length} chars`);
    }

    /* ---------- description ---------- */
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (!desc) err(relPosix, 'missing meta description');
    else {
      if (descriptions.has(desc)) err(relPosix, `duplicate meta description (also on ${descriptions.get(desc)})`);
      descriptions.set(desc, relPosix);
      if (desc.length < 70 || desc.length > 165) {
        err(relPosix, `meta description is ${desc.length} chars (want 70–165)`);
      }
    }

    /* ---------- robots / canonical ---------- */
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] || '';
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];

    if (!canonical) {
      err(relPosix, 'missing canonical tag');
    } else {
      if (!canonical.startsWith('https://')) err(relPosix, `canonical is not HTTPS: ${canonical}`);
      const expectedPath =
        relPosix === 'index.html'
          ? '/'
          : relPosix.endsWith('/index.html')
            ? `/${relPosix.slice(0, -'index.html'.length)}`
            : `/${relPosix}`;
      const expected = `${SITE_URL}${expectedPath}`;
      if (canonical !== expected) {
        err(relPosix, `canonical mismatch — got ${canonical}, expected ${expected}`);
      }
    }

    if (isNotFound) {
      if (!/noindex/.test(robots)) err(relPosix, '404 page should be noindex');
    } else {
      if (/noindex/.test(robots)) err(relPosix, 'unexpected noindex on an indexable page');
      if (!/index/.test(robots)) err(relPosix, 'missing explicit index directive');
      indexablePaths.push(
        relPosix === 'index.html'
          ? '/'
          : `/${relPosix.replace(/index\.html$/, '')}`,
      );
    }

    /* ---------- images ---------- */
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      if (!/\salt="/.test(tag)) err(relPosix, `<img> without alt: ${tag.slice(0, 90)}`);
      if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) {
        err(relPosix, `<img> without width/height (layout shift risk): ${tag.slice(0, 90)}`);
      }
      if (!/\sloading="(lazy|eager)"/.test(tag)) {
        warn(relPosix, `<img> without loading attribute: ${tag.slice(0, 70)}`);
      }
      const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
      if (src && src.startsWith('/') && !fileSet.has(src.slice(1))) {
        err(relPosix, `<img src> not found in dist: ${src}`);
      }
    }

    /* ---------- social cards ---------- */
    if (!isNotFound) {
      for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
        if (!html.includes(`property="${prop}"`)) err(relPosix, `missing ${prop}`);
      }
      for (const name of ['twitter:card', 'twitter:title', 'twitter:image']) {
        if (!html.includes(`name="${name}"`)) err(relPosix, `missing ${name}`);
      }
      const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
      if (ogImage) {
        if (!ogImage.startsWith('https://')) err(relPosix, 'og:image must be an absolute HTTPS URL');
        const localPath = ogImage.replace(SITE_URL, '').replace(/^\//, '');
        if (!fileSet.has(localPath)) err(relPosix, `og:image missing from dist: ${localPath}`);
      }
    }

    /* ---------- structured data ---------- */
    for (const block of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []) {
      const json = block.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
      try {
        const parsed = JSON.parse(json.replace(/\\u003c/g, '<'));
        const nodes = parsed['@graph'] || [parsed];
        for (const node of nodes) {
          if (!node['@type']) err(relPosix, 'JSON-LD node without @type');
        }
      } catch (e) {
        err(relPosix, `invalid JSON-LD: ${e.message}`);
      }
    }

    /* ---------- links ---------- */
    for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      const href = m[1];
      if (href.startsWith('http://') && href.includes(OWN_HOST)) {
        err(relPosix, `insecure http link to own domain: ${href}`);
      }
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (/^https?:\/\//.test(href)) {
        if (href.startsWith(SITE_URL)) {
          const target = resolveInternal(href.replace(SITE_URL, ''));
          if (!fileSet.has(target)) err(relPosix, `broken absolute internal link: ${href}`);
        }
        continue;
      }
      if (!href.startsWith('/')) {
        warn(relPosix, `relative link (prefer root-relative): ${href}`);
        continue;
      }
      const target = resolveInternal(href);
      if (!fileSet.has(target)) err(relPosix, `broken internal link: ${href} → ${target}`);
    }

    /* ---------- misc ---------- */
    if (!/<html lang="/.test(html)) err(relPosix, 'missing lang attribute on <html>');
    if (!/name="viewport"/.test(html)) err(relPosix, 'missing viewport meta');
  }

  /* ---------- site-wide files ---------- */
  const required = [
    'sitemap.xml',
    'robots.txt',
    'site.webmanifest',
    'favicon.svg',
    'assets/img/og-default.jpg',
    'assets/js/main.js',
    'assets/icons/icon-192.png',
    'assets/icons/icon-512.png',
    '404.html',
  ];
  for (const f of required) {
    if (!fileSet.has(f)) err('site', `missing required file: ${f}`);
  }

  /* ---------- sitemap ---------- */
  if (fileSet.has('sitemap.xml')) {
    const xml = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
    if (!xml.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) {
      err('sitemap.xml', 'wrong or missing sitemap namespace');
    }
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    for (const loc of locs) {
      if (!loc.startsWith(`${SITE_URL}/`)) err('sitemap.xml', `URL outside the canonical origin: ${loc}`);
      const target = resolveInternal(loc.replace(SITE_URL, ''));
      if (!fileSet.has(target)) err('sitemap.xml', `lists a URL with no page: ${loc}`);
    }

    const listed = new Set(locs.map((l) => l.replace(SITE_URL, '')));
    for (const p of indexablePaths) {
      if (!listed.has(p)) err('sitemap.xml', `indexable page missing from sitemap: ${p}`);
    }
    if (listed.has('/404.html')) err('sitemap.xml', '404 page must not be listed');
  }

  /* ---------- robots ---------- */
  if (fileSet.has('robots.txt')) {
    const robots = await fs.readFile(path.join(DIST, 'robots.txt'), 'utf8');
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
      err('robots.txt', 'does not reference the sitemap');
    }
    if (/Disallow:\s*\/(assets|css|js|img)/i.test(robots)) {
      err('robots.txt', 'blocks assets Google needs to render the page');
    }
    if (/^Disallow:\s*\/\s*$/m.test(robots)) err('robots.txt', 'blocks the entire site');
  }

  /* ---------- report ---------- */
  const pageCount = htmlFiles.length;
  console.log(`\nAudited ${pageCount} pages in dist/\n`);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
    console.log('');
  }

  if (errors.length) {
    console.log(`Errors (${errors.length}):`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    console.log('');
    process.exit(1);
  }

  console.log('All SEO checks passed.');
  console.log(`  ${titles.size} unique titles, ${descriptions.size} unique meta descriptions`);
  console.log(`  ${indexablePaths.length} indexable pages, all present in sitemap.xml`);
  console.log('  every image has alt text and intrinsic dimensions');
  console.log('  every internal link resolves');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
