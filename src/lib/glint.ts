/** Which corner a `CornerGlint` tucks into. */
export type Corner = 'tl' | 'tr' | 'bl' | 'br';

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
