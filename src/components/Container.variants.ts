import { cva } from '@/lib/cva';

/**
 * The page shell, and the reason it is a component rather than a habit.
 *
 * `grid-cols-[minmax(0,1fr)]` is in the base and cannot be left off. A grid
 * item keeps `min-width: auto`, so a single-column grid sizes its column to its
 * widest child — one wide table, or a four-tab `TabsList`, then stretches the
 * whole page past the viewport instead of scrolling inside its own wrapper.
 * Carried here, it cannot be forgotten at a page root.
 *
 * `content-start` is in the base for the same kind of reason: without it a
 * short page's rows stretch to fill the viewport height, which nobody chooses
 * and everybody notices only on the one screen that is short.
 *
 * The width names are Tailwind's own `max-w-*` steps rather than an invented
 * `narrow | wide`, for the reason `Heading`'s sizes are the type scale's steps:
 * pages use five widths, and a three-name scale would have to round two of
 * them silently.
 */
export const containerVariants = cva(
  'mx-auto grid w-full grid-cols-[minmax(0,1fr)] content-start px-4 md:px-8',
  {
    variants: {
      width: {
        md: 'max-w-md',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        /** No limit: a page beside a rail, which has already been given its width. */
        full: 'max-w-none',
      },
      /** The rhythm between the blocks of a page. */
      gap: { sm: 'gap-4', md: 'gap-6', lg: 'gap-8' },
      /**
       * How far the first block sits from the edge above it. `xs` is a bar
       * rather than a page — a header row, a composer under a transcript.
       */
      pad: { xs: 'py-4', sm: 'py-6', md: 'py-8', lg: 'py-10' },
    },
    defaultVariants: { width: '4xl', gap: 'md', pad: 'sm' },
  },
);
