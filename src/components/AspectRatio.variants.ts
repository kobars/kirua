import { cva } from '@/lib/cva';

/** The box's corner. It clips, so the image or placeholder inside takes the same corner. */
export const aspectRatioVariants = cva('', {
  variants: {
    radius: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
});
