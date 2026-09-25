/**
 * Room inventory. Each entry generates:
 *   • a card on /rooms/
 *   • a detail page at /rooms/<slug>/
 *   • a HotelRoom node inside the Hotel JSON-LD
 *   • a sitemap entry
 *
 * VERIFY: sizes, bed counts and rates are taken from the property's public
 * Booking.com listing. Confirm with the owner and update `rateFrom` seasonally.
 */
export const rooms = [
  {
    slug: 'suite-with-private-pool',
    name: 'Suite with Private Pool',
    shortName: 'Pool Suite',
    order: 1,
    size: 21,
    sizeUnit: 'm²',
    maxGuests: 2,
    bedrooms: 1,
    beds: '1 king bed',
    bathroom: 'Private bathroom with bathtub or shower',
    rateFrom: 77,
    currency: 'USD',
    accessible: true,
    views: ['Private pool', 'River', 'Lake', 'Garden', 'Wilpattu jungle'],
    summary:
      'A ground-floor suite with its own plunge pool, a private entrance and a long view over the water towards the Wilpattu tree line.',
    intro:
      'The Pool Suite is the quietest corner of the lodge. It opens through its own entrance onto a private plunge pool, with the lagoon and the jungle beyond it, close enough that the evening bird chorus arrives without invitation. Inside, the room is simple and cool: a king bed, a writing desk, a wardrobe and a bathroom with a deep tub.',
    paragraphs: [
      'Because the suite sits on the ground floor with a level threshold, it is the most accessible room at the lodge and the easiest for guests who would rather not manage steps.',
      'Mornings here are unhurried. Breakfast can be brought to the terrace, and from the pool edge it is common to watch peacocks work their way along the far bank while the mist lifts off the water.',
    ],
    amenities: [
      'Private plunge pool',
      'Private entrance',
      'King bed (extra long)',
      'Bathtub or shower',
      'Free toiletries',
      'Writing desk',
      'Wardrobe and clothes rack',
      'Ceiling fan',
      'Electric kettle',
      'Fresh linens and towels',
      'Pool towels',
      'Ground floor, step-free access',
      'Non-smoking',
    ],
    image: 'room-pool-suite',
    alt: 'Private plunge pool and terrace of the Suite with Private Pool at Raalmadu Wilpattu, looking out over the lagoon',
    metaTitle: 'Suite with Private Pool | Raalmadu Wilpattu',
    metaDescription:
      'A 21 m² ground-floor suite at Raalmadu Wilpattu with its own plunge pool, king bed, private entrance and lagoon views on the edge of Wilpattu National Park.',
  },
  {
    slug: 'family-room-with-balcony',
    name: 'Family Room with Balcony',
    shortName: 'Family Room',
    order: 2,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 8,
    bedrooms: 1,
    beds: 'Up to 8 single/full beds',
    bathroom: 'Shared bathroom with shower',
    rateFrom: 95,
    currency: 'USD',
    accessible: false,
    views: ['Garden', 'Paddy fields', 'Jungle'],
    summary:
      'A large, airy room with its own balcony, built for families travelling together and for small groups on a safari trip.',
    intro:
      'The Family Room is the lodge\u2019s most sociable space. It sleeps up to eight across a flexible bed layout, and its balcony looks out over the garden towards the paddy fields, which is where the elephants tend to appear at dusk.',
    paragraphs: [
      'Groups use it as a base: bags in one place, a kettle and toaster for early safari starts, and enough room that nobody has to tiptoe around a 5 a.m. departure.',
      'Bed configuration is flexible. Tell us your group when you book and we will set the room up before you arrive.',
    ],
    amenities: [
      'Private balcony',
      'Flexible bedding for up to 8 guests',
      'Shared bathroom with shower',
      'Electric kettle and toaster',
      'Wardrobe and clothes rack',
      'Ceiling fan',
      'Free toiletries',
      'Fresh linens and towels',
      'Garden and paddy-field views',
      'Non-smoking',
    ],
    image: 'room-family',
    alt: 'Balcony of the Family Room at Raalmadu Wilpattu overlooking the garden and paddy fields',
    metaTitle: 'Family Room with Balcony | Raalmadu Wilpattu',
    metaDescription:
      'A large family room at Raalmadu Wilpattu sleeping up to 8, with a private balcony over the garden and paddy fields, minutes from Wilpattu National Park.',
  },
  {
    slug: 'double-room',
    name: 'Double Room',
    shortName: 'Double Room',
    order: 3,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 2,
    bedrooms: 1,
    beds: '1 double bed',
    bathroom: 'Shared bathroom with shower',
    rateFrom: 55,
    currency: 'USD',
    accessible: false,
    views: ['Garden', 'Jungle'],
    summary:
      'A simple, comfortable double with a private entrance. The easy choice for a one- or two-night safari stop.',
    intro:
      'Most guests come to Raalmadu for one or two nights on the way to or from a Wilpattu game drive, and the Double Room is built exactly for that: a good bed, a fan, a private entrance straight onto the garden, and a short walk to the pool and the dining terrace.',
    paragraphs: [
      'The bathroom is shared with one other room and kept spotless. It is the reason this rate stays as low as it does.',
      'Breakfast is included on most rates, and packed breakfasts are made up for guests leaving before dawn for the park gate.',
    ],
    amenities: [
      'Private entrance',
      'Double bed',
      'Shared bathroom with shower',
      'Ceiling fan',
      'Wardrobe and clothes rack',
      'Free toiletries',
      'Fresh linens and towels',
      'Garden access',
      'Non-smoking',
    ],
    image: 'room-double',
    alt: 'Double Room at Raalmadu Wilpattu with a private entrance opening onto the lodge garden',
    metaTitle: 'Double Room | Raalmadu Wilpattu',
    metaDescription:
      'An affordable double room at Raalmadu Wilpattu with a private entrance, ceiling fan and shared bathroom, a comfortable base for a Wilpattu National Park safari.',
  },
];

export const roomBySlug = (slug) => rooms.find((r) => r.slug === slug);
