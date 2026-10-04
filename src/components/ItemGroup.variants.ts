import { cva } from '@/lib/cva';

/**
 * The container a list of `Item` rows sits in.
 *
 * `outlined` gives a list that stands on the page by itself its own edge, so
 * no screen types `rounded-lg border border-line-subtle` onto it by hand.
 *
 * `plain` is the default because most lists sit inside something that already
 * has an edge — a `Card`, a `Sheet` — and a second border there is a line the
 * design did not ask for.
 */
export const itemGroupVariants = cva('flex flex-col', {
  variants: {
    variant: {
      plain: '',
      /**
       * `overflow-hidden` is not decoration: without it a row's own hover fill
       * paints over the rounded corner it is supposed to sit inside, and the
       * first and last rows show a square corner poking past the edge.
       *
       * The rows lose their own corners for the opposite reason: a filled row
       * (an unread `accent` row, a hover) is a band across the list, and a
       * rounded band leaves notches of the group's background at each end.
       */
      outlined:
        'overflow-hidden rounded-lg border border-line-subtle **:data-[slot=item]:rounded-none',
    },
  },
  defaultVariants: { variant: 'plain' },
});
