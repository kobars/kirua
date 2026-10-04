/* oxlint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role --
 * `role="group"` with `aria-roledescription` is the WAI-ARIA carousel pattern.
 * The tabindex is required by axe's `scrollable-region-focusable`; see
 * `Table.tsx` for the same conflict. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface CarouselProps extends ComponentProps<'div'> {
  /** Names the scrollable region. Required — an unnamed focusable region is announced as nothing. */
  label: string;
  /**
   * 4px of room inside the track, so a focused item's ring is not clipped by
   * the scroller. A scrolling box clips on both axes, and the ring reaches 4px
   * past the item.
   */
  inset?: boolean;
}

/**
 * A row of items that snaps as it scrolls, using CSS scroll snap so it works
 * before hydration.
 *
 * There are no previous and next buttons: those need a ref, and therefore a
 * client boundary. Add them from a consumer's own client file:
 *
 * ```tsx
 * 'use client';
 * const track = useRef<HTMLDivElement>(null);
 * const page = (dir: 1 | -1) =>
 *   track.current?.scrollBy({ left: dir * track.current.clientWidth, behavior: 'smooth' });
 * ```
 *
 * @example
 * <Carousel label="Product photos" inset>
 *   <CarouselItem size="md"><img … /></CarouselItem>
 * </Carousel>
 */
export function Carousel({ className, label, inset = false, ...props }: CarouselProps) {
  return (
    <div
      data-slot="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        inset && 'scroll-p-1 p-1',
        className,
      )}
      {...props}
    />
  );
}

/** Each step is capped by the viewport, so a phone still shows the next slide's edge. */
const itemSizes = {
  sm: 'w-[min(16rem,70vw)]',
  md: 'w-[min(20rem,80vw)]',
  lg: 'w-[min(24rem,85vw)]',
} as const;

export interface CarouselItemProps extends ComponentProps<'div'> {
  /** The slide's width. Unset, the slide is as wide as its content. */
  size?: keyof typeof itemSizes;
}

export function CarouselItem({ className, size, ...props }: CarouselItemProps) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn('shrink-0 snap-start', size && itemSizes[size], className)}
      {...props}
    />
  );
}
