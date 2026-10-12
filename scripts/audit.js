/**
 * audit.js — runtime audit of the built site.
 *
 * Loads every page in a real browser at desktop and mobile widths and reports:
 *   • JavaScript runtime errors and console errors/warnings
 *   • failed or 4xx/5xx network requests
 *   • images that failed to decode, or that are served far larger than needed
 *   • axe-core accessibility violations (WCAG 2.1 A + AA)
 *   • interaction smoke tests: mobile nav, gallery lightbox, form validation,
 *     booking form query-string hand-off, skip link, keyboard focus
 *
 * Run: npm run audit          (exits 1 on any error-level finding)
 *      npm run audit -- --verbose
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = 4183;
const BASE = `http://localhost:${PORT}`;
const VERBOSE = process.argv.includes('--verbose');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const ROUTES = [
  '/',
  '/about/',
  '/rooms/',
  '/rooms/villa-with-private-plunge-pool/',
  '/rooms/family-residence/',
  '/rooms/shared-glamping-lodge/',
  '/rooms/villa-with-balcony-overlooking-wilpattu/',
  '/dining/',
  '/experiences/',
  '/gallery/',
  '/offers/',
  '/contact/',
  '/faq/',
  '/booking/',
  '/image-credits/',
  '/privacy-policy/',
  '/terms/',
  '/404.html',
];

const VIEWS = [
  { name: 'desktop', width: 1366, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where} — ${msg}`);
const warn = (where, msg) => warnings.push(`${where} — ${msg}`);

async function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try {
      await fs.access(p);
      return p;
    } catch {
      /* next */
    }
  }
  throw new Error('No Chrome or Edge found. Set CHROME_PATH.');
}

/** Console messages that are noise rather than defects. */
const IGNORED_CONSOLE = [
  /favicon/i,
  /Download the React DevTools/i,
];

async function main() {
  const chrome = process.env.CHROME_PATH || (await findChrome());
  const server = spawn(process.execPath, [path.join(__dirname, 'serve.js')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });
  await new Promise((r) => setTimeout(r, 1200));

  const axeSource = await fs.readFile(axePath, 'utf8');
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });

  const a11ySeen = new Set();

  try {
    for (const view of VIEWS) {
      for (const route of ROUTES) {
        const where = `[${view.name}] ${route}`;
        const page = await browser.newPage();
        await page.setViewport({
          width: view.width,
          height: view.height,
          deviceScaleFactor: 1,
          isMobile: view.mobile,
          hasTouch: view.mobile,
        });

        page.on('pageerror', (e) => err(where, `uncaught JS error: ${e.message}`));
        page.on('console', (m) => {
          const text = m.text();
          if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
          if (m.type() === 'error') err(where, `console error: ${text}`);
          else if (m.type() === 'warning') warn(where, `console warning: ${text}`);
        });
        page.on('requestfailed', (r) =>
          err(where, `request failed: ${r.url().replace(BASE, '')} (${r.failure()?.errorText})`),
        );
        page.on('response', (r) => {
          const status = r.status();
          const url = r.url().replace(BASE, '');
          // The 404 page is expected to return 404.
          if (status >= 400 && !(route === '/404.html' && url === '/404.html')) {
            err(where, `HTTP ${status}: ${url}`);
          }
        });

        await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });

        /* -------- images actually decoded, and sized sensibly -------- */
        const imgIssues = await page.evaluate(() => {
          const out = [];
          for (const img of document.images) {
            const r = img.getBoundingClientRect();
            if (!img.complete || img.naturalWidth === 0) {
              // Below-the-fold lazy images legitimately have not loaded yet.
              if (r.top < window.innerHeight * 1.5) {
                out.push({ kind: 'broken', src: img.currentSrc || img.src });
              }
              continue;
            }
            if (r.width > 0 && img.naturalWidth > r.width * window.devicePixelRatio * 2.2) {
              out.push({
                kind: 'oversized',
                src: (img.currentSrc || img.src).split('/').pop(),
                natural: img.naturalWidth,
                css: Math.round(r.width),
              });
            }
          }
          return out;
        });
        for (const i of imgIssues) {
          if (i.kind === 'broken') err(where, `image failed to load: ${i.src}`);
          else warn(where, `image oversized: ${i.src} is ${i.natural}px for a ${i.css}px box`);
        }

        /* -------- accessibility -------- */
        await page.evaluate(axeSource);
        const results = await page.evaluate(async () =>
          // eslint-disable-next-line no-undef
          await axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
            resultTypes: ['violations'],
          }),
        );
        for (const v of results.violations) {
          const key = `${v.id}|${route}|${view.name}`;
          if (a11ySeen.has(key)) continue;
          a11ySeen.add(key);
          const targets = [
            ...new Set(v.nodes.map((n) => (n.target || []).join(' ')).filter(Boolean)),
          ];
          const shown = targets.slice(0, 8).join(', ');
          const more = targets.length > 8 ? ` (+${targets.length - 8} more)` : '';
          const line = `a11y [${v.impact}] ${v.id}: ${v.help} → ${shown}${more}`;
          if (v.impact === 'critical' || v.impact === 'serious') err(where, line);
          else warn(where, line);
        }

        await page.close();
      }
    }

    /* ================= interaction smoke tests ================= */
    const page = await browser.newPage();

    // --- mobile nav opens, traps nothing, closes on Escape ---
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
    await page.click('[data-nav-toggle]');
    await new Promise((r) => setTimeout(r, 400));
    let open = await page.evaluate(
      () => document.getElementById('site-nav').classList.contains('is-open'),
    );
    if (!open) err('[interaction] mobile nav', 'did not open on click');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 400));
    open = await page.evaluate(
      () => document.getElementById('site-nav').classList.contains('is-open'),
    );
    if (open) err('[interaction] mobile nav', 'did not close on Escape');

    // --- booking form hands the dates to /booking/ ---
    await page.setViewport({ width: 1366, height: 900, isMobile: false });
    await page.goto(`${BASE}/rooms/villa-with-private-plunge-pool/`, { waitUntil: 'networkidle2' });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('[data-booking-form] button[type="submit"]'),
    ]);
    const bookingUrl = page.url();
    if (!/\/booking\/\?/.test(bookingUrl)) {
      err('[interaction] booking form', `did not reach /booking/ with a query string: ${bookingUrl}`);
    } else {
      const q = new URL(bookingUrl).searchParams;
      for (const k of ['checkin', 'checkout', 'adults', 'room']) {
        if (!q.get(k)) err('[interaction] booking form', `missing "${k}" in query string`);
      }
      if (q.get('room') !== 'villa-with-private-plunge-pool') {
        err('[interaction] booking form', `wrong room slug: ${q.get('room')}`);
      }
    }

    // --- check-out is kept after check-in ---
    await page.goto(`${BASE}/booking/`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      const i = document.querySelector('input[name="checkin"]');
      i.value = '2027-05-10';
      i.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 200));
    const checkout = await page.$eval('input[name="checkout"]', (e) => e.value);
    if (checkout <= '2027-05-10') {
      err('[interaction] booking dates', `check-out ${checkout} is not after check-in 2027-05-10`);
    }

    // --- gallery lightbox opens, advances and closes ---
    await page.goto(`${BASE}/gallery/`, { waitUntil: 'networkidle2' });
    await page.click('[data-lightbox]');
    await new Promise((r) => setTimeout(r, 400));
    const lbOpen = await page.evaluate(() => {
      const lb = document.querySelector('.lb');
      return lb && lb.classList.contains('is-open') && !!lb.querySelector('.lb__img')?.src;
    });
    if (!lbOpen) err('[interaction] lightbox', 'did not open with an image');
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 250));
    const counter = await page.evaluate(() => document.querySelector('.lb__count')?.textContent);
    if (counter && !counter.startsWith('2 /')) {
      err('[interaction] lightbox', `arrow key did not advance (counter: ${counter})`);
    }
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const lbClosed = await page.evaluate(
      () => !document.querySelector('.lb')?.classList.contains('is-open'),
    );
    if (!lbClosed) err('[interaction] lightbox', 'did not close on Escape');

    // --- contact form enforces its required fields ---
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle2' });
    const formValid = await page.evaluate(() => {
      const f = document.querySelector('[data-contact-form]');
      return f ? f.checkValidity() : null;
    });
    if (formValid !== false) {
      err('[interaction] contact form', 'submits while required fields are empty');
    }

    // --- skip link is reachable and targets #main ---
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
    await page.keyboard.press('Tab');
    await new Promise((r) => setTimeout(r, 400)); // let the reveal transition finish
    const skip = await page.evaluate(() => {
      const el = document.activeElement;
      return { href: el?.getAttribute('href'), visible: el?.getBoundingClientRect().top >= 0 };
    });
    if (skip.href !== '#main') err('[interaction] skip link', `first tab stop is ${skip.href}`);
    if (!skip.visible) err('[interaction] skip link', 'is not visible when focused');

    await page.close();
  } finally {
    await browser.close();
    server.kill();
  }

  /* ================= report ================= */
  const dedupe = (list) => [...new Set(list)];
  const uniqueErrors = dedupe(errors);
  const uniqueWarnings = dedupe(warnings);

  console.log(`\nAudited ${ROUTES.length} pages × ${VIEWS.length} viewports + 6 interaction tests\n`);

  if (uniqueWarnings.length) {
    const show = VERBOSE ? uniqueWarnings : uniqueWarnings.slice(0, 12);
    console.log(`Warnings (${uniqueWarnings.length}):`);
    for (const w of show) console.log(`  ! ${w}`);
    if (show.length < uniqueWarnings.length) {
      console.log(`  … ${uniqueWarnings.length - show.length} more (run with --verbose)`);
    }
    console.log('');
  }

  if (uniqueErrors.length) {
    console.log(`Errors (${uniqueErrors.length}):`);
    for (const e of uniqueErrors) console.log(`  ✗ ${e}`);
    console.log('');
    process.exit(1);
  }

  console.log('Runtime audit passed.');
  console.log('  no JS errors, no failed requests, no broken images');
  console.log('  no serious or critical accessibility violations');
  console.log('  nav, lightbox, booking hand-off, date sync, form validation and skip link all work');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
