import { cva } from '@/lib/cva';

/**
 * The same status ramp as `Badge` and `Alert`, on a raised surface.
 *
 * `pointer-events-auto` belongs here and not on the viewport: the viewport
 * spans a strip of the screen and must not swallow clicks meant for the page
 * behind it, while each toast still has to be clickable.
 */
export const toastVariants = cva(
  [
    'pointer-events-auto flex items-start gap-3',
    'rounded-md border p-4 font-text shadow-overlay',
    'animate-slide-in-bottom',
  ],
  {
    variants: {
      status: {
        neutral: 'border-line bg-raised text-fg',
        info: 'border-info-solid bg-info-bg text-info-fg',
        success: 'border-success-solid bg-success-bg text-success-fg',
        warning: 'border-warning-solid bg-warning-bg text-warning-fg',
        danger: 'border-danger-solid bg-danger-bg text-danger-fg',
      },
    },
    defaultVariants: { status: 'neutral' },
  },
);
