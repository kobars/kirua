import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type InputProps = ComponentProps<'input'>;

/**
 * A native single-line input styled from the field semantic family. Its medium
 * height is the same `h-11` step as `Button`, so controls align without a
 * second field-height token that can drift.
 *
 * Set `aria-invalid` when validation fails, or compose with `Field`, which sets
 * it from the visible error message.
 *
 * @example <Input id="email" name="email" type="email" placeholder="you@example.com" />
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(
        'flex h-11 w-full rounded-md border border-field-line bg-field px-3',
        'font-text text-body-md text-on-field shadow-resting placeholder:text-placeholder',
        'transition-[border-color,box-shadow] duration-fast ease-out',
        'hover:border-field-line-hover focus-visible:border-ring',
        'aria-invalid:border-field-line-invalid aria-invalid:hover:border-field-line-invalid',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
        className,
      )}
      {...props}
    />
  );
}
