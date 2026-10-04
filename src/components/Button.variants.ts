import { cva } from '@/lib/cva';

/**
 * The Clay press, shared by the three filled and outlined variants: a bold
 * edge, a hard offset shadow, and a lift under a fine pointer that springs down
 * when pressed. Only for a button standing on its own and able to be pressed.
 * The lift and press are movement, so they wait for `motion-safe`; a popup
 * trigger neither lifts nor presses, because Radix measures it on pointerdown.
 * The press replaces the shrink every other button uses.
 */
const pressable = [
  'solo:border-(length:--clay-edge)',
  'solo-enabled:shadow-press',
  'solo-enabled:motion-safe:pointer-fine:not-aria-[haspopup]:hover:-translate-y-(--clay-lift)',
  'solo-enabled:motion-safe:pointer-fine:not-aria-[haspopup]:hover:shadow-press-lifted',
  'solo-enabled:motion-safe:not-aria-[haspopup]:active:translate-y-(--clay-lift)',
  'solo-enabled:motion-safe:not-aria-[haspopup]:active:scale-100',
  'solo-enabled:motion-safe:not-aria-[haspopup]:active:shadow-press-down',
  // A mouse press is also a hover, and the hover rules above come later in
  // the stylesheet at the same specificity, so they would hold the button up
  // while it is pressed. `hover:active` outranks them.
  'solo-enabled:motion-safe:pointer-fine:not-aria-[haspopup]:hover:active:translate-y-(--clay-lift)',
  'solo-enabled:motion-safe:pointer-fine:not-aria-[haspopup]:hover:active:shadow-press-down',
];

/**
 * Kept out of `Button.tsx` so that file exports components only, which React
 * Fast Refresh requires — and so other components can borrow the look without
 * importing the component.
 *
 * Every colour is a semantic token. That is why one `<Button variant="primary">`
 * renders as a blue gradient on a white page and a white button on the blue
 * panel: the surface re-points `--color-action-primary-*` and the button never
 * knows.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-text font-medium',
    'touch-manipulation rounded-control',
    // `scale` and `translate`, not `transform`: Tailwind v4 compiles both to
    // their own properties, so a transform transition never animates them.
    'transition-press',
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
        primary: [
          'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
          ...pressable,
          'solo-enabled:border-line-press',
          'solo-enabled:bg-primary-gradient solo-enabled:hover:bg-primary-gradient-hover',
          'forced-colors:bg-none',
        ],
        secondary: [
          'border-2 border-secondary-line bg-secondary text-on-secondary hover:bg-secondary-hover aria-expanded:bg-secondary-hover',
          ...pressable,
          'solo-enabled:border-secondary-raised-line solo-enabled:text-on-secondary-raised',
          // Written for each state the plain look styles, so the raised fill
          // wins in all of them. Hover is shown by the lift.
          'solo-enabled:bg-secondary-raised solo-enabled:hover:bg-secondary-raised',
          'solo-enabled:aria-expanded:bg-secondary-raised-open',
        ],
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover aria-expanded:bg-ghost-hover',
        danger: [
          'bg-danger text-on-danger hover:bg-danger-hover',
          ...pressable,
          'solo-enabled:border-line-press',
          '[--press-shade:var(--color-shade-press-danger)]',
        ],
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
      /**
       * `between` pushes a trailing icon to the far end: a full-width
       * disclosure button whose chevron lines up with the edge.
       */
      justify: {
        center: '',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);
