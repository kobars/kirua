import type { ComponentProps } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { cn } from '@/lib/cn';

/**
 * Two or more panels with a bar you drag between them.
 *
 * The behaviour is `react-resizable-panels`, for the same reason the overlays
 * are Radix: the bar has to be a `role="separator"` carrying `aria-valuenow`,
 * move on the arrow keys, respect each panel's minimum, and survive a window
 * resize. This file supplies appearance only.
 *
 * `orientation` names the axis the **panels** sit on, so a `horizontal` group
 * has a vertical bar. The library publishes the bar's own axis as
 * `aria-orientation`, which is the opposite value — which is why nothing here
 * takes an orientation prop and the two shapes are one component.
 *
 * Sizes are per panel, and the unit is decided by the type: a **number is
 * pixels** and a **bare numeric string is a percentage**. `minSize={20}` is
 * therefore twenty pixels and almost never what was meant — write `minSize="20"`.
 * A group whose panels give no size splits evenly.
 *
 * @example
 * <ResizableGroup orientation="horizontal">
 *   <ResizablePanel defaultSize="32" minSize="20">Patients</ResizablePanel>
 *   <ResizableHandle withGrip />
 *   <ResizablePanel>Record</ResizablePanel>
 * </ResizableGroup>
 */
export function ResizableGroup({ className, ...props }: ComponentProps<typeof Group>) {
  return (
    <Group data-slot="resizable-group" className={cn('flex size-full', className)} {...props} />
  );
}

export function ResizablePanel({ className, ...props }: ComponentProps<typeof Panel>) {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn('min-h-0 min-w-0 overflow-hidden', className)}
      {...props}
    />
  );
}

export interface ResizableHandleProps extends ComponentProps<typeof Separator> {
  /**
   * Draw a grip in the middle of the bar. A hairline is a one-pixel drag
   * target that nobody finds, and the grip is what says the bar moves at all.
   */
  withGrip?: boolean;
}

/**
 * The bar. It is twelve pixels of hit area with a one-pixel line painted
 * inside it, because the line is what a reader should see and the twelve
 * pixels are what a pointer needs to hit.
 *
 * The line lives in an `::after` so the bar's own background stays free for
 * the hit area, and `data-separator` — the library's own state attribute —
 * turns it brand-coloured while a drag is in progress.
 */
export function ResizableHandle({
  className,
  withGrip,
  children,
  ...props
}: ResizableHandleProps) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        'group/handle relative flex shrink-0 items-center justify-center',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        'after:absolute after:bg-line-subtle after:transition-colors after:duration-fast',
        'hover:after:bg-brand data-[separator="active"]:after:bg-brand',
        'aria-[orientation="vertical"]:w-3 aria-[orientation="vertical"]:after:inset-y-0',
        'aria-[orientation="vertical"]:after:w-px',
        'aria-[orientation="horizontal"]:h-3 aria-[orientation="horizontal"]:after:inset-x-0',
        'aria-[orientation="horizontal"]:after:h-px',
        className,
      )}
      {...props}
    >
      {withGrip && (
        <span
          data-slot="resizable-grip"
          className={cn(
            'relative z-raised flex items-center justify-center gap-0.5',
            'rounded-xs border border-line bg-raised',
            'group-aria-[orientation="vertical"]/handle:h-6 group-aria-[orientation="vertical"]/handle:w-2',
            'group-aria-[orientation="horizontal"]/handle:h-2 group-aria-[orientation="horizontal"]/handle:w-6',
          )}
        >
          <span
            className={cn(
              'bg-line-strong',
              'group-aria-[orientation="vertical"]/handle:h-3 group-aria-[orientation="vertical"]/handle:w-px',
              'group-aria-[orientation="horizontal"]/handle:h-px group-aria-[orientation="horizontal"]/handle:w-3',
            )}
          />
        </span>
      )}
      {children}
    </Separator>
  );
}
