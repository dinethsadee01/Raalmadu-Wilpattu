/** Shared content blocks used across pages. */

/** Facility groups — rendered on the home page, and used for Hotel amenityFeature JSON-LD. */
export const facilities = [
  {
    heading: 'Outdoors & pool',
    icon: 'water',
    items: [
      'Outdoor swimming pool, open year-round',
      'Pool towels provided',
      'Garden and shaded outdoor furniture',
      'BBQ facilities',
      'Picnic area',
      'Terrace overlooking the lagoon',
    ],
  },
  {
    heading: 'Food & drink',
    icon: 'leaf',
    items: [
      'Restaurant serving Sri Lankan home cooking',
      'Breakfast served in the room on request',
      'Packed breakfasts and lunches for safari days',
      'Meals for children',
      'Wine and beer available',
      'Special diets catered for with notice',
    ],
  },
  {
    heading: 'Things to do',
    icon: 'binoculars',
    items: [
      'Wilpattu safari drives arranged at the lodge',
      'Guided birdwatching walks',
      'Hiking and jungle trails',
      'Water sports on the lagoon',
      'Board games and books',
      'Elephant and crocodile watching from the property',
    ],
  },
  {
    heading: 'Services & practicalities',
    icon: 'key',
    items: [
      'Free private parking on site',
      'Airport and Colombo transfers arranged',
      'Wake-up service',
      'Ironing facilities',
      'Contactless check-in and cashless payment',
      'English, Sinhala and Tamil spoken',
    ],
  },
];

/** Homepage "why here" pillars. */
export const pillars = [
  {
    title: 'Inside the wildlife corridor',
    body: 'The lodge sits where the Kala Oya meets the Wilpattu boundary. Elephants come down to drink at the pond at the end of the property, and crocodiles work the lagoon below the terrace.',
  },
  {
    title: 'Forty guests, not four hundred',
    body: 'Six units across 10.5 acres and a maximum of forty guests. There is no reception desk and no queue for breakfast. Just Kuma and the team, who will know your name by the second morning.',
  },
  {
    title: 'Food worth staying in for',
    body: 'Every meal is cooked fresh to order. Rice and curry with eight or nine dishes, string hoppers at breakfast, and fish brought up from the coast that afternoon.',
  },
];

export const experiences = [
  {
    slug: 'wilpattu-safari',
    title: 'Wilpattu leopard safari',
    duration: 'Half day or full day',
    image: 'exp-leopard',
    alt: 'Sri Lankan leopard resting on a branch in Wilpattu National Park',
    body: 'Wilpattu is the largest and oldest national park in Sri Lanka, and far quieter than Yala. We arrange the jeep, the tracker and the park permits, and we will have you at the gate for opening. Leopard, sloth bear, spotted deer, elephant and mugger crocodile are all resident.',
    detail: [
      'Full-day drives leave before dawn and return mid-afternoon with a packed lunch.',
      'Half-day drives run either at first light or from early afternoon to dusk.',
    ],
  },
  {
    slug: 'birdwatching',
    title: 'Birdwatching on the villus',
    duration: '2–3 hours',
    image: 'exp-birds',
    alt: 'Painted storks wading in a shallow villu lake at Wilpattu National Park',
    body: 'The villus, natural rain-fed lakes, draw painted storks, spot-billed pelicans, open-bills and the occasional black-necked stork. More than 200 species have been recorded in and around the park, and a good share of them pass through the lodge garden.',
    detail: [
      'Best between November and April, in the first two hours after sunrise.',
      'Binoculars available at the lodge; a local guide can be arranged the evening before.',
    ],
  },
  {
    slug: 'lagoon-and-river',
    title: 'Kala Oya lagoon & mangroves',
    duration: '2 hours',
    image: 'exp-lagoon',
    alt: 'Mangrove-lined lagoon channel at the Kala Oya estuary near Raalmadu Wilpattu',
    body: 'The Kala Oya estuary holds one of the densest mangrove stands in Sri Lanka. A slow boat through the channels at dusk is the best way to see kingfishers, monitor lizards and, at a respectful distance, the resident crocodiles.',
    detail: [
      'Arranged with local boatmen from the village, so half the fee stays in the community.',
      'Life jackets provided. Suitable for children over six.',
    ],
  },
  {
    slug: 'village-and-kitchen',
    title: 'Village walk & cooking session',
    duration: '3 hours',
    image: 'exp-cooking',
    alt: 'Sri Lankan rice and curry spread with several vegetable dishes served at Raalmadu Wilpattu',
    body: 'Walk out through the paddy with one of the team, then come back and cook. You will grate the coconut, temper the spices and put together a rice and curry with whatever the garden gave up that morning. Then you eat it.',
    detail: [
      'Vegetarian and vegan versions available.',
      'Best booked at least a day ahead, so the market run can be planned around it.',
    ],
  },
];

export const offers = [
  {
    slug: 'safari-and-stay',
    title: 'Safari & Stay',
    kicker: 'Most popular',
    body: 'Two nights in the room of your choice, breakfast and dinner daily, and a full-day Wilpattu game drive with park fees, jeep, tracker and packed lunch included.',
    terms: 'Minimum two nights. Subject to park permit availability. Not combinable with other offers.',
    cta: 'Check dates',
  },
  {
    slug: 'long-stay',
    title: 'Stay four, pay three',
    kicker: 'Low season',
    body: 'Book four consecutive nights and the fourth is on us. Ideal if you want to actually settle in: the lagoon, the pool, a book, and one unhurried safari in the middle.',
    terms: 'Available outside December and January. The free night applies to the lowest-rated night.',
    cta: 'Check dates',
  },
  {
    slug: 'whole-lodge',
    title: 'The whole lodge',
    kicker: 'Groups & families',
    body: 'Take the whole property (up to forty guests across the villas, the glamping lodge and the Family Residence), with the pool, the terrace and the kitchen to yourselves. We will build the menu around your group.',
    terms: 'Minimum two nights. Full-board pricing on request.',
    cta: 'Enquire',
  },
];

export const faqs = [
  {
    q: 'How do I get to Raalmadu Wilpattu?',
    a: 'The lodge is about 3.5 hours from Bandaranaike International Airport (CMB) and roughly 170 km from Colombo. The final stretch along Raalmadu Road is unsealed, so a tuk-tuk or a high-clearance vehicle is best. Tell us your arrival time and we will arrange a transfer or meet you at the turn-off.',
  },
  {
    q: 'What are the check-in and check-out times?',
    a: 'Check-in is from 14:00 and check-out is until 11:00. Early check-in and late check-out can usually be arranged. Just ask when you book, and note that guests must be at least 18 to check in.',
  },
  {
    q: 'Will I actually see wildlife from the lodge?',
    a: 'Often, yes. Elephants come down to drink at the pond at the end of the property and cross the river; crocodiles live in the lagoon; peacocks, monkeys and a long list of birds are permanent residents. Nothing is guaranteed (it is wild), but most guests see something without leaving the garden.',
  },
  {
    q: 'Can you arrange a Wilpattu safari?',
    a: 'Yes. We book the jeep, tracker and park permits for you and can have you at the gate for opening. Half-day and full-day drives are both available, and a packed breakfast or lunch comes with it.',
  },
  {
    q: 'Is breakfast included?',
    a: 'Breakfast is included on most rates. All meals are cooked fresh to order, and we can cater for vegetarian, vegan and most allergy requirements if you let us know in advance.',
  },
  {
    q: 'Is there Wi-Fi and mobile signal?',
    a: 'The lodge is deliberately remote and connectivity is limited. Mobile signal is patchy and best near the main terrace. Most guests treat it as part of the point.',
  },
  {
    q: 'Are pets allowed?',
    a: 'Pets are not allowed, largely because of the wildlife that moves through the property.',
  },
  {
    q: 'When is the best time to visit Wilpattu?',
    a: 'The dry season from February to October is the most reliable for game viewing, when animals concentrate around the villus. February to April is the sweet spot. The park normally closes for a short period in September, so check with us before booking those dates.',
  },
];

/**
 * Guest reviews for the homepage carousel — excerpts of verified Booking.com
 * reviews, quoted as written and shortened only at sentence boundaries.
 * Shown in the UI only: third-party reviews are deliberately kept out of the
 * JSON-LD graph (see the aggregateRating note in CLAUDE.md).
 */
export const testimonials = [
  {
    title: 'Incredible location with super helpful staff who made our stay unforgettable',
    quote:
      'This property is right in the middle of the nature. I have never met a team more helpful and attentive. They organized our safari, lit a bonfire for us, and even picked us up from the main road because elephants sometimes block the road.',
    name: 'Ece',
    country: 'Turkey',
    score: 10,
    stayed: 'July 2026',
  },
  {
    title: 'Great and calm place in the jungle with friendly staff',
    quote:
      'Warm welcome at arrival. The food was really good and more than enough. It was my birthday during our staying and they surprised me with a private little party which was very thoughtful.',
    name: 'Victor',
    country: 'Belgium',
    score: 10,
    stayed: 'March 2026',
  },
  {
    title: 'Wilpattu magic',
    quote:
      'Location was very quiet and secluded. The room we had was excellent and the pool area was fantastic. Wildlife around the resort was awesome with monkeys, crocodiles in the lagoon and birds aplenty!',
    name: 'Dean',
    country: 'Australia',
    score: 9,
    stayed: 'March 2026',
  },
  {
    title: 'Beautiful and peaceful stay, with the most wonderful and attentive hosts',
    quote:
      'Very remote and peaceful, surrounded by nature including watching monkeys from the pool! The staff were amazing and catered to every need — sorting our safari for us and cooking delicious meals.',
    name: 'Ellie',
    country: 'United Kingdom',
    score: 10,
    stayed: 'February 2026',
  },
  {
    title: 'Amazing stay in the wild with perfect hosts',
    quote:
      'Kuma and his team were amazing hosts. The room was near the lake which was a lovely view in the morning sun, occasional crocodiles we saw in the water too which was fun experience! Really feels like you’re in the wild.',
    name: 'Rebecca',
    country: 'United Kingdom',
    score: 10,
    stayed: 'January 2026',
  },
  {
    title: 'Amazing stay in the middle of nature close to Wilpattu',
    quote:
      'A beautiful place in the middle of nature and rice fields, surrounded by wildlife. The pool is stunning and fits perfectly into the peaceful natural setting. At night you fall asleep to the sounds of the animals around you.',
    name: 'Danique',
    country: 'Netherlands',
    score: 10,
    stayed: 'January 2026',
  },
  {
    title: 'We had a really lively stay and would love to come back',
    quote:
      'The staff and manager Kuma were really welcoming and attentive. The rooms were lovely and very in keeping with the safari theme. The pool was stunning and a great place to hang out.',
    name: 'Honor',
    country: 'Australia',
    score: 9,
    stayed: 'February 2026',
  },
];

/** Homepage "eco safari glamping" story — wording supplied by the owner. */
export const ecoRetreat = {
  kicker: 'Eco safari glamping site',
  title: 'Experience nature at its purest',
  paragraphs: [
    'Located within an active elephant corridor at Wilpattu National Park, Raalmadu Resorts provides an immersive wilderness retreat. Set amid dense forests, a peaceful lake, and vibrant wildlife, it is an ideal spot for travelers seeking tranquility, adventure, and genuine eco-luxury.',
    'The resort spans 10.5 acres of jungle forest along the edge of Wilpattu, where guests may observe elephants, crocodiles, and more than 500 species of exotic birds in their natural surroundings. Visitors enjoy the comfort of a fully solar-powered eco-retreat designed to harmonize with nature, and may occasionally glimpse leopards, bears, and other wildlife.',
  ],
  stats: [
    { value: '10.5', unit: 'acres', label: 'of jungle forest on the edge of Wilpattu' },
    { value: '500+', unit: 'species', label: 'of exotic birds in their natural surroundings' },
    { value: '100%', unit: 'solar', label: 'a fully solar-powered eco-retreat' },
  ],
  wildlife: ['Elephants', 'Crocodiles', 'Leopards', 'Sloth bears', 'Painted storks', 'Peacocks', 'Kingfishers', 'Spotted deer'],
};

/** Homepage "why Eluwankulam" reasons, in the owner's order. */
export const eluwankulamReasons = [
  'Easily connects to Colombo, the airport, Anuradhapura and Jaffna',
  'Sea excursions to Kalpitiya for dolphin watching',
  'Historical sites close at hand',
  'Faster access to the heart of Wilpattu for better wildlife viewing',
  'Fewer crowds at the gate and on the tracks',
];

/* ---------------------------------------------------------------- about us */
// Everything below is the owner's own wording from the About Us brief,
// lightly edited for grammar. Rendered on /about/.

/** The founder's story, told as four steps. */
export const aboutStory = [
  {
    icon: 'stethoscope',
    title: "A healer's belief",
    text: 'As a medical professional who believes that nature plays an important role in healing, Rizvi Hasan developed a passion for the wonders of the wilderness.',
  },
  {
    icon: 'compass',
    title: 'A hike, twenty years ago',
    text: 'On a hike in Wilpattu 20 years ago he discovered his home away from home: almost an island, surrounded by a lake, a stream and the mighty Wilpattu jungle.',
  },
  {
    icon: 'heart',
    title: 'A passion worth sharing',
    text: 'He wanted to share his passion with other nature lovers, both Sri Lankans and overseas visitors.',
  },
  {
    icon: 'leaf',
    title: 'Raalmadu comes to life',
    text: "Wasting no time, he brought Raalmadu to life, creating an eco-friendly resort and an exotic holiday destination for nature lovers seeking tranquillity within Sri Lanka's largest forest reserve.",
  },
];

/** Restaurant and common areas: the feature card on /about/. */
export const aboutDining = [
  { icon: 'fan', text: 'Ceiling fans throughout our open-air design, for natural cooling' },
  { icon: 'chef', text: 'A modern kitchen run by experienced cooks of traditional food' },
  { icon: 'candle', text: 'Romantic candle-lit dinners on the floating deck' },
  { icon: 'flame', text: "A wood-fired oven for pizzas, bread, fish buns and our authentic 'Kimbula banis'" },
  { icon: 'grill', text: 'Poolside BBQ' },
];

export const aboutFacilities = [
  {
    icon: 'waves',
    title: 'Swimming pool',
    text: "A modern swimming pool with a separate children's pool.",
  },
  {
    icon: 'wheelchair',
    title: 'Wheelchair access',
    text: 'Step-free access for differently-abled guests.',
  },
  {
    icon: 'raft',
    title: 'Arrive by land or by lake',
    text: "Drive straight to the resort across a causeway, or park and cross the lake on our specially built 'Paaruwa'.",
  },
  {
    icon: 'wifi',
    title: 'Free Wi-Fi',
    text: 'Stay in touch, if you really want to.',
  },
];

/** Experiences & excursions. `wide` cards span two columns on desktop. */
export const aboutExcursions = [
  {
    icon: 'binoculars',
    title: 'Wilpattu National Park',
    tag: 'Wildlife',
    wide: true,
    text: "The largest national park in Sri Lanka, Wilpattu is famous for its 'villus' (natural lakes), dense forest and diverse wildlife. Jeep safaris bring you close to leopards, elephants, sloth bears, deer and a dazzling array of birds.",
  },
  {
    icon: 'river',
    title: 'Gange Vadiya',
    tag: 'Riverside',
    text: "Set along the Moderagam Aru river, Gange Vadiya is a peaceful hideaway for riverside relaxation, birdwatching and local meals, framed by nature's soundtrack.",
  },
  {
    icon: 'ruins',
    title: "Kuweni's Palace (Kuweni Maligawa)",
    tag: 'Heritage',
    text: 'Near Eluwankulam lie the ancient ruins believed to be linked to Queen Kuweni, a legendary figure in Sri Lankan history. A window into myth and mystery.',
  },
  {
    icon: 'mountain',
    title: 'Hiking trails',
    tag: 'On foot',
    wide: true,
    trails: [
      { name: 'Moderagam Aru Trail', text: 'A gentle riverside hike, perfect for early-morning or evening birdwatching.' },
      { name: 'Forest trails around Eluwankulam', text: 'Wander through dry-zone forest and spot endemic flora and fauna, with a chance to glimpse wild elephants.' },
    ],
  },
  {
    icon: 'stupa',
    title: 'Thanthirimale Temple',
    tag: 'Heritage',
    text: 'A short drive from Wilpattu, this ancient Buddhist temple perched on rocky outcrops offers panoramic views and a haven of tranquillity.',
  },
  {
    icon: 'beach',
    title: 'Chilaw sand dunes and beaches',
    tag: 'Coast',
    text: 'South of Eluwankulam, these scenic beaches are perfect for relaxation, swimming and sunset views.',
  },
  {
    icon: 'bird',
    title: 'Pambala wetlands',
    tag: 'Birdlife',
    text: 'A paradise for bird lovers, these wetlands teem with migratory and resident species, especially from November to March.',
  },
];

/**
 * Sites within 30 km, or about half an hour, of the lodge.
 *
 * `bearing` (degrees clockwise from north) and `km` place each site on the
 * live radar on /excursions/. VERIFY: they are approximate, read off a map
 * for a schematic, and should be checked with the owner. `side` says which
 * way the radar label opens (left, right or up) so neighbouring labels do not collide.
 */
export const nearbySites = [
  { name: 'Kudiramalai Point, where Prince Vijaya landed on this island in 543 BCE', short: 'Kudiramalai Point', bearing: 356, km: 31, side: 'left' },
  { name: 'Tomb of a Muslim saint at Kudiramalai Point', short: "Saint's tomb", bearing: 3, km: 28, side: 'right' },
  { name: 'Palace of Kuweni', short: "Kuweni's Palace", bearing: 338, km: 12, side: 'left' },
  { name: 'Kalaru Survey Tower', short: 'Kalaru Tower', bearing: 22, km: 19, side: 'right' },
  { name: 'Baobab tree at Pomparippu Aru', short: 'Baobab tree', bearing: 302, km: 14, side: 'right' },
  { name: 'Veli Vehera archaeological site', short: 'Veli Vehera', bearing: 48, km: 13, side: 'left' },
  { name: 'Pomparippu ancient burial site', short: 'Pomparippu', bearing: 275, km: 8, side: 'right' },
  { name: 'The Doric Tower', short: 'Doric Tower', bearing: 7, km: 38, side: 'right' },
  { name: 'Arippu Fort', short: 'Arippu Fort', bearing: 353, km: 37, side: 'left' },
  { name: 'Galge Viharaya ruins', short: 'Galge Viharaya', bearing: 95, km: 22, side: 'up' },
  { name: 'Kalpitiya whale and dolphin watching', short: 'Kalpitiya', bearing: 248, km: 24, side: 'right' },
];

/** A suggested day out, in the order it happens. */
export const sampleDay = [
  {
    icon: 'binoculars',
    time: 'Dawn',
    title: 'Into the park at first light',
    text: 'The jeep leaves before sunrise for the Eluwankulama gate, ten minutes away, with a packed breakfast for the drive.',
  },
  {
    icon: 'pot',
    time: 'Midday',
    title: 'Back for lunch and a swim',
    text: 'Return as the heat builds for a home-cooked lunch, a swim in the pool or a slow hour on the lagoon deck.',
  },
  {
    icon: 'ruins',
    time: 'Afternoon',
    title: 'History and legend',
    text: "Once the sun softens, drive out to Kuweni's Palace, Thanthirimale's rock temple or the burial site at Pomparippu.",
  },
  {
    icon: 'candle',
    time: 'Evening',
    title: 'Sunset on the water',
    text: 'Watch the birds come in to roost over the lagoon, then sit down to a candle-lit dinner on the floating deck.',
  },
];

export const aboutClosingQuote =
  "The greatness of mankind lies in our willingness to share, inspire, and nurture each other's dreams.";
