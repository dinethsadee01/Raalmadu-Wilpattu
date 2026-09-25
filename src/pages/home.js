import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import { facilities, pillars, experiences, testimonials } from '../data/content.js';
import {
  esc,
  media,
  picture,
  button,
  sectionHead,
  roomCard,
  bookingWidget,
} from '../lib/components.js';
import {
  graph,
  hotelNode,
  websiteNode,
  webPageNode,
  faqNode,
} from '../lib/schema.js';
import { abs } from '../lib/schema.js';
import { faqs } from '../data/content.js';

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
        <p class="hero__kicker">Wilpattu &middot; Sri Lanka</p>
        <h1>A jungle lodge on the edge of Wilpattu</h1>
        <p class="hero__lead">
          Three bedrooms, ten guests, one lagoon. Elephants drink at the pond behind the
          property and leopards are a short drive away through the park gate.
        </p>
        <div class="hero__actions">
          ${button('Check availability', '/booking/', 'primary')}
          ${button('See the rooms', '/rooms/', 'light')}
        </div>
      </div>
      <a class="hero__scroll" href="#welcome">Scroll</a>
    </section>

    <div class="shell">
      <div class="bookbar--hero">${bookingWidget()}</div>
    </div>

    <aside class="hero-ledger" aria-label="At the lodge">
      <div class="shell hero-ledger__inner">
        <div class="hero-ledger__item">
          <span class="hero-ledger__label">The lodge</span>
          <p class="hero-ledger__value">Three rooms &middot; Ten guests</p>
        </div>
        <div class="hero-ledger__item">
          <span class="hero-ledger__label">Park gate</span>
          <p class="hero-ledger__value">Ten minutes to Wilpattu</p>
        </div>
        <div class="hero-ledger__item">
          <span class="hero-ledger__label">The kitchen</span>
          <p class="hero-ledger__value">Home-cooked, three times a day</p>
        </div>
      </div>
    </aside>

    <section data-reveal class="section" id="welcome">
      <div class="shell split">
        <div>
          ${sectionHead({
            kicker: 'Welcome',
            title: 'The quiet side of Sri Lankan safari country',
            level: 2,
          })}
          <p>
            Raalmadu Wilpattu sits where the Kala Oya runs out towards the coast and the
            dry-zone forest begins. It is a small, owner-run lodge, not a resort, with an
            outdoor pool, a garden that the peacocks treat as their own, and a kitchen that
            turns out rice and curry worth planning a day around.
          </p>
          <p>
            <a href="/location/">Wilpattu National Park</a> is the largest and oldest national
            park in the country, and far less crowded than Yala. We will have you at the gate
            for opening, then bring you back for lunch and an afternoon by the water.
          </p>
          <p>
            ${button('Read about the location', '/location/', 'ghost')}
          </p>
        </div>
        <div>
          ${media('intro-lagoon', {
            sizes: '(max-width: 860px) 100vw, 50vw',
          })}
        </div>
      </div>
    </section>

    <section data-reveal class="section section--ink">
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
          title: 'Three rooms, and the whole place if you want it',
          lead: 'From a suite with its own plunge pool to a family room that sleeps eight. Rates start at $55 a night.',
          level: 2,
        })}
        <div class="grid grid--3">
          ${rooms.map((r) => roomCard(r, { level: 3 })).join('')}
        </div>
        <p style="margin-top:var(--sp-6)">
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
              (x) => `<article class="card">
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
        <p style="margin-top:var(--sp-6)">
          ${button('All experiences', '/experiences/', 'ghost')}
        </p>
      </div>
    </section>

    <section data-reveal class="section">
      <div class="shell split split--reverse">
        <div>
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

    <section data-reveal class="section section--ink">
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
        <p style="margin-top:var(--sp-6)">
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
        <h2>Come and stay</h2>
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
      'A small jungle lodge on the edge of Wilpattu National Park, Sri Lanka. Outdoor pool, home-cooked Sri Lankan food and leopard safaris at the gate. Rooms from $55.',
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
