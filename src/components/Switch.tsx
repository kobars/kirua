import * as SwitchPrimitive from '@radix-ui/react-switch';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

/**
 * A setting that applies the moment it moves, where a checkbox is collected now
 * and submitted later with a form. `role="switch"` follows from that, and is
 * announced as "on"/"off".
 *
 * @example
 * <div className="flex items-center gap-3">
 *   <Switch id="notify" defaultChecked />
 *   <Label htmlFor="notify">Email me about replies</Label>
 * </div>
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-pill p-0.5',
        'border border-transparent bg-field-line',
        'transition-colors duration-fast ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-checked:bg-primary',
        'disabled:cursor-not-allowed disabled:bg-disabled',
        className,
      )}
      {...props}
    >
      {/* The travel needs `transform`, which has no logical form, so its sign
          lives in `styles/kirua.css` keyed on this `data-slot`. The border is
          load-bearing: forced colours drop the fill, and without an edge the
          track and thumb resolve to one blank pill. */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-5 rounded-pill border border-field-line bg-field',
        )}
      />
    </SwitchPrimitive.Root>
  );
}
