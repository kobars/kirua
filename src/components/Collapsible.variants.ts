import { cva } from '@/lib/cva';

/**
 * `gap` is the space between the trigger row and the panel, owned by the
 * disclosure rather than written as a top padding on every panel. It is
 * padding inside the panel, not a grid gap: a gap appears whole on the
 * first frame of opening and vanishes only after the last frame of closing,
 * while padding inside the clipped panel opens and closes with its height.
 * The base resets the variable so a nested disclosure does not inherit its
 * parent's gap.
 *
 * `rail` draws a rule down the leading edge and no fill: an aside — the
 * reasoning behind an answer — that must not look like the code block or the
 * question beside it. A border survives forced colours, where a fill would
 * not.
 */
export const collapsibleVariants = cva('[--collapsible-gap:0px]', {
  variants: {
    variant: {
      plain: '',
      rail: 'border-s-2 border-line-subtle ps-3',
    },
    gap: {
      1: 'grid [--collapsible-gap:--spacing(1)]',
      2: 'grid [--collapsible-gap:--spacing(2)]',
      3: 'grid [--collapsible-gap:--spacing(3)]',
      4: 'grid [--collapsible-gap:--spacing(4)]',
    },
  },
});
