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
 * Placed after a disabled `Checkbox`, `Switch` or `RadioGroupItem`, it dims
 * with it: those roots are `peer`s. CSS reaches only a following sibling, so a
 * label before its control does not dim; `Field` covers that order.
 *
 * @example <Label htmlFor="email">Email address</Label>
 */
export function Label({ className, htmlFor, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        'font-text text-body-sm font-medium text-fg select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:text-on-field-disabled',
        className,
      )}
      {...props}
    />
  );
}
