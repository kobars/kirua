import { cva } from '@/lib/cva';

/**
 * A card title's size, from the heading scale. Unset is `heading-lg`, the
 * card's own default; a product name in a grid of nine is `body-md`, because
 * a grid of display-size names is a wall. `display-md` is for a title that is
 * a figure — the price of a plan.
 *
 * Only the size moves. The weight, the face and the colour stay the title's.
 */
export const cardTitleVariants = cva('', {
  variants: {
    size: {
      'heading-lg': 'text-heading-lg',
      'heading-md': 'text-heading-md',
      'heading-sm': 'text-heading-sm',
      'body-md': 'text-body-md',
      'display-md': 'text-display-md',
    },
    /** Tabular figures, so three prices in a row of cards line up digit for digit. */
    numeric: { true: 'tabular-nums', false: '' },
  },
});
