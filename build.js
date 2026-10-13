/**
 * Static site generator for Raalmadu Wilpattu.
 *
 * Everything the site ships is produced here, which is what keeps the SEO
 * surface consistent: one page definition in, one directory-style clean URL
 * out, plus a sitemap, robots.txt, a web manifest and host configuration for
 * HTTPS and caching.
 *
 * Run: npm run build      → dist/
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, SITE_URL } from './src/data/site.js';
import { rooms } from './src/data/rooms.js';
import { IMAGES } from './src/data/images.js';
import { setImageManifest } from './src/lib/components.js';
import { renderPage } from './src/lib/layout.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');

/** Host names derived from SITE_URL, so the domain is configured in one file only. */
const CANONICAL_HOST = new URL(SITE_URL).host;           // e.g. www.example.com
const APEX_HOST = CANONICAL_HOST.replace(/^www[.]/, ''); // e.g. example.com
const HAS_WWW = CANONICAL_HOST !== APEX_HOST;
const PUBLIC = path.join(__dirname, 'public');

/* ----------------------------------------------------------------- helpers */

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else await fs.copyFile(src, dest);
  }
}

/**
 * Mirror `from` into `to`, copying only what actually changed and deleting
 * whatever no longer exists at the source.
 *
 * The generated image set is ~57 MB across several hundred files. Wiping and
 * re-copying it on every build made a rebuild take minutes on Windows, almost
 * entirely in I/O wait behind on-access virus scanning — the build itself uses
 * about 0.1 s of CPU. Syncing instead keeps the output identical and makes a
 * no-op rebuild effectively free.
 */
async function syncDir(from, to, stats) {
  await fs.mkdir(to, { recursive: true });

  const srcEntries = await fs.readdir(from, { withFileTypes: true });
  const srcNames = new Set(srcEntries.map((e) => e.name));

  // Drop anything at the destination that the source no longer has.
  for (const entry of await fs.readdir(to, { withFileTypes: true }).catch(() => [])) {
    if (!srcNames.has(entry.name)) {
      await fs.rm(path.join(to, entry.name), { recursive: true, force: true });
      stats.removed++;
    }
  }

  for (const entry of srcEntries) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await syncDir(src, dest, stats);
      continue;
    }

    const [srcStat, destStat] = await Promise.all([
      fs.stat(src),
      fs.stat(dest).catch(() => null),
    ]);

    // mtimeMs can differ by sub-millisecond rounding across filesystems, so
    // compare with a 1 s tolerance alongside an exact size match.
    const unchanged =
      destStat &&
      destStat.size === srcStat.size &&
      Math.abs(destStat.mtimeMs - srcStat.mtimeMs) < 1000;

    if (unchanged) {
      stats.skipped++;
    } else {
      await fs.copyFile(src, dest);
      await fs.utimes(dest, srcStat.atime, srcStat.mtime);
      stats.copied++;
    }
  }
}

/** Conservative CSS minifier: comments and redundant whitespace only. */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Conservative HTML minifier. Strips leading indentation and blank lines but
 * always leaves at least one whitespace character between elements, so inline
 * content can never be accidentally joined together.
 */
function minifyHtml(html) {
  return html
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/>\n</g, '>\n<');
}

/** Build the LCP preload descriptor for a given image key. */
function preloadFor(key, manifest, sizes = '100vw') {
  const entry = manifest[key];
  if (!entry) return null;
  return {
    srcset: entry.widths.map((w) => `/assets/img/${key}-${w}.avif ${w}w`).join(', '),
    sizes,
  };
}

/* -------------------------------------------------------------- generators */

function buildSitemap(pages) {
  const today = new Date().toISOString().slice(0, 10);

  const priorityFor = (p) => {
    if (p.path === '/') return '1.0';
    if (p.path === '/rooms/' || p.path === '/booking/') return '0.9';
    if (p.path.startsWith('/rooms/')) return '0.8';
    if (['/privacy-policy/', '/terms/', '/image-credits/'].includes(p.path)) return '0.2';
    return '0.7';
  };

  const urls = pages
    .filter((p) => !p.noindex && !p.excludeFromSitemap)
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priorityFor(p)}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`;
}

function buildRobots() {
  return `# robots.txt for ${site.name}
# Everything is crawlable. CSS, JS and images are deliberately NOT blocked —
# Google needs them to render the page and assess Core Web Vitals.

User-agent: *
Allow: /

# No crawlable value, and they should never appear in results.
Disallow: /404.html

# Common bad-citizen scrapers.
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function buildWebmanifest() {
  return `${JSON.stringify(
    {
      name: site.name,
      short_name: 'Raalmadu',
      description: site.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: site.themeColor,
      lang: site.lang,
      icons: [
        { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/assets/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2,
  )}\n`;
}

/** Netlify / Cloudflare Pages headers: HTTPS, security and cache policy. */
function buildHeaders() {
  return `/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'; upgrade-insecure-requests

# Fingerprint-free HTML: always revalidate.
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Immutable, content-addressed assets.
/assets/img/*
  Cache-Control: public, max-age=31536000, immutable

/assets/icons/*
  Cache-Control: public, max-age=31536000, immutable

/assets/js/*
  Cache-Control: public, max-age=604800
`;
}

/** Old room URLs → their renamed pages, from `previousSlugs` in rooms.js. */
const roomRedirects = () =>
  rooms.flatMap((r) =>
    (r.previousSlugs || []).map((old) => ({ from: `/rooms/${old}/`, to: `/rooms/${r.slug}/` })),
  );

function buildRedirects() {
  const hostRules = HAS_WWW
    ? [
        `http://${APEX_HOST}/*    ${SITE_URL}/:splat   301!`,
        `https://${APEX_HOST}/*   ${SITE_URL}/:splat   301!`,
        `http://${CANONICAL_HOST}/*   ${SITE_URL}/:splat   301!`,
      ].join('\n')
    : [
        `http://${CANONICAL_HOST}/*     ${SITE_URL}/:splat   301!`,
        `http://www.${CANONICAL_HOST}/*  ${SITE_URL}/:splat   301!`,
        `https://www.${CANONICAL_HOST}/* ${SITE_URL}/:splat   301!`,
      ].join('\n');

  return `# Canonical host + HTTPS. Generated from SITE_URL in src/data/site.js.
${hostRules}

# Legacy / mistyped paths -> their canonical clean slugs.
/index.html      /              301
/home            /              301
/rooms.html      /rooms/        301
/accommodation   /rooms/        301
/suites          /rooms/        301
/restaurant      /dining/       301
/food            /dining/       301
/things-to-do    /experiences/  301
/safari          /experiences/  301
/photos          /gallery/      301
/deals           /offers/       301
/packages        /offers/       301
/contact-us      /contact/      301
/book            /booking/      301
/book-now        /booking/      301
/directions      /contact/      301

# Location now lives on the contact page.
/location        /contact/      301
/location/       /contact/      301
/faqs            /faq/          301

# Renamed rooms.
${roomRedirects()
  .flatMap(({ from, to }) => [`${from.slice(0, -1)}  ${to}  301`, `${from}  ${to}  301`])
  .join('\n')}

/*  /404.html  404
`;
}

function buildHtaccess() {
  return `# Apache configuration for ${site.name}
# Drop this at the document root if the site is hosted on Apache/cPanel.

RewriteEngine On

# ---- Force HTTPS -----------------------------------------------------------
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# ---- Canonical host --------------------------------------------------------
RewriteCond %{HTTP_HOST} !^${CANONICAL_HOST.split('.').join('\\.')}$ [NC]
RewriteRule ^(.*)$ ${SITE_URL}/$1 [R=301,L]

# ---- Merged pages: location now lives on the contact page ------------------
RewriteRule ^(location|directions)/?$ /contact/ [R=301,L]

# ---- Renamed rooms ---------------------------------------------------------
${roomRedirects()
  .map(({ from, to }) => `RewriteRule ^${from.slice(1, -1)}/?$ ${to} [R=301,L]`)
  .join('\n')}

# ---- Clean URLs: serve /path/ from /path/index.html ------------------------
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ /$1/index.html [L]

# Add the trailing slash so each page has exactly one address.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\\.[a-zA-Z0-9]{2,5}$
RewriteRule ^(.*[^/])$ /$1/ [R=301,L]

ErrorDocument 404 /404.html

# ---- Security headers ------------------------------------------------------
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# ---- Compression -----------------------------------------------------------
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# ---- Caching ---------------------------------------------------------------
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png  "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css   "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresByType text/html  "access plus 0 seconds"
</IfModule>
`;
}

// Only used when dist/ is uploaded to Vercel directly (`vercel deploy ./dist`).
// A Git-based Vercel build reads vercel.json from the REPOSITORY ROOT before it
// ever runs this script, so the committed root file is the one that configures
// the build command, the output directory and these headers. Keep the two in
// step — the root file additionally pins `installCommand` (npm, matching the
// committed package-lock.json), `buildCommand` and `outputDirectory`.
function buildVercelJson() {
  return `${JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      cleanUrls: true,
      trailingSlash: true,
      headers: [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
              key: 'Permissions-Policy',
              value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
            },
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
                "script-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'self'; " +
                "base-uri 'self'; upgrade-insecure-requests",
            },
          ],
        },
        {
          source: '/assets/img/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/assets/icons/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/assets/js/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }],
        },
      ],
      redirects: [
        { source: '/book', destination: '/booking/', permanent: true },
        { source: '/book-now', destination: '/booking/', permanent: true },
        { source: '/accommodation', destination: '/rooms/', permanent: true },
        { source: '/restaurant', destination: '/dining/', permanent: true },
        { source: '/safari', destination: '/experiences/', permanent: true },
        { source: '/photos', destination: '/gallery/', permanent: true },
        { source: '/deals', destination: '/offers/', permanent: true },
        { source: '/faqs', destination: '/faq/', permanent: true },
        { source: '/location{/}?', destination: '/contact/', permanent: true },
        { source: '/directions{/}?', destination: '/contact/', permanent: true },
        ...roomRedirects().map(({ from, to }) => ({
          source: `${from.slice(0, -1)}{/}?`,
          destination: to,
          permanent: true,
        })),
      ],
    },
    null,
    2,
  )}\n`;
}

/* ------------------------------------------------------------------- build */

async function main() {
  const started = Date.now();

  // 1. image manifest ------------------------------------------------------
  let imageData;
  try {
    imageData = await readJson(path.join(__dirname, 'src', 'data', 'image-manifest.json'));
  } catch {
    console.error('\nNo image manifest found. Run `npm run images` first.\n');
    process.exit(1);
  }
  setImageManifest(imageData.images);

  // The manifest is tracked in git but the derivatives it points at are not,
  // so a fresh clone has one without the other. Building then silently emits a
  // site whose every <img> 404s. Check before rendering anything.
  const sampleKey = Object.keys(imageData.images)[0];
  if (sampleKey) {
    const sample = imageData.images[sampleKey];
    const probe = path.join(
      PUBLIC,
      'assets',
      'img',
      `${sampleKey}-${sample.widths[sample.widths.length - 1]}.jpg`,
    );
    try {
      await fs.access(probe);
    } catch {
      console.error(
        '\nImage derivatives are missing from public/assets/img/.\n' +
          'They are generated, not committed. Run:\n\n' +
          '  npm run images:optimize\n\n' +
          'On a host/CI build, use the pairing instead:\n\n' +
          '  npm run vercel-build\n',
      );
      process.exit(1);
    }
  }

  let credits = {};
  try {
    credits = await readJson(path.join(__dirname, 'assets', 'images', 'credits.json'));
  } catch {
    /* credits are optional */
  }

  // 2. page definitions ----------------------------------------------------
  const { homePage } = await import('./src/pages/home.js');
  const { roomsIndexPage, roomDetailPage } = await import('./src/pages/rooms.js');
  const staticPages = await import('./src/pages/static.js');

  const pages = [
    homePage({ heroPreload: preloadFor('hero-lodge', imageData.images) }),
    roomsIndexPage(),
    ...rooms.map((r) => roomDetailPage(r)),
    staticPages.aboutPage(),
    staticPages.diningPage(),
    staticPages.experiencesPage(),
    staticPages.excursionsPage(),
    staticPages.galleryPage(),
    staticPages.offersPage(),
    staticPages.contactPage(),
    staticPages.faqPage(),
    staticPages.bookingPage(),
    staticPages.imageCreditsPage(credits),
    staticPages.privacyPage(),
    staticPages.termsPage(),
    staticPages.notFoundPage(),
  ];

  // Resolve LCP preloads declared by key.
  for (const page of pages) {
    if (page.preloadImageKey && !page.preloadImage) {
      page.preloadImage = preloadFor(page.preloadImageKey, imageData.images);
    }
  }

  // 3. guard rails ---------------------------------------------------------
  // Collect every problem, then fail once, so a bad build is fixed in one pass
  // rather than one error at a time.
  const problems = [];
  const seenPaths = new Set();
  const seenTitles = new Map();

  for (const page of pages) {
    if (seenPaths.has(page.path)) problems.push(`duplicate page path: ${page.path}`);
    seenPaths.add(page.path);

    const title = page.metaTitle || page.title;
    if (seenTitles.has(title)) {
      problems.push(`duplicate <title> "${title}" on ${page.path} and ${seenTitles.get(title)}`);
    }
    seenTitles.set(title, page.path);

    if (title.length > 65) {
      problems.push(`${page.path} <title> is ${title.length} chars (want <= 65)`);
    }

    const h1Count = (page.body.match(/<h1[\s>]/g) || []).length;
    if (h1Count !== 1) {
      problems.push(`${page.path} has ${h1Count} <h1> elements — exactly one is required`);
    }

    const len = page.metaDescription.length;
    if (len < 70 || len > 165) {
      problems.push(`${page.path} meta description is ${len} chars (want 70–165)`);
    }
  }

  if (problems.length) {
    console.error(`\n${problems.length} content problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('');
    process.exit(1);
  }

  // 4. clean + scaffold ----------------------------------------------------
  // Remove last build's output, but leave the heavy generated asset trees in
  // place — step 5 syncs those, which is far cheaper than re-copying them.
  const KEEP = new Set(['assets']);
  await fs.mkdir(DIST, { recursive: true });
  for (const entry of await fs.readdir(DIST, { withFileTypes: true }).catch(() => [])) {
    if (KEEP.has(entry.name)) continue;
    await fs.rm(path.join(DIST, entry.name), { recursive: true, force: true });
  }
  // Inside assets/, only js is rewritten from source each build.
  await fs.rm(path.join(DIST, 'assets', 'js'), { recursive: true, force: true });

  // 5. static assets -------------------------------------------------------
  const syncStats = { copied: 0, skipped: 0, removed: 0 };
  await syncDir(PUBLIC, DIST, syncStats);

  const jsDir = path.join(DIST, 'assets', 'js');
  await fs.mkdir(jsDir, { recursive: true });

  // The stylesheet is inlined into every page rather than linked. It minifies
  // to ~22 KB (~5 KB over the wire), so inlining costs less than the round trip
  // it removes, and it keeps the CSP free of the inline event handler that the
  // usual async-stylesheet trick requires.
  const mainCss = await fs.readFile(path.join(__dirname, 'src', 'styles', 'main.css'), 'utf8');
  const siteCss = minifyCss(mainCss);

  const mainJs = await fs.readFile(path.join(__dirname, 'src', 'scripts', 'main.js'), 'utf8');
  await fs.writeFile(path.join(jsDir, 'main.js'), mainJs);

  // 6. render pages --------------------------------------------------------
  for (const page of pages) {
    let html = renderPage(page).replace('__SITE_CSS__', siteCss);
    html = minifyHtml(html);

    const outPath =
      page.path === '/'
        ? path.join(DIST, 'index.html')
        : page.path.endsWith('.html')
          ? path.join(DIST, page.path.slice(1))
          : path.join(DIST, page.path.slice(1, -1), 'index.html');

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html);
  }

  // 7. SEO + host files ----------------------------------------------------
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap(pages));
  await fs.writeFile(path.join(DIST, 'robots.txt'), buildRobots());
  await fs.writeFile(path.join(DIST, 'site.webmanifest'), buildWebmanifest());
  await fs.writeFile(path.join(DIST, '_headers'), buildHeaders());
  await fs.writeFile(path.join(DIST, '_redirects'), buildRedirects());
  await fs.writeFile(path.join(DIST, '.htaccess'), buildHtaccess());
  await fs.writeFile(path.join(DIST, 'vercel.json'), buildVercelJson());

  // 8. summary -------------------------------------------------------------
  const indexed = pages.filter((p) => !p.noindex).length;
  console.log(`\nBuilt ${pages.length} pages (${indexed} indexable) in ${Date.now() - started}ms`);
  console.log(`  ${Object.keys(IMAGES).length} images, ${Object.keys(imageData.images).length} in manifest`);
  console.log(
    `  assets: ${syncStats.copied} copied, ${syncStats.skipped} unchanged` +
      (syncStats.removed ? `, ${syncStats.removed} removed` : ''),
  );
  console.log(`  sitemap.xml, robots.txt, site.webmanifest, _headers, _redirects, .htaccess, vercel.json`);
  console.log(`  output → dist/`);
}

main().catch((err) => {
  console.error(`\nBuild failed: ${err.message}\n`);
  process.exit(1);
});
