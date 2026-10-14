import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import {
  facilities,
  experiences,
  offers,
  faqs,
  aboutStory,
  aboutDining,
  aboutFacilities,
  aboutExcursions,
  nearbySites,
  aboutClosingQuote,
  sampleDay,
} from '../data/content.js';
import { IMAGES } from '../data/images.js';
import { esc, media, button, sectionHead, bookingWidget, largestSrc } from '../lib/components.js';
import { pageHero, plainHero, ctaBand, accordion } from '../lib/sections.js';
import { icon } from '../lib/icons.js';
import { gatewayMap } from './home.js';
import {
  graph,
  hotelNode,
  hotelRef,
  webPageNode,
  breadcrumbNode,
  faqNode,
  imageGalleryNode,
  abs,
} from '../lib/schema.js';

/** Shared builder: every interior page gets the same schema spine. */
const spine = (url, title, description, image, trail) => [
  hotelRef(),
  webPageNode({ url, title, description, image, breadcrumbId: `${url}#breadcrumb` }),
  breadcrumbNode(url, trail),
];

/* ------------------------------------------------------------------- about */
export function aboutPage() {
  const path = '/about/';
  const url = abs(path);
  const trail = [{ name: 'About Us', path }];
  const title = 'About Us';

  const num = (i) => String(i + 1).padStart(2, '0');

  const body = `
    ${pageHero({
      image: 'intro-lagoon',
      kicker: 'Our story',
      title,
      lead: 'A home away from home on the edge of the Wilpattu jungle, built by one man who wanted to share it.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split">
        <div class="about-portrait polaroid">
          ${media('founder-rizvi', { sizes: '(max-width: 860px) 100vw, 50vw' })}
          <svg class="eco__seal about-portrait__seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <defs><path id="about-seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
            <circle class="eco__seal-disc" cx="60" cy="60" r="58"/>
            <g class="eco__seal-spin">
              <text><textPath href="#about-seal-ring" textLength="272">HOME AWAY FROM HOME &#183; WILPATTU &#183;</textPath></text>
            </g>
            <text class="eco__seal-core" x="60" y="58" text-anchor="middle">20</text>
            <text class="eco__seal-sub" x="60" y="74" text-anchor="middle">YEARS</text>
          </svg>
        </div>
        <div>
          <p class="kicker">Our founder</p>
          <h2>Welcome</h2>
          <blockquote class="about-pull">
            <p>When we share what we love, we sow seeds of joy and possibility for those around us.</p>
          </blockquote>
          <p class="about-signoff">Rizvi Hasan <span>Founder, Raalmadu Wilpattu</span></p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'How it began', title: 'From a hike to a home', level: 2 })}
        <ol class="story">
          ${aboutStory
            .map(
              (step, i) => `<li class="story__step" data-reveal style="--reveal-delay:${i * 90}ms">
              <span class="story__icon">${icon(step.icon)}</span>
              <p class="story__num">${num(i)}</p>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.text)}</p>
            </li>`,
            )
            .join('')}
        </ol>
        <blockquote class="about-pull about-pull--center">
          <p>True fulfilment comes not only from pursuing our passions, but from sharing them to help others thrive.</p>
        </blockquote>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        ${sectionHead({ kicker: 'At the lodge', title: 'Facilities', level: 2 })}
        <div class="amenities">
          <article class="amenities__feature">
            <span class="amenities__icon">${icon('utensils')}</span>
            <h3>Restaurant &amp; common areas</h3>
            <ul class="icon-list">
              ${aboutDining.map((d) => `<li>${icon(d.icon)}<span>${esc(d.text)}</span></li>`).join('')}
            </ul>
          </article>
          ${aboutFacilities
            .map(
              (f) => `<article class="amenity">
              <span class="amenities__icon">${icon(f.icon)}</span>
              <h3>${esc(f.title)}</h3>
              <p>${esc(f.text)}</p>
            </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell shell--narrow">
        <blockquote class="about-pull about-pull--center about-pull--large">
          <p>${esc(aboutClosingQuote)}</p>
        </blockquote>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Get in touch', title: 'Contact us', level: 2 })}
        <div class="contact-cards">
          <div class="amenity">
            <span class="amenities__icon">${icon('pin')}</span>
            <h3>Find us</h3>
            <address>${esc(site.name)}<br>${esc(site.address.line)}</address>
            <p><a href="${esc(site.mapUrl)}" rel="noopener">Open in Google Maps</a></p>
          </div>
          <div class="amenity">
            <span class="amenities__icon">${icon('building')}</span>
            <h3>Managed by</h3>
            <address>${esc(site.operator.name)}<br>${esc(site.operator.street)},<br>${esc(site.operator.locality)}, ${esc(site.operator.country)}</address>
          </div>
          <div class="amenity">
            <span class="amenities__icon">${icon('phone')}</span>
            <h3>Call us</h3>
            <p><a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></p>
          </div>
          <div class="amenity">
            <span class="amenities__icon">${icon('mail')}</span>
            <h3>Email us</h3>
            <p><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></p>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand({ title: 'Come and share it with us', text: 'Tell us your dates and how many of you there are, and we will come back within the day with availability and rates.' })}
  `;

  return {
    path,
    title,
    metaTitle: 'About Us | The Story of Raalmadu Wilpattu',
    metaDescription:
      'The story of founder Rizvi Hasan and Raalmadu, an eco-friendly lodge on the edge of Wilpattu National Park, and the facilities it offers guests.',
    ogImageKey: 'intro-lagoon',
    ogImageAlt: IMAGES['intro-lagoon'].alt,
    preloadImageKey: 'intro-lagoon',
    body,
    schema: graph(
      spine(
        url,
        'About Us | Raalmadu Wilpattu',
        'The story of Raalmadu Wilpattu and its founder, Rizvi Hasan.',
        largestSrc('intro-lagoon'),
        trail,
      ),
    ),
  };
}

/* ------------------------------------------------------------------ dining */
export function diningPage() {
  const path = '/dining/';
  const url = abs(path);
  const trail = [{ name: 'Dining', path }];
  const title = 'Dining';

  const body = `
    ${pageHero({
      image: 'dining-terrace',
      kicker: 'Food & drink',
      title,
      lead: 'One kitchen, no menu, and everything cooked to order. This is the part of the stay most guests write home about.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split">
        <div class="dining-copy">
          <h2>Sri Lankan home cooking, three times a day</h2>
          <p>
            Dinner is the centrepiece: a bowl of red rice surrounded by eight or nine
            curries (dhal, jackfruit, beetroot, green beans, cashew, a fish or chicken
            dish), plus pol sambol, papadam and whatever the garden gave up that morning.
            Nothing is pre-cooked and nothing sits under a lamp.
          </p>
          <p>
            Breakfast runs from string hoppers and kiribath through to eggs and fruit,
            with good tea. Lunch is usually lighter, and often eaten in the shade by the
            pool.
          </p>
          <h3>Special diets</h3>
          <p>
            Vegetarian and vegan versions of everything are straightforward, and most
            allergies can be worked around if you let us know when you book. Meals for
            children are always available.
          </p>
          <h3>Eating around a safari</h3>
          <p>
            Early game drives mean early departures, so packed breakfasts go out with
            every dawn start and a full packed lunch comes with the
            <a href="/experiences/#wilpattu-safari">full-day drive</a>. Dinner is served
            whenever you get back.
          </p>
          <p>${button('See the experiences', '/experiences/', 'ghost')}</p>
        </div>
        <div class="dining-photos">
          <div class="polaroid">${media('dining-table', { sizes: '(max-width: 860px) 100vw, 50vw' })}</div>
          <div class="polaroid polaroid--right">${media('exp-cooking', { sizes: '(max-width: 860px) 80vw, 40vw' })}</div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Practicalities', title: 'How dining works here', level: 2 })}
        <div class="grid grid--3">
          <div class="pillar">
            <h3>Half board and full board</h3>
            <p>Breakfast is included on most rates. Add dinner, or go full board, when you book. It is the simplest option given how remote the lodge is.</p>
          </div>
          <div class="pillar">
            <h3>Nowhere else to eat</h3>
            <p>There are no restaurants within easy reach, which is rather the point. Tell us how many meals you want and we will plan the shopping around it.</p>
          </div>
          <div class="pillar">
            <h3>Drinks</h3>
            <p>Wine, beer and soft drinks are available at the lodge. King coconut comes straight off the property.</p>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand({ title: 'Hungry yet?', text: 'Book a table and a bed. Tell us your dates and any dietary needs and we will take it from there.' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Dining | Sri Lankan Home Cooking at Raalmadu Wilpattu',
    metaDescription:
      'Rice and curry cooked fresh to order at Raalmadu Wilpattu, with vegetarian and vegan options, packed safari breakfasts and half- or full-board rates.',
    ogImageKey: 'dining-terrace',
    ogImageAlt: IMAGES['dining-terrace'].alt,
    preloadImageKey: 'dining-terrace',
    body,
    schema: graph(
      spine(
        url,
        'Dining | Raalmadu Wilpattu',
        'Sri Lankan home cooking at Raalmadu Wilpattu.',
        largestSrc('dining-terrace'),
        trail,
      ),
    ),
  };
}

/* ------------------------------------------------------------- experiences */
export function experiencesPage() {
  const path = '/experiences/';
  const url = abs(path);
  const trail = [{ name: 'Experiences', path }];
  const title = 'Experiences';

  const body = `
    ${pageHero({
      image: 'gal-buffalo',
      kicker: 'Things to do',
      title,
      lead: 'Safari drives, birdwatching, mangrove boats and a cooking session, all arranged at the lodge, all using local guides.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell">
        ${experiences
          .map(
            (x, i) => `<article class="split exp-row${i % 2 ? ' split--reverse' : ''}" id="${esc(x.slug)}">
              <div>
                ${media(x.image, { sizes: '(max-width: 860px) 100vw, 50vw', altOverride: x.alt })}
              </div>
              <div>
                <p class="kicker">${esc(x.duration)}</p>
                <h2>${esc(x.title)}</h2>
                <p>${esc(x.body)}</p>
                <ul>${x.detail.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
                ${button('Enquire about this', '/contact/', 'ghost')}
              </div>
            </article>`,
          )
          .join('')}
      </div>
    </section>

    <section class="section section--feature">
      <div class="shell">
        ${sectionHead({
          kicker: 'Planning',
          title: 'When to come',
          lead: 'Wilpattu is a dry-zone park, so game viewing follows the water.',
          level: 2,
        })}
        <div class="grid grid--3">
          <div class="pillar">
            <h3>February to April</h3>
            <p>The sweet spot. Water concentrates in the villus, the animals concentrate with it, and the weather is dependable.</p>
          </div>
          <div class="pillar">
            <h3>May to October</h3>
            <p>Still dry and still good, with fewer visitors. The park normally closes briefly in September, so check with us before booking those dates.</p>
          </div>
          <div class="pillar">
            <h3>November to January</h3>
            <p>Greener, wetter and excellent for birds, with migrants on the lakes. Tracks can be soft after heavy rain.</p>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand({ title: 'Plan your safari', text: 'Tell us your dates and we will book the jeep, the tracker and the park permits alongside your room.' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Wilpattu Safari & Experiences | Raalmadu Wilpattu',
    metaDescription:
      'Leopard safaris in Wilpattu National Park, birdwatching on the villus, mangrove boat trips and Sri Lankan cooking sessions, arranged at Raalmadu Wilpattu.',
    ogImageKey: 'gal-buffalo',
    ogImageAlt: IMAGES['gal-buffalo'].alt,
    preloadImageKey: 'gal-buffalo',
    body,
    schema: graph(
      spine(
        url,
        'Wilpattu Safari & Experiences | Raalmadu Wilpattu',
        'Safaris, birdwatching, mangrove trips and cooking sessions at Raalmadu Wilpattu.',
        largestSrc('gal-buffalo'),
        trail,
      ),
    ),
  };
}

/* -------------------------------------------------------------- excursions */

/** Where a site sits on the radar: the 40 km outer ring is 46.875% from centre. */
function radarPoint({ bearing, km }) {
  const r = (Math.min(km, 40) / 40) * 46.875;
  const rad = (bearing * Math.PI) / 180;
  return {
    x: (50 + r * Math.sin(rad)).toFixed(2),
    y: (50 - r * Math.cos(rad)).toFixed(2),
  };
}

/**
 * The live radar: a sweep turns once every 8 s and each site's blip pings,
 * label and all, as the beam passes its bearing. Pure CSS: every blip shares
 * the sweep's period and is offset by its bearing. Decorative, so hidden from
 * assistive tech; the list beside it carries the content.
 */
function liveRadar(sites) {
  const rings = [10, 20, 30, 40]
    .map((km) => {
      const r = (km / 40) * 150;
      return `<circle cx="160" cy="160" r="${r}" class="radar__ring${km === 30 ? ' radar__ring--limit' : ''}"/>`;
    })
    .join('');
  const blips = sites
    .map((site, i) => {
      const { x, y } = radarPoint(site);
      return `<span class="radar__blip radar__blip--${site.side}" data-site="${i}" style="--x:${x}%;--y:${y}%;--b:${site.bearing}"><span class="radar__label">${esc(site.short)}</span></span>`;
    })
    .join('');
  return `<div class="radar" aria-hidden="true" data-radar>
      <svg class="radar__grid" viewBox="0 0 320 320" focusable="false">
        <circle cx="160" cy="160" r="150" class="radar__disc"/>
        ${rings}
        <path d="M160 10v300M10 160h300" class="radar__axis"/>
        <path d="M160 2v14M160 304v14M2 160h14M304 160h14" class="radar__tick"/>
        <text x="160" y="-4" text-anchor="middle" class="radar__n">N</text>
        <text x="166" y="${160 + 112.5 - 5}" class="radar__km">30 km</text>
        <text x="166" y="${160 + 75 - 5}" class="radar__km radar__km--soft">20</text>
        <text x="166" y="${160 + 37.5 - 5}" class="radar__km radar__km--soft">10</text>
      </svg>
      <div class="radar__sweep"></div>
      ${blips}
      <span class="radar__home"><span class="radar__home-label">Raalmadu</span></span>
    </div>`;
}

export function excursionsPage() {
  const path = '/excursions/';
  const url = abs(path);
  const trail = [{ name: 'Excursions', path }];
  const title = 'Excursions';

  const num = (i) => String(i + 1).padStart(2, '0');

  const body = `
    ${pageHero({
      image: 'exc-hero',
      kicker: 'Day trips',
      title,
      lead: 'National parks, river hideaways, ancient ruins and quiet beaches, all within an easy drive of Raalmadu.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split">
        <div>
          ${sectionHead({ kicker: 'Make a day of it', title: 'Days out from the lodge', level: 2 })}
          <p>
            Raalmadu sits where the jungle, the river and the coast meet, which makes it an
            easy base for more than safaris. A short drive away there are ruins tied to the
            island's founding legends, a rock temple, riverside hideaways, wetlands full of
            birds and long, empty beaches.
          </p>
          <p>
            Tell us what interests you and we will put the day together: the vehicle and
            driver, a guide where one helps, park permits and a packed meal for the road.
            Most guests pair one big outing with a slow afternoon back at the lodge.
          </p>
          <p class="section-actions">
            ${button('Plan a day out', '/contact/#enquire', 'primary')}
            ${button('Lodge experiences', '/experiences/', 'ghost')}
          </p>
        </div>
        <div class="excursion-photos">
          <figure class="polaroid">${media('exc-leopard', { sizes: '(max-width: 860px) 90vw, 45vw' })}<figcaption>Leopard country, ten minutes away</figcaption></figure>
          <figure class="polaroid polaroid--right">${media('exc-stork', { sizes: '(max-width: 860px) 70vw, 30vw' })}<figcaption>Birdlife on the wetlands</figcaption></figure>
        </div>
      </div>
    </section>

    <section class="section section--sand" id="day-trips">
      <div class="shell">
        ${sectionHead({
          kicker: 'Beyond the lodge',
          title: 'Experiences & excursions',
          lead: 'Comprehensive experiences for holiday makers.',
          level: 2,
        })}
        <div class="excursions">
          ${aboutExcursions
            .map(
              (x, i) => `<article class="excursion${x.wide ? ' excursion--wide' : ''}" data-reveal style="--reveal-delay:${(i % 3) * 80}ms">
              <div class="excursion__top">
                <span class="amenities__icon">${icon(x.icon)}</span>
                <span class="excursion__num" aria-hidden="true">${num(i)}</span>
              </div>
              ${x.tag ? `<p class="excursion__tag">${esc(x.tag)}</p>` : ''}
              <h3>${esc(x.title)}</h3>
              ${x.text ? `<p>${esc(x.text)}</p>` : ''}
              ${
                x.trails
                  ? `<dl class="excursion__trails">${x.trails
                      .map((t) => `<div><dt>${esc(t.name)}</dt><dd>${esc(t.text)}</dd></div>`)
                      .join('')}</dl>`
                  : ''
              }
            </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section--forest nearby" id="nearby">
      <div class="shell nearby__grid">
        ${liveRadar(nearbySites)}
        <div>
          ${sectionHead({
            kicker: 'On the doorstep',
            title: 'Within 30 km, or half an hour',
            lead: 'History, legend and wildlife, all a short drive from the lodge. Watch the sweep: each place lights up as the beam passes it.',
            level: 2,
          })}
          <ul class="nearby__list">
            ${nearbySites
              .map(
                (site, i) => `<li data-site="${i}" style="--b:${site.bearing}">${icon('pin')}<span>${esc(site.name)}</span></li>`,
              )
              .join('')}
          </ul>
          <p class="nearby__note">Positions are approximate, to give a sense of direction.</p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'An idea for your stay',
          title: 'A day around Wilpattu',
          lead: 'One way to fit the park, the past and the lagoon into a single day.',
          level: 2,
        })}
        <ol class="story story--day">
          ${sampleDay
            .map(
              (step, i) => `<li class="story__step" data-reveal style="--reveal-delay:${i * 90}ms">
              <span class="story__icon">${icon(step.icon)}</span>
              <p class="story__num">${esc(step.time)}</p>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.text)}</p>
            </li>`,
            )
            .join('')}
        </ol>
      </div>
    </section>

    ${ctaBand({ title: 'Plan your days out', text: 'Tell us what you would like to see and we will arrange the drivers, guides and timings around your stay.', image: 'gal-sunset' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Excursions Around Wilpattu | Raalmadu Wilpattu',
    metaDescription:
      'Day trips from Raalmadu Wilpattu: Wilpattu National Park, Gange Vadiya, Kuweni\'s Palace, Thanthirimale temple, Chilaw beaches and the Pambala wetlands.',
    ogImageKey: 'exc-hero',
    ogImageAlt: IMAGES['exc-hero'].alt,
    preloadImageKey: 'exc-hero',
    body,
    schema: graph(
      spine(
        url,
        'Excursions Around Wilpattu | Raalmadu Wilpattu',
        'Excursions and historic sites within easy reach of Raalmadu Wilpattu.',
        largestSrc('exc-hero'),
        trail,
      ),
    ),
  };
}

/* ----------------------------------------------------------------- gallery */
export function galleryPage() {
  const path = '/gallery/';
  const url = abs(path);
  const trail = [{ name: 'Gallery', path }];
  const title = 'Gallery';

  const sections = [
    {
      kicker: 'The wildlife',
      title: 'What turns up without being asked',
      lead: 'Elephants at the pond, leopards in the park, peacocks on the lawn, and a long list of birds that treat the lodge garden as their own.',
      keys: ['gal-elephant', 'exp-leopard', 'gal-peacock', 'gal-crocodile', 'exp-birds', 'gal-monkey', 'gal-buffalo', 'gal-birds-2'],
    },
    {
      kicker: 'The lodge',
      title: 'Where you actually stay',
      lead: 'Villas, a glamping lodge, a family residence, and the terraces and quiet corners in between.',
      keys: ['gal-pool', 'room-pool-suite', 'room-family', 'room-double', 'dining-terrace', 'gal-terrace-view'],
    },
    {
      kicker: 'Food & kitchen',
      title: 'What the kitchen sends out',
      lead: 'Rice and curry, string hoppers at first light, and whatever the coast and the garden gave up that morning.',
      keys: ['dining-table', 'exp-cooking', 'gal-hoppers'],
    },
    {
      kicker: 'The place',
      title: 'Wilpattu and the country around it',
      lead: 'The Kala Oya lagoon, the villus of the park, the sandy tracks, the paddy and the light at the end of the day.',
      keys: ['hero-lodge', 'gal-grounds', 'gal-paddy', 'gal-safari', 'gal-villu', 'intro-lagoon', 'exp-lagoon', 'gal-sunset'],
    },
  ];

  const allKeys = sections.flatMap((s) => s.keys);

  const renderTile = (k) => `<figure class="gallery__item">
    <a href="${largestSrc(k)}" data-lightbox>
      ${media(k, { sizes: '(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 33vw' })}
    </a>
  </figure>`;

  const body = `
    ${pageHero({
      image: 'gal-elephant',
      kicker: 'Photographs',
      title,
      lead: 'The lodge, the lagoon and the wildlife that turns up without being asked.',
      trail,
    })}

    <div data-gallery>
      ${sections
        .map(
          (s, i) => `<section data-reveal class="section${i % 2 === 1 ? ' section--sand' : ''}">
            <div class="shell">
              ${sectionHead({ kicker: s.kicker, title: s.title, lead: s.lead, level: 2 })}
              <div class="gallery">
                ${s.keys.map(renderTile).join('')}
              </div>
            </div>
          </section>`,
        )
        .join('')}
    </div>

    <section class="section section--tight">
      <div class="shell">
        <p class="form-note form-note--center">
          Photography credits are listed on the <a href="/image-credits/">image credits</a> page.
        </p>
      </div>
    </section>

    ${ctaBand()}
  `;

  return {
    path,
    title,
    metaTitle: 'Photo Gallery | Raalmadu Wilpattu, Sri Lanka',
    metaDescription:
      'Photographs of Raalmadu Wilpattu: the pool, the rooms, the dining terrace and the elephants, leopards and birdlife around Wilpattu National Park.',
    ogImageKey: 'gal-elephant',
    ogImageAlt: IMAGES['gal-elephant'].alt,
    preloadImageKey: 'gal-elephant',
    body,
    schema: graph([
      ...spine(
        url,
        'Photo Gallery | Raalmadu Wilpattu',
        'Photographs of Raalmadu Wilpattu and the wildlife around Wilpattu National Park.',
        largestSrc('gal-elephant'),
        trail,
      ),
      imageGalleryNode(
        url,
        allKeys.map((k) => ({ src: largestSrc(k), alt: IMAGES[k].alt })),
      ),
    ]),
  };
}

/* ------------------------------------------------------------------ offers */
export function offersPage() {
  const path = '/offers/';
  const url = abs(path);
  const trail = [{ name: 'Offers', path }];
  const title = 'Offers';

  const body = `
    ${pageHero({
      image: 'gal-pool',
      kicker: 'Rates & packages',
      title,
      lead: 'Booked direct, these are the best rates we offer. No booking fees and no commission in the middle.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell">
        <div class="grid grid--3">
          ${offers
            .map(
              (o) => `<article class="offer" id="${esc(o.slug)}">
                <p class="offer__kicker">${esc(o.kicker)}</p>
                <h2>${esc(o.title)}</h2>
                <p>${esc(o.body)}</p>
                ${button(o.cta, '/booking/', 'primary')}
                <p class="offer__terms">${esc(o.terms)}</p>
              </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell shell--narrow">
        ${sectionHead({ kicker: 'Why book direct', title: 'It is cheaper for you and better for us', level: 2, align: 'center' })}
        <div class="facility">
          <ul>
            <li>No third-party commission, so the rate you see is the rate we keep</li>
            <li>Free cancellation on most rates</li>
            <li>Room and bed setup arranged before you arrive</li>
            <li>Safari, transfer and dietary requests handled in one conversation</li>
          </ul>
        </div>
        <p class="section-actions section-actions--center">
          ${button('Check availability', '/booking/', 'primary')}
        </p>
      </div>
    </section>

    ${ctaBand({ title: 'Ready when you are' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Offers & Packages | Raalmadu Wilpattu',
    metaDescription:
      'Direct-booking offers at Raalmadu Wilpattu: a two-night Safari & Stay package, stay four nights and pay for three, and whole-lodge rates for groups of up to ten.',
    ogImageKey: 'gal-pool',
    ogImageAlt: IMAGES['gal-pool'].alt,
    preloadImageKey: 'gal-pool',
    body,
    schema: graph(
      spine(
        url,
        'Offers & Packages | Raalmadu Wilpattu',
        'Direct-booking offers and packages at Raalmadu Wilpattu.',
        largestSrc('gal-pool'),
        trail,
      ),
    ),
  };
}

/* ----------------------------------------------------------------- contact */
// Contact details, the enquiry form and directions on one page. Location used
// to be its own page; /location/ now 301s here (see build.js redirects).
export function contactPage() {
  const path = '/contact/';
  const url = abs(path);
  const trail = [{ name: 'Contact', path }];
  const title = 'Contact & getting here';
  const whatsappHref = site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`
    : '';

  const journeys = [
    { icon: 'car', from: 'From Colombo', time: 'About 4 hours', note: 'By road via Puttalam' },
    { icon: 'plane', from: 'From the airport (CMB)', time: 'About 3.5 hours', note: 'Transfers arranged on request' },
    { icon: 'stupa', from: 'From Anuradhapura', time: 'About 2 hours', note: 'A good pairing with the cultural triangle' },
    { icon: 'track', from: 'The last stretch', time: 'Unsealed track', note: 'Tuk-tuk or 4×4 recommended' },
  ];

  const body = `
    ${pageHero({
      image: 'location-map',
      kicker: 'Reservations & directions',
      title,
      lead: 'Write to us, call, or come and find us at Eluwankulam on the edge of Wilpattu National Park. We answer every enquiry ourselves, usually the same day.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell">
        <ul class="reach">
          <li class="reach__item">
            <span class="feature__badge reach__badge">${icon('phone')}</span>
            <h2 class="reach__label">Call us</h2>
            <p class="reach__value">${esc(site.contact.phone)}</p>
            <a class="reach__action" href="tel:${esc(site.contact.phoneHref)}">Call now<span class="visually-hidden"> on ${esc(site.contact.phone)}</span></a>
          </li>
          ${
            whatsappHref
              ? `<li class="reach__item">
            <span class="feature__badge reach__badge">${icon('chat')}</span>
            <h2 class="reach__label">WhatsApp</h2>
            <p class="reach__value">Message us any time</p>
            <a class="reach__action" href="${esc(whatsappHref)}" rel="noopener">Open chat<span class="visually-hidden"> on WhatsApp</span></a>
          </li>`
              : ''
          }
          <li class="reach__item">
            <span class="feature__badge reach__badge">${icon('mail')}</span>
            <h2 class="reach__label">Email us</h2>
            <p class="reach__value">${esc(site.contact.email)}</p>
            <a class="reach__action" href="mailto:${esc(site.contact.email)}">Send email<span class="visually-hidden"> to ${esc(site.contact.email)}</span></a>
          </li>
          <li class="reach__item">
            <span class="feature__badge reach__badge">${icon('pin')}</span>
            <h2 class="reach__label">Find us</h2>
            <p class="reach__value">${esc(site.address.locality)}, ${esc(site.address.district)}</p>
            <a class="reach__action" href="#getting-here">Directions<span class="visually-hidden"> to the lodge</span></a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--tight" id="enquire">
      <div class="shell">
        <div class="enquire">
        <aside class="enquire__panel" aria-labelledby="enquire-title">
          <p class="kicker">Plan your stay</p>
          <h2 id="enquire-title">Tell us about your <span class="accent">trip</span></h2>
          <p>
            Every enquiry is answered by the people who run the lodge, usually the same day.
            Tell us roughly when and how many, and we will come back with availability, rates
            and a plan for the safari.
          </p>
          <ul class="enquire__facts">
            <li>${icon('clock')}<span><strong>Check in ${site.policies.checkIn}</strong> Check out ${site.policies.checkOut}</span></li>
            <li>${icon('globe')}<span><strong>We speak</strong> ${site.contact.languages.map(esc).join(', ')}</span></li>
            <li>${icon('tick')}<span><strong>${esc(site.policies.cancellation)}</strong> Confirmed in writing when you book</span></li>
            <li>${icon('tag')}<span><strong>No booking fees</strong> Book direct and the rate goes to the lodge</span></li>
          </ul>
          <p class="enquire__more">
            Know your dates? <a href="/booking/">Check availability</a>.
            Practical questions? <a href="/faq/">Read the FAQ</a>.
          </p>
          <p class="enquire__operator">Managed by ${esc(site.operator.name)}, ${esc(site.operator.street)}, ${esc(site.operator.locality)}</p>
        </aside>

        <div class="contact-form-card">
          <h3 class="contact-form-card__title">Send an enquiry</h3>
          <p class="form-note">
            Fields marked * are required. We only use your details to answer you; see our
            <a href="/privacy-policy/">privacy policy</a>.
          </p>

          <form class="enquiry-form" action="${esc(site.forms.action || '/contact/')}" method="post" data-contact-form${
            site.forms.provider === 'netlify' ? ' data-netlify="true" netlify-honeypot="bot-field"' : ''
          }>
            ${site.forms.provider === 'netlify' ? '<input type="hidden" name="form-name" value="contact">' : ''}
            <p class="visually-hidden" aria-hidden="true">
              <label>Leave this field empty<input name="bot-field" tabindex="-1" autocomplete="off"></label>
            </p>
            <div class="field">
              <label for="c-name">Your name *</label>
              <input type="text" id="c-name" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="c-email">Email address *</label>
              <input type="email" id="c-email" name="email" autocomplete="email" required>
            </div>
            <div class="field">
              <label for="c-phone">Phone or WhatsApp</label>
              <input type="tel" id="c-phone" name="phone" autocomplete="tel">
            </div>
            <div class="field">
              <label for="c-guests">Number of guests</label>
              <select id="c-guests" name="guests">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n}</option>`)
                  .join('')}
                <option value="more than 10">More than 10</option>
              </select>
            </div>
            <div class="field field--wide">
              <label for="c-dates">Dates you have in mind</label>
              <input type="text" id="c-dates" name="dates" placeholder="e.g. 12–15 March, or “sometime in April”">
            </div>
            <fieldset class="field field--wide chips">
              <legend>I am interested in</legend>
              ${['Safari drive', 'Birdwatching', 'Lagoon boat trip', 'Cooking session', 'Airport transfer', 'Whole-lodge booking']
                .map(
                  (c) => `<label class="chip"><input type="checkbox" name="interests" value="${esc(c)}"><span>${esc(c)}</span></label>`,
                )
                .join('')}
            </fieldset>
            <div class="field field--wide">
              <label for="c-message">Message *</label>
              <textarea id="c-message" name="message" required></textarea>
              <span class="field__hint">Dietary needs, arrival time, anything else we should know.</span>
            </div>
            <div class="field--wide enquiry-form__submit">
              <button class="btn btn--primary" type="submit">Send enquiry ${icon('arrow')}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </section>

    <section class="section section--feature gateway" id="getting-here">
      <div class="shell gateway__grid">
        <div>
          ${sectionHead({
            kicker: 'Getting here',
            title: 'Where the lodge is',
            lead: 'In the North Western Province near Eluwankulam, on the southern boundary of Wilpattu National Park.',
            level: 2,
          })}
          <p>
            It is genuinely remote: the last stretch of road is unsealed, and most guests
            arrive by tuk-tuk or in a high-clearance vehicle. Tell us your arrival time when
            you book and we will either arrange a transfer or meet you at the turn-off. Do not
            rely on a standard taxi making the final few kilometres.
          </p>
          <ol class="routes">
            ${journeys
              .map(
                (j) => `<li class="route">
                <span class="route__icon">${icon(j.icon)}</span>
                <h3 class="route__from">${esc(j.from)}</h3>
                <p class="route__time">${esc(j.time)}</p>
                <p class="route__note">${esc(j.note)}</p>
              </li>`,
              )
              .join('')}
          </ol>
          <p>${button('Open in Google Maps', site.mapUrl, 'ghost', 'rel="noopener noreferrer" target="_blank"')}</p>
        </div>
        <figure class="gateway__map">
          ${gatewayMap()}
          <figcaption>Not to scale &mdash; a sketch of where the lodge sits.</figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell shell--narrow">
        ${sectionHead({ kicker: 'Distances', title: 'How far is everything?', level: 2 })}
        <ul class="distances">
          ${site.distances
            .map(
              (d) => `<li class="distance">
              <span class="distance__label">${esc(d.label)}</span>
              <span class="distance__leader" aria-hidden="true"></span>
              <span class="distance__value">${/^approx\./.test(d.value) ? '<span class="distance__approx">approx.</span> ' : ''}${esc(d.value.replace(/^approx\.\s*/, ''))}</span>
            </li>`,
            )
            .join('')}
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        ${sectionHead({
          kicker: 'Nearby',
          title: 'What else is within reach',
          lead: 'More ideas, with eleven historic sites within 30 km, are on our About page.',
          level: 2,
        })}
        <div class="grid grid--3">
          <div class="amenity">
            <span class="amenities__icon">${icon('binoculars')}</span>
            <h3>Wilpattu National Park</h3>
            <p>The oldest and largest park in Sri Lanka, known for leopard, sloth bear and its chain of natural villu lakes. We run drives from the nearest gate.</p>
          </div>
          <div class="amenity">
            <span class="amenities__icon">${icon('river')}</span>
            <h3>Kala Oya estuary</h3>
            <p>One of the densest mangrove systems in the country, and the best place nearby for kingfishers and crocodiles.</p>
          </div>
          <div class="amenity">
            <span class="amenities__icon">${icon('stupa')}</span>
            <h3>Anuradhapura</h3>
            <p>A UNESCO World Heritage city of ancient stupas and monasteries, about two hours east. An easy day trip or a natural next stop.</p>
          </div>
        </div>
        <p class="section-actions">${button('See what is nearby', '/excursions/#nearby', 'ghost')}</p>
      </div>
    </section>

    ${ctaBand({ title: 'Or just book', text: 'If you already know your dates, go straight to availability.' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Contact, Location & Directions | Raalmadu Wilpattu',
    metaDescription:
      'Call, email or WhatsApp Raalmadu Wilpattu, send an enquiry, and get directions to our lodge at Eluwankulam on the edge of Wilpattu National Park.',
    ogImageKey: 'location-map',
    ogImageAlt: IMAGES['location-map'].alt,
    preloadImageKey: 'location-map',
    body,
    schema: graph([
      hotelNode('/assets/img/og-default.jpg'),
      ...spine(
        url,
        'Contact, Location & Directions | Raalmadu Wilpattu',
        'Contact details, enquiry form and directions for Raalmadu Wilpattu.',
        largestSrc('location-map'),
        trail,
      ),
      {
        '@type': 'ContactPage',
        '@id': `${url}#contactpage`,
        url,
        name: 'Contact Raalmadu Wilpattu',
        about: { '@id': `${site.url}/#hotel` },
      },
    ]),
  };
}

/* --------------------------------------------------------------------- FAQ */
export function faqPage() {
  const path = '/faq/';
  const url = abs(path);
  const trail = [{ name: 'FAQ', path }];
  const title = 'Frequently asked questions';

  const body = `
    ${pageHero({
      image: 'gal-paddy',
      kicker: 'Good to know',
      title,
      lead: 'The practical things guests ask before they book: roads, wildlife, meals and timing.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell shell--narrow">
        ${accordion(faqs)}
        <p class="form-note section-actions">
          Still unsure about something? <a href="/contact/">Ask us directly</a>. We answer
          every message ourselves.
        </p>
      </div>
    </section>

    ${ctaBand()}
  `;

  return {
    path,
    title,
    metaTitle: 'Frequently Asked Questions | Raalmadu Wilpattu',
    metaDescription:
      'Answers about reaching Raalmadu Wilpattu, check-in times, wildlife around the lodge, Wilpattu safaris, meals, connectivity and the best time of year to visit.',
    ogImageKey: 'gal-paddy',
    ogImageAlt: IMAGES['gal-paddy'].alt,
    preloadImageKey: 'gal-paddy',
    body,
    schema: graph([
      ...spine(
        url,
        'Frequently Asked Questions | Raalmadu Wilpattu',
        'Practical answers about staying at Raalmadu Wilpattu.',
        largestSrc('gal-paddy'),
        trail,
      ),
      faqNode(url, faqs),
    ]),
  };
}

/* ----------------------------------------------------------------- booking */
export function bookingPage() {
  const path = '/booking/';
  const url = abs(path);
  const trail = [{ name: 'Book', path }];
  const title = 'Check availability';

  const body = `
    ${plainHero({
      kicker: 'Reservations',
      title,
      lead: 'Choose your dates below. Booking is confirmed by us directly, with no booking fees on a direct reservation.',
      trail,
    })}

    <section class="section section--tight" style="padding-top:0">
      <div class="shell shell--narrow">
        ${bookingWidget()}

        <div id="booking-engine" class="booking-next" data-booking-engine>
          <h2>Your dates</h2>
          <p class="form-note" data-booking-summary>
            Pick your dates above to see availability.
          </p>

          <div class="facility">
            <h3>What happens next</h3>
            <ul>
              <li>We confirm availability for your dates and room</li>
              <li>You receive a rate, including breakfast and any safari you have asked for</li>
              <li>Free cancellation applies to most rates</li>
              <li>Payment is taken on arrival, by card or cash</li>
            </ul>
          </div>

          <p class="section-actions">
            ${button('Send an enquiry instead', '/contact/', 'ghost')}
          </p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Rooms', title: 'What you can book', level: 2 })}
        <ul class="info-list">
          ${rooms
            .map(
              (r) =>
                `<li><strong><a href="/rooms/${esc(r.slug)}/">${esc(r.name)}</a></strong><span>Sleeps ${r.maxGuests} &middot; ${r.rateFrom != null ? `from $${r.rateFrom} per night` : 'rates on request'}</span></li>`,
            )
            .join('')}
        </ul>
        <p class="section-actions">
          Looking for a package? See the current <a href="/offers/">offers</a>.
        </p>
      </div>
    </section>
  `;

  return {
    path,
    title,
    metaTitle: 'Check Availability & Book | Raalmadu Wilpattu',
    metaDescription:
      'Check availability and book directly at Raalmadu Wilpattu near Wilpattu National Park. No booking fees, free cancellation on most rates, breakfast included.',
    body,
    schema: graph(
      spine(
        url,
        'Check Availability & Book | Raalmadu Wilpattu',
        'Book a room directly at Raalmadu Wilpattu.',
        '/assets/img/og-default.jpg',
        trail,
      ),
    ),
  };
}

/* ---------------------------------------------------------- image credits */
export function imageCreditsPage(credits) {
  const path = '/image-credits/';
  const url = abs(path);
  const trail = [{ name: 'Image credits', path }];
  const title = 'Image credits';

  const rows = Object.entries(credits);

  const body = `
    ${plainHero({
      kicker: 'Photography',
      title,
      lead: 'Placeholder photography used on this site while the property’s own photographs are being prepared.',
      trail,
    })}

    <section class="section section--tight" style="padding-top:0">
      <div class="shell shell--narrow prose">
        <p>
          The images below are licensed for commercial reuse under Creative Commons
          licences. Each is credited to its photographer as the licence requires. They are
          stand-ins for Raalmadu Wilpattu’s own photography and will be replaced.
        </p>
        ${
          rows.length
            ? `<table class="specs">
                <caption class="visually-hidden">Photographer and licence for each image</caption>
                <thead>
                  <tr><th scope="col">Image</th><th scope="col">Credit</th></tr>
                </thead>
                <tbody>
                  ${rows
                    .map(
                      ([key, c]) => `<tr>
                        <th scope="row">${esc(key)}</th>
                        <td>
                          ${c.creatorUrl ? `<a href="${esc(c.creatorUrl)}" rel="noopener nofollow" target="_blank">${esc(c.creator)}</a>` : esc(c.creator)}
                          &middot; ${c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" rel="noopener nofollow license" target="_blank">${esc(c.license)}</a>` : esc(c.license)}
                          ${c.source ? `<br><a href="${esc(c.source)}" rel="noopener nofollow" target="_blank">Source</a>` : ''}
                        </td>
                      </tr>`,
                    )
                    .join('')}
                </tbody>
              </table>`
            : '<p>No third-party images are currently in use.</p>'
        }
        <p>
          Any image not listed above is a generated graphic produced for this site and
          carries no third-party rights.
        </p>
      </div>
    </section>
  `;

  return {
    path,
    title,
    metaTitle: 'Image Credits | Raalmadu Wilpattu',
    metaDescription:
      'Photographer credits and Creative Commons licence details for the placeholder photography currently used on the Raalmadu Wilpattu website.',
    body,
    schema: graph(
      spine(
        url,
        'Image Credits | Raalmadu Wilpattu',
        'Photography credits for the Raalmadu Wilpattu website.',
        '/assets/img/og-default.jpg',
        trail,
      ),
    ),
  };
}

/* ------------------------------------------------------------------- legal */
export function privacyPage() {
  const path = '/privacy-policy/';
  const url = abs(path);
  const trail = [{ name: 'Privacy policy', path }];
  const title = 'Privacy policy';

  const body = `
    ${plainHero({ kicker: 'Legal', title, trail })}
    <section class="section section--tight" style="padding-top:0">
      <div class="shell shell--narrow prose">
        <p><strong>Last updated:</strong> ${new Date().toISOString().slice(0, 10)}</p>
        <p>
          ${esc(site.name)} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
          policy explains what we collect when you use this website and what we do with it.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Enquiry details.</strong> When you send an enquiry or booking request we collect your name, email address, phone number, travel dates and anything you write in your message.</li>
          <li><strong>Technical data.</strong> Our host records standard server logs, including IP address, browser type and the pages requested.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To answer your enquiry and manage your reservation</li>
          <li>To arrange services you have asked for, such as safaris and transfers</li>
          <li>To keep the website secure and working correctly</li>
        </ul>
        <p>We do not sell your data, and we do not send marketing email unless you ask us to.</p>

        <h2>Who we share it with</h2>
        <p>
          Only where it is needed to deliver your stay: for example passing your arrival
          time to a driver, or your dates to our booking system. Those parties may only use
          the information for that purpose.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Enquiry correspondence is kept for up to two years. Reservation records are kept
          for as long as local tax and accounting rules require.
        </p>

        <h2>Cookies</h2>
        <p>
          This site sets no advertising or tracking cookies. It remembers your answer to the
          cookie notice in your browser&rsquo;s local storage so it isn&rsquo;t shown again;
          you can change it any time from &ldquo;Cookie settings&rdquo; in the footer.
        </p>
        <p>
          When you open the booking window, our booking engine (ibooking.live) runs inside
          the page and stores your room selection in your browser so the booking can be
          completed. Links to Booking.com and Tripadvisor take you to those sites, which set
          their own cookies under their own policies. If analytics are added in future, this
          policy will be updated first and the cookie notice will ask before anything loads.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us for a copy of the information we hold about you, ask us to correct
          it, or ask us to delete it. Write to
          <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          ${esc(site.name)}, ${esc(site.address.line)}, managed by ${esc(site.operator.name)}.
          Email <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.
        </p>
      </div>
    </section>
  `;

  return {
    path,
    title,
    metaTitle: 'Privacy Policy | Raalmadu Wilpattu',
    metaDescription:
      'How Raalmadu Wilpattu collects, uses and protects the personal information you provide through enquiries and bookings on this website.',
    body,
    schema: graph(
      spine(url, 'Privacy Policy | Raalmadu Wilpattu', 'Privacy policy for the Raalmadu Wilpattu website.', '/assets/img/og-default.jpg', trail),
    ),
  };
}

export function termsPage() {
  const path = '/terms/';
  const url = abs(path);
  const trail = [{ name: 'Terms & conditions', path }];
  const title = 'Terms & conditions';

  const body = `
    ${plainHero({ kicker: 'Legal', title, trail })}
    <section class="section section--tight" style="padding-top:0">
      <div class="shell shell--narrow prose">
        <p><strong>Last updated:</strong> ${new Date().toISOString().slice(0, 10)}</p>

        <h2>Bookings</h2>
        <p>
          A booking is confirmed only once we have replied to you in writing. Rates quoted
          are per room per night and include breakfast unless stated otherwise.
        </p>

        <h2>Check in and check out</h2>
        <p>
          Check-in is from ${site.policies.checkIn} and check-out is until
          ${site.policies.checkOut}. Early check-in and late check-out are subject to
          availability. The minimum age to check in is ${site.policies.minCheckInAge}.
        </p>

        <h2>Cancellation</h2>
        <p>
          ${esc(site.policies.cancellation)}. The exact terms that apply to your reservation
          are confirmed in writing at the time of booking. Cancellations should be sent to
          <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.
        </p>

        <h2>Payment</h2>
        <p>
          Payment is taken on arrival unless otherwise agreed. We accept cash and card, and
          quote in Sri Lankan rupees, US dollars or euros.
        </p>

        <h2>House rules</h2>
        <ul>
          <li>All rooms are non-smoking</li>
          <li>Pets are not allowed, because of the wildlife around the property</li>
          <li>Please do not feed or approach any wild animal on or near the property</li>
          <li>Children are welcome and must be supervised around the pool and the water at all times</li>
        </ul>

        <h2>Safaris and excursions</h2>
        <p>
          Safaris, boat trips and transfers are arranged with independent local operators
          on your behalf. Park fees and permits are set by the Department of Wildlife
          Conservation and may change. Wildlife sightings can never be guaranteed.
        </p>

        <h2>Liability</h2>
        <p>
          The lodge sits in a wild area. Guests take part in activities at their own risk
          and are responsible for their own belongings. Nothing here limits liability that
          cannot be limited under Sri Lankan law.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the law of Sri Lanka.</p>
      </div>
    </section>
  `;

  return {
    path,
    title,
    metaTitle: 'Terms & Conditions | Raalmadu Wilpattu',
    metaDescription:
      'Booking terms, cancellation policy, payment, house rules and excursion conditions for stays at Raalmadu Wilpattu near Wilpattu National Park, Sri Lanka.',
    body,
    schema: graph(
      spine(url, 'Terms & Conditions | Raalmadu Wilpattu', 'Booking terms and house rules for Raalmadu Wilpattu.', '/assets/img/og-default.jpg', trail),
    ),
  };
}

/* --------------------------------------------------------------------- 404 */
export function notFoundPage() {
  const body = `
    <section class="error-page">
      <div class="shell shell--narrow">
        <p class="kicker">Error 404</p>
        <h1>That page has wandered off</h1>
        <p class="section-lead">
          The link may be old, or the address slightly wrong. Here is the way back.
        </p>
        <p class="section-actions error-page__actions">
          ${button('Back to the home page', '/', 'primary')}
          ${button('See the rooms', '/rooms/', 'ghost')}
          ${button('Contact us', '/contact/', 'ghost')}
        </p>
      </div>
    </section>
  `;

  return {
    path: '/404.html',
    title: 'Page not found',
    metaTitle: 'Page Not Found | Raalmadu Wilpattu',
    metaDescription:
      'The page you were looking for could not be found. Return to the Raalmadu Wilpattu home page, browse the rooms, or get in touch with us.',
    noindex: true,
    excludeFromSitemap: true,
    body,
    schema: null,
  };
}
