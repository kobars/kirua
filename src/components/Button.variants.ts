import { cva } from 'class-variance-authority';

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
    'rounded-pill',
    'transition-[background-color,color,border-color,transform] duration-200 ease-out',
    'active:scale-[0.98]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-disabled disabled:text-on-disabled disabled:border-transparent',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'bg-secondary text-on-secondary border-2 border-secondary-line hover:bg-secondary-hover',
        ghost: 'bg-transparent text-on-ghost hover:bg-ghost-hover',
        danger: 'bg-danger text-on-danger hover:bg-danger-hover',
      },
      size: {
        sm: 'h-9 px-4 text-body-sm',
        /** 44px — meets the minimum touch target. */
        md: 'h-11 px-6 text-body-md',
        /** 54px — the reference design's hero call to action. */
        lg: 'h-[3.375rem] px-8 text-body-lg',
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
