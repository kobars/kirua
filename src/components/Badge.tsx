import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { badgeVariants } from './Badge.variants';

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * A short status label: draft, published, failed. Colour never carries the
 * meaning alone: every badge shows a word, so the state survives greyscale and
 * colour blindness.
 *
 * @example <Badge status="success" icon={<CheckIcon />}>Published</Badge>
 */
export function Badge({ className, status, size, icon, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ status, size }), className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
