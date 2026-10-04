import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Radix supplies the tablist/tab/tabpanel relationships, arrow-key movement, and
 * the rule that Tab moves OUT of the list into the active panel rather than
 * through every tab — the keyboard model where most hand-rolled tabs fail.
 *
 * @example
 * <Tabs defaultValue="chibi">
 *   <TabsList>
 *     <TabsTrigger value="chibi">Chibi</TabsTrigger>
 *     <TabsTrigger value="comics">Comics</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="chibi">…</TabsContent>
 * </Tabs>
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex items-center gap-1 rounded-pill bg-sunken p-1.5',
        // A tab list is `inline-flex`, so it takes the width of its tabs and
        // never shrinks: four tabs need 372 pixels, and on a 320-wide phone the
        // bar runs past the viewport and scrolls the whole document instead of
        // scrolling inside itself.
        //
        // Both utilities are inert until it actually overflows — a bar that
        // fits is narrower than `100%` and has nothing to scroll. The focus
        // ring survives the clip because a trigger sits inside 6 pixels of
        // padding and the ring reaches 4.
        'max-w-full overflow-x-auto',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex h-10 items-center rounded-pill px-5',
        'font-text text-body-sm font-medium text-fg-muted',
        'transition-[color,background-color,border-color] duration-fast ease-out',
        'hover:text-fg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        // The active tab is marked by fill AND weight, not colour alone. Its
        // label keeps its colour on hover: `hover:text-fg` would otherwise
        // turn it dark on the blue fill in light mode, where the two tokens
        // differ, and only there.
        'data-active:bg-primary data-active:text-on-primary data-active:hover:text-on-primary',
        'data-active:font-semibold',
        'disabled:pointer-events-none disabled:text-on-disabled',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'mt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-active:animate-fade-in',
        className,
      )}
      {...props}
    />
  );
}
