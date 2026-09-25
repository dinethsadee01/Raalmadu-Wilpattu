/**
 * Image registry — the single source of truth for every photo on the site.
 *
 * `alt` is written once here and reused everywhere the image appears, so no
 * image can ever ship without alt text. Decorative images would carry
 * `alt: ''` plus `decorative: true`; at present every image is meaningful.
 *
 * `aspect` drives both the crop in scripts/optimize-images.js and the
 * width/height attributes emitted in the HTML — that pairing is what holds
 * Cumulative Layout Shift at zero.
 */

/** Breakpoint widths generated for every image. */
export const WIDTHS = [400, 800, 1200, 1600, 2000];

export const IMAGES = {
  'hero-lodge': {
    aspect: 16 / 9,
    position: 'attention',
    alt: 'Evening light over the lagoon and jungle canopy beside Wilpattu National Park, seen from Raalmadu Wilpattu',
  },
  'intro-lagoon': {
    aspect: 4 / 3,
    alt: 'The Kala Oya lagoon running past the edge of the Raalmadu Wilpattu property',
  },
  'room-pool-suite': {
    aspect: 3 / 2,
    alt: 'Private plunge pool and terrace of the Suite with Private Pool at Raalmadu Wilpattu',
  },
  'room-family': {
    aspect: 3 / 2,
    alt: 'The Family Room with Balcony at Raalmadu Wilpattu, set up with beds for a group',
  },
  'room-double': {
    aspect: 3 / 2,
    alt: 'Double Room at Raalmadu Wilpattu with a double bed, ceiling fan and private entrance',
  },
  'dining-table': {
    aspect: 3 / 2,
    alt: 'Sri Lankan rice and curry with several vegetable dishes served at Raalmadu Wilpattu',
  },
  'dining-terrace': {
    aspect: 16 / 9,
    alt: 'Open-air dining terrace at Raalmadu Wilpattu looking out over the garden',
  },
  'exp-leopard': {
    aspect: 3 / 2,
    alt: 'Sri Lankan leopard resting in the shade in Wilpattu National Park',
  },
  'exp-birds': {
    aspect: 3 / 2,
    alt: 'Painted storks feeding in the shallows of a villu lake in Wilpattu National Park',
  },
  'exp-lagoon': {
    aspect: 3 / 2,
    alt: 'Mangrove channel at the Kala Oya estuary near Raalmadu Wilpattu',
  },
  'exp-cooking': {
    aspect: 3 / 2,
    alt: 'Spices and fresh coconut being prepared for a Sri Lankan curry at Raalmadu Wilpattu',
  },
  'gal-elephant': {
    aspect: 3 / 2,
    alt: 'Wild Asian elephant drinking at a waterhole near Wilpattu National Park',
  },
  'gal-peacock': {
    aspect: 3 / 2,
    alt: 'Indian peafowl displaying its tail in the grounds of Raalmadu Wilpattu',
  },
  'gal-crocodile': {
    aspect: 3 / 2,
    alt: 'Mugger crocodile basking on the bank of the lagoon below the lodge terrace',
  },
  'gal-jungle-path': {
    aspect: 2 / 3,
    alt: 'Sandy jungle track running through dry-zone forest near Wilpattu National Park',
  },
  'gal-paddy': {
    aspect: 3 / 2,
    alt: 'Green paddy fields surrounding Raalmadu Wilpattu in the North Western Province',
  },
  'gal-safari': {
    aspect: 3 / 2,
    alt: 'Safari jeep and tracker at the edge of Wilpattu National Park, ready for a game drive',
  },
  'gal-pool': {
    aspect: 2 / 3,
    alt: 'The outdoor swimming pool at Raalmadu Wilpattu framed by tropical planting',
  },
  'gal-villu': {
    aspect: 3 / 2,
    alt: 'A villu, a natural rain-fed lake, on the plains of Wilpattu National Park',
  },
  'location-map': {
    aspect: 16 / 9,
    alt: 'Evening sky over the dry-zone landscape surrounding Raalmadu Wilpattu',
  },
  'gal-sunset': {
    aspect: 3 / 2,
    alt: 'Sunset over the dry-zone plains near Wilpattu, silhouetting palms against a warm orange sky',
  },
  'gal-monkey': {
    aspect: 3 / 2,
    alt: 'Grey langur resting on a branch in the forest canopy of Wilpattu National Park',
  },
  'gal-buffalo': {
    aspect: 3 / 2,
    alt: 'Water buffalo grazing on the open grassland at the edge of a Wilpattu villu',
  },
  'gal-hoppers': {
    aspect: 3 / 2,
    alt: 'Sri Lankan string hoppers served with coconut sambol and dhal at Raalmadu Wilpattu',
  },
  'gal-terrace-view': {
    aspect: 3 / 2,
    alt: 'Shaded lounging terrace at Raalmadu Wilpattu looking out over the garden and lagoon',
  },
  'gal-birds-2': {
    aspect: 3 / 2,
    alt: 'A green bee-eater perched on a branch near the Kala Oya lagoon',
  },
};

/**
 * Sources used by scripts/fetch-images.js when pulling placeholder photography.
 *
 * `provider: 'commons'` searches Wikimedia Commons, which is much better
 * curated for Sri Lankan wildlife, food and landscape subjects. The remaining
 * entries fall back to the broader Openverse index.
 */
export const PLACEHOLDER_QUERIES = {
  'hero-lodge': { queries: ['Category:Sunsets of Sri Lanka', 'Category:Wilpattu National Park'] },
  'intro-lagoon': { provider: 'commons', queries: ['Kala Oya', 'Puttalam lagoon', 'Sri Lanka lagoon'] },
  'room-pool-suite': { queries: ['plunge pool', 'resort pool', 'swimming pool'] },
  'room-family': { queries: ['twin beds hotel', 'guesthouse bedroom', 'hotel room beds'] },
  'room-double': { queries: ['hotel bed room', 'guest bedroom', 'double bed room'] },
  'dining-table': { queries: ['Category:Rice and curry', 'Category:Cuisine of Sri Lanka', 'Category:Sri Lankan cuisine'] },
  'dining-terrace': { queries: ['outdoor dining table', 'terrace restaurant', 'garden restaurant'] },
  'exp-leopard': { provider: 'commons', queries: ['Sri Lankan leopard', 'Panthera pardus kotiya', 'Leopard Wilpattu'] },
  'exp-birds': { provider: 'commons', queries: ['Painted stork Sri Lanka', 'Painted stork', 'Spot-billed pelican'] },
  'exp-lagoon': { queries: ['Category:Mangroves of Sri Lanka', 'Category:Mangroves', 'Category:Mangrove forests'] },
  'exp-cooking': { provider: 'commons', queries: ['Sri Lankan curry', 'Pol sambol', 'Sri Lanka cooking'] },
  'gal-elephant': { provider: 'commons', queries: ['Sri Lankan elephant', 'Elephas maximus maximus', 'Elephant Sri Lanka'] },
  'gal-peacock': { provider: 'commons', queries: ['Indian peafowl Sri Lanka', 'Pavo cristatus', 'Peacock displaying'] },
  'gal-crocodile': { provider: 'commons', queries: ['Mugger crocodile', 'Crocodylus palustris', 'Marsh crocodile'] },
  'gal-jungle-path': { provider: 'commons', queries: ['Wilpattu road', 'Sri Lanka forest track', 'Dry zone forest Sri Lanka'] },
  'gal-paddy': { provider: 'commons', queries: ['Paddy field Sri Lanka', 'Rice field Sri Lanka', 'Paddy field'] },
  'gal-safari': { queries: ['Category:Wilpattu National Park', 'Category:Safari vehicles'] },
  'gal-pool': { queries: ['swimming pool garden', 'resort swimming pool', 'hotel pool'] },
  'gal-villu': { queries: ['Category:Wilpattu National Park', 'Category:Lakes of Sri Lanka'] },
  'location-map': { queries: ['Category:Puttalam District', 'Category:Wilpattu National Park'] },
  'gal-sunset': { provider: 'commons', queries: ['Category:Sunsets of Sri Lanka', 'Sri Lanka sunset', 'Wilpattu sunset'] },
  'gal-monkey': { provider: 'commons', queries: ['Semnopithecus priam', 'Grey langur Sri Lanka', 'Toque macaque'] },
  'gal-buffalo': { provider: 'commons', queries: ['Water buffalo Sri Lanka', 'Bubalus bubalis Sri Lanka', 'Wild buffalo Wilpattu'] },
  'gal-hoppers': { provider: 'commons', queries: ['String hoppers', 'Idiyappam', 'Sri Lankan breakfast'] },
  'gal-terrace-view': { queries: ['garden terrace lounge', 'tropical resort terrace', 'outdoor lounge villa'] },
  'gal-birds-2': { provider: 'commons', queries: ['Green bee-eater Sri Lanka', 'Merops orientalis', 'White-throated kingfisher Sri Lanka'] },
};
