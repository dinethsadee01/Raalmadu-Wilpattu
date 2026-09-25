/**
 * Reusable markup helpers.
 *
 * Two rules are enforced here rather than left to each page:
 *   1. every <img> gets alt text, straight from src/data/images.js
 *   2. every <img> gets intrinsic width/height, from the build-time manifest
 * Together those remove the two commonest sources of layout shift and of
 * missing-alt accessibility failures.
 */

import { IMAGES } from '../data/images.js';

let manifest = {};

/** Called once by build.js after the image manifest is loaded from disk. */
export function setImageManifest(m) {
  manifest = m;
}

/**
 * Path to the largest derivative that actually exists for an image.
 * Source photos vary in size, so the widest breakpoint is not always generated
 * — never hard-code a width in a link.
 */
export function largestSrc(key, ext = 'jpg') {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown image "${key}"`);
  return `/assets/img/${key}-${entry.widths[entry.widths.length - 1]}.${ext}`;
}

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const attr = (name, value) =>
  value === undefined || value === null || value === false || value === '' ? '' : ` ${name}="${esc(value)}"`;

/**
 * Responsive <picture> with AVIF → WebP → JPEG fallbacks.
 *
 * @param {string} key        image key from src/data/images.js
 * @param {object} opts
 * @param {string} opts.sizes the CSS `sizes` attribute — always set this
 * @param {boolean} opts.priority  true for the LCP image only (eager + high priority)
 * @param {string} opts.className  extra class on the <picture>
 * @param {string} opts.altOverride use when context makes a more specific alt better
 */
export function picture(key, opts = {}) {
  const entry = manifest[key];
  const reg = IMAGES[key];

  if (!entry || !reg) {
    throw new Error(
      `Unknown image "${key}". Add it to src/data/images.js and run \`npm run images\`.`,
    );
  }

  const {
    sizes = '100vw',
    priority = false,
    className = '',
    altOverride,
    caption,
  } = opts;

  const alt = altOverride ?? reg.alt;
  if (!alt && alt !== '') {
    throw new Error(`Image "${key}" has no alt text.`);
  }

  const srcset = (ext) =>
    entry.widths.map((w) => `/assets/img/${key}-${w}.${ext} ${w}w`).join(', ');

  // Pick a sensible intrinsic-size fallback near the middle of the range.
  const fallbackWidth = entry.widths.includes(1200) ? 1200 : entry.widths[entry.widths.length - 1];
  const fallbackHeight = Math.round(fallbackWidth / entry.aspect);

  const img = [
    '<img',
    attr('src', `/assets/img/${key}-${fallbackWidth}.jpg`),
    attr('srcset', srcset('jpg')),
    attr('sizes', sizes),
    attr('width', fallbackWidth),
    attr('height', fallbackHeight),
    ` alt="${esc(alt)}"`,
    priority ? ' fetchpriority="high" loading="eager" decoding="sync"' : ' loading="lazy" decoding="async"',
    '>',
  ].join('');

  const html = `<picture class="ph${className ? ` ${className}` : ''}" style="--lqip:url(${entry.lqip})">
      <source type="image/avif" srcset="${srcset('avif')}" sizes="${esc(sizes)}">
      <source type="image/webp" srcset="${srcset('webp')}" sizes="${esc(sizes)}">
      ${img}
    </picture>`;

  if (caption) {
    return `<figure class="figure">${html}<figcaption>${esc(caption)}</figcaption></figure>`;
  }
  return html;
}

/** Intrinsic ratio box so the slot is reserved before the image decodes. */
export function media(key, opts = {}) {
  const entry = manifest[key];
  const ratio = entry ? entry.aspect : 3 / 2;
  return `<div class="media" style="aspect-ratio:${ratio.toFixed(4)}">${picture(key, opts)}</div>`;
}

export function button(label, href, variant = 'primary', extra = '') {
  return `<a class="btn btn--${variant}"${attr('href', href)}${extra ? ` ${extra}` : ''}>${esc(label)}</a>`;
}

/** Section heading block. `level` keeps the document outline correct per page. */
export function sectionHead({ kicker, title, lead, level = 2, align = 'left' }) {
  const H = `h${level}`;
  return `<header class="section-head section-head--${align}">
      ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}
      <${H} class="section-title">${esc(title)}</${H}>
      ${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}
    </header>`;
}

export function roomCard(room, { level = 3 } = {}) {
  const H = `h${level}`;
  const url = `/rooms/${room.slug}/`;
  return `<article class="card card--room">
      <a class="card__media" href="${url}" tabindex="-1" aria-hidden="true">
        ${media(room.image, { sizes: '(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw' })}
      </a>
      <div class="card__body">
        <${H} class="card__title"><a href="${url}">${esc(room.name)}</a></${H}>
        <ul class="card__facts">
          <li>Sleeps ${room.maxGuests}</li>
          ${room.size ? `<li>${room.size} ${room.sizeUnit}</li>` : ''}
          <li>${esc(room.beds)}</li>
        </ul>
        <p class="card__text">${esc(room.summary)}</p>
        <p class="card__foot">
          <span class="price"><span class="price__from">from</span> <strong>$${room.rateFrom}</strong> <span class="price__unit">/ night</span></span>
          <span class="card__link" aria-hidden="true">View room</span>
        </p>
      </div>
    </article>`;
}

export function breadcrumbs(trail) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  const last = items.length - 1;
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        ${items
          .map((item, i) =>
            i === last
              ? `<li><span aria-current="page">${esc(item.name)}</span></li>`
              : `<li><a href="${esc(item.path)}">${esc(item.name)}</a></li>`,
          )
          .join('')}
      </ol>
    </nav>`;
}

/** The booking widget. Posts to /booking/ until the booking engine is wired up. */
export function bookingWidget({ compact = false, roomSlug = '' } = {}) {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  const iso = (d) => d.toISOString().slice(0, 10);

  return `<form class="bookbar${compact ? ' bookbar--compact' : ''}" action="/booking/" method="get" data-booking-form>
      <div class="bookbar__field">
        <label for="bb-checkin">Check in</label>
        <input type="date" id="bb-checkin" name="checkin" value="${iso(today)}" min="${iso(today)}" required>
      </div>
      <div class="bookbar__field">
        <label for="bb-checkout">Check out</label>
        <input type="date" id="bb-checkout" name="checkout" value="${iso(tomorrow)}" min="${iso(tomorrow)}" required>
      </div>
      <div class="bookbar__field bookbar__field--narrow">
        <label for="bb-adults">Guests</label>
        <select id="bb-adults" name="adults">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} guest${n > 1 ? 's' : ''}</option>`)
            .join('')}
        </select>
      </div>
      ${roomSlug ? `<input type="hidden" name="room" value="${esc(roomSlug)}">` : ''}
      <button class="btn btn--primary bookbar__submit" type="submit">Check availability</button>
    </form>`;
}
