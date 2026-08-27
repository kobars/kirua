import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { alertVariants } from './Alert.variants';

export interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  /** Decorative leading icon. The visible title and description carry the meaning. */
  icon?: ReactNode;
}

/**
 * Static inline feedback built from the same semantic status ramp as `Badge`.
 * It deliberately supplies no live-region role: content already on the page
 * should not be announced as if it just changed. Add `role="status"` for a
 * polite update or `role="alert"` for an urgent dynamic failure.
 *
 * @example
 * <Alert status="success" icon={<CheckIcon />}>
 *   <AlertTitle>Published</AlertTitle>
 *   <AlertDescription>Your changes are live.</AlertDescription>
 * </Alert>
 */
export function Alert({ className, status, icon, children, ...props }: AlertProps) {
  return (
    <div data-slot="alert" className={cn(alertVariants({ status }), className)} {...props}>
      {icon !== undefined && icon !== null && (
        <span
          data-slot="alert-icon"
          aria-hidden="true"
          className="mt-0.5 flex shrink-0 [--icon-size:var(--icon-md)]"
        >
          {icon}
        </span>
      )}
      <div data-slot="alert-content" className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="alert-title"
      className={cn('text-body-md font-semibold text-current', className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="alert-description"
      className={cn('mt-1 text-body-sm text-current', className)}
      {...props}
    />
  );
}
