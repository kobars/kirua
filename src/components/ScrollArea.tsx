import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface ScrollAreaProps extends ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /** Which axes may scroll. A scrollbar is only ever drawn for an axis that
   *  actually overflows, whichever value is given. */
  orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * A scrolling region whose scrollbar is drawn by the component, not the
 * platform. macOS overlay scrollbars fade out, so a column with three more
 * cards below looks exactly like one with none; this one stays, themed from
 * the semantic layer, on every operating system.
 *
 * Radix supplies the viewport, the thumb geometry, drag and wheel handling,
 * and the `auto` rule — a scrollbar appears only when content overflows on
 * its axis. `type` is fixed to `auto` rather than exposed: the whole reason
 * the component exists is that a region with no overflow must show nothing,
 * and `always` would draw an empty track.
 *
 * **Edge fades are the consumer's.** A fade at the bottom of a list says "there
 * is more content", which is a statement about the content, not about
 * scrolling, and its colour must match the surface *behind* the region —
 * which only the consumer knows. Paint it on the element that owns the
 * surface.
 *
 * In a region that scrolls only vertically, content is exactly as wide as the
 * region, so a truncating `ItemTitle` inside it cuts with an ellipsis.
 *
 * Reading direction reaches Radix through its `dir` prop, not the document:
 * pass `dir="rtl"` and the vertical scrollbar moves to the inline end.
 *
 * @example
 * <ScrollArea className="h-80">
 *   {cards.map((card) => <Card key={card.id}>…</Card>)}
 * </ScrollArea>
 */
export function ScrollArea({
  className,
  children,
  orientation = 'vertical',
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type="auto"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/* Focusable, so a keyboard user can reach the region and scroll it with
          the arrow keys. axe names the rule: scrollable-region-focusable. */}
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        tabIndex={0}
        className={cn(
          'size-full rounded-[inherit]',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
          // Radix wraps the content in a `display: table` box so a horizontal
          // scroller can grow to its content. A table is as wide as its
          // min-content, so in a region that only scrolls vertically a
          // truncating title would widen the box rather than cut, and an
          // action at the row's end would be clipped off. A block is as wide
          // as the region.
          orientation === 'vertical' && '[&>div]:block!',
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

export interface ScrollBarProps extends ComponentProps<typeof ScrollAreaPrimitive.Scrollbar> {}

/**
 * One scrollbar. Exported so a consumer composing `ScrollAreaPrimitive`
 * directly can still use the themed bar; `ScrollArea` renders it for you.
 */
export function ScrollBar({ className, orientation = 'vertical', ...props }: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-0.5 select-none',
        'transition-colors duration-fast ease-out',
        orientation === 'vertical' && 'h-full w-2.5 border-s border-s-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-bar-thumb"
        className="relative flex-1 rounded-pill bg-line-strong"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
