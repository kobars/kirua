import * as TogglePrimitive from '@radix-ui/react-toggle';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { toggleVariants } from './Toggle.variants';

export interface ToggleProps
  extends ComponentProps<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants> {}

/**
 * A button that stays pressed, reporting `aria-pressed`. The on state is marked
 * by fill as well as weight, never by colour alone.
 *
 * Use `ToggleGroup` when the choices belong together and should be one tab stop.
 *
 * @example
 * <Toggle aria-label="Bold" defaultPressed>
 *   <BoldIcon />
 * </Toggle>
 */
export function Toggle({ className, variant, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
