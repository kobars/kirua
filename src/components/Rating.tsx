import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { StarIcon } from './icons';
import { VisuallyHidden } from './VisuallyHidden';

export interface RatingProps extends ComponentProps<'p'> {
  /** The average, shown to one decimal place. */
  value: number;
  /** The top of the scale, read out after the value. */
  max?: number;
  /** Words for "out of", so the scale can be read aloud in the page's language. */
  outOfLabel?: string;
}

/**
 * An average rating: a star, the value, and whatever follows it — a review
 * count — as `children`, quieter than the value.
 *
 * The star is decoration. "4.6" on its own is a number with no scale, so the
 * scale is spoken after it ("4.6 out of 5") and never drawn.
 *
 * @example <Rating value={4.6}>(128)</Rating>
 * @example <Rating value={product.rating}>· {product.reviews} reviews</Rating>
 */
export function Rating({
  value,
  max = 5,
  outOfLabel = 'out of',
  className,
  children,
  ...props
}: RatingProps) {
  return (
    <p
      data-slot="rating"
      className={cn(
        'relative flex items-center gap-1 font-text text-body-sm text-fg-secondary',
        '[--icon-size:var(--icon-sm)]',
        className,
      )}
      {...props}
    >
      <StarIcon tone="warning" />
      <span className="tabular-nums">
        {value.toFixed(1)}
        <VisuallyHidden>
          {' '}
          {outOfLabel} {max}
        </VisuallyHidden>
      </span>
      {children !== undefined && children !== null && (
        <span className="text-fg-muted">{children}</span>
      )}
    </p>
  );
}
