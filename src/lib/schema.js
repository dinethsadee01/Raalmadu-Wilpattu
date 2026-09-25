/**
 * JSON-LD builders.
 *
 * Every node carries a stable `@id` so the graph is properly connected:
 *   {origin}/#hotel      the business itself (one canonical node, site-wide)
 *   {origin}/#website    the site
 *   {pageUrl}#webpage    the individual page, linked back to both
 *   {pageUrl}#breadcrumb the page's breadcrumb trail
 *
 * Deliberately NOT emitted: `aggregateRating`. The 9.0/10 score shown in the
 * UI comes from Booking.com, and Google's structured-data policy treats
 * third-party or self-serving ratings on a LocalBusiness as ineligible —
 * marking them up risks a manual action. The score is still displayed to users
 * with clear attribution and an outbound link, which is allowed.
 */

import { site, SITE_URL } from '../data/site.js';
import { rooms } from '../data/rooms.js';
import { facilities } from '../data/content.js';

export const abs = (p) => (p.startsWith('http') ? p : `${SITE_URL}${p}`);

const ids = {
  hotel: `${SITE_URL}/#hotel`,
  website: `${SITE_URL}/#website`,
  org: `${SITE_URL}/#organization`,
};

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.countryCode,
});

const amenityFeatures = () =>
  facilities.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'LocationFeatureSpecification',
      name: item,
      value: true,
    })),
  );

/** The business. Emitted once per page as the anchor of the graph. */
export function hotelNode(ogImage) {
  const sameAs = Object.values(site.social).filter(Boolean);

  return {
    '@type': ['Hotel', 'LodgingBusiness'],
    '@id': ids.hotel,
    name: site.name,
    description: site.description,
    url: `${SITE_URL}/`,
    image: abs(ogImage),
    logo: abs('/assets/icons/icon-512.png'),
    telephone: site.contact.phone,
    email: site.contact.email,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`,
    checkinTime: site.policies.checkIn,
    checkoutTime: site.policies.checkOut,
    numberOfRooms: site.policies.capacity.bedrooms,
    petsAllowed: site.policies.petsAllowed,
    smokingAllowed: site.policies.smoking,
    priceRange: '$$',
    currenciesAccepted: 'LKR, USD, EUR',
    availableLanguage: site.contact.languages.map((name) => ({ '@type': 'Language', name })),
    amenityFeature: amenityFeatures(),
    ...(sameAs.length ? { sameAs } : {}),
    makesOffer: rooms.map((room) => ({
      '@type': 'Offer',
      name: room.name,
      url: abs(`/rooms/${room.slug}/`),
      priceCurrency: room.currency,
      price: room.rateFrom,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: room.rateFrom,
        priceCurrency: room.currency,
        unitCode: 'DAY',
        unitText: 'per night',
      },
      availability: 'https://schema.org/InStock',
    })),
    containsPlace: rooms.map((room) => ({
      '@type': 'HotelRoom',
      '@id': abs(`/rooms/${room.slug}/#room`),
      name: room.name,
      url: abs(`/rooms/${room.slug}/`),
      description: room.summary,
      bed: { '@type': 'BedDetails', typeOfBed: room.beds },
      occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests, unitCode: 'C62' },
      ...(room.size
        ? { floorSize: { '@type': 'QuantitativeValue', value: room.size, unitCode: 'MTK' } }
        : {}),
    })),
  };
}

/**
 * Compact reference to the business, for interior pages. Carries the same
 * `@id` as the full node on the home page, so search engines consolidate the
 * two rather than treating them as separate entities — without repeating the
 * full amenity and room lists in every document.
 */
export function hotelRef() {
  return {
    '@type': ['Hotel', 'LodgingBusiness'],
    '@id': ids.hotel,
    name: site.name,
    url: `${SITE_URL}/`,
    telephone: site.contact.phone,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: `${SITE_URL}/`,
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': ids.hotel },
  };
}

export function webPageNode({ url, title, description, image, breadcrumbId, datePublished, dateModified }) {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.hotel },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: abs(image) } : undefined,
    ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    inLanguage: 'en',
    datePublished,
    dateModified,
  };
}

/** `trail` is [{ name, path }], excluding Home, which is prepended here. */
export function breadcrumbNode(url, trail) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqNode(url, faqs) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Full HotelRoom detail, used on an individual room page. */
export function roomNode(room, url, image) {
  return {
    '@type': 'HotelRoom',
    '@id': `${url}#room`,
    name: room.name,
    url,
    description: room.summary,
    image: abs(image),
    bed: { '@type': 'BedDetails', typeOfBed: room.beds },
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests, unitCode: 'C62' },
    ...(room.size
      ? { floorSize: { '@type': 'QuantitativeValue', value: room.size, unitCode: 'MTK' } }
      : {}),
    amenityFeature: room.amenities.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    containedInPlace: { '@id': ids.hotel },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: abs(`/booking/?room=${room.slug}`),
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'LodgingReservation', name: `Reserve the ${room.name}` },
    },
  };
}

export function imageGalleryNode(url, items) {
  return {
    '@type': 'ImageGallery',
    '@id': `${url}#gallery`,
    name: `Photo gallery, ${site.name}`,
    about: { '@id': ids.hotel },
    associatedMedia: items.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: abs(img.src),
      caption: img.alt,
      representativeOfPage: false,
    })),
  };
}

/** Wraps a list of nodes into one @graph script tag payload. */
export function graph(nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean).map((n) => JSON.parse(JSON.stringify(n))),
  };
}
