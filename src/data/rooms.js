/**
 * Room inventory. Each entry generates:
 *   • a card on /rooms/
 *   • a detail page at /rooms/<slug>/
 *   • a HotelRoom node inside the Hotel JSON-LD
 *   • a sitemap entry
 *
 * Room types, unit counts and features follow the owner's accommodation sheet.
 * VERIFY: `rateFrom` on the two villa types carried over from the old Booking.com
 * listing (pool suite → plunge-pool villa, family room → Family Residence);
 * the balcony villa and the dormitory have no published rate yet, so they show
 * "rates on request". Set `rateFrom` once the owner confirms.
 *
 * `previousSlugs` keeps old URLs working: build.js emits a 301 for each.
 */
export const rooms = [
  {
    slug: 'villa-with-private-plunge-pool',
    previousSlugs: ['suite-with-private-pool'],
    name: 'Villa with Private Plunge Pool',
    shortName: 'Plunge Pool Villa',
    order: 1,
    units: 2,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 2,
    beds: '1 super king-size bed',
    bathroom: 'Attached modern bathroom with hot water',
    rateFrom: 77,
    currency: 'USD',
    views: ['Private plunge pool', 'Jungle'],
    summary:
      'Our most private stay: a villa with its own plunge pool, a sit-out balcony and a super king-size bed. Two of them on the property.',
    intro:
      'Each of the two plunge-pool villas is a self-contained hideaway. A super king-size bed, air coolers for the hottest afternoons, and a private plunge pool with its own sit-out balcony, where the jungle is close enough to hear long before you see it.',
    paragraphs: [
      'The whole villa is insect-proofed, and ceiling fans with natural cross-ventilation keep the air moving at night without shutting the forest out.',
      'Mornings are unhurried. Breakfast can be brought to the balcony, and from the pool edge it is common to watch peacocks work through the undergrowth while the mist lifts.',
    ],
    amenities: [
      'Private plunge pool',
      'Private sit-out balcony',
      'Super king-size bed',
      'Air coolers for extra comfort',
      'Ceiling fans and natural cross-ventilation',
      'Fully insect-proofed villa',
      'Attached modern bathroom with hot water',
    ],
    image: 'room-pool-suite',
    alt: 'The private plunge pool of a villa at Raalmadu Wilpattu, lit at night',
    metaTitle: 'Villa with Private Plunge Pool | Raalmadu Wilpattu',
    metaDescription:
      'A private villa at Raalmadu Wilpattu with its own plunge pool and sit-out balcony, a super king-size bed, air coolers and a modern bathroom on the edge of Wilpattu.',
  },
  {
    slug: 'villa-with-balcony-overlooking-wilpattu',
    previousSlugs: ['double-room'],
    name: 'Villa with Balcony overlooking Wilpattu',
    shortName: 'Balcony Villa',
    order: 2,
    units: 2,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 2,
    beds: '1 super king-size bed',
    bathroom: 'Attached modern bathroom with hot water',
    rateFrom: null,
    currency: 'USD',
    views: ['Wilpattu jungle'],
    summary:
      'A super king-size bed and a private sit-out balcony that looks straight out over the Wilpattu forest. Two of them on the property.',
    intro:
      'The balcony villas face the park. Each has a super king-size bed and its own sit-out balcony overlooking Wilpattu, the best seat on the property for the evening bird chorus and the first light over the tree line.',
    paragraphs: [
      'The villa is fully insect-proofed and cooled the old way, with ceiling fans and natural cross-ventilation pulling the forest air through.',
      'An attached modern bathroom with hot water means you come back from a dusty game drive to a proper shower.',
    ],
    amenities: [
      'Private sit-out balcony overlooking Wilpattu',
      'Super king-size bed',
      'Ceiling fans and natural cross-ventilation',
      'Fully insect-proofed villa',
      'Attached modern bathroom with hot water',
    ],
    image: 'room-double',
    alt: 'A bed in a timber villa at Raalmadu Wilpattu, open to the forest beyond',
    metaTitle: 'Villa with Balcony overlooking Wilpattu | Raalmadu',
    metaDescription:
      'A jungle villa at Raalmadu Wilpattu with a super king-size bed, a private sit-out balcony overlooking Wilpattu National Park and an attached modern bathroom.',
  },
  {
    slug: 'shared-glamping-lodge',
    previousSlugs: [],
    name: 'Shared Glamping Lodge',
    shortName: 'Glamping Lodge',
    order: 3,
    units: 1,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 20,
    beds: '10 double beds with mosquito nets',
    bathroom: null,
    rateFrom: null,
    currency: 'USD',
    views: ['Forest'],
    summary:
      'An open-sided dormitory lodge with ten netted double beds and the forest breeze running through it. Made for groups, schools and friends travelling together.',
    intro:
      'The glamping lodge is one long, open timber room: ten double beds, each under its own mosquito net, ceiling fans overhead and the forest on every side. It is the closest you can sleep to the jungle without a tent.',
    paragraphs: [
      'It is designed for groups, from nature clubs and school trips to a big family gathering, and is well ventilated by the natural forest breeze so it stays comfortable through the night.',
      'Tell us the size of your group when you enquire and we will set the lodge up before you arrive.',
    ],
    amenities: [
      'Dormitory lodge (1 unit)',
      '10 double beds with mosquito nets',
      'Ceiling fans in all areas',
      'Well ventilated by the natural forest breeze',
    ],
    image: 'room-family',
    alt: 'Rows of four-poster beds in the open-sided glamping lodge at Raalmadu Wilpattu',
    metaTitle: 'Shared Glamping Lodge | Raalmadu Wilpattu',
    metaDescription:
      'A shared glamping dormitory at Raalmadu Wilpattu with ten netted double beds, ceiling fans and open forest ventilation, ideal for groups visiting Wilpattu.',
  },
  {
    slug: 'family-residence',
    previousSlugs: ['family-room-with-balcony'],
    name: 'Family Residence',
    shortName: 'Family Residence',
    order: 4,
    units: 1,
    size: null,
    sizeUnit: 'm²',
    maxGuests: 8,
    beds: 'Beds for 8 adults',
    bathroom: 'Two attached modern bathrooms with hot water',
    rateFrom: 95,
    currency: 'USD',
    views: ['Villuwa lake', 'Jungle'],
    summary:
      'A private residence for up to eight adults, with two bathrooms and an open-air deck over the villuwa lake, where elephants often come to drink.',
    intro:
      'The Family Residence is a home of its own within the property. It sleeps up to eight adults, has two attached modern bathrooms, and opens onto a private jungle-view deck overlooking the villuwa lake, which the elephants visit often.',
    paragraphs: [
      'The open-air design keeps it well ventilated, with air coolers and ceiling fans for the warmest hours of the day.',
      'Families and small groups use it as a base: everyone under one roof, two bathrooms for the 5 a.m. safari departure, and the deck for sundowners when you get back.',
    ],
    amenities: [
      'Sleeps up to 8 adults',
      'Two attached modern bathrooms with hot water',
      'Air coolers and ceiling fans',
      'Open-air, well-ventilated design',
      'Private jungle-view deck overlooking the villuwa lake',
    ],
    image: 'gal-terrace-view',
    alt: 'The private deck of the Family Residence at Raalmadu Wilpattu, looking over the jungle',
    metaTitle: 'Family Residence | Raalmadu Wilpattu',
    metaDescription:
      'A private family residence at Raalmadu Wilpattu sleeping up to 8 adults, with two modern bathrooms and a jungle-view deck over a lake often visited by elephants.',
  },
];

export const roomBySlug = (slug) => rooms.find((r) => r.slug === slug);
