import { cva } from '@/lib/cva';

/**
 * A page's title row: the title block at the start, the page's own actions at
 * the end, wrapping under the title when the row runs out of room.
 *
 * `align="end"` sits the actions on the title block's last line, which is
 * where a button reads as belonging to the description above it. `center` is
 * for a title with no description.
 */
export const pageHeaderVariants = cva('flex flex-wrap justify-between gap-x-4 gap-y-3', {
  variants: {
    align: {
      end: 'items-end',
      center: 'items-center',
    },
  },
  defaultVariants: { align: 'end' },
});
