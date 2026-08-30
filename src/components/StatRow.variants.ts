import { cva } from '@/lib/cva';

/**
 * A wrapping line of inline stats, or a grid of tiles.
 *
 * The grid is the point. A wrapping flex row leaves the last tile a different
 * width from the rest, and a row of tiles whose numbers do not line up is a row
 * of tiles that has stopped being a comparison. `auto-fit` rather than a fixed
 * column count because the two screens using it have three tiles and four, and
 * a named count would have been wrong for one of them; at 320px it collapses to
 * a single column on its own.
 *
 * Its own file rather than a second export from `Stat.variants.ts`, because
 * `variants.test.tsx` checks every cva in a module against one `data-slot` —
 * the one named by the file. Two roots, two files.
 */
export const statRowVariants = cva('', {
  variants: {
    variant: {
      inline: 'flex flex-wrap items-center gap-x-6 gap-y-2',
      tile: 'grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4',
    },
  },
  defaultVariants: { variant: 'inline' },
});
