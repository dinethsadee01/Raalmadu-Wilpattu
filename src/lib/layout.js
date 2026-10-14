/**
 * The HTML shell.
 *
 * Every page on the site renders through this one function, which is what
 * guarantees that each page has — without exception — a unique title, a meta
 * description, a self-referencing absolute canonical, an explicit
 * index,follow robots directive, Open Graph and Twitter cards with an absolute
 * image URL, and a connected JSON-LD graph.
 */

import { site, nav, footerNav, SITE_URL } from '../data/site.js';
import { esc, attr, ogImageFor } from './components.js';
import { abs } from './schema.js';

// The generated share card. Pages that name an `ogImageKey` instead get that
// photo at its largest built width — see ogImageFor().
const OG_DEFAULT = { path: '/assets/img/og-default.jpg', width: 1200, height: 630 };

/** Title rule: page-specific, then the brand. Home uses its own full title. */
function buildTitle(page) {
  if (page.metaTitle) return page.metaTitle;
  if (page.path === '/') return `${site.name} | ${site.tagline}`;
  return `${page.title} | ${site.titleSuffix}`;
}

function headLinks(preloadImage) {
  const parts = [
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/assets/icons/favicon.png" sizes="32x32" type="image/png">',
    '<link rel="apple-touch-icon" href="/assets/icons/icon-180.png">',
    '<link rel="manifest" href="/site.webmanifest">',
  ];

  // Preload the LCP image so it starts downloading before CSS resolves.
  if (preloadImage) {
    parts.push(
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${preloadImage.srcset}" imagesizes="${esc(
        preloadImage.sizes,
      )}" fetchpriority="high">`,
    );
  }
  return parts.join('\n    ');
}

function header(currentPath) {
  const link = (item) => {
    const isCurrent =
      item.path === currentPath ||
      (item.path !== '/' && currentPath.startsWith(item.path));
    return `<li><a href="${esc(item.path)}"${isCurrent ? ' aria-current="page"' : ''}>${esc(
      item.label,
    )}</a></li>`;
  };

  const whatsappHref = site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`
    : '';

  return `<a class="skip-link" href="#main">Skip to content</a>
  <aside class="top-strip" aria-label="Contact reservations" data-top-strip>
    <div class="shell top-strip__inner">
      <ul class="top-strip__items">
        <li><a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
        ${whatsappHref ? `<li><a href="${esc(whatsappHref)}" rel="noopener">WhatsApp</a></li>` : ''}
        <li><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></li>
      </ul>
      <a class="top-strip__cta" href="/booking/">Reserve directly &rarr;</a>
    </div>
  </aside>
  <header class="site-header" data-header>
    <div class="shell site-header__inner">
      <a class="brand" href="/">
        ${logo(`${site.name}, home`, 'eager', '(max-width: 1080px) 64px, 84px')}
      </a>

      <nav class="site-nav" id="site-nav" aria-label="Primary">
        <ul>${nav.map(link).join('')}</ul>
      </nav>

      <div class="site-header__actions">
        <a class="btn btn--primary btn--sm" href="/booking/">Book now</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="visually-hidden">Menu</span>
        </button>
      </div>
    </div>
  </header>`;
}

/**
 * The round Raalmadu badge (generated from assets/brand/logo.png by
 * `npm run images:optimize`). Square 1:1, so width/height reserve the space.
 */
function logo(alt, loading, sizes) {
  const set = (ext) => [96, 192, 288].map((w) => `/assets/icons/logo-${w}.${ext} ${w}w`).join(', ');
  return `<picture>
          <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
          <img class="brand__logo" src="/assets/icons/logo-192.png" srcset="${set('png')}" sizes="${sizes}"
               width="192" height="192" alt="${esc(alt)}" loading="${loading}" decoding="async">
        </picture>`;
}

function footer() {
  const social = Object.entries(site.social).filter(([, v]) => v);
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tripadvisor: 'Tripadvisor',
    booking: 'Booking.com',
  };

  return `<footer class="site-footer">
    <div class="shell">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <p class="brand brand--footer">
            ${logo(site.name, 'lazy', '112px')}
          </p>
          <p class="site-footer__blurb">${esc(site.description)}</p>
          <address class="site-footer__address">
            <strong>Visit us</strong>
            ${esc(site.name)}, ${esc(site.address.locality)}<br>
            ${esc(site.address.district)}, ${esc(site.address.country)}<br>
            <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a><br>
            <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
          </address>
        </div>

        ${footerNav
          .map(
            (col) => `<nav class="site-footer__col" aria-label="${esc(col.heading)}">
            <h2 class="site-footer__heading">${esc(col.heading)}</h2>
            <ul>${col.links
              .map((l) => `<li><a href="${esc(l.path)}">${esc(l.label)}</a></li>`)
              .join('')}</ul>
          </nav>`,
          )
          .join('')}
      </div>

      <div class="site-footer__bottom">
        <div class="site-footer__meta">
          <p class="site-footer__legal">
            &copy; ${new Date().getFullYear()} ${esc(site.name)}
          </p>
          <a href="/privacy-policy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="/image-credits/">Image credits</a>
        </div>
        ${
          social.length
            ? `<ul class="site-footer__social" aria-label="Find us on">${social
                .map(
                  ([k, v]) =>
                    `<li><a href="${esc(v)}" rel="noopener noreferrer me" target="_blank">${esc(
                      labels[k] || k,
                    )}</a></li>`,
                )
                .join('')}</ul>`
            : ''
        }
      </div>
    </div>
  </footer>`;
}

/**
 * @param {object} page
 * @param {string} page.path           clean slug, e.g. "/rooms/" (always trailing slash)
 * @param {string} page.title          the H1 / nav title
 * @param {string} page.metaTitle      optional explicit <title>
 * @param {string} page.metaDescription  required, 50–160 chars
 * @param {string} page.body           page markup (must contain exactly one <h1>)
 * @param {object[]} page.schema       JSON-LD nodes
 * @param {string} page.ogImageKey     optional image key for a page-specific OG card
 * @param {object} page.preloadImage   { srcset, sizes } for the LCP image
 * @param {boolean} page.noindex       only for genuinely private pages (none today)
 */
export function renderPage(page) {
  const url = abs(page.path);
  const title = buildTitle(page);
  const description = page.metaDescription;
  const og = page.ogImageKey ? ogImageFor(page.ogImageKey) : OG_DEFAULT;
  const ogImage = abs(og.path);
  const ogType = page.ogType || 'website';

  if (!description) throw new Error(`Page ${page.path} is missing metaDescription`);

  // Pages that open on a photo hero get the transparent header over it.
  const bodyClass = [page.bodyClass, page.preloadImageKey ? 'has-hero' : '']
    .filter(Boolean)
    .join(' ');

  const robots = page.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const jsonLd = page.schema
    ? `<script type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!doctype html>
<html lang="${site.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${esc(url)}">
    <meta name="robots" content="${robots}">
    <meta name="theme-color" content="${site.themeColor}">
    <meta name="format-detection" content="telephone=no">

    <meta property="og:type" content="${esc(ogType)}">
    <meta property="og:site_name" content="${esc(site.name)}">
    <meta property="og:locale" content="${site.locale}">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:secure_url" content="${esc(ogImage)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="${og.width}">
    <meta property="og:image:height" content="${og.height}">
    <meta property="og:image:alt" content="${esc(page.ogImageAlt || `${site.name}: ${site.tagline}`)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${esc(ogImage)}">
    <meta name="twitter:image:alt" content="${esc(page.ogImageAlt || `${site.name}: ${site.tagline}`)}">

    <meta name="geo.region" content="LK-6">
    <meta name="geo.placename" content="${esc(site.address.locality)}">
    <meta name="geo.position" content="${site.geo.lat};${site.geo.lng}">
    <meta name="ICBM" content="${site.geo.lat}, ${site.geo.lng}">

    ${headLinks(page.preloadImage)}

    <style>__SITE_CSS__</style>

    ${jsonLd}
  </head>
  <body class="${esc(bodyClass)}">
    ${header(page.path)}
    <main id="main">
${page.body}
    </main>
    ${footer()}
    <aside class="cookie-consent" hidden data-cookie-consent aria-label="Cookie preferences">
      <div class="shell cookie-consent__inner">
        <p class="cookie-consent__text">
          This site is cookie-free by default. Booking.com and Tripadvisor links may set their own cookies when you click them. See our <a href="/privacy-policy/">privacy policy</a>.
        </p>
        <div class="cookie-consent__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-cookie-decline>Decline</button>
          <button type="button" class="btn btn--primary btn--sm" data-cookie-accept>Accept</button>
        </div>
      </div>
    </aside>
    <script src="/assets/js/main.js" defer></script>
  </body>
</html>
`;
}
