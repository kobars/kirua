import { cva } from '@/lib/cva';

export const alertVariants = cva('flex items-start gap-3 rounded-md border p-4 font-text', {
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
});
