import { cva } from '@/lib/cva';

/** The space between options. `3` is the default, and the gap a label row needs. */
export const radioGroupVariants = cva('grid', {
  variants: {
    gap: {
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
    },
  },
  defaultVariants: { gap: 3 },
});
