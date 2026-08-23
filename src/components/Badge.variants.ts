import { cva } from '@/lib/cva';

export const badgeVariants = cva(
  ['inline-flex items-center gap-1.5', 'rounded-pill font-text font-medium whitespace-nowrap'],
  {
    variants: {
      status: {
        neutral: 'bg-sunken text-fg-secondary',
        success: 'bg-success-bg text-success-fg',
        warning: 'bg-warning-bg text-warning-fg',
        danger: 'bg-danger-bg text-danger-fg',
        info: 'bg-info-bg text-info-fg',
      },
      size: {
        sm: 'h-5 px-2 text-caption [--icon-size:var(--icon-xs)]',
        md: 'h-6 px-2.5 text-body-sm [--icon-size:var(--icon-sm)]',
      },
    },
    defaultVariants: { status: 'neutral', size: 'md' },
  },
);
