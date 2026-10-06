import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { textareaVariants } from './Textarea.variants';

export interface TextareaProps
  extends ComponentProps<'textarea'>, VariantProps<typeof textareaVariants> {}

/**
 * A native multi-line field with the same semantic states as `Input`. It is
 * vertically resizable by default, so a user can expand the control without
 * breaking the surrounding inline layout.
 *
 * Set `aria-invalid` when validation fails, or compose with `Field`, which sets
 * it from the visible error message.
 *
 * @example <Textarea id="bio" name="bio" rows={5} placeholder="Tell us about yourself" />
 * @example <Textarea variant="bare" grow aria-label="Message" placeholder="Ask anything" />
 */
export function Textarea({ className, variant, grow, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-24 w-full min-w-0 resize-y rounded-md border border-field-line bg-field px-3 py-2.5',
        'font-text text-body-md text-on-field shadow-resting placeholder:text-placeholder',
        'transition-[border-color,box-shadow] duration-fast ease-out',
        'hover:border-field-line-hover focus-visible:-outline-offset-1 focus-visible:outline-field-ring',
        'aria-invalid:focus-visible:outline-field-line-invalid',
        'aria-invalid:border-field-line-invalid aria-invalid:hover:border-field-line-invalid',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
        textareaVariants({ variant, grow }),
        className,
      )}
      {...props}
    />
  );
}
