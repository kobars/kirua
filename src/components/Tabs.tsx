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
      className={cn('inline-flex items-center gap-1 rounded-pill bg-sunken p-1.5', className)}
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
        'transition-colors duration-200 ease-out',
        'hover:text-fg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        // The active tab is marked by fill AND weight, not colour alone.
        'data-[state=active]:bg-primary data-[state=active]:text-on-primary',
        'data-[state=active]:font-semibold',
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
        'data-[state=active]:animate-fade-in',
        className,
      )}
      {...props}
    />
  );
}
