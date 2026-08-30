/**
 * The class lists for a `Stat`'s two inner spans, keyed by its variant.
 *
 * Not a `*.variants.ts` file, and the reason is mechanical rather than
 * stylistic: `variants.test.tsx` requires every cva exported from
 * `X.variants.ts` to put its classes on the element carrying `X`'s own
 * `data-slot`. These land on children, so a cva here would fail a test that is
 * right about everything else. `menu.styles.ts` carries the same suffix for the
 * same reason.
 */
export const statValue = {
  inline: 'font-text text-body-sm font-medium',
  /** Tabular, so a row of tiles lines its digits up and reads as a comparison. */
  tile: 'font-text text-display-md font-semibold text-fg tabular-nums',
} as const;

export const statLabel = {
  /** Inline, the label runs on from the value inside one sentence. */
  inline: '',
  tile: 'font-text text-body-sm text-fg-secondary',
} as const;
