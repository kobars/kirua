import { cva } from '@/lib/cva';

/**
 * Term and value, in the three arrangements the applications actually draw.
 *
 * The alignment of the values is the whole point of the component. `Item` is
 * the nearest relative and is not this: `Item` is a row with media and actions,
 * sized for a list of things you can act on. A description list is a
 * two-column grid, and a column that does not line up is a column.
 *
 * `split` is the receipt — term at the start, value at the end, the value
 * column right-aligned so the digits stack. `aligned` is a details panel: a
 * fixed term column, so a long value wraps under itself rather than under the
 * term. `stacked` is the narrow-column form, term above value, for a sidebar
 * that has no room for two columns.
 *
 * Three, not one, because all three were already being written by hand — five
 * `<dl>` elements across four applications, and no two of them agreed.
 */
export const descriptionListVariants = cva('grid font-text text-body-sm', {
  variants: {
    layout: {
      /* The value column is `auto`, so it is exactly as wide as its widest
       * value, and `text-end` on the values right-aligns the shorter ones
       * inside it. Alignment belongs to the layout rather than to the
       * `numeric` prop: a right-aligned value is wrong in the other two
       * layouts, where the value column is the one that grows. */
      split: 'grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 [&>dd]:text-end',
      aligned: 'grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-x-3',
      stacked: 'grid-cols-[minmax(0,1fr)]',
    },
    gap: { sm: 'gap-y-1', md: 'gap-y-2', lg: 'gap-y-3' },
  },
  defaultVariants: { layout: 'split', gap: 'md' },
});
