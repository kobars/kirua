import { cva } from '@/lib/cva';

/**
 * `plain` drops the calendar's own surface, for a calendar already inside a
 * card. It keeps 4px of padding: the calendar scrolls sideways on a narrow
 * screen, a scroller clips, and a day's focus ring reaches 4px past the day.
 */
export const calendarVariants = cva('', {
  variants: {
    variant: {
      raised: '',
      plain: 'bg-transparent p-1',
    },
  },
});
