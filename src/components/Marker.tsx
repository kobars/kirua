import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { markerVariants } from './Marker.variants';

/** The elements a marker can honestly be. */
export type MarkerElement = 'div' | 'p' | 'li' | 'h2' | 'h3' | 'h4';

export type MarkerProps<T extends MarkerElement = 'div'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof markerVariants> & {
    /**
     * A heading when the marker opens a stretch a reader may want to jump to —
     * a day in a long thread. `li` when it sits inside a list of its own kind,
     * an activity feed. Otherwise a plain block.
     */
    as?: T;
  };

/**
 * A quiet line inside a conversation or a feed: "Today", "Rin joined",
 * "Earlier messages".
 *
 * Deliberately not `role="separator"`, even as a `divider` with rules on both
 * sides. ARIA makes a separator's children presentational, so "Today" would be
 * announced as a bare "separator" or dropped — the one word that carries the
 * meaning is the one that would be lost. The marker is text, and a screen
 * reader reads it in its place in the flow; the rules are borders on
 * pseudo-elements and say nothing. Where a reader should be able to jump from
 * day to day, render it as a heading with `as`.
 *
 * @example
 * <Marker variant="divider">
 *   <MarkerContent>Today</MarkerContent>
 * </Marker>
 *
 * @example
 * <Marker as="h3" variant="border">
 *   <MarkerIcon><CalendarIcon /></MarkerIcon>
 *   <MarkerContent>Earlier messages</MarkerContent>
 * </Marker>
 */
export function Marker<T extends MarkerElement = 'div'>({
  as,
  variant,
  className,
  ...props
}: MarkerProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'div') as 'div';
  return (
    <Comp
      data-slot="marker"
      data-variant={variant ?? 'plain'}
      className={cn(markerVariants({ variant }), className)}
      {...(props as ComponentProps<'div'>)}
    />
  );
}

/**
 * An icon before the text, hidden from assistive technology: the text already
 * says what happened, and an icon's name would only repeat it.
 *
 * @example <MarkerIcon><UserIcon /></MarkerIcon>
 */
export function MarkerIcon({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn('inline-flex shrink-0', className)}
      {...props}
    />
  );
}

/**
 * The words. It may shrink and wrap, so a long line at a narrow width breaks
 * instead of pushing the rules of a `divider` off the edge.
 *
 * @example <MarkerContent>Rin joined the conversation</MarkerContent>
 */
export function MarkerContent({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-content"
      className={cn('min-w-0 text-pretty', className)}
      {...props}
    />
  );
}
