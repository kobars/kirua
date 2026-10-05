import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon, MinusIcon } from './icons';

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * A box with three states: `checked` may be `true`, `false`, or
 * `'indeterminate'` — a "select all" row with some but not all rows ticked,
 * drawn as a dash rather than a tick.
 *
 * A hidden native input submits the value with a surrounding `<form>`. Pair it
 * with `Label htmlFor` for a name.
 *
 * @example
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">I have read the terms</Label>
 * </div>
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer group/checkbox inline-flex size-5 shrink-0 items-center justify-center rounded-xs',
        'border border-field-line bg-field text-on-primary',
        'transition-[background-color,border-color] duration-fast ease-out',
        'hover:border-field-line-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-checked:border-primary data-checked:bg-primary',
        'data-indeterminate:border-primary data-indeterminate:bg-primary',
        'aria-invalid:border-field-line-invalid',
        // Checked is the stronger fact: a ticked box keeps its own edge.
        'aria-invalid:data-checked:border-primary aria-invalid:data-indeterminate:border-primary',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled',
        'disabled:data-checked:bg-disabled disabled:data-checked:text-on-disabled',
        'disabled:data-indeterminate:bg-disabled disabled:data-indeterminate:text-on-disabled',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center [--icon-size:var(--icon-sm)]"
      >
        {/* Chosen by the state Radix renders, not by the `checked` prop, which
            an uncontrolled checkbox never passes. */}
        <CheckIcon className="group-data-indeterminate/checkbox:hidden" />
        <MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
