/**
 * The `--radius-*` scale in pixels, mirrored into JavaScript.
 *
 * `CornerGlint` computes an SVG path from a number, and no component in this
 * system may read CSS during render — that is what keeps it server-renderable.
 * So the scale exists twice, and the copy has to be checked:
 * `src/components/radius.test.tsx` asserts each value against the computed
 * `border-radius` of the component that uses it. Retuning `--radius` then fails
 * a test instead of quietly leaving every corner ornament drawn for the old
 * radius — it still renders, it just stops sitting concentric with the corner.
 *
 * Lives here rather than beside the components for the same reason
 * `Button.variants.ts` and `glint.ts` do: a component module exports components
 * only, which is what React Fast Refresh needs and what
 * `react/only-export-components` enforces.
 */
export const CARD_RADIUS_PX = { md: 16, lg: 22, card: 24, xl: 32 } as const;

/** `--clay-edge`, the line every filled card draws inside its corner. A corner
 *  ornament sits inside that line, so it follows the inner radius. */
export const CARD_EDGE_PX = 3;

/** `--radius-xl`, the reference's hero panel corner. */
export const PANEL_RADIUS_PX = 32;

/** Keeps the blade's arc at the 14px the reference draws on its 22px cards:
 *  32 - 18 = 14. The panel reuses the card's blade rather than scaling it up. */
export const PANEL_GLINT_INSET_PX = 18;
