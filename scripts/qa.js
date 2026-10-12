/**
 * qa.js — visual and responsive QA against the built site.
 *
 * Drives the locally installed Chrome (no browser download) to check, at
 * several device widths, that:
 *   • nothing overflows the viewport horizontally
 *   • the mobile navigation opens and closes
 *   • tap targets are large enough
 *   • no console errors or failed requests
 * and to capture screenshots for review.
 *
 * Run: node scripts/qa.js [--shots]
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SHOT_DIR = process.env.SHOT_DIR || path.join(ROOT, '.qa');
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;
const WANT_SHOTS = process.argv.includes('--shots');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 780, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'desktop-1280', width: 1280, height: 900, mobile: false },
  { name: 'desktop-1680', width: 1680, height: 1000, mobile: false },
];

const PAGES = [
  '/',
  '/about/',
  '/rooms/',
  '/rooms/villa-with-private-plunge-pool/',
  '/dining/',
  '/experiences/',
  '/gallery/',
  '/offers/',
  '/contact/',
  '/faq/',
  '/booking/',
];

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

function startServer() {
  const proc = spawn(process.execPath, [path.join(__dirname, 'serve.js')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });
  return proc;
}

const problems = [];
const note = (msg) => problems.push(msg);

async function main() {
  const chrome = process.env.CHROME_PATH || (await findChrome());
  const server = startServer();
  await new Promise((r) => setTimeout(r, 1200));

  if (WANT_SHOTS) await fs.mkdir(SHOT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
      });

      const consoleErrors = [];
      const failedRequests = [];
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(m.text());
      });
      page.on('requestfailed', (r) => failedRequests.push(r.url()));
      page.on('response', (r) => {
        if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
      });

      for (const route of PAGES) {
        await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });

        /* ---- horizontal overflow ---- */
        const overflow = await page.evaluate((vw) => {
          const docWidth = document.documentElement.scrollWidth;
          const offenders = [];
          if (docWidth > vw + 1) {
            for (const el of document.querySelectorAll('body *')) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              const style = getComputedStyle(el);
              if (style.position === 'fixed' && style.visibility === 'hidden') continue;
              if (r.right > vw + 1 || r.left < -1) {
                offenders.push({
                  tag: el.tagName.toLowerCase(),
                  cls: (el.className || '').toString().slice(0, 60),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                });
              }
            }
          }
          return { docWidth, offenders: offenders.slice(0, 6) };
        }, vp.width);

        if (overflow.docWidth > vp.width + 1) {
          note(
            `[${vp.name}] ${route} overflows: scrollWidth ${overflow.docWidth} > ${vp.width}` +
              overflow.offenders
                .map((o) => `\n      ${o.tag}.${o.cls} (${o.left}→${o.right}, w=${o.width})`)
                .join(''),
          );
        }

        /* ---- mobile nav ---- */
        if (vp.mobile && vp.width <= 860 && route === '/') {
          const toggleVisible = await page.evaluate(() => {
            const t = document.querySelector('[data-nav-toggle]');
            return t ? getComputedStyle(t).display !== 'none' : false;
          });
          if (!toggleVisible) note(`[${vp.name}] mobile nav toggle is not visible`);
          else {
            await page.click('[data-nav-toggle]');
            await new Promise((r) => setTimeout(r, 400));
            const open = await page.evaluate(() => {
              const n = document.getElementById('site-nav');
              return n && n.classList.contains('is-open') && getComputedStyle(n).visibility === 'visible';
            });
            if (!open) note(`[${vp.name}] mobile nav did not open`);
            await page.click('[data-nav-toggle]');
            await new Promise((r) => setTimeout(r, 300));
          }
        }

        /* ---- tap targets ---- */
        if (vp.mobile) {
          const small = await page.evaluate(() => {
            const out = [];
            for (const el of document.querySelectorAll('a, button')) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (getComputedStyle(el).position === 'fixed' && r.top < 0) continue;
              // WCAG 2.5.8 exempts links that sit inline within a sentence.
              if (el.closest('p, address, blockquote, figcaption, caption, td')) continue;
              if (r.height < 24) {
                out.push(`${el.tagName.toLowerCase()}:${(el.textContent || '').trim().slice(0, 24)} h=${Math.round(r.height)}`);
              }
            }
            return out.slice(0, 4);
          });
          if (small.length) note(`[${vp.name}] ${route} small tap targets: ${small.join(' | ')}`);
        }

        if (WANT_SHOTS && ['mobile-390', 'desktop-1280'].includes(vp.name)) {
          const name = `${vp.name}${route.replace(/\//g, '_') || '_home'}.png`;
          await page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: true });
        }
      }

      if (consoleErrors.length) note(`[${vp.name}] console errors: ${consoleErrors.slice(0, 3).join(' | ')}`);
      if (failedRequests.length) {
        note(`[${vp.name}] failed requests: ${[...new Set(failedRequests)].slice(0, 5).join(' | ')}`);
      }

      await page.close();
      console.log(`  checked ${vp.name}`);
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log('');
  if (problems.length) {
    console.log(`${problems.length} issue(s):`);
    for (const p of problems) console.log(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log('Responsive QA passed: no overflow, nav works, no failed requests.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
