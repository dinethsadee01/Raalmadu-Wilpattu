import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import { facilities, experiences, offers, faqs } from '../data/content.js';
import { IMAGES } from '../data/images.js';
import { esc, media, button, sectionHead, bookingWidget, largestSrc } from '../lib/components.js';
import { pageHero, plainHero, ctaBand, accordion } from '../lib/sections.js';
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
        <div>
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
            <a href="/rooms/suite-with-private-pool/">pool</a>.
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
        <div>
          ${media('dining-table', { sizes: '(max-width: 860px) 100vw, 50vw' })}
          <div style="margin-top:var(--sp-4)">
            ${media('exp-cooking', { sizes: '(max-width: 860px) 100vw, 50vw' })}
          </div>
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
    ogImage: '/assets/img/dining-terrace-1200.jpg',
    ogImageAlt: IMAGES['dining-terrace'].alt,
    preloadImageKey: 'dining-terrace',
    body,
    schema: graph(
      spine(
        url,
        'Dining | Raalmadu Wilpattu',
        'Sri Lankan home cooking at Raalmadu Wilpattu.',
        '/assets/img/dining-terrace-1200.jpg',
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
      image: 'exp-leopard',
      kicker: 'Things to do',
      title,
      lead: 'Safari drives, birdwatching, mangrove boats and a cooking session, all arranged at the lodge, all using local guides.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell">
        ${experiences
          .map(
            (x, i) => `<article class="split${i % 2 ? ' split--reverse' : ''}" id="${esc(x.slug)}" style="margin-bottom:var(--sp-9)">
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

    <section class="section section--ink">
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
    ogImage: '/assets/img/exp-leopard-1200.jpg',
    ogImageAlt: IMAGES['exp-leopard'].alt,
    preloadImageKey: 'exp-leopard',
    body,
    schema: graph(
      spine(
        url,
        'Wilpattu Safari & Experiences | Raalmadu Wilpattu',
        'Safaris, birdwatching, mangrove trips and cooking sessions at Raalmadu Wilpattu.',
        '/assets/img/exp-leopard-1200.jpg',
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
      lead: 'Three rooms, one pool, and the terraces and quiet corners in between.',
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
      keys: ['hero-lodge', 'gal-jungle-path', 'gal-paddy', 'gal-safari', 'gal-villu', 'intro-lagoon', 'exp-lagoon', 'gal-sunset'],
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
        <p class="form-note" style="text-align:center">
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
    ogImage: '/assets/img/gal-elephant-1200.jpg',
    ogImageAlt: IMAGES['gal-elephant'].alt,
    preloadImageKey: 'gal-elephant',
    body,
    schema: graph([
      ...spine(
        url,
        'Photo Gallery | Raalmadu Wilpattu',
        'Photographs of Raalmadu Wilpattu and the wildlife around Wilpattu National Park.',
        '/assets/img/gal-elephant-1200.jpg',
        trail,
      ),
      imageGalleryNode(
        url,
        allKeys.map((k) => ({ src: `/assets/img/${k}-1200.jpg`, alt: IMAGES[k].alt })),
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
        <p style="text-align:center;margin-top:var(--sp-6)">
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
    ogImage: '/assets/img/gal-pool-1200.jpg',
    ogImageAlt: IMAGES['gal-pool'].alt,
    preloadImageKey: 'gal-pool',
    body,
    schema: graph(
      spine(
        url,
        'Offers & Packages | Raalmadu Wilpattu',
        'Direct-booking offers and packages at Raalmadu Wilpattu.',
        '/assets/img/gal-pool-1200.jpg',
        trail,
      ),
    ),
  };
}

/* ---------------------------------------------------------------- location */
export function locationPage() {
  const path = '/location/';
  const url = abs(path);
  const trail = [{ name: 'Location', path }];
  const title = 'Location & getting here';
  const mapQuery = `${site.geo.lat},${site.geo.lng}`;

  const body = `
    ${pageHero({
      image: 'location-map',
      kicker: 'Finding us',
      title,
      lead: 'On Raalmadu Road at Achchamulai, where the Kala Oya meets the edge of Wilpattu National Park.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split">
        <div>
          <h2>Where the lodge is</h2>
          <p>
            Raalmadu Wilpattu is in the North Western Province, near Eluwankulama, on the
            southern boundary of <a href="/experiences/#wilpattu-safari">Wilpattu National
            Park</a>. It is genuinely remote: the last stretch of Raalmadu Road is unsealed,
            and most guests arrive by tuk-tuk or in a high-clearance vehicle.
          </p>
          <p>
            Tell us your arrival time when you book and we will either arrange a transfer
            or meet you at the turn-off. Do not rely on a standard taxi making the final
            few kilometres.
          </p>

          <h3>Distances</h3>
          <ul class="info-list">
            ${site.distances
              .map(
                (d) => `<li><strong>${esc(d.label)}</strong><span>${esc(d.value)}</span></li>`,
              )
              .join('')}
          </ul>

          <p style="margin-top:var(--sp-5)">
            ${button('Open in Google Maps', `https://www.google.com/maps/search/?api=1&query=${mapQuery}`, 'ghost', 'rel="noopener noreferrer" target="_blank"')}
          </p>
        </div>

        <div>
          ${media('gal-paddy', { sizes: '(max-width: 860px) 100vw, 50vw' })}
          <div style="margin-top:var(--sp-5)">
            <h3>Getting here</h3>
            <table class="specs">
              <caption class="visually-hidden">Travel options to Raalmadu Wilpattu</caption>
              <tbody>
                <tr><th scope="row">From Colombo</th><td>About 4 hours by road via Puttalam</td></tr>
                <tr><th scope="row">From the airport (CMB)</th><td>About 3.5 hours; transfers arranged on request</td></tr>
                <tr><th scope="row">From Anuradhapura</th><td>About 2 hours, a good pairing with the cultural triangle</td></tr>
                <tr><th scope="row">Last stretch</th><td>Unsealed track. Tuk-tuk or 4×4 recommended.</td></tr>
                <tr><th scope="row">Address</th><td>${esc(site.address.street)}, ${esc(site.address.locality)} ${esc(site.address.postalCode)}, ${esc(site.address.country)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Nearby', title: 'What else is within reach', level: 2 })}
        <div class="grid grid--3">
          <div class="pillar">
            <h3>Wilpattu National Park</h3>
            <p>The oldest and largest park in Sri Lanka, known for leopard, sloth bear and its chain of natural villu lakes. We run drives from the nearest gate.</p>
          </div>
          <div class="pillar">
            <h3>Kala Oya estuary</h3>
            <p>One of the densest mangrove systems in the country, and the best place nearby for kingfishers and crocodiles.</p>
          </div>
          <div class="pillar">
            <h3>Anuradhapura</h3>
            <p>A UNESCO World Heritage city of ancient stupas and monasteries, about two hours east. An easy day trip or a natural next stop.</p>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand({ image: 'location-map' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Location & Directions | Raalmadu Wilpattu, Sri Lanka',
    metaDescription:
      'How to reach Raalmadu Wilpattu at Achchamulai near Eluwankulama: 3.5 hours from Colombo airport, on the southern edge of Wilpattu National Park. Transfers arranged.',
    ogImage: '/assets/img/location-map-1200.jpg',
    ogImageAlt: IMAGES['location-map'].alt,
    preloadImageKey: 'location-map',
    body,
    schema: graph(
      spine(
        url,
        'Location & Directions | Raalmadu Wilpattu',
        'Directions and distances for Raalmadu Wilpattu near Wilpattu National Park.',
        '/assets/img/location-map-1200.jpg',
        trail,
      ),
    ),
  };
}

/* ----------------------------------------------------------------- contact */
export function contactPage() {
  const path = '/contact/';
  const url = abs(path);
  const trail = [{ name: 'Contact', path }];
  const title = 'Contact us';

  const body = `
    ${pageHero({
      image: 'intro-lagoon',
      kicker: 'Reservations & enquiries',
      title,
      lead: 'Write to us directly. We answer every enquiry ourselves, usually the same day.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell contact-grid">
        <div>
          <h2>Send an enquiry</h2>
          <p class="form-note">
            Fields marked with an asterisk are required. We will only use your details to
            answer your enquiry. See our <a href="/privacy-policy/">privacy policy</a>.
          </p>

          <form action="${esc(site.forms.action || '/contact/')}" method="post" data-contact-form${
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
              <label for="c-dates">Dates you have in mind</label>
              <input type="text" id="c-dates" name="dates" placeholder="e.g. 12–15 March">
            </div>
            <div class="field">
              <label for="c-guests">Number of guests</label>
              <select id="c-guests" name="guests">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="c-message">Message *</label>
              <textarea id="c-message" name="message" required></textarea>
              <span class="field__hint">Tell us about safaris, dietary needs, transfers, anything at all.</span>
            </div>
            <button class="btn btn--primary" type="submit">Send enquiry</button>
          </form>
        </div>

        <div>
          <h2>Direct details</h2>
          <ul class="info-list">
            <li><strong>Phone</strong><span><a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></span></li>
            <li><strong>Email</strong><span><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></span></li>
            <li><strong>Address</strong><span>${esc(site.address.street)}, ${esc(site.address.locality)} ${esc(site.address.postalCode)}</span></li>
            <li><strong>Check in</strong><span>${site.policies.checkIn}</span></li>
            <li><strong>Check out</strong><span>${site.policies.checkOut}</span></li>
            <li><strong>Languages</strong><span>${site.contact.languages.map(esc).join(', ')}</span></li>
          </ul>

          <h3 style="margin-top:var(--sp-6)">Check availability now</h3>
          ${bookingWidget({ compact: true })}

          <h3 style="margin-top:var(--sp-6)">Common questions</h3>
          <p>
            Most practical questions (transfers, wildlife, meals, the state of the road)
            are answered on our <a href="/faq/">frequently asked questions</a> page.
          </p>
        </div>
      </div>
    </section>

    ${ctaBand({ title: 'Or just book', text: 'If you already know your dates, go straight to availability.' })}
  `;

  return {
    path,
    title,
    metaTitle: 'Contact & Reservations | Raalmadu Wilpattu',
    metaDescription:
      'Contact Raalmadu Wilpattu directly for reservations, safari bookings, airport transfers and dietary requests. We reply to every enquiry the same day.',
    ogImage: '/assets/img/intro-lagoon-1200.jpg',
    ogImageAlt: IMAGES['intro-lagoon'].alt,
    preloadImageKey: 'intro-lagoon',
    body,
    schema: graph([
      hotelNode('/assets/img/og-default.jpg'),
      ...spine(
        url,
        'Contact & Reservations | Raalmadu Wilpattu',
        'Contact details and enquiry form for Raalmadu Wilpattu.',
        '/assets/img/intro-lagoon-1200.jpg',
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
      image: 'gal-jungle-path',
      kicker: 'Good to know',
      title,
      lead: 'The practical things guests ask before they book: roads, wildlife, meals and timing.',
      trail,
    })}

    <section class="section section--tight">
      <div class="shell shell--narrow">
        ${accordion(faqs)}
        <p class="form-note" style="margin-top:var(--sp-6)">
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
    ogImage: '/assets/img/gal-jungle-path-1200.jpg',
    ogImageAlt: IMAGES['gal-jungle-path'].alt,
    preloadImageKey: 'gal-jungle-path',
    body,
    schema: graph([
      ...spine(
        url,
        'Frequently Asked Questions | Raalmadu Wilpattu',
        'Practical answers about staying at Raalmadu Wilpattu.',
        '/assets/img/gal-jungle-path-1200.jpg',
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

        <div id="booking-engine" data-booking-engine style="margin-top:var(--sp-7)">
          <h2>Your dates</h2>
          <p class="form-note" data-booking-summary>
            Pick your dates above to see availability.
          </p>

          <div class="facility" style="margin-top:var(--sp-5)">
            <h3>What happens next</h3>
            <ul>
              <li>We confirm availability for your dates and room</li>
              <li>You receive a rate, including breakfast and any safari you have asked for</li>
              <li>Free cancellation applies to most rates</li>
              <li>Payment is taken on arrival, by card or cash</li>
            </ul>
          </div>

          <p style="margin-top:var(--sp-6)">
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
                `<li><strong><a href="/rooms/${esc(r.slug)}/">${esc(r.name)}</a></strong><span>Sleeps ${r.maxGuests} &middot; from $${r.rateFrom} per night</span></li>`,
            )
            .join('')}
        </ul>
        <p style="margin-top:var(--sp-5)">
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
          This site sets no advertising or tracking cookies. If analytics are added in
          future, this policy will be updated first and a consent notice will be shown.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us for a copy of the information we hold about you, ask us to correct
          it, or ask us to delete it. Write to
          <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          ${esc(site.name)}, ${esc(site.address.street)}, ${esc(site.address.locality)}
          ${esc(site.address.postalCode)}, ${esc(site.address.country)}.
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
        <p style="margin-top:var(--sp-6);display:flex;gap:var(--sp-3);justify-content:center;flex-wrap:wrap">
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
