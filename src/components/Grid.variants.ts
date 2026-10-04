import { cva } from '@/lib/cva';
import { gapScale } from './layout.styles';

/**
 * Equal columns, set per breakpoint.
 *
 * Tailwind's `grid-cols-N` is `repeat(N, minmax(0, 1fr))`, so every column here
 * may shrink below its content and a wide child scrolls inside its own box. A
 * column template written as `1fr` would not: `1fr` is `minmax(auto, 1fr)`,
 * and `auto` is the widest child.
 *
 * Each breakpoint is its own axis with its own literal classes. A computed
 * `md:grid-cols-${n}` would generate nothing, because Tailwind reads source
 * text.
 *
 * `align="start"` lets cards of different heights keep their own height
 * instead of stretching to the tallest in the row.
 */
export const gridVariants = cva('grid content-start', {
  variants: {
    columns: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' },
    sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' },
    md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
    lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
    gap: gapScale,
    align: {
      stretch: 'items-stretch',
      start: 'items-start',
    },
  },
  defaultVariants: { columns: 1, gap: 4, align: 'stretch' },
});
