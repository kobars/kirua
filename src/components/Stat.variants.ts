import { cva } from '@/lib/cva';

/**
 * The same number, arranged two ways.
 *
 * `inline` is the reference design's engagement row: an icon and a short pair
 * on one line, sized to sit beside body copy. `tile` is what a dashboard opens
 * with: the figure large and tabular, the caption quiet underneath.
 *
 * One component with a variant rather than two components, because they share
 * their semantics exactly — a value and the label that says what it counts —
 * and differ only in arrangement.
 */
export const statVariants = cva('text-fg-secondary', {
  variants: {
    variant: {
      inline: 'inline-flex items-center gap-2 [--icon-size:var(--icon-md)]',
      tile: 'flex flex-col items-start gap-1 [--icon-size:var(--icon-lg)]',
    },
  },
  defaultVariants: { variant: 'inline' },
});
