import { cva } from '@/lib/cva';

/**
 * A data cell's figures, tone and wrapping.
 *
 * `numeric` is tabular figures, so a column of amounts lines up digit for
 * digit. `nowrap` keeps a date or a code on one line; the table scrolls
 * sideways in its own box rather than breaking "12 Mar 2026" in two.
 */
export const tableCellVariants = cva('', {
  variants: {
    numeric: { true: 'tabular-nums', false: '' },
    tone: {
      primary: 'text-fg',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
    },
    nowrap: { true: 'whitespace-nowrap', false: '' },
  },
});
