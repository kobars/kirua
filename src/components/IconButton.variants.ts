import { cva } from '@/lib/cva';

export const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-pill',
    'transition-[background-color,color,transform] duration-fast ease-out',
    'active:scale-95',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-disabled disabled:text-on-disabled',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'border-2 border-secondary-line bg-secondary text-on-secondary hover:bg-secondary-hover',
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover',
      },
      size: {
        sm: 'size-9 [--icon-size:var(--icon-md)]',
        md: 'size-11 [--icon-size:var(--icon-lg)]',
        /** 54px — the reference design's circular search control. */
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- [FIGMA] 54px, must not track --spacing
        lg: 'size-[3.375rem] [--icon-size:var(--icon-xl)]',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);
