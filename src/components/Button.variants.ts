import { cva } from '@/lib/cva';

/**
 * Kept out of `Button.tsx` so that file exports components only, which React
 * Fast Refresh requires — and so other components can borrow the look without
 * importing the component.
 *
 * Every colour is a semantic token. That is why one `<Button variant="primary">`
 * renders as a blue pill on a white page and a white pill on the blue panel: the
 * surface re-points `--color-action-primary-*` and the button never knows.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-text font-medium',
    'touch-manipulation rounded-pill',
    // `scale`, not `transform`: Tailwind v4 compiles `scale-*` to the scale
    // property, so a transform transition never animates the press.
    'transition-[background-color,color,border-color,scale] duration-fast ease-out',
    // Radix opens a menu on pointerdown and measures its trigger then, so a
    // trigger that shrinks while pressed places its popup off by a pixel or two.
    'not-aria-[haspopup]:active:scale-[0.98]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:border-transparent disabled:bg-disabled disabled:text-on-disabled',
    'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed',
    'aria-disabled:border-transparent aria-disabled:bg-disabled aria-disabled:text-on-disabled',
    // Any svg follows the size step, not only kirua's own icons. An explicit
    // size class, such as the spinner's, is left alone.
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-(--icon-size)',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'border-2 border-secondary-line bg-secondary text-on-secondary hover:bg-secondary-hover aria-expanded:bg-secondary-hover',
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover aria-expanded:bg-ghost-hover',
        danger: 'bg-danger text-on-danger hover:bg-danger-hover',
      },
      size: {
        sm: 'h-9 px-4 text-body-sm [--icon-size:var(--icon-sm)]',
        /** 44px — meets the minimum touch target. */
        md: 'h-11 px-6 text-body-md [--icon-size:var(--icon-md)]',
        /** 54px — the reference design's hero call to action. */
        /** 54px — the reference design's hero call to action. Arbitrary, not
         *  `h-13.5`: numeric utilities compile to calc(var(--spacing) * n), and a
         *  measured value must not move when the spacing scale is retuned. */
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes
        lg: 'h-[3.375rem] px-8 text-body-lg [--icon-size:var(--icon-lg)]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);
