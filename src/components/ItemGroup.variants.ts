import { cva } from '@/lib/cva';

/**
 * The container a list of `Item` rows sits in.
 *
 * It has variants at all because two screens had already typed the same three
 * utilities onto it by hand — `rounded-lg border border-line-subtle`, in
 * `examples/social/Explore.tsx` and `examples/social/Notifications.tsx`. The
 * same decoration written twice is a variant that has not been declared yet,
 * and the second copy is where it stops being a coincidence.
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
       */
      outlined: 'overflow-hidden rounded-lg border border-line-subtle',
    },
  },
  defaultVariants: { variant: 'plain' },
});
