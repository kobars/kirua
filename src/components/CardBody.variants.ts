import { cva } from '@/lib/cva';

/** A card's paragraph size. `lg` is a lead: one or two sentences that open a band. */
export const cardBodyVariants = cva('', {
  variants: {
    size: {
      md: 'text-body-md',
      lg: 'text-body-lg',
    },
  },
});
