import { cva } from '@/lib/cva';

export const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'touch-manipulation rounded-control',
    'transition-[background-color,color,scale] duration-fast ease-out',
    // See `buttonVariants`: no press scale on a popup trigger.
    'not-aria-[haspopup]:active:scale-95',
    // See `buttonVariants`: a chevron turns over while expanded.
    '**:data-[icon=chevron-down]:transition-transform **:data-[icon=chevron-down]:duration-fast',
    'aria-expanded:**:data-[icon=chevron-down]:rotate-180',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-disabled disabled:text-on-disabled',
    'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed',
    'aria-disabled:bg-disabled aria-disabled:text-on-disabled',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-(--icon-size)',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'border-2 border-secondary-line bg-secondary text-on-secondary hover:bg-secondary-hover aria-expanded:bg-secondary-hover',
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover aria-expanded:bg-ghost-hover',
      },
      size: {
        sm: 'size-9 [--icon-size:var(--icon-md)]',
        md: 'size-11 [--icon-size:var(--icon-lg)]',
        /** 54px — the reference design's search control. */
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- [FIGMA] 54px, must not track --spacing
        lg: 'size-[3.375rem] [--icon-size:var(--icon-xl)]',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);
