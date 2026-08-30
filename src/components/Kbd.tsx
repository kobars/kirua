import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { kbdVariants } from './Kbd.variants';
import type { VariantProps } from '@/lib/cva';

export interface KbdProps extends ComponentProps<'kbd'>, VariantProps<typeof kbdVariants> {}

/**
 * One key on a keyboard, drawn as a key cap. A chord is several elements with
 * ordinary text between them, so a screen reader reads "Control K".
 *
 * Colour comes from the field family: its border is the one token guaranteed to
 * clear 3:1 against every surface.
 *
 * @example
 * <span className="inline-flex items-center gap-1">
 *   <Kbd>⌘</Kbd>
 *   <Kbd>K</Kbd>
 * </span>
 */
export function Kbd({ className, size, ...props }: KbdProps) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ size }), className)} {...props} />;
}
