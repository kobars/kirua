/** Which corner a `CornerGlint` tucks into, named by reading direction rather
 *  than by screen side: `start` is the left in English and the right in Arabic. */
export type Corner = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

/**
 * Normalises the `glint` prop shared by Card and SpotlightPanel, so callers can
 * pass one corner, several, or `false`.
 *
 * Lives outside the component module so that module exports components only,
 * which is what React Fast Refresh needs to hot-reload it.
 */
export function resolveGlints(glint: Corner | Corner[] | false | undefined): Corner[] {
  if (!glint) return [];
  return Array.isArray(glint) ? glint : [glint];
}
