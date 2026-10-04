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
        // 1px of padding inside the 1px border leaves 40px for a 20px thumb
        // and its 20px travel, so the gap is 2px at both ends and above and
        // below it.
        'peer inline-flex h-6 w-11 shrink-0 items-center rounded-pill px-px',
        'border border-transparent bg-field-line',
        'transition-[color,background-color,border-color] duration-fast ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'enabled:data-unchecked:hover:bg-field-line-hover',
        'data-checked:bg-primary',
        // Off and on stay distinct when disabled, as on `Checkbox`: the empty
        // field fill when off, the disabled action fill when on.
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled',
        'disabled:data-checked:border-transparent disabled:data-checked:bg-disabled',
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
