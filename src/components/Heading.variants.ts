import { cva } from '@/lib/cva';

/** Display sizes use the display face; other sizes use the text face. */
export const headingVariants = cva('text-balance text-fg', {
  variants: {
    size: {
      'display-xl': 'font-display text-display-xl',
      'display-lg': 'font-display text-display-lg',
      'display-md': 'font-display text-display-md',
      'heading-lg': 'font-text text-heading-lg font-semibold',
      'heading-md': 'font-text text-heading-md font-semibold',
      'heading-sm': 'font-text text-heading-sm font-semibold',
      'body-md': 'font-text text-body-md font-semibold',
      'body-sm': 'font-text text-body-sm font-semibold',
    },
  },
  defaultVariants: { size: 'heading-md' },
});
