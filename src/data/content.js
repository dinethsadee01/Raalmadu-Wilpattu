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
    title: 'Ten guests, not a hundred',
    body: 'Three bedrooms and a maximum of ten guests. There is no reception desk and no queue for breakfast. Just Kuma and the team, who will know your name by the second morning.',
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
    body: 'Take all three bedrooms (up to ten guests), with the pool, the terrace and the kitchen to yourselves. We will build the menu around your group.',
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

export const testimonials = [
  {
    quote:
      'Beautiful location in the middle of nature and rice fields. Very clean, spacious rooms and an amazing pool with views over the green surroundings.',
    source: 'Verified Booking.com guest',
  },
  {
    quote:
      'We saw a leopard, a bear, two crocodiles, apes and many stunning birds. The staff were incredibly kind and the Sri Lankan food for dinner and breakfast was amazing.',
    source: 'Verified Booking.com guest',
  },
  {
    quote:
      'A unique and special place in the middle of Wilpattu. You can see elephants right at the resort as they come to drink at the pond.',
    source: 'Verified Booking.com guest',
  },
];
