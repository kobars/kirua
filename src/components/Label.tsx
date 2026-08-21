import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends Omit<ComponentProps<'label'>, 'htmlFor'> {
  /** ID of the control this label names. Required so a visible label cannot be inert. */
  htmlFor: string;
}

/**
 * A native form label with kirua typography. Keep `htmlFor` paired with the
 * control's `id`; the browser then supplies click-to-focus and the accessible
 * name without a client runtime.
 *
 * @example <Label htmlFor="email">Email address</Label>
 */
export function Label({ className, htmlFor, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn('font-text text-body-sm font-medium text-fg', className)}
      {...props}
    />
  );
}
