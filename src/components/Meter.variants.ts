import { cva } from '@/lib/cva';

/**
 * The track. `sm` is the one that sits in a table cell beside its own number,
 * where the bar is a shape you read at a glance and the number is the value.
 * It keeps 8rem however narrow the column's other content: a bar shorter
 * than that no longer reads as a proportion, and an auto-width column would
 * otherwise shrink it to the width of the number beside it.
 */
export const meterVariants = cva('w-full overflow-hidden rounded-pill bg-sunken', {
  variants: {
    size: { sm: 'h-1.5 min-w-32', md: 'h-2' },
  },
  defaultVariants: { size: 'md' },
});
