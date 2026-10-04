import { cva } from '@/lib/cva';

/**
 * `horizontal` is the row a checkbox or a switch sits in: the control in a
 * first column, and the label, description and error stacked in the second.
 * The first row is centred, so a 20px checkbox and a 24px switch both line up
 * with a one-line label.
 */
export const fieldVariants = cva('group/field w-full', {
  variants: {
    orientation: {
      vertical: 'flex flex-col gap-2',
      horizontal: 'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});
