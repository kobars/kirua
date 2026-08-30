import { cva } from '@/lib/cva';

/**
 * Two sizes, matched to the text steps a shortcut appears beside: `sm` in a
 * menu row or tooltip, `md` in body copy.
 */
export const kbdVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-xs border border-field-line bg-field text-on-field',
    'font-text font-medium',
    'select-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 min-w-5 px-1 text-caption',
        md: 'h-6 min-w-6 px-1.5 text-body-sm',
      },
    },
    defaultVariants: { size: 'sm' },
  },
);
