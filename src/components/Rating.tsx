import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { StarIcon } from './icons';
import { VisuallyHidden } from './VisuallyHidden';

export interface RatingProps extends ComponentProps<'p'> {
  /** The average, shown to one decimal place unless `display` is given. */
  value: number;
  /**
   * The value as the page should show it, already formatted for its locale —
   * `4,6` where the decimal is a comma. Formatting is the caller's, as it is
   * for `Price`; without it the value is written with a full stop.
   */
  display?: ReactNode;
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
 * A value that is not a number — the average of no reviews — shows a dash
 * rather than the text "NaN".
 *
 * @example <Rating value={4.6}>(128)</Rating>
 * @example <Rating value={product.rating}>· {product.reviews} reviews</Rating>
 * @example <Rating value={rating} display={decimal.format(rating)} outOfLabel={t('outOf')} />
 */
export function Rating({
  value,
  display,
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
      <span data-slot="rating-value" className="tabular-nums">
        {display ?? (Number.isFinite(value) ? value.toFixed(1) : '–')}
        <VisuallyHidden>
          {' '}
          {outOfLabel} {max}
        </VisuallyHidden>
      </span>
      {children !== undefined && children !== null && (
        <span data-slot="rating-detail" className="text-fg-muted">
          {children}
        </span>
      )}
    </p>
  );
}
