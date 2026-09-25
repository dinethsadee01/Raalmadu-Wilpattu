/**
 * Raalmadu Wilpattu — global site configuration.
 *
 * This file is the SINGLE SOURCE OF TRUTH for the domain, contact details,
 * geo-coordinates and brand metadata. Every canonical tag, Open Graph URL,
 * sitemap entry and JSON-LD block is derived from the values below, so
 * changing the domain here updates the entire site on the next `npm run build`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠  VERIFY BEFORE GOING LIVE  (see README.md → "Before you launch")
 *    Every value marked `VERIFY:` is a best-effort placeholder taken from
 *    public listings. Confirm each one with the hotel owner.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Production origin. No trailing slash. Used for canonicals, OG, sitemap. */
export const SITE_URL = 'https://www.raalmaduwilpattu.com'; // VERIFY: final domain

export const site = {
  url: SITE_URL,
  name: 'Raalmadu Wilpattu',
  legalName: 'Raalmadu Wilpattu',
  tagline: 'A jungle lodge on the edge of Wilpattu',
  /** Default <title> suffix. Keeps every title unique but brand-consistent. */
  titleSuffix: 'Raalmadu Wilpattu',
  description:
    'Raalmadu Wilpattu is a small jungle lodge on the edge of Wilpattu National Park, Sri Lanka, with an outdoor pool, home-cooked Sri Lankan food and leopard safaris at the gate.',
  locale: 'en_LK',
  lang: 'en',
  themeColor: '#14281f',

  address: {
    street: 'Raalmadu Road',
    locality: 'Achchamulai',
    region: 'North Western Province',
    district: 'Puttalam District',
    postalCode: '61308',
    country: 'Sri Lanka',
    countryCode: 'LK',
  },

  /**
   * VERIFY: approximate coordinates (Eluwankulama village, the nearest mapped
   * settlement). Replace with the exact pin from the property's Google Business
   * Profile before launch — an inaccurate geo in JSON-LD hurts local ranking.
   */
  geo: { lat: 8.2874, lng: 79.883, approximate: true },

  contact: {
    phone: '+94 77 000 0000',          // VERIFY: real reservations number
    phoneHref: '+94770000000',         // VERIFY
    whatsapp: '+94770000000',          // VERIFY
    email: 'reservations@raalmaduwilpattu.com', // VERIFY
    languages: ['English', 'Sinhala', 'Tamil'],
  },

  /** VERIFY: confirm/replace with the hotel's own profiles. Empty = hidden. */
  social: {
    facebook: '',
    instagram: '',
    tripadvisor:
      'https://www.tripadvisor.com/Hotel_Review-g12549273-d23357883-Reviews-Raalmadu_Wilpattu-Eluwankulam_North_Western_Province.html',
    booking: 'https://www.booking.com/hotel/lk/raalmadu.html',
  },

  /**
   * Contact-form backend. A static host cannot process a POST on its own, so
   * this must be wired up before launch — see README → "Contact form".
   *   'netlify'  : zero-config on Netlify; the markup below is all it needs
   *   'formspree': set `action` to the Formspree endpoint
   *   'custom'   : set `action` to your own handler
   */
  forms: {
    provider: 'netlify', // VERIFY: match this to the chosen host
    action: '', // VERIFY: required for 'formspree' and 'custom'
  },

  policies: {
    checkIn: '14:00',
    checkOut: '11:00',
    minCheckInAge: 18,
    petsAllowed: false,
    smoking: false,
    cancellation: 'Free cancellation on most rates',
    children: 'Children of all ages are welcome',
    capacity: { guests: 10, bedrooms: 3 },
  },

  /**
   * Guest rating shown in the UI with clear attribution.
   * NOTE: deliberately NOT emitted as schema.org `aggregateRating`. Google's
   * structured-data policy disallows self-serving / third-party-sourced ratings
   * for a LocalBusiness, and doing so risks a manual action. See README.
   */
  rating: { score: 9.0, best: 10, count: 85, source: 'Booking.com' }, // VERIFY: refresh periodically

  /**
   * Hero media. If `video` is set (e.g. '/assets/video/hero.mp4'), the home hero
   * renders an autoplay muted loop video with a poster fallback and skips the
   * slideshow. Leave empty to use the image slideshow (default).
   */
  hero: {
    video: '',
    slides: ['hero-lodge', 'gal-villu', 'intro-lagoon'],
  },

  /** Distances used on the Location page and in the Hotel JSON-LD. */
  distances: [
    { label: 'Wilpattu National Park (Eluwankulama entrance)', value: 'approx. 10 min drive' },
    { label: 'Kala Oya estuary & lagoon', value: 'on the doorstep' },
    { label: 'Puttalam town', value: 'approx. 40 km' },
    { label: 'Anuradhapura', value: 'approx. 85 km' },
    { label: 'Colombo', value: 'approx. 170 km' },
    { label: 'Bandaranaike International Airport (CMB)', value: 'approx. 134 km / 3.5 hrs' },
  ],
};

/**
 * Primary navigation. `path` values are the clean, lowercase, hyphenated slugs
 * used for the directory-style URLs the build emits (e.g. /rooms/ → rooms/index.html).
 */
export const nav = [
  { label: 'Stay', path: '/rooms/' },
  { label: 'Dining', path: '/dining/' },
  { label: 'Experiences', path: '/experiences/' },
  { label: 'Gallery', path: '/gallery/' },
  { label: 'Offers', path: '/offers/' },
  { label: 'Location', path: '/location/' },
  { label: 'Contact', path: '/contact/' },
];

export const footerNav = [
  {
    heading: 'Stay',
    links: [
      { label: 'All rooms', path: '/rooms/' },
      { label: 'Suite with Private Pool', path: '/rooms/suite-with-private-pool/' },
      { label: 'Family Room with Balcony', path: '/rooms/family-room-with-balcony/' },
      { label: 'Double Room', path: '/rooms/double-room/' },
      { label: 'Offers', path: '/offers/' },
    ],
  },
  {
    heading: 'The lodge',
    links: [
      { label: 'Dining', path: '/dining/' },
      { label: 'Experiences', path: '/experiences/' },
      { label: 'Gallery', path: '/gallery/' },
      { label: 'Location & directions', path: '/location/' },
      { label: 'Frequently asked questions', path: '/faq/' },
    ],
  },
  {
    heading: 'Book',
    links: [
      { label: 'Check availability', path: '/booking/' },
      { label: 'Contact reservations', path: '/contact/' },
      { label: 'Image credits', path: '/image-credits/' },
      { label: 'Privacy policy', path: '/privacy-policy/' },
      { label: 'Terms & conditions', path: '/terms/' },
    ],
  },
];
