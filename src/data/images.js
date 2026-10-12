/**
 * Image registry — the single source of truth for every photo on the site.
 *
 * `alt` is written once here and reused everywhere the image appears, so no
 * image can ever ship without alt text. An image with no entry here throws at
 * build time rather than rendering a silent gap.
 *
 * `aspect` drives both the crop in scripts/optimize-images.js and the
 * width/height attributes emitted in the HTML — that pairing is what holds
 * Cumulative Layout Shift at zero.
 *
 * PROVENANCE
 *   The first 16 entries are the hotel's own photographs, taken from the
 *   property's Booking.com gallery with the owner's permission. Booking caps
 *   that gallery at 1024px on the long edge, so `hero-lodge` is upscaled and
 *   sharpened; ask the hotel for the original if a crisper hero is wanted.
 *
 *   The remaining 10 are Creative Commons wildlife and landscape photographs
 *   of Wilpattu National Park. They depict the park, not the property — the
 *   lodge has no leopard or elephant photography of its own — and each is
 *   credited in NOTICE and on /image-credits/. The three `exc-*` entries are
 *   later, higher-resolution Commons picks for /excursions/ and are credited
 *   the same way.
 */

/** Breakpoint widths generated for every image. */
export const WIDTHS = [400,800,1200,1600,2000];

export const IMAGES = {
  'hero-lodge': {
    aspect: 16 / 9,
    position: 'attention',
    alt:
      'The main lodge at Raalmadu Wilpattu lit at dusk, its thatched roof against a pink evening sky',
  },
  'intro-lagoon': {
    aspect: 4 / 3,
    alt:
      'A table laid on the timber deck above the river at Raalmadu Wilpattu',
  },
  'room-pool-suite': {
    aspect: 3 / 2,
    alt:
      'The private plunge pool of the Suite with Private Pool at Raalmadu Wilpattu, lit at night',
  },
  'room-family': {
    aspect: 3 / 2,
    alt:
      'Bunk beds under mosquito nets in the Family Room at Raalmadu Wilpattu, forest visible through the glass walls',
  },
  'room-double': {
    aspect: 3 / 2,
    alt:
      'A double bed beside a full-height glass wall looking into the forest at Raalmadu Wilpattu',
  },
  'dining-table': {
    aspect: 3 / 2,
    alt:
      'A meal laid out on the timber deck above the water at Raalmadu Wilpattu',
  },
  'dining-terrace': {
    aspect: 16 / 9,
    alt:
      'The open dining deck at Raalmadu Wilpattu, tables looking out over the forest',
  },
  'exp-lagoon': {
    aspect: 3 / 2,
    alt:
      'Kayaking the mangrove channel on the river beside Raalmadu Wilpattu',
  },
  'exp-cooking': {
    aspect: 3 / 2,
    alt:
      'Meat and vegetables cooking on the barbecue grill at Raalmadu Wilpattu',
  },
  'gal-pool': {
    aspect: 3 / 2,
    alt:
      'The outdoor swimming pool at Raalmadu Wilpattu beneath a thatched shelter',
  },
  'gal-safari': {
    aspect: 2 / 3,
    alt:
      'A Land Rover safari jeep and guides at Raalmadu Wilpattu, ready for a game drive',
  },
  'gal-sunset': {
    aspect: 3 / 2,
    alt:
      'Guests silhouetted against the sunset on the water near Raalmadu Wilpattu',
  },
  'gal-terrace-view': {
    aspect: 3 / 2,
    alt:
      'The balcony deck at Raalmadu Wilpattu with table and chairs overlooking the forest',
  },
  'gal-hoppers': {
    aspect: 3 / 2,
    alt:
      'Sri Lankan food served on a banana leaf with curd at Raalmadu Wilpattu',
  },
  'location-map': {
    aspect: 16 / 9,
    alt:
      'Aerial view of Raalmadu Wilpattu and its clearing in the surrounding jungle',
  },
  'gal-grounds': {
    aspect: 3 / 2,
    alt: 'The lodge and its grounds at Raalmadu Wilpattu lit at dusk',
  },
  'exp-leopard': {
    aspect: 3 / 2,
    alt: 'Sri Lankan leopard resting in the shade in Wilpattu National Park',
  },
  'exp-birds': {
    aspect: 3 / 2,
    alt:
      'Painted storks feeding in the shallows of a villu lake in Wilpattu National Park',
  },
  'gal-elephant': {
    aspect: 3 / 2,
    alt:
      'Wild Asian elephant drinking at a waterhole near Wilpattu National Park',
  },
  'gal-peacock': {
    aspect: 3 / 2,
    alt:
      'Indian peafowl displaying its tail in the dry-zone scrub around Wilpattu National Park',
  },
  'gal-crocodile': {
    aspect: 3 / 2,
    alt:
      'Mugger crocodile basking on a riverbank in Wilpattu National Park',
  },
  'gal-villu': {
    aspect: 3 / 2,
    alt:
      'A shallow rain-fed lake on the dry-zone plains of a Sri Lankan national park',
  },
  'gal-paddy': {
    aspect: 3 / 2,
    alt:
      'Paddy fields in the North Western Province of Sri Lanka, near Wilpattu National Park',
  },
  'gal-monkey': {
    aspect: 3 / 2,
    alt:
      'Grey langur resting on a branch in the forest canopy of Wilpattu National Park',
  },
  'gal-buffalo': {
    aspect: 3 / 2,
    alt:
      'Water buffalo grazing on the open grassland at the edge of a Wilpattu villu',
  },
  'gal-birds-2': {
    aspect: 3 / 2,
    alt: 'A green bee-eater perched on a branch in the Wilpattu area',
  },
  // High-resolution Creative Commons photographs for /excursions/.
  'exc-hero': {
    aspect: 3 / 2,
    alt:
      'A wild elephant wading through a lily-covered lake, with painted storks, in a Sri Lankan national park',
  },
  'exc-leopard': {
    aspect: 3 / 2,
    alt: 'A Sri Lankan leopard stepping out of the scrub onto a sandy jungle track',
  },
  'exc-stork': {
    aspect: 3 / 2,
    alt: 'A painted stork with its yellow bill and pink wing feathers, walking through green grass',
  },
  // Founder portrait for /about/. Supplied by the owner, not Creative Commons.
  'founder-rizvi': {
    aspect: 4 / 5,
    position: 'attention',
    alt: 'Portrait of Rizvi Hasan, founder of Raalmadu Wilpattu, smiling outdoors',
  },
};

/**
 * Search terms used by scripts/fetch-images.js. Only the Creative Commons
 * slots appear here — the hotel's own photographs must never be overwritten
 * by a re-fetch.
 */
export const PLACEHOLDER_QUERIES = {
  'exp-leopard': {'provider':'commons','queries':['Sri Lankan leopard','Panthera pardus kotiya','Leopard Wilpattu']},
  'exp-birds': {'provider':'commons','queries':['Painted stork Sri Lanka','Painted stork','Spot-billed pelican']},
  'gal-elephant': {'provider':'commons','queries':['Sri Lankan elephant','Elephas maximus maximus','Elephant Sri Lanka']},
  'gal-peacock': {'provider':'commons','queries':['Indian peafowl Sri Lanka','Pavo cristatus','Peacock displaying']},
  'gal-crocodile': {'provider':'commons','queries':['Mugger crocodile','Crocodylus palustris','Marsh crocodile']},
  'gal-villu': {'queries':['Category:Wilpattu National Park','Category:Lakes of Sri Lanka']},
  'gal-paddy': {'provider':'commons','queries':['Paddy field Sri Lanka','Rice field Sri Lanka','Paddy field']},
  'gal-monkey': {'provider':'commons','queries':['Semnopithecus priam','Grey langur Sri Lanka','Toque macaque']},
  'gal-buffalo': {'provider':'commons','queries':['Water buffalo Sri Lanka','Bubalus bubalis Sri Lanka','Wild buffalo Wilpattu']},
  'gal-birds-2': {'provider':'commons','queries':['Green bee-eater Sri Lanka','Merops orientalis','White-throated kingfisher Sri Lanka']},
  'exc-hero': {'provider':'commons','queries':['Elephant and Painted Stork by Prarthana Mahipala']},
  'exc-leopard': {'provider':'commons','queries':['A watchful leopard']},
  'exc-stork': {'provider':'commons','queries':['Painted Stork on grass']},
};
