import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const badge = cva(
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
        sm: 'h-5 px-2 text-caption',
        md: 'h-6 px-2.5 text-body-sm',
      },
    },
    defaultVariants: { status: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Invented — the reference has nothing to succeed or fail. Colour never carries
 * the meaning alone: every badge shows a word, so the state survives greyscale
 * and colour blindness.
 *
 * @example <Badge status="success" icon={<CheckIcon size={14} />}>Published</Badge>
 */
export function Badge({ className, status, size, icon, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badge({ status, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
