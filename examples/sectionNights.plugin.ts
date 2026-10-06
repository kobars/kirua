import type { Plugin } from 'vite';
import { SECTIONS } from './sections.ts';

/** The line in `index.html` the build fills in; as written, it names no section. */
const PLACEHOLDER = 'const sectionNights = {};';

/** `index.html` with each section's night written into its blocking script. */
export function injectSectionNights(html: string): string {
  const nights = JSON.stringify(Object.fromEntries(SECTIONS.map((s) => [s.id, s.night])));
  return html.replace(PLACEHOLDER, `const sectionNights = ${nights};`);
}

/**
 * Gives the blocking script in `index.html` each section's night, so the page
 * paints in it before any module has loaded and `sections.ts` stays the one
 * place the nights are written.
 */
export function sectionNights(): Plugin {
  return { name: 'kirua-section-nights', transformIndexHtml: injectSectionNights };
}
