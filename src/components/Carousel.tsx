/* oxlint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role --
 * `role="group"` with `aria-roledescription` is the WAI-ARIA carousel pattern.
 * The tabindex is required by axe's `scrollable-region-focusable`; see
 * `Table.tsx` for the same conflict. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface CarouselProps extends ComponentProps<'div'> {
  /** Names the scrollable region. Required — an unnamed focusable region is announced as nothing. */
  label: string;
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
 * <Carousel label="Product photos">
 *   <CarouselItem className="w-64"><img … /></CarouselItem>
 * </Carousel>
 */
export function Carousel({ className, label, ...props }: CarouselProps) {
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
        className,
      )}
      {...props}
    />
  );
}

export function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn('shrink-0 snap-start', className)}
      {...props}
    />
  );
}
