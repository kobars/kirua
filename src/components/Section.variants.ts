import { cva } from '@/lib/cva';

/**
 * A block within a page: a heading and the thing it names.
 *
 * It carries the same `grid-cols-[minmax(0,1fr)]` as `Container`, because a
 * table one level deeper stretches its column exactly as readily as a table at
 * the page root — and nesting is where the fix was most often forgotten.
 *
 * The gap here is *inside* a block. The gap between blocks belongs to the
 * `Container`, which is the distinction the hand-written shells did not draw:
 * they used one number for both and then differed on which number.
 */
export const sectionVariants = cva('grid grid-cols-[minmax(0,1fr)] content-start', {
  variants: {
    gap: { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' },
  },
  defaultVariants: { gap: 'md' },
});
