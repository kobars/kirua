import { cva } from '@/lib/cva';

/**
 * Breakpoint visibility, as classes added to the child itself.
 *
 * `from="md"` is `max-md:hidden` and `below="md"` is `md:hidden`. Both are
 * variant-prefixed, so they sort after the child's own `flex` or `inline-flex`
 * in the stylesheet and win without knowing which display the child uses —
 * and tailwind-merge keeps both, because their variants differ.
 *
 * The two can be combined into a range: `from="sm" below="lg"`.
 */
export const visibleVariants = cva('', {
  variants: {
    from: {
      sm: 'max-sm:hidden',
      md: 'max-md:hidden',
      lg: 'max-lg:hidden',
      xl: 'max-xl:hidden',
    },
    below: {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    },
    print: {
      true: '',
      false: 'print:hidden',
    },
  },
  defaultVariants: { print: true },
});
