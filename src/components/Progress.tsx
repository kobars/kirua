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
  const indeterminate = value === null || value === undefined;

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
          indeterminate && 'w-1/3 animate-pulse-soft',
        )}
        style={indeterminate ? undefined : { width: `${((value ?? 0) / max) * 100}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
