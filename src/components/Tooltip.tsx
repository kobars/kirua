import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Radix shows the hint on keyboard focus as well as hover, shares one open-delay
 * timer across the group so a row of icons does not stutter, dismisses on
 * Escape, and positions with collision detection.
 *
 * A tooltip is a hint, never a control's only name — an icon-only button still
 * needs its own `aria-label`. Wrap the app once in `TooltipProvider`.
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger asChild><IconButton aria-label="Search"><SearchIcon /></IconButton></TooltipTrigger>
 *   <TooltipContent>Search the gallery</TooltipContent>
 * </Tooltip>
 */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'ctx-inverse z-50 max-w-64 rounded-sm bg-page px-3 py-2',
          'font-text text-body-sm text-fg shadow-md',
          'data-[state=delayed-open]:animate-pop-in',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-[var(--color-surface-page)]" width={11} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
