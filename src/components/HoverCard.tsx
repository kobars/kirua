import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * A rich preview that appears on hover.
 *
 * **Everything in it must exist somewhere else on the page.** It never opens on
 * focus or on touch, so its content is unreachable by keyboard and on a phone.
 * It is a pointer shortcut; the trigger is the route everyone else takes.
 *
 * @example
 * <HoverCard>
 *   <HoverCardTrigger asChild><a href="/@rin">@rin</a></HoverCardTrigger>
 *   <HoverCardContent>…</HoverCardContent>
 * </HoverCard>
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 8,
  container,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Content> & {
  container?: ComponentProps<typeof HoverCardPrimitive.Portal>['container'];
}) {
  return (
    <HoverCardPrimitive.Portal container={container}>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-popover w-72 rounded-lg border border-line-subtle bg-raised p-4',
          'font-text text-body-md text-fg shadow-overlay',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          'focus:outline-none',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
