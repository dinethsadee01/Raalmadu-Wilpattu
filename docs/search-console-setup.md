# Search Console & analytics setup

This needs the hotel's Google account and a live domain, so it cannot be done
from the codebase. Run through it the day the site goes live.

Everything the site itself must provide — the sitemap, `robots.txt`, canonical
tags, structured data — is already generated and verified by `npm run check`.

---

## 1. Verify the domain in Google Search Console

Use a **Domain property**, not a URL-prefix property. A domain property covers
`http`, `https`, `www`, the apex and every subdomain in one go, which avoids
the classic mistake of verifying `https://www.` and then seeing no data because
traffic is measured elsewhere.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
   and sign in as the hotel (not as the agency — the owner must keep control).
2. **Add property → Domain** → enter `raalmaduwilpattu.com` (no scheme, no `www`).
3. Google shows a TXT record like
   `google-site-verification=xxxxxxxxxxxxxxxxxxxxxxxx`.
4. Add that TXT record at the DNS host for the domain, on the root (`@`).
5. Back in Search Console, click **Verify**. DNS can take up to an hour; if it
   fails, wait and retry rather than starting over.

> If DNS access is not available, fall back to a URL-prefix property verified
> by HTML file: put the file Google gives you into `public/` and it will be
> copied to the site root on the next build. The domain property is still the
> better option once DNS is reachable.

### Then, in Search Console

- **Sitemaps → Add a new sitemap →** `sitemap.xml`. It should report 16 discovered URLs.
- **URL Inspection →** the home page → **Request indexing**. Do the same for `/rooms/` and `/booking/`.
- **Settings → Users and permissions →** add the developer as Full user, keeping the owner as the verified owner.

### Check back after a week

| Report | What you are looking for |
|---|---|
| Pages | 16 indexed, 0 excluded by `noindex`. Anything excluded is a bug — report it. |
| Sitemaps | Status "Success", 16 discovered. |
| Core Web Vitals | Needs ~28 days of field data before it populates. |
| Enhancements → Breadcrumbs / FAQ / Merchant listings | The structured data should appear here once crawled. |
| Manual actions | Must stay empty. |

---

## 2. Validate the structured data

Run these once the site is live — they need a public URL:

- [Rich Results Test](https://search.google.com/test/rich-results) — check the home page, one room page and `/faq/`.
- [Schema Markup Validator](https://validator.schema.org/) — checks the whole `@graph`, including types Google does not surface.

Expect: `Hotel`, `WebSite`, `WebPage`, `BreadcrumbList` sitewide;
`HotelRoom` + `Offer` on room pages; `FAQPage` on `/faq/` and the home page.

**Do not** add `aggregateRating` to get review stars. The 9.0/10 score comes
from Booking.com, and Google treats third-party or self-serving ratings on a
`LocalBusiness` as ineligible. Collect reviews first-party first, then mark
those up. The reasoning is in `src/lib/schema.js`.

---

## 3. Bing Webmaster Tools

Ten minutes, and it now feeds Copilot as well as Bing.

1. [bing.com/webmasters](https://www.bing.com/webmasters) → **Import from Google Search Console** (carries the verification across).
2. Submit `https://www.raalmaduwilpattu.com/sitemap.xml`.

---

## 4. Core Web Vitals

Field data takes about 28 days to appear. Until then use lab tools:

```
https://pagespeed.web.dev/analysis?url=https://www.raalmaduwilpattu.com/
```

Check the home page and one room page, on **mobile** — that is the profile
Google ranks on.

The build targets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms. If LCP
comes back slow, the cause is almost always the hero image over a slow
connection rather than the markup: the preload, `fetchpriority`, AVIF encoding
and inlined critical CSS are already in place.

---

## 5. Analytics

None is installed, deliberately — no third-party script, and therefore no
cookie banner required, which keeps the privacy policy accurate as written.

If analytics are wanted, prefer a cookieless, privacy-first option (Plausible,
Fathom, Cloudflare Web Analytics). Whichever is chosen:

1. Add the script to `src/lib/layout.js`.
2. Add its origin to the CSP `script-src` in `buildHeaders()` in `build.js` —
   the current policy is `'self'` only, so an external script will otherwise be
   silently blocked.
3. Update `/privacy-policy/` before it goes live. Google Analytics 4 sets
   cookies and will require a consent banner for EU visitors; the current
   policy text says the site sets no tracking cookies, and that must stay true.

---

## 6. Launch checklist

```bash
npm run build && npm run check && node scripts/qa.js
```

Then, against the live domain:

- [ ] `https://` loads; `http://` redirects to it with a 301
- [ ] the apex domain redirects to the canonical `www` host (or the reverse — pick one and be consistent)
- [ ] `/robots.txt` resolves and names the sitemap
- [ ] `/sitemap.xml` resolves and lists 16 URLs
- [ ] `curl -sI https://www.raalmaduwilpattu.com/ | grep -i strict-transport` returns the HSTS header
- [ ] a deliberately wrong URL returns a real 404 status, not a soft 200
- [ ] the OG card renders — paste the URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and into a WhatsApp message
- [ ] Google Business Profile is verified and links to the site
- [ ] the phone number and email in `src/data/site.js` are the real ones
