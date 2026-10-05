import * as ProgressPrimitive from '@radix-ui/react-progress';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root>;

/**
 * How much of a task is done. Pass a number and the bar reports
 * `aria-valuenow`; pass `null` when the total is unknown and it reports
 * nothing, animating instead of filling.
 *
 * A bar has no name of its own — give it `aria-label` or `aria-labelledby`.
 *
 * @example <Progress value={63} max={100} aria-label="Upload progress" />
 * @example <Progress value={null} aria-label="Loading results" />
 */
export function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  // Radix's own rule: an unusable max becomes 100, and a value outside
  // [0, max] reports as indeterminate. The width follows the same rule, so
  // the bar never draws a value the progressbar does not announce.
  const limit = max > 0 ? max : 100;
  const known = typeof value === 'number' && value >= 0 && value <= limit;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value ?? null}
      max={max}
      className={cn('relative h-2 w-full overflow-hidden rounded-pill bg-sunken', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'h-full rounded-pill bg-primary transition-[width] duration-base ease-out',
          // An indeterminate bar shows a fixed slice that travels.
          'data-indeterminate:w-1/3 data-indeterminate:animate-pulse-soft',
        )}
        style={known ? { width: `${(value / limit) * 100}%` } : undefined}
      />
    </ProgressPrimitive.Root>
  );
}
