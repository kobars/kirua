import { cva } from '@/lib/cva';

/**
 * The row every list in this system is made of. Kept here rather than in
 * `Item.tsx` so that file exports components only, which React Fast Refresh
 * requires.
 *
 * `interactive` is separate from `variant` because the two are independent: an
 * outlined row may or may not be clickable, and a plain row usually is.
 */
export const itemVariants = cva(
  [
    'group/item flex w-full items-center gap-3 rounded-md text-start',
    'font-text text-fg',
    'transition-colors duration-fast ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'aria-disabled:pointer-events-none aria-disabled:text-on-disabled',
  ],
  {
    variants: {
      variant: {
        plain: '',
        outline: 'border border-line-subtle bg-raised shadow-resting',
        muted: 'bg-sunken',
      },
      size: {
        sm: 'px-3 py-2 text-body-sm [--icon-size:var(--icon-sm)]',
        md: 'px-4 py-3 text-body-md [--icon-size:var(--icon-md)]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-ghost-hover',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'plain',
      size: 'md',
      interactive: false,
    },
  },
);
