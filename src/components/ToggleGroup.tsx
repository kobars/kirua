import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { toggleVariants } from './Toggle.variants';

export type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root>;
export interface ToggleGroupItemProps
  extends
    ComponentProps<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

/**
 * Several toggles behaving as one control: a single tab stop with arrow-key
 * movement inside it.
 *
 * `type="single"` is a view switcher, `type="multiple"` a filter. Radix types
 * `value` differently for each, so the prop passes straight through.
 *
 * An icon-only item still needs `aria-label`.
 *
 * @example
 * <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
 *   <ToggleGroupItem value="grid" aria-label="Grid"><GridIcon /></ToggleGroupItem>
 *   <ToggleGroupItem value="list" aria-label="List"><MenuIcon /></ToggleGroupItem>
 * </ToggleGroup>
 */
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn('inline-flex items-center gap-1 rounded-md', className)}
      {...props}
    />
  );
}

export function ToggleGroupItem({ className, variant, size, ...props }: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
