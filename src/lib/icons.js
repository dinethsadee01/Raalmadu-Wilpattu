/**
 * Inline line icons. Drawn on a 24px grid with a 1.5 stroke in currentColor,
 * so each one takes the colour of the text around it and costs no request.
 * Icons are decorative only: the text beside them always carries the meaning,
 * which is why every one is aria-hidden.
 */

const PATHS = {
  tick:
    '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.6"/>',
  tag:
    '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0z"/><circle cx="8" cy="8" r="1.6"/>',
  arrow:
    '<path d="M5 12h14M13 6l6 6-6 6"/>',
  hut:
    '<path d="M3 12.5 12 4l9 8.5"/><path d="M6.5 9.2 5 13.5h14l-1.5-4.3"/><path d="M8.5 7.6 8 13.5M12 4.6v8.9M15.5 7.6l.5 5.9"/><path d="M6.5 13.5V20h11v-6.5"/><path d="M10.5 20v-3.5h3V20"/>',
  pot:
    '<path d="M3.5 11h17"/><path d="M5 11c0 5 3 8.5 7 8.5s7-3.5 7-8.5"/><path d="M8 20h8"/><path d="M9 8.2c-1-1.2 1-2 0-3.5M12 8.2c-1-1.2 1-2 0-3.5M15 8.2c-1-1.2 1-2 0-3.5"/>',
  sunleaf:
    '<circle cx="12" cy="7" r="2.5"/><path d="M12 2v1.2M7.6 3.8l.8.8M16.4 3.8l-.8.8M5.6 7h1.2M17.2 7h1.2"/><path d="M5 21c0-5 3.5-8.5 9-9 .5 5.5-3 9-9 9z"/><path d="M5 21c2.5-2.5 4.5-4 7-5.5"/>',
  stethoscope:
    '<path d="M5 3h2M13 3h2M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  heart:
    '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  leaf:
    '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c4-5 7-7 10-8"/>',
  utensils:
    '<path d="M5 3v5a2 2 0 0 0 4 0V3M7 3v18"/><path d="M17 3c-2 2-2 7 0 9v9"/>',
  fan:
    '<circle cx="12" cy="12" r="1.5"/><path d="M12 10.5c-1-3-.8-6.5 1.8-7 2.4 1.6.6 5.6-1.8 7z"/><path d="M12 10.5c-1-3-.8-6.5 1.8-7 2.4 1.6.6 5.6-1.8 7z" transform="rotate(120 12 12)"/><path d="M12 10.5c-1-3-.8-6.5 1.8-7 2.4 1.6.6 5.6-1.8 7z" transform="rotate(240 12 12)"/>',
  chef:
    '<path d="M7 14a4 4 0 1 1 2-7.5 3.5 3.5 0 0 1 6 0A4 4 0 1 1 17 14v6H7z"/><path d="M7 17h10"/>',
  candle:
    '<rect x="9" y="11" width="6" height="10" rx="1"/><path d="M12 9v2"/><path d="M12 3c1.6 2 1.6 3.6 0 5.2-1.6-1.6-1.6-3.2 0-5.2z"/>',
  flame:
    '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-1.5-2-3-2 2-3 4.5-3 7a6 6 0 0 0 6 6z"/>',
  grill:
    '<path d="M4 10h16a8 8 0 0 1-16 0z"/><path d="M8 17l-2 4M16 17l2 4M12 18v3"/><path d="M9 3c-1 1 1 2 0 3.5M14 3c-1 1 1 2 0 3.5"/>',
  waves:
    '<path d="M2 9c2 0 2-1.5 4-1.5S8 9 10 9s2-1.5 4-1.5S16 9 18 9s2-1.5 4-1.5"/><path d="M2 14c2 0 2-1.5 4-1.5S8 14 10 14s2-1.5 4-1.5S16 14 18 14s2-1.5 4-1.5"/><path d="M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5S16 19 18 19s2-1.5 4-1.5"/>',
  wheelchair:
    '<circle cx="11" cy="4" r="1.6"/><path d="M11 7.5v5.5h5l2 5h2"/><path d="M11 10h4"/><path d="M8 10.4a5 5 0 1 0 7 6.6"/>',
  raft:
    '<path d="M4 12h16v3H4z"/><path d="M8 12v3M12 12v3M16 12v3"/><path d="M15 3l-3 9"/><path d="M2 20c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',
  wifi:
    '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>',
  binoculars:
    '<circle cx="6.5" cy="16" r="3.5"/><circle cx="17.5" cy="16" r="3.5"/><path d="M10 16h4M3.5 14l2-8h3l1.5 8M20.5 14l-2-8h-3L14 14"/>',
  river:
    '<path d="M6 3c3 3-2 6 1 9s-2 6 1 9"/><path d="M16 3c3 3-2 6 1 9s-2 6 1 9"/>',
  ruins:
    '<path d="M3 21h18M5 21v-9M9 21v-9M15 21v-6M19 21v-9"/><path d="M3 10h18L12 4z"/>',
  mountain:
    '<path d="M2 20l7-11 4 6 3-4 6 9z"/><circle cx="17" cy="5" r="2"/>',
  stupa:
    '<path d="M12 2v3M10.5 5h3v2.5h-3z"/><path d="M5 16a7 7 0 0 1 14 0"/><path d="M3 16h18v2H3zM2 21h20"/>',
  beach:
    '<path d="M7 14a5 5 0 0 1 10 0"/><path d="M12 5v2M5.6 8l1.4 1.4M18.4 8L17 9.4M3 14h2M19 14h2"/><path d="M2 19c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',
  bird:
    '<path d="M3 17c5 1 9-1 11-5l2-4a2.6 2.6 0 0 1 5 1l-2 1c0 6-5 9-11 9"/><path d="M13 12L9 7c-2 0-3 2-2 4"/><path d="M18 8.5h.01"/>',
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  building:
    '<path d="M4 21V5l8-3v19M12 8l8 3v10M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
  chat:
    '<path d="M4 20l1.4-4A8 8 0 1 1 8.6 19z"/><path d="M9 10.5c.5 2 2 3.5 4 4l1.2-1.2 2 1-.6 1.6c-3.6 0-7-3.4-7-7l1.6-.6 1 2z"/>',
  car:
    '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v2H3zM5 11h14"/><circle cx="7.5" cy="13.5" r=".8" fill="currentColor"/><circle cx="16.5" cy="13.5" r=".8" fill="currentColor"/><path d="M6 18v2M18 18v2"/>',
  plane:
    '<path d="M10.5 13.5L3 11l1-1.5 8 .5 4.5-5a1.8 1.8 0 0 1 2.5 2.5l-5 4.5.5 8-1.5 1-2.5-7.5-3 3v2.5L6 21l-1-2.5L2.5 17.5 4 16.5h2.5z"/>',
  track:
    '<path d="M8 21c0-6 8-6 8-12 0-3-2-6-4-6"/><path d="M5 21h4M15 21h4"/><circle cx="17" cy="16" r="1" fill="currentColor"/><circle cx="6" cy="9" r="1" fill="currentColor"/>',
  clock:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  pin:
    '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
};

/** Render a named icon. Throws on an unknown name, like picture() does. */
export function icon(name, className = '') {
  const paths = PATHS[name];
  if (!paths) throw new Error(`Unknown icon "${name}". Add it to src/lib/icons.js.`);
  return `<svg class="icon${className ? ` ${className}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}
