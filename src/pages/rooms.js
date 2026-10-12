import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import { IMAGES } from '../data/images.js';
import {
  esc,
  media,
  button,
  sectionHead,
  roomCard,
  roomPrice,
  bookingWidget,
  largestSrc,
} from '../lib/components.js';
import { pageHero, ctaBand } from '../lib/sections.js';
import {
  graph,
  hotelRef,
  webPageNode,
  breadcrumbNode,
  roomNode,
  abs,
} from '../lib/schema.js';

const TRAIL = [{ name: 'Accommodation', path: '/rooms/' }];

const unitLabel = (r) => `${r.units} unit${r.units > 1 ? 's' : ''}`;

/** One alternating image/text row per room type, after the owner's sheet. */
function stayRow(room, i) {
  const url = `/rooms/${room.slug}/`;
  return `<article class="stay-row${i % 2 ? ' stay-row--flip' : ''}" id="${esc(room.slug)}" data-reveal>
      <a class="stay-row__media" href="${url}" tabindex="-1" aria-hidden="true">
        ${media(room.image, { sizes: '(max-width: 860px) 100vw, 55vw' })}
        <span class="stay-row__badge">${esc(unitLabel(room))}</span>
      </a>
      <div class="stay-row__body">
        <p class="stay-row__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
        <h2 class="stay-row__title"><a href="${url}">${esc(room.name)}</a></h2>
        <ul class="card__facts">
          <li>${esc(unitLabel(room))}</li>
          <li>Sleeps ${room.maxGuests}</li>
          <li>${esc(room.beds)}</li>
        </ul>
        <p class="stay-row__summary">${esc(room.summary)}</p>
        <ul class="ticks">${room.amenities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
        <div class="stay-row__foot">
          ${roomPrice(room)}
          <span class="stay-row__actions">
            <a class="btn btn--ghost" href="${url}">View details<span class="visually-hidden"> of the ${esc(room.shortName)}</span></a>
            ${button('Check availability', `/booking/?room=${room.slug}`, 'primary')}
          </span>
        </div>
      </div>
    </article>`;
}

export function roomsIndexPage() {
  const url = abs('/rooms/');
  const title = 'Accommodation';
  const cap = site.policies.capacity;

  const body = `
    ${pageHero({
      image: 'gal-terrace-view',
      kicker: 'Where you sleep',
      title,
      lead: `Private villas, a glamping lodge and a family residence, spread across 10.5 acres of jungle. Room for up to ${cap.guests} guests in all.`,
      trail: TRAIL,
    })}

    <section class="section section--tight">
      <div class="shell">
        <div class="stay-tally">
          <p class="stay-tally__cap">
            <span class="stay-tally__label">Maximum capacity</span>
            <span class="stay-tally__num">${cap.guests}</span>
            <span class="stay-tally__label">guests</span>
          </p>
          <ol class="stay-tally__list">
            ${rooms
              .map(
                (r) => `<li><a href="#${esc(r.slug)}">
                <span class="stay-tally__units">${r.units}&times;</span>
                <span>${esc(r.shortName)}</span>
                <span class="stay-tally__sleeps">sleeps ${r.maxGuests}</span>
              </a></li>`,
              )
              .join('')}
          </ol>
        </div>

        <div class="stay-rows">
          ${rooms.map(stayRow).join('')}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'Good to know',
          title: 'What every stay includes',
          level: 2,
        })}
        <div class="split">
          <div>
            <table class="specs">
              <caption class="visually-hidden">Standard inclusions and house policies</caption>
              <tbody>
                <tr><th scope="row">Check in / check out</th><td>${site.policies.checkIn} / ${site.policies.checkOut}</td></tr>
                <tr><th scope="row">Breakfast</th><td>Included on most rates, cooked to order</td></tr>
                <tr><th scope="row">Pool</th><td>Outdoor pool open year-round, towels provided</td></tr>
                <tr><th scope="row">Parking</th><td>Free private parking on site</td></tr>
                <tr><th scope="row">Children</th><td>${esc(site.policies.children)}</td></tr>
                <tr><th scope="row">Pets</th><td>Not allowed, because of the wildlife on the property</td></tr>
                <tr><th scope="row">Smoking</th><td>All rooms are non-smoking</td></tr>
                <tr><th scope="row">Whole-property bookings</th><td>Up to ${cap.guests} guests across ${cap.units} units</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3>Booking the whole property</h3>
            <p>
              Groups, schools and extended families often take the whole property. You get
              the villas, the glamping lodge, the pool and the kitchen to yourselves, and we
              build the menu around whoever is staying. See the <a href="/offers/">current offers</a> for full-board pricing.
            </p>
            <h3>Arriving late or leaving early</h3>
            <p>
              Early check-in and late check-out can usually be arranged; just ask. If you
              are heading into the park at first light we will have a packed breakfast
              ready the night before.
            </p>
            <p>${button('Ask a question', '/contact/', 'ghost')}</p>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand()}
  `;

  return {
    path: '/rooms/',
    title,
    metaTitle: 'Accommodation | Raalmadu Wilpattu, Sri Lanka',
    metaDescription:
      'Plunge-pool villas, balcony villas overlooking Wilpattu, a shared glamping lodge and a family residence for eight at Raalmadu Wilpattu. Up to 40 guests.',
    ogImageKey: 'gal-terrace-view',
    ogImageAlt: IMAGES['gal-terrace-view'].alt,
    preloadImageKey: 'gal-terrace-view',
    body,
    schema: graph([
      hotelRef(),
      webPageNode({
        url,
        title,
        description: 'Accommodation at Raalmadu Wilpattu.',
        image: largestSrc('gal-terrace-view'),
        breadcrumbId: `${url}#breadcrumb`,
      }),
      breadcrumbNode(url, TRAIL),
    ]),
  };
}

export function roomDetailPage(room) {
  const path = `/rooms/${room.slug}/`;
  const url = abs(path);
  const trail = [...TRAIL, { name: room.name, path }];

  const others = rooms.filter((r) => r.slug !== room.slug);

  const body = `
    ${pageHero({
      image: room.image,
      kicker: 'Accommodation',
      title: room.name,
      lead: room.summary,
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split room-detail">
        <div>
          <h2>About the ${esc(room.shortName)}</h2>
          <p>${esc(room.intro)}</p>
          ${room.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}

          <h3>What you get</h3>
          <div class="facility">
            <ul>${room.amenities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
          </div>
        </div>

        <div class="room-aside">
          <table class="specs">
            <caption class="visually-hidden">${esc(room.name)} specifications</caption>
            <tbody>
              <tr><th scope="row">On the property</th><td>${esc(unitLabel(room))}</td></tr>
              <tr><th scope="row">Sleeps</th><td>${room.maxGuests} guest${room.maxGuests > 1 ? 's' : ''}</td></tr>
              <tr><th scope="row">Beds</th><td>${esc(room.beds)}</td></tr>
              ${room.size ? `<tr><th scope="row">Room size</th><td>${room.size} ${room.sizeUnit}</td></tr>` : ''}
              ${room.bathroom ? `<tr><th scope="row">Bathroom</th><td>${esc(room.bathroom)}</td></tr>` : ''}
              <tr><th scope="row">Views</th><td>${room.views.map(esc).join(', ')}</td></tr>
              <tr><th scope="row">Rate</th><td>${room.rateFrom != null ? `From $${room.rateFrom} per night` : 'On request'}</td></tr>
            </tbody>
          </table>

          <h3>Check availability</h3>
          ${bookingWidget({ compact: true, roomSlug: room.slug })}
          <p class="form-note section-actions">
            Prefer to ask first? <a href="/contact/">Send us a message</a> and we will reply
            the same day.
          </p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Also available', title: 'Other ways to stay', level: 2 })}
        <div class="grid grid--3">
          ${others.map((r) => roomCard(r, { level: 3 })).join('')}
        </div>
      </div>
    </section>

    ${ctaBand({
      title: `Stay in the ${room.shortName}`,
      text: 'Send us your dates and we will confirm availability, rates and any safari plans within the day.',
    })}
  `;

  return {
    path,
    title: room.name,
    metaTitle: room.metaTitle,
    metaDescription: room.metaDescription,
    ogImageKey: room.image,
    ogImageAlt: room.alt,
    preloadImageKey: room.image,
    body,
    schema: graph([
      hotelRef(),
      webPageNode({
        url,
        title: room.metaTitle,
        description: room.metaDescription,
        image: largestSrc(room.image),
        breadcrumbId: `${url}#breadcrumb`,
      }),
      breadcrumbNode(url, trail),
      roomNode(room, url, largestSrc(room.image)),
    ]),
  };
}
