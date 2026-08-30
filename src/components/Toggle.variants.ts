import { cva } from '@/lib/cva';

/**
 * `Button`'s size steps, so a toggle lines up in a toolbar beside real buttons.
 * `outline` is for a toggle standing alone, where the plain one has no edge and
 * is invisible until hovered.
 */
export const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-text font-medium text-fg-secondary',
    'transition-colors duration-fast ease-out',
    'hover:bg-ghost-hover hover:text-fg',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    // Fill as well as weight: colour is never the only signal.
    'data-on:bg-primary data-on:font-semibold data-on:text-on-primary',
    'data-on:hover:bg-primary-hover data-on:hover:text-on-primary',
    'disabled:pointer-events-none disabled:text-on-disabled',
  ],
  {
    variants: {
      variant: {
        plain: 'bg-transparent',
        outline: 'border border-line bg-transparent',
      },
      size: {
        sm: 'h-9 min-w-9 px-3 text-body-sm [--icon-size:var(--icon-sm)]',
        md: 'h-11 min-w-11 px-4 text-body-md [--icon-size:var(--icon-md)]',
      },
    },
    defaultVariants: { variant: 'plain', size: 'md' },
  },
);
