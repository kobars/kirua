import { cva } from '@/lib/cva';

/**
 * One sender's turn: an avatar beside a column of bubbles.
 *
 * `self` reverses the row rather than naming a side. A flex row runs in the
 * reading direction, so `flex-row-reverse` puts the avatar and the column at
 * the end — the right in English, the left in Arabic — with no physical
 * utility anywhere. The column's alignment follows from the same variant, so a
 * header, a footer and a row of reactions line up under the bubbles they
 * belong to without a prop of their own.
 *
 * `relative` is there for a `VisuallyHidden` name in the header: `sr-only` is
 * positioned, and without a positioned ancestor it lands at the page's edge.
 */
export const messageVariants = cva('relative flex min-w-0 gap-2', {
  variants: {
    from: {
      self: 'flex-row-reverse *:data-[slot=message-content]:items-end',
      other: '',
    },
  },
  defaultVariants: { from: 'other' },
});
