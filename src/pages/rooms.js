import { site } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import { esc, media, button, sectionHead, roomCard, bookingWidget } from '../lib/components.js';
import { pageHero, ctaBand } from '../lib/sections.js';
import {
  graph,
  hotelRef,
  webPageNode,
  breadcrumbNode,
  roomNode,
  abs,
} from '../lib/schema.js';

const TRAIL = [{ name: 'Stay', path: '/rooms/' }];

export function roomsIndexPage() {
  const url = abs('/rooms/');
  const title = 'Rooms & rates';

  const body = `
    ${pageHero({
      image: 'room-pool-suite',
      kicker: 'Where you sleep',
      title,
      lead: 'Three rooms and a total of ten beds, so the lodge never feels busy. Every rate includes breakfast and use of the pool.',
      trail: TRAIL,
    })}

    <section class="section section--tight">
      <div class="shell">
        <div class="grid grid--3">
          ${rooms.map((r) => roomCard(r, { level: 2 })).join('')}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({
          kicker: 'Good to know',
          title: 'What every room includes',
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
                <tr><th scope="row">Whole-lodge bookings</th><td>Up to ${site.policies.capacity.guests} guests across ${site.policies.capacity.bedrooms} bedrooms</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3>Booking the whole lodge</h3>
            <p>
              Families and small groups often take all three rooms. You get the pool, the
              terrace and the kitchen to yourselves, and we build the menu around whoever
              is staying. See the <a href="/offers/">current offers</a> for full-board pricing.
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
    metaTitle: 'Rooms & Rates | Raalmadu Wilpattu, Sri Lanka',
    metaDescription:
      'Compare the three rooms at Raalmadu Wilpattu: a suite with a private plunge pool, a family room sleeping eight, and a double room. From $55 a night with breakfast.',
    ogImage: '/assets/img/room-pool-suite-1200.jpg',
    ogImageAlt: 'Private plunge pool of the Suite with Private Pool at Raalmadu Wilpattu',
    preloadImageKey: 'room-pool-suite',
    body,
    schema: graph([
      hotelRef(),
      webPageNode({
        url,
        title,
        description: 'Rooms and rates at Raalmadu Wilpattu.',
        image: '/assets/img/room-pool-suite-1200.jpg',
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
      kicker: 'Rooms',
      title: room.name,
      lead: room.summary,
      trail,
    })}

    <section class="section section--tight">
      <div class="shell split">
        <div>
          <h2>About this room</h2>
          <p>${esc(room.intro)}</p>
          ${room.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}

          <h3>In the room</h3>
          <div class="facility">
            <ul>${room.amenities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
          </div>
        </div>

        <div>
          <table class="specs">
            <caption class="visually-hidden">${esc(room.name)} specifications</caption>
            <tbody>
              <tr><th scope="row">Sleeps</th><td>${room.maxGuests} guest${room.maxGuests > 1 ? 's' : ''}</td></tr>
              <tr><th scope="row">Beds</th><td>${esc(room.beds)}</td></tr>
              ${room.size ? `<tr><th scope="row">Room size</th><td>${room.size} ${room.sizeUnit}</td></tr>` : ''}
              <tr><th scope="row">Bathroom</th><td>${esc(room.bathroom)}</td></tr>
              <tr><th scope="row">Views</th><td>${room.views.map(esc).join(', ')}</td></tr>
              <tr><th scope="row">Accessibility</th><td>${room.accessible ? 'Ground floor, step-free access' : 'Reached by a short path across the garden'}</td></tr>
              <tr><th scope="row">Rate</th><td>From $${room.rateFrom} per night</td></tr>
            </tbody>
          </table>

          <h3>Check availability</h3>
          ${bookingWidget({ compact: true, roomSlug: room.slug })}
          <p class="form-note" style="margin-top:var(--sp-4)">
            Prefer to ask first? <a href="/contact/">Send us a message</a> and we will reply
            the same day.
          </p>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="shell">
        ${sectionHead({ kicker: 'Also available', title: 'The other rooms', level: 2 })}
        <div class="grid grid--2">
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
    ogImage: `/assets/img/${room.image}-1200.jpg`,
    ogImageAlt: room.alt,
    preloadImageKey: room.image,
    body,
    schema: graph([
      hotelRef(),
      webPageNode({
        url,
        title: room.metaTitle,
        description: room.metaDescription,
        image: `/assets/img/${room.image}-1200.jpg`,
        breadcrumbId: `${url}#breadcrumb`,
      }),
      breadcrumbNode(url, trail),
      roomNode(room, url, `/assets/img/${room.image}-1200.jpg`),
    ]),
  };
}
