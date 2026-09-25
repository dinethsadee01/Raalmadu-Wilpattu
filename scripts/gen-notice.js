/**
 * gen-notice.js — regenerates NOTICE from assets/images/credits.json.
 *
 * The photography in this repository is third-party Creative Commons work.
 * Several images are CC BY-SA, which requires attribution and carries
 * share-alike obligations that the repository's own LICENSE does not override.
 * NOTICE is the attribution record that satisfies those licences.
 *
 * Run it whenever the image set changes:
 *   npm run notice
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CREDITS = path.join(ROOT, 'assets', 'images', 'credits.json');
const OUT = path.join(ROOT, 'NOTICE');

/** Openverse sometimes returns a bare slug ("by-sa") with no version. */
function normaliseLicence(raw) {
  const v = String(raw || '').trim();
  if (!v) return 'See source';
  if (/^(cc\s+)?cc0/i.test(v)) return 'CC0 1.0 (public domain dedication)';
  if (/^public domain$/i.test(v)) return 'Public domain';
  if (/^by-sa$/i.test(v)) return 'CC BY-SA (version unspecified — see source)';
  if (/^by$/i.test(v)) return 'CC BY (version unspecified — see source)';
  return v.replace(/^CC\s+CC/i, 'CC');
}

/** Wikimedia often stores the artist as a run-on string with stray whitespace. */
const tidy = (s) => String(s || 'Unknown').replace(/\s+/g, ' ').trim();

const credits = JSON.parse(await fs.readFile(CREDITS, 'utf8'));
const entries = Object.entries(credits).sort(([a], [b]) => a.localeCompare(b));

const counts = {};
for (const [, c] of entries) {
  const l = normaliseLicence(c.license);
  counts[l] = (counts[l] || 0) + 1;
}

const body = entries
  .map(([key, c]) => {
    const lines = [
      `${key}  (${c.file})`,
      `    Title    : ${tidy(c.title)}`,
      `    Author   : ${tidy(c.creator)}`,
      `    Licence  : ${normaliseLicence(c.license)}`,
    ];
    if (c.licenseUrl) lines.push(`    Terms    : ${c.licenseUrl}`);
    if (c.source) lines.push(`    Source   : ${c.source}`);
    return lines.join('\n');
  })
  .join('\n\n');

const notice = `NOTICE — third-party photography
================================================================================

This file is the attribution record for the photographs in this repository. It
is required: the images are licensed from their authors under Creative Commons
terms, and those terms — not the repository's LICENSE — govern their use.

  * The repository LICENSE covers the code, tooling, stylesheet and written
    copy only. It does not and cannot relicense the images below.
  * CC BY requires attribution.
  * CC BY-SA requires attribution AND carries share-alike obligations on
    derivative works of the image itself.
  * Attribution is also published on the live site at /image-credits/.

All ${entries.length} photographs are PLACEHOLDERS. They depict the Wilpattu region and
comparable properties, not Raalmadu Wilpattu itself. Room, pool and dining
images in particular do not show the actual rooms. They are to be replaced by
the hotel's own photography before launch; see README → "Photography".

Licences in use
--------------------------------------------------------------------------------
${Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .map(([l, n]) => `  ${String(n).padStart(2)} x  ${l}`)
  .join('\n')}

Per-image attribution
--------------------------------------------------------------------------------

${body}

================================================================================
Regenerate this file with \`npm run notice\` after changing the image set.
Generated from assets/images/credits.json.
`;

await fs.writeFile(OUT, notice);
console.log(`NOTICE written: ${entries.length} images, ${Object.keys(counts).length} distinct licences`);
