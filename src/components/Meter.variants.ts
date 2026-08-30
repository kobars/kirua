import { cva } from '@/lib/cva';

/**
 * The track. `sm` is the one that sits in a table cell beside its own number,
 * where the bar is a shape you read at a glance and the number is the value.
 */
export const meterVariants = cva('w-full overflow-hidden rounded-pill bg-sunken', {
  variants: {
    size: { sm: 'h-1.5', md: 'h-2' },
  },
  defaultVariants: { size: 'md' },
});
