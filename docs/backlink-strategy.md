# Backlink strategy — Raalmadu Wilpattu

A backlink profile is earned over months through outreach and listings; it
cannot be shipped in a build. This is the plan to execute after launch.

The goal is not link volume. For a ten-bed lodge competing on
`wilpattu hotels`, `wilpattu safari accommodation` and `hotels near wilpattu
national park`, roughly thirty genuinely relevant links will outperform three
hundred scraped directory entries — and carry none of the penalty risk.

**Never buy links, never use a PBN, never mass-submit to directories.** A small
property with an unnatural link profile is exactly the pattern Google's link
spam systems are tuned to catch, and recovery takes longer than the ranking
was ever worth.

---

## Phase 0 — Foundations (week 1)

These are not backlinks, but nothing else works without them.

| Task | Notes |
|---|---|
| Google Business Profile | Claim and verify. Category "Lodge" or "Resort hotel". Add the exact pin, real hours, photos, and a link to `https://www.raalmaduwilpattu.com/`. This is the single highest-value local asset. |
| NAP consistency | Name, Address, Phone identical everywhere — on the site, on Google, on Booking.com, on Tripadvisor. Mismatches split local authority. |
| Bing Places | Free, takes ten minutes, feeds Bing and Copilot. |
| Apple Business Connect | Feeds Apple Maps and Siri. Many international travellers use it. |

---

## Phase 1 — Claim what already exists (weeks 1–3)

The property already has an online footprint. Each of these profiles allows a
website field, and several pass real referral traffic.

| Platform | Action | Link value |
|---|---|---|
| **Booking.com** | Already listed, 9.0/10 from 85 reviews. Add the website URL to the profile where the listing type permits. | `nofollow`, but high referral traffic |
| **Tripadvisor** | Claim the listing (already exists for Raalmadu Wilpattu, Eluwankulam). Complete every field, add photos, respond to all reviews. | `nofollow`, strong trust signal |
| **Google Business Profile** | See Phase 0. | Direct local ranking factor |
| **Agoda, Expedia, Hostelworld** | List if the commission model suits. Each gives a profile and referral traffic. | `nofollow` |
| **Facebook / Instagram** | Create if they do not exist. Put the URL in the bio. These are the `sameAs` entries in the site's structured data — fill them into `site.social` in `src/data/site.js` once live. | `nofollow`, entity confirmation |

> Most travel-platform links are `nofollow`. They still matter: they confirm
> the business entity to Google, and they send booking-intent traffic, which is
> the actual point.

---

## Phase 2 — Local and sector authority (months 1–3)

These are the links that move rankings for Wilpattu terms.

**Sri Lanka tourism bodies**

- Sri Lanka Tourism Development Authority (SLTDA) — registration is a legal
  requirement for accommodation providers and gives a listing on the official
  portal. Start here; it is the most authoritative Sri Lankan link available.
- Sri Lanka Tourism (`srilanka.travel`) — the national tourism portal.
- The relevant provincial and Puttalam district tourism pages.

**Wildlife and park ecosystem**

- Department of Wildlife Conservation — partner and operator listings.
- Wilpattu safari operators. The lodge already arranges jeeps and trackers; ask
  each partner for a reciprocal listing on their "where to stay" page. This is
  the most natural link the property can earn, and the most relevant.
- Birding organisations: Field Ornithology Group of Sri Lanka, eBird hotspot
  pages, local birding tour operators. The property's bird list is genuinely
  good content for them.

**Eco and specialist directories** — apply, do not bulk-submit:

- Ecotourism and responsible-travel directories
- Sri Lanka boutique and small-hotel collections
- Safari lodge aggregators

---

## Phase 3 — Content that earns links (months 2–6)

Directory links plateau. What keeps compounding is content other sites want to
cite. The lodge has genuine subject authority — it sits on the park boundary
and the team is out there daily.

Suggested pieces, in priority order:

1. **"Wilpattu vs Yala: an honest comparison"**
   The highest-intent question a Sri Lanka safari planner asks. Answer it
   fairly, including where Yala wins. Travel bloggers cite comparisons.

2. **"When to visit Wilpattu: a month-by-month guide"**
   Game viewing, weather, park closures, bird migration. Update it annually so
   it stays the best version available.

3. **"Birds of Wilpattu: a running checklist"**
   A real, maintained species list with dates and locations. Birding sites link
   to lists like this, and the audience converts well.

4. **"Getting to Wilpattu: routes, road conditions and transfers"**
   Nobody covers the Eluwankulama approach properly. The site's `/location/`
   page is the seed; expand it.

5. **Seasonal sighting reports**
   Short, dated posts: what was seen this month. Cheap to produce, genuinely
   useful, and they give safari operators and birders a reason to link
   repeatedly.

This would need a `/journal/` or `/guides/` section. The generator already
supports it — add a page module under `src/pages/` and it inherits every meta
tag, the breadcrumb schema and its sitemap entry automatically.

---

## Phase 4 — Outreach (ongoing)

**Travel writers and bloggers.** Target people who have already written about
Wilpattu or Sri Lankan safari. Offer a genuine stay, and make clear you expect
honest coverage, not a guaranteed link. Paid or exchanged links must carry
`rel="sponsored"` — if a writer will not disclose, walk away.

**Guest contribution.** Pitch one genuinely expert piece to Sri Lanka travel
publications. The angle nobody else can write: what it is like to live on the
boundary of the park.

**Digital PR.** Notable wildlife events at the property — an unusual sighting,
a conservation partnership, a leopard cub on the lagoon — are legitimate local
news. Sri Lankan outlets cover this.

**Partner reciprocity.** Safari operators, transfer drivers, Anuradhapura
guides, cooking-class operators. Everyone the lodge already works with has a
website.

---

## What to measure

Track quarterly, not weekly:

| Metric | Where | Target at 12 months |
|---|---|---|
| Referring domains | Search Console → Links | 30–50 genuinely relevant |
| Rankings for `wilpattu hotels`, `wilpattu safari accommodation` | Search Console → Performance | Page 1 |
| Organic sessions | Analytics | Growing quarter on quarter |
| Direct bookings vs OTA | The hotel's own records | The real measure — every direct booking saves 15–18% commission |

That last row is the one that matters. The purpose of this site is to shift
bookings away from Booking.com commission, not to win a ranking report.

---

## Red flags

Walk away from anything offering:

- "500 backlinks for $50" — these are the links Google penalises
- Guaranteed first-page rankings — nobody can guarantee that
- Link exchange schemes or reciprocal-link networks
- Comment, forum or profile-spam links
- Private blog networks (PBNs)

One link from the SLTDA portal or a respected Sri Lanka travel publication is
worth more than every one of those combined.
