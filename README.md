# Raalmadu Wilpattu - website

Static marketing site for Raalmadu Wilpattu, a jungle lodge on the edge of
Wilpattu National Park, Sri Lanka.

Hand-built static site generator in Node. No framework, no runtime
dependencies, no web fonts. Output is plain HTML/CSS/JS in `dist/`, deployable
to any static host.

---

## Quick start

```bash
git clone https://github.com/dinethsadee01/Hotel-Showcase-Web---Raalmadu-Wilpattu.git
cd Hotel-Showcase-Web---Raalmadu-Wilpattu
npm install              # sharp (images) + puppeteer-core & axe-core (audits)
npm run images:optimize  # generate the responsive derivatives  (required once)
npm run build            # render dist/
npm run serve            # preview on http://localhost:4173
```

> **Why `images:optimize` after cloning.** The ~57 MB of generated AVIF/WebP/JPEG
> derivatives are gitignored because they are reproducible; the source photos in
> `assets/images/src/` are tracked, so one optimise pass rebuilds them exactly.
> `npm run build` will refuse to run before that step. You do **not** need
> `npm run images:fetch` — that re-downloads placeholders from the internet and
> returns different photos each time.

Day to day:

```bash
npm run dev          # build + serve
npm run verify       # build + all three audits below; use this before deploying
```

The three audits, individually:

| Command | What it checks | Fails on |
|---|---|---|
| `npm run check` | Static SEO audit of `dist/` — titles, descriptions, canonicals, robots directives, headings, alt text, JSON-LD, sitemap, internal links | any error |
| `npm run qa` | Responsive layout in headless Chrome at 360/390/768/1280/1680 px — horizontal overflow, mobile nav, tap-target size | any error |
| `npm run audit` | Runtime audit: JS errors, failed requests, broken images, axe-core WCAG 2.1 AA, and interaction smoke tests (nav, lightbox, booking hand-off, date sync, form validation, skip link) | serious/critical only |

`npm run images:sheet` renders every image into one labelled grid at
`.qa/contact-sheet.jpg` — the quickest way to spot a wrong or mismatched photo
after swapping in real photography.

### Accessibility

The palette is checked against WCAG 2.1 AA (4.5:1 for normal text) and axe-core
reports no serious or critical violations on any page at either width. The
accent colour `--clay` is `#a05a3c` specifically because the warmer
`#b06a4a` it started as only reached 4.19:1 behind white button text — if you
lighten it, re-run `npm run audit`.

---

## Before you launch

Everything in this list is a placeholder taken from public listings. **Confirm
each one with the hotel owner before the site goes live.** All of them live in
one file: `src/data/site.js`, marked `VERIFY:`.

| What | Where | Current value |
|---|---|---|
| Domain | `SITE_URL` in `src/data/site.js` | `https://www.raalmaduwilpattu.com` |
| Phone | `site.contact.phone` | `+94 77 059 0656` — confirmed |
| WhatsApp | `site.contact.whatsapp` | `+94 78 199 5041` — **check**: old line, not yet confirmed |
| Email | `site.contact.email` | `info.raalmadu@gmail.com` — confirmed |
| Address | `site.address` | Eluwankulam, Puttalam — confirmed |
| Operator | `site.operator` | Raalmadu Resorts (Pvt) Ltd, Kandana — confirmed |
| Coordinates | `site.geo` | `8.2699961, 79.8925245` — confirmed, from the Maps pin |
| Google Maps link | `site.mapUrl` | `maps.app.goo.gl/2cYY5QkDkzGfqw2p6` — confirmed |
| Social profiles | `site.social` | Facebook and Instagram are empty |
| Rates | `rateFrom` in `src/data/rooms.js` | From the Booking.com listing |
| Review score | `site.rating` | 9.0 / 10 from 85 Booking.com reviews |

Changing `SITE_URL` updates every canonical tag, Open Graph URL, sitemap entry
and JSON-LD node on the next build. It is the only place the domain appears.

> **Keep `geo` and `mapUrl` in step.** Both describe the same place — the
> coordinates were read off the pin that `mapUrl` resolves to. If the hotel
> moves its Google listing, update both together; a `GeoCoordinates` node that
> disagrees with `hasMap` is worse than either alone.

> **NAP check.** The Google listing is titled **"Raalmadu Resort -
> Eluwankulama"**, while this site and the Booking.com listing both say
> **"Raalmadu Wilpattu"**. Google matches businesses across the web partly on
> name/address/phone consistency, so it is worth renaming the Google Business
> Profile to match. See `docs/backlink-strategy.md` → Phase 0.

### Photography

**Every photograph currently on the site is a placeholder.** They are
Creative-Commons images that depict the region, not the property, and are
credited on `/image-credits/`. Room, pool and dining images in particular do
**not** show the actual rooms.

To swap in the real photography:

1. Drop the hotel's files into `assets/images/src/` using the existing file
   names (`hero-lodge.jpg`, `room-pool-suite.jpg`, …). See
   `src/data/images.js` for the full list and the alt text attached to each.
2. Update the `alt` text in `src/data/images.js` to describe the real photo.
3. Run `npm run images:optimize && npm run build`.
4. Delete the now-irrelevant entries from `assets/images/credits.json` and
   rebuild, which empties the credits page.

Nothing else changes — sizes, formats, `srcset`, `width`/`height` and the LQIP
blur-up are all regenerated automatically.

---

## Project structure

```
build.js                  static site generator → dist/
src/
  data/
    site.js               domain, contact, geo, policies  ← single source of truth
    rooms.js              room inventory
    content.js            facilities, experiences, offers, FAQs, testimonials
    images.js             image registry: alt text + aspect ratios
    image-manifest.json   generated — real dimensions + LQIP data URIs
  lib/
    layout.js             the HTML shell: every meta, OG and canonical tag
    schema.js             JSON-LD builders
    components.js         responsive <picture>, cards, booking widget
    sections.js           page heroes, CTA bands, accordion
  pages/                  one module per page group
  styles/
    main.css              full design system (inlined into every page)
  scripts/main.js         nav, sticky header, lightbox, date sync
scripts/
  fetch-images.js         source CC-licensed placeholder photography
  optimize-images.js      responsive AVIF/WebP/JPEG + OG image + icons
  contact-sheet.js        all images in one labelled grid (npm run images:sheet)
  check-seo.js            static SEO audit (npm run check)
  qa.js                   headless-Chrome responsive QA (npm run qa)
  audit.js                runtime + axe-core a11y audit (npm run audit)
  gen-notice.js           regenerate NOTICE from credits (npm run notice)
  serve.js                local preview server
public/                   generated assets, synced into dist/ — all gitignored
dist/                     build output — deploy this — gitignored
LICENSE                   all rights reserved; code only
NOTICE                    per-image photography attribution (generated)
```

`public/` and `dist/` are both build products and neither is committed.
`npm run images:optimize` creates `public/`; `npm run build` syncs it into
`dist/`. The build refuses to start if the derivatives are missing, rather than
emitting a site whose every image 404s.

---

## SEO implementation

Everything below is enforced by the build, and re-verified by `npm run check`,
which exits non-zero on any failure.

| Requirement | How it is met |
|---|---|
| `sitemap.xml` | Generated from the page list. Indexable pages only; the 404 is excluded. |
| `robots.txt` | Allows everything, references the sitemap, and deliberately does **not** block CSS/JS/images. |
| No `noindex` | The shell emits `index, follow, max-image-preview:large` on every page. Only `/404.html` is `noindex`, and the audit fails if that ever changes. |
| Canonical tags | Self-referencing, absolute, HTTPS, derived from the page path. The audit compares each canonical against the file it was written to. |
| Meta titles | Unique per page. The build fails on a duplicate or on anything over 65 characters. |
| Meta descriptions | Unique per page, 70–165 characters. The build fails outside that range. |
| One H1 per page | The build counts `<h1>` in every page body and refuses to emit a page with anything other than exactly one. |
| Header hierarchy | Section helpers take an explicit heading level; the audit fails if any page skips a level (h2 → h4). |
| Alt text | Alt text lives in `src/data/images.js` and is attached by the `picture()` helper. An image with no registry entry throws at build time. |
| Schema markup | Entity-linked JSON-LD `@graph`: `Hotel`/`LodgingBusiness`, `WebSite`, `WebPage`, `BreadcrumbList`, `HotelRoom` with `Offer` and `ReserveAction`, `FAQPage`, `ImageGallery`, `ContactPage`. |
| Internal links | Cross-links between rooms, dining, experiences, location and booking, plus breadcrumbs and a three-column footer. |
| Broken links | The audit resolves every internal `href` against the files in `dist/` and fails on any miss. |
| Compressed images | AVIF + WebP + JPEG at five breakpoints, `mozjpeg`, never upscaled. |
| Core Web Vitals | See below. |
| Mobile responsiveness | Verified in headless Chrome at 360/390/768/1280/1680 px — no horizontal overflow, working nav, 24 px tap targets. |
| HTTPS | HSTS plus redirects in `_headers`, `_redirects`, `.htaccess` and `vercel.json`. |
| URL slugs | Lowercase, hyphenated, directory-style with a trailing slash — `/rooms/suite-with-private-pool/`. |
| OG image | Generated 1200×630 card with a legible overlay, plus per-page overrides and full Twitter card tags. |

### Core Web Vitals

- **LCP** — the hero is preloaded with `<link rel="preload" as="image" type="image/avif" imagesrcset>` and carries `fetchpriority="high"`. The stylesheet is inlined rather than linked (~22 KB minified, ~5 KB over the wire), so first paint waits on no CSS request at all. There are no web fonts either, which leaves the hero image as the only thing standing between the user and a painted page.
- **CLS** — every `<img>` carries intrinsic `width`/`height` from the build manifest, and media boxes reserve their slot with `aspect-ratio`. An LQIP data-URI fills the box while the image decodes.
- **INP** — about 6 KB of dependency-free, deferred JavaScript. No layout-thrashing scroll handlers; the sticky header uses `IntersectionObserver`.

Measured locally in headless Chrome at 390 px (uncompressed, so the document
figures are roughly 4× what gzip/brotli will actually send):

| Page | Transfer | Requests | FCP | CLS |
|---|---|---|---|---|
| `/` | 222 KB | 7 | 316 ms | 0.0000 |
| `/rooms/` | 197 KB | 7 | 152 ms | 0.0000 |
| `/gallery/` (16 images) | 545 KB | 9 | 140 ms | 0.0000 |

Re-measure against the live domain with PageSpeed Insights once deployed —
lab numbers on localhost flatter the network.

> **Not marked up: `aggregateRating`.** The 9.0/10 score is displayed with
> attribution and a link, but is deliberately kept out of the structured data.
> It comes from Booking.com, and Google's policy treats third-party or
> self-serving ratings on a `LocalBusiness` as ineligible — marking it up risks
> a manual action. To earn review rich results legitimately, collect reviews
> first-party and mark those up instead.

### Two items that need the owner, not the code

- **Search Console verification** requires access to the hotel's Google account and the live domain. Step-by-step instructions: [`docs/search-console-setup.md`](docs/search-console-setup.md).
- **Backlinks** are an outreach programme, not a build step. The plan is in [`docs/backlink-strategy.md`](docs/backlink-strategy.md).

---

## Deployment

`dist/` is a plain static directory. Host config for the common targets is
generated into it on every build.

Because the image derivatives are gitignored, every host build command must
run the optimiser first:

```
npm run images:optimize && npm run build
```

**Netlify / Cloudflare Pages** — build command as above, publish directory
`dist`. `_headers` and `_redirects` are picked up automatically.

**Vercel** — nothing to configure in the dashboard. The committed root
`vercel.json` pins `buildCommand` to `npm run vercel-build` (which is the
optimiser plus the build) and `outputDirectory` to `dist`, and sets
`cleanUrls`, `trailingSlash`, security headers and legacy redirects. Vercel
reads that file from the repository root *before* the build runs, so the copy
the build writes into `dist/` only applies to a direct `vercel deploy ./dist`.

**Apache / cPanel** — upload the contents of `dist/`. The generated `.htaccess`
forces HTTPS, canonicalises the host, serves clean URLs, sets security headers
and configures compression and caching.

**Nginx** — no config is generated. Use `try_files $uri $uri/index.html =404`,
add HSTS, and redirect HTTP and the apex domain to `https://www.`.

After the first deploy, confirm:

```bash
curl -sI https://www.raalmaduwilpattu.com/ | grep -i strict-transport
curl -s  https://www.raalmaduwilpattu.com/robots.txt
curl -s  https://www.raalmaduwilpattu.com/sitemap.xml | head
```

---

## Booking engine

The booking engine is not yet integrated. Everything is in place for it:

- `/booking/` is a real page with the date/guest form and a
  `<div id="booking-engine" data-booking-engine>` mount point.
- The booking widget (header CTA, hero bar, room pages) submits
  `GET /booking/?checkin=…&checkout=…&adults=…&room=…`, so the engine receives
  the dates the guest already chose.
- Room pages pass their `room` slug through.
- `ReserveAction` in the `HotelRoom` schema points at
  `/booking/?room=<slug>`.

To wire up a provider, mount its widget on `[data-booking-engine]` in
`src/scripts/main.js` and read the query string for the pre-filled dates. If
the provider requires a third-party script, add its origin to the CSP
`script-src` in `buildHeaders()` in `build.js` — the current policy is
`'self'` only.

---

## Content model

Text is data, not markup. To change the rooms, facilities, FAQs, offers or
experiences, edit `src/data/rooms.js` and `src/data/content.js` and rebuild.
Adding an FAQ automatically extends the `FAQPage` schema; adding a room
automatically creates its page, its card, its sitemap entry and its
`HotelRoom` node.

Room descriptions were written from the property's public Booking.com listing
and guest reviews. Facts worth a second look with the owner: bed
configurations, room sizes, which bathrooms are shared, and whether Wi-Fi is
available.

---

## Contact form

A static host cannot process a form POST. The enquiry form on `/contact/` is
configured through `site.forms` in `src/data/site.js` and ships set to
`provider: 'netlify'`, which needs no further work **if the site is deployed to
Netlify** — the hidden `form-name` field and honeypot are already in the markup,
and submissions appear under Forms in the Netlify dashboard.

On any other host, pick one:

| Option | Change |
|---|---|
| Formspree / Basin / Getform | `provider: 'formspree'`, `action: '<your endpoint>'` |
| Your own handler | `provider: 'custom'`, `action: '<your POST URL>'` |
| No form at all | Remove the form block from `contactPage()` in `src/pages/static.js` — the phone number and email are listed alongside it either way |

Whichever you choose, test a real submission before launch. A form that
silently fails is worse than no form.

> The CSP in `_headers` is `script-src 'self'`. A form provider that needs its
> own JavaScript will be blocked until you add its origin there, in
> `buildHeaders()` in `build.js`.

---

## Licence & attribution

**Code: all rights reserved.** See [LICENSE](LICENSE). This is bespoke client
work published for portfolio and review purposes. You may read it and fork it to
evaluate the author's work; you may not reuse it in a product or site, and the
"Raalmadu Wilpattu" name and branding are not licensed by it.

**Photography: not covered by LICENSE.** Every photograph in
`assets/images/` is third-party Creative Commons work and stays under its own
licence — 9 are CC BY-SA 4.0, and the share-alike obligation applies regardless
of anything LICENSE says. Full per-image attribution is in
[NOTICE](NOTICE), generated from `assets/images/credits.json` and also
published on the live site at `/image-credits/`.

Regenerate NOTICE after changing the image set:

```bash
npm run notice
```

All photography is placeholder imagery of the region, not of the property —
see [Photography](#photography) above for the swap-in procedure. Once the
hotel's own photographs replace them, clear `assets/images/credits.json`, run
`npm run notice`, and NOTICE plus the credits page both empty out.
