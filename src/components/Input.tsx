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
        // `min-w-0`: an input's min-content is about twenty characters, which
        // would push a flex row past its container.
        'flex h-11 w-full min-w-0 rounded-md border border-field-line bg-field px-3',
        'font-text text-body-md text-on-field shadow-resting placeholder:text-placeholder',
        'transition-[border-color,box-shadow] duration-fast ease-out',
        // One focus ring, laid over the border: recolouring the border as
        // well would draw the same signal twice, with the page between the lines.
        // An invalid field keeps its colour in the ring.
        'hover:border-field-line-hover focus-visible:-outline-offset-1 focus-visible:outline-field-ring',
        'aria-invalid:focus-visible:outline-field-line-invalid',
        'aria-invalid:border-field-line-invalid aria-invalid:hover:border-field-line-invalid',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
        className,
      )}
      {...props}
    />
  );
}
