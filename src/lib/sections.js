/** Page-level section helpers shared by the interior pages. */

import { esc, media, picture, button, breadcrumbs, accentTitle } from './components.js';

/**
 * Interior-page hero. Contains the page's single <h1>.
 * The image is marked `priority` because on these pages it is the LCP element.
 */
export function pageHero({ image, kicker, title, lead, trail }) {
  return `<section class="page-hero">
      <div class="page-hero__media">
        ${picture(image, { sizes: '100vw', priority: true, className: 'ken-burns' })}
      </div>
      <div class="shell page-hero__inner">
        ${kicker ? `<p class="hero__kicker">${esc(kicker)}</p>` : ''}
        <h1>${accentTitle(title)}</h1>
        ${lead ? `<p class="page-hero__lead">${esc(lead)}</p>` : ''}
      </div>
    </section>
    ${trail ? `<div class="shell">${breadcrumbs(trail)}</div>` : ''}`;
}

/** Plain heading block for pages with no hero image (legal, 404). */
export function plainHero({ kicker, title, lead, trail }) {
  return `<section class="plain-hero">
      <div class="shell shell--narrow">
        ${trail ? breadcrumbs(trail) : ''}
        ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}
        <h1>${esc(title)}</h1>
        ${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}
      </div>
    </section>`;
}

export function ctaBand({
  title = 'Come and stay',
  text = 'Tell us your dates and how many of you there are, and we will come back within the day with availability, rates and a plan for the safari.',
  label = 'Check availability',
  href = '/booking/',
  image = 'gal-villu',
} = {}) {
  return `<section class="section cta-band">
      <div class="cta-band__media">${media(image, { sizes: '100vw' })}</div>
      <div class="shell">
        <h2>${accentTitle(title)}</h2>
        <p>${esc(text)}</p>
        ${button(label, href, 'light')}
      </div>
    </section>`;
}

/** Accordion built on native <details>, so it works with JavaScript disabled. */
export function accordion(items) {
  return `<div class="accordion">
      ${items
        .map(
          (item) => `<details>
            <summary>${esc(item.q)}</summary>
            <div class="accordion__body"><p>${esc(item.a)}</p></div>
          </details>`,
        )
        .join('')}
    </div>`;
}
