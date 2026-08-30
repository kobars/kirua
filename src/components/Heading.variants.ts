import { cva } from '@/lib/cva';

/**
 * Size is a separate axis from level, and that separation is the whole point.
 *
 * The values are the type scale's own step names rather than an invented
 * `lg | md | sm`, because `md` alone cannot say whether it means `heading-md`
 * or `body-md` — and the examples used both as headings, nine times and
 * seventeen times respectively.
 *
 * The three `display` steps carry `font-display` with them. In this system a
 * display step *is* the display face: Luckiest Guy is single-weight and
 * uppercase-only, and a display size set in the text face is not a size the
 * system has an opinion about.
 *
 * Every heading balances. Before this component the examples wrote
 * `text-balance` three times out of four at the same level, and nobody had
 * chosen either way — so it is chosen here, once, and there is no prop to get
 * it wrong with. A balanced heading is right whenever the line count is small,
 * which is what a heading is.
 */
export const headingVariants = cva('text-balance text-fg', {
  variants: {
    size: {
      'display-xl': 'font-display text-display-xl',
      'display-lg': 'font-display text-display-lg',
      'display-md': 'font-display text-display-md',
      'heading-lg': 'font-text text-heading-lg font-semibold',
      'heading-md': 'font-text text-heading-md font-semibold',
      'heading-sm': 'font-text text-heading-sm font-semibold',
      'body-md': 'font-text text-body-md font-semibold',
      'body-sm': 'font-text text-body-sm font-semibold',
    },
  },
  defaultVariants: { size: 'heading-md' },
});
