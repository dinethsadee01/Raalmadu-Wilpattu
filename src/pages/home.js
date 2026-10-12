import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import {
  facilities,
  pillars,
  experiences,
  testimonials,
  ecoRetreat,
  eluwankulamReasons,
} from '../data/content.js';
import {
  esc,
  media,
  picture,
  button,
  sectionHead,
  roomCard,
  bookingWidget,
} from '../lib/components.js';
import { icon } from '../lib/icons.js';
import {
  graph,
  hotelNode,
  websiteNode,
  webPageNode,
  faqNode,
} from '../lib/schema.js';
import { abs } from '../lib/schema.js';
import { faqs } from '../data/content.js';

/**
 * Schematic (not to scale) route map centred on the lodge. Purely decorative
 * alongside the reasons list, which carries the same information as text.
 */
/** Exported so /contact/ can draw the same sketch beside its directions. */
export function gatewayMap() {
  const hub = { x: 200, y: 250 };
  const places = [
    { name: 'Jaffna', x: 250, y: 46, lx: 250, ly: 30, anchor: 'middle', bend: [228, 140] },
    { name: 'Anuradhapura', x: 372, y: 236, lx: 372, ly: 216, anchor: 'end', bend: [300, 210] },
    { name: 'Kalpitiya', x: 92, y: 282, lx: 92, ly: 308, anchor: 'middle', bend: [150, 310] },
    { name: 'Airport', x: 222, y: 410, lx: 236, ly: 414, anchor: 'start', bend: [240, 330] },
    { name: 'Colombo', x: 196, y: 452, lx: 210, ly: 466, anchor: 'start', bend: [170, 360] },
  ];
  const routes = places
    .map(
      (p, i) =>
        `<path class="gmap__route" style="--i:${i}" d="M${hub.x} ${hub.y} Q${p.bend[0]} ${p.bend[1]} ${p.x} ${p.y}"/>`,
    )
    .join('');
  const pins = places
    .map(
      (p) => `<g class="gmap__place">
          <circle cx="${p.x}" cy="${p.y}" r="4.5"/>
          <text x="${p.lx}" y="${p.ly}" text-anchor="${p.anchor}">${esc(p.name)}</text>
        </g>`,
    )
    .join('');
  return `<svg class="gmap" viewBox="0 0 420 480" role="img"
      aria-label="Map sketch: Raalmadu at Eluwankulam, linked to Jaffna, Anuradhapura, Kalpitiya, the airport and Colombo, beside Wilpattu National Park">
      <path class="gmap__coast" d="M150 0 C120 70 128 150 96 210 C70 250 40 262 56 300 C80 350 150 380 150 480"/>
      <text class="gmap__sea-label" x="34" y="150">Indian Ocean</text>
      <path class="gmap__park" d="M196 120 C240 86 330 92 358 140 C380 180 340 214 290 214 C250 216 214 204 200 178 C188 156 180 136 196 120 Z"/>
      <text class="gmap__park-label" x="312" y="152" text-anchor="middle">Wilpattu</text>
      <text class="gmap__park-label gmap__park-label--sm" x="312" y="170" text-anchor="middle">National Park</text>
      <path class="gmap__route gmap__route--park" d="M${hub.x} ${hub.y} Q196 214 222 176"/>
      ${routes}
      ${pins}
      <g class="gmap__hub">
        <circle class="gmap__pulse" cx="${hub.x}" cy="${hub.y}" r="9"/>
        <circle cx="${hub.x}" cy="${hub.y}" r="7"/>
        <text x="${hub.x - 14}" y="${hub.y - 20}" text-anchor="end">Raalmadu</text>
        <text class="gmap__hub-sub" x="${hub.x - 14}" y="${hub.y - 5}" text-anchor="end">Eluwankulam</text>
      </g>
    </svg>`;
}

export function homePage({ heroPreload }) {
  const url = abs('/');

  const heroVideo = site.hero?.video || '';
  const heroSlides = (site.hero?.slides && site.hero.slides.length ? site.hero.slides : ['hero-lodge']);
  const heroMedia = heroVideo
    ? `<video class="hero__video" autoplay muted loop playsinline preload="metadata" poster="/assets/img/hero-lodge-1600.jpg">
        <source src="${esc(heroVideo)}" type="${heroVideo.endsWith('.webm') ? 'video/webm' : 'video/mp4'}">
      </video>`
    : `<div class="hero-rotator" data-hero-rotator>
        ${heroSlides
          .map(
            (key, i) =>
              `<div class="hero-slide${i === 0 ? ' is-active' : ''}" data-hero-slide>${picture(key, { sizes: '100vw', priority: i === 0, className: 'ken-burns' })}</div>`,
          )
          .join('')}
      </div>`;

  const body = `
    <section class="hero">
      <div class="hero__media">
        ${heroMedia}
        <div class="hero__vignette" aria-hidden="true"></div>
      </div>
      <div class="shell hero__inner">
        <div class="hero__copy">
        <p class="hero__kicker">Eluwankulam &middot; Wilpattu &middot; Sri Lanka</p>
        <h1>A jungle lodge on the edge of <span class="accent">Wilpattu</span></h1>
        <p class="hero__lead">
          Private villas, a glamping lodge and a family residence on 10.5 acres of jungle.
          Elephants drink at the lake behind the property and leopards are a short drive away.
        </p>
        <div class="hero__actions">
          ${button('Check availability', '/booking/', 'primary')}
          ${button('See the rooms', '/rooms/', 'light')}
        </div>
        </div>
      </div>
    </section>

    <div class="shell">
      <div class="bookbar--hero">${bookingWidget()}</div>
    </div>

    <section data-reveal class="section" id="welcome">
      <div class="shell">
        ${sectionHead({
          kicker: 'Welcome',
          title: 'The quiet side of Sri Lankan safari country',
          level: 2,
        })}
        <div class="intro">
          <p>
            Raalmadu Wilpattu sits where the Kala Oya runs out towards the coast and the
            dry-zone forest begins. It is a small, owner-run lodge, not a resort, with an
            outdoor pool, a garden that the peacocks treat as their own, and a kitchen that
            turns out rice and curry worth planning a day around.
          </p>
          <p>
            <a href="/experiences/#wilpattu-safari">Wilpattu National Park</a> is the largest and oldest national
            park in the country, and far less crowded than Yala. We will have you at the gate
            for opening, then bring you back for lunch and an afternoon by the water.
          </p>
        </div>
        <p class="section-actions">
          ${button('Read about the location', '/contact/#getting-here', 'ghost')}
        </p>
      </div>
    </section>

    <section class="glance" aria-label="The lodge at a glance">
      <div class="shell">
        <div class="photo-strip" data-reveal tabindex="0" role="region" aria-label="Photographs of the lodge and its wildlife">
          ${[
            ['intro-lagoon', 'The lagoon deck'],
            ['gal-elephant', 'Our neighbours'],
            ['gal-peacock', 'Peacocks on the lawn'],
          ]
            .map(
              ([k, caption]) => `<figure class="photo-strip__item">
              ${media(k, { sizes: '(max-width: 680px) 78vw, 380px' })}
              <figcaption>${esc(caption)}</figcaption>
            </figure>`,
            )
            .join('')}
        </div>
        <ul class="features" data-reveal>
          ${[
            ['hut', 'Six units, forty guests', 'Villas, a glamping lodge and a family residence'],
            ['binoculars', 'Ten minutes to the gate', 'First into Wilpattu at opening time'],
            ['pot', 'Cooked fresh, every meal', 'Rice and curry made to order, three times a day'],
            ['sunleaf', '10.5 acres, fully solar', 'An eco-retreat inside the elephant corridor'],
          ]
            .map(
              ([ic, title, text], i) => `<li class="feature" style="--reveal-delay:${i * 120}ms">
              <span class="feature__badge">${icon(ic)}</span>
              <p class="feature__title">${esc(title)}</p>
              <p class="feature__text">${esc(text)}</p>
            </li>`,
            )
            .join('')}
        </ul>
      </div>
    </section>

    <section data-reveal class="section section--sand eco" id="eco">
      <div class="shell eco__grid">
        <div class="eco__collage">
          <div class="eco__photo eco__photo--tall polaroid">
            ${media('gal-safari', { sizes: '(max-width: 860px) 70vw, 30vw' })}
          </div>
          <div class="eco__photo eco__photo--wide polaroid polaroid--right">
            ${media('gal-elephant', { sizes: '(max-width: 860px) 70vw, 28vw' })}
          </div>
          <svg class="eco__seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <defs><path id="eco-seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
            <circle class="eco__seal-disc" cx="60" cy="60" r="58"/>
            <g class="eco__seal-spin">
              <text><textPath href="#eco-seal-ring" textLength="272">SOLAR POWERED &#183; ECO RETREAT &#183; WILPATTU &#183;</textPath></text>
            </g>
            <text class="eco__seal-core" x="60" y="58" text-anchor="middle">10.5</text>
            <text class="eco__seal-sub" x="60" y="74" text-anchor="middle">ACRES</text>
          </svg>
        </div>
        <div class="eco__copy">
          ${sectionHead({ kicker: ecoRetreat.kicker, title: ecoRetreat.title, level: 2 })}
          <p class="eco__lede">${esc(ecoRetreat.paragraphs[0])}</p>
          <p>${esc(ecoRetreat.paragraphs[1])}</p>
          <dl class="eco__stats">
            ${ecoRetreat.stats
              .map(
                (s) => `<div class="eco__stat">
                <dt><span class="eco__num">${esc(s.value)}</span> <span class="eco__unit">${esc(s.unit)}</span></dt>
                <dd>${esc(s.label)}</dd>
              </div>`,
              )
              .join('')}
          </dl>
        </div>
      </div>
      <div class="eco__ticker">
        <p class="visually-hidden">Wildlife you may see: ${esc(ecoRetreat.wildlife.join(', '))}.</p>
        <div class="eco__ticker-track" aria-hidden="true">
          ${[0, 1]
            .map(
              () =>
                `<span class="eco__ticker-set">${ecoRetreat.wildlife
                  .map((w) => `<span>${esc(w)}</span>`)
                  .join('')}</span>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section data-reveal class="section section--feature gateway">
      <div class="shell gateway__grid">
        <div>
          ${sectionHead({
            kicker: 'Through Eluwankulam, Puttalam',
            title: 'Why Eluwankulam is the best way into Wilpattu',
            lead: 'Most visitors enter Wilpattu from the Anuradhapura side. We sit on the Puttalam side, at Eluwankulam, and it pays off.',
            level: 2,
          })}
          <ol class="gateway__list">
            ${eluwankulamReasons.map((r) => `<li>${esc(r)}</li>`).join('')}
          </ol>
          <p>${button('Getting here', '/contact/#getting-here', 'ghost')}</p>
        </div>
        <figure class="gateway__map">
          ${gatewayMap()}
          <figcaption>Not to scale &mdash; a sketch of where the lodge sits.</figcaption>
        </figure>
      </div>
    </section>

    <section data-reveal class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'Why here',
          title: 'Small, remote, and genuinely wild',
          level: 2,
        })}
        <div class="grid grid--3">
          ${pillars
            .map(
              (p) => `<div class="pillar">
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.body)}</p>
              </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section data-reveal class="section" id="rooms">
      <div class="shell">
        ${sectionHead({
          kicker: 'Where you sleep',
          title: 'Four ways to stay, and the whole place if you want it',
          lead: 'From villas with their own plunge pools to a glamping lodge for twenty. Up to forty guests across the property.',
          level: 2,
        })}
        <div class="grid grid--2">
          ${rooms.map((r) => roomCard(r, { level: 3 })).join('')}
        </div>
        <p class="section-actions">
          ${button('Compare all rooms', '/rooms/', 'ghost')}
        </p>
      </div>
    </section>

    <section data-reveal class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'Things to do',
          title: 'Leopards, storks, mangroves and a cooking lesson',
          lead: 'Everything below is arranged at the lodge: the jeep, the tracker, the permits and the packed lunch.',
          level: 2,
        })}
        <div class="grid grid--2">
          ${experiences
            .slice(0, 4)
            .map(
              (x) => `<article class="card card--story">
                <a class="card__media" href="/experiences/#${esc(x.slug)}" tabindex="-1" aria-hidden="true">
                  ${media(x.image, { sizes: '(max-width: 860px) 100vw, 50vw', altOverride: x.alt })}
                </a>
                <div class="card__body">
                  <h3 class="card__title"><a href="/experiences/#${esc(x.slug)}">${esc(x.title)}</a></h3>
                  <ul class="card__facts"><li>${esc(x.duration)}</li></ul>
                  <p class="card__text">${esc(x.body)}</p>
                </div>
              </article>`,
            )
            .join('')}
        </div>
        <p class="section-actions">
          ${button('All experiences', '/experiences/', 'ghost')}
        </p>
      </div>
    </section>

    <section data-reveal class="section">
      <div class="shell split split--reverse">
        <div class="polaroid polaroid--right">
          ${media('dining-table', { sizes: '(max-width: 860px) 100vw, 50vw' })}
        </div>
        <div>
          ${sectionHead({
            kicker: 'Dining',
            title: 'Cooked to order, three times a day',
            level: 2,
          })}
          <p>
            There is no menu and no set sitting. Breakfast might be string hoppers with
            pol sambol and a dhal curry; dinner is usually eight or nine dishes around a
            bowl of red rice, with fish brought up from the coast that afternoon.
          </p>
          <p>
            Vegetarian, vegan and most allergy requirements are straightforward if you tell
            us in advance. Packed breakfasts go out with every early safari departure.
          </p>
          <p>${button('More about dining', '/dining/', 'ghost')}</p>
        </div>
      </div>
    </section>

    <section data-reveal class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'Facilities',
          title: 'What is on site',
          level: 2,
        })}
        <div class="grid grid--4">
          ${facilities
            .map(
              (f) => `<div class="facility">
                <h3>${esc(f.heading)}</h3>
                <ul>${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
              </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section data-reveal class="section section--forest">
      <div class="shell">
        ${sectionHead({
          kicker: 'Guest reviews',
          title: 'What people say after they leave',
          level: 2,
        })}
        <div class="grid grid--3">
          ${testimonials
            .map(
              (t) => `<blockquote class="quote">
                <p>${esc(t.quote)}</p>
                <footer>${esc(t.source)}</footer>
              </blockquote>`,
            )
            .join('')}
        </div>
        <p class="section-actions">
          <span class="rating">
            <span class="rating__score">${site.rating.score.toFixed(1)}</span>
            <span class="rating__meta">
              out of ${site.rating.best} &middot; ${site.rating.count} verified reviews on
              <a href="${esc(site.social.booking)}" rel="noopener nofollow" target="_blank">${esc(site.rating.source)}</a>
            </span>
          </span>
        </p>
      </div>
    </section>

    <section data-reveal class="section cta-band">
      <div class="cta-band__media">
        ${media('gal-villu', { sizes: '100vw' })}
      </div>
      <div class="shell">
        <h2>Come and <span class="accent">stay</span></h2>
        <p>
          Tell us your dates and how many of you there are, and we will come back within
          the day with availability, rates and a plan for the safari.
        </p>
        ${button('Check availability', '/booking/', 'light')}
      </div>
    </section>
  `;

  const description = site.description;

  return {
    path: '/',
    title: 'Raalmadu Wilpattu',
    metaTitle: 'Raalmadu Wilpattu | Jungle Lodge & Safari Stay, Sri Lanka',
    metaDescription:
      'A small jungle lodge on the edge of Wilpattu National Park, Sri Lanka. Outdoor pool, home-cooked Sri Lankan food and leopard safaris at the gate. Villas from $77.',
    bodyClass: 'has-hero',
    preloadImage: heroPreload,
    ogImageAlt: 'Evening light over the lagoon beside Wilpattu National Park at Raalmadu Wilpattu',
    body,
    schema: graph([
      hotelNode('/assets/img/og-default.jpg'),
      websiteNode(),
      webPageNode({
        url,
        title: 'Raalmadu Wilpattu | Jungle Lodge & Safari Stay, Sri Lanka',
        description,
        image: '/assets/img/hero-lodge-1600.jpg',
      }),
      faqNode(url, faqs.slice(0, 4)),
    ]),
  };
}
