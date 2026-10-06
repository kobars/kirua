import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { descriptionListVariants } from './DescriptionList.variants';

export interface DescriptionListProps
  extends ComponentProps<'dl'>, VariantProps<typeof descriptionListVariants> {}

/**
 * A real `<dl>` of real `<dt>` and `<dd>` pairs. The semantics are the reason
 * to have it and the grid is the reason it is one component.
 *
 * The terms and values are **direct children of the `<dl>`**, not wrapped in a
 * row element. That is what puts every value in the same grid column, which is
 * what makes the column line up. Wrap each pair in a `flex` row and each row
 * aligns itself, and no two agree.
 *
 * @example
 * <DescriptionList>
 *   <DescriptionTerm>Subtotal</DescriptionTerm>
 *   <DescriptionDetails numeric>Rp 1,200,000</DescriptionDetails>
 *   <DescriptionTerm emphasis>Total</DescriptionTerm>
 *   <DescriptionDetails emphasis numeric>Rp 1,230,000</DescriptionDetails>
 * </DescriptionList>
 */
export function DescriptionList({ className, layout, gap, ...props }: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      className={cn(descriptionListVariants({ layout, gap }), className)}
      {...props}
    />
  );
}

export interface DescriptionTermProps extends ComponentProps<'dt'> {
  /**
   * The total row of a receipt, and every receipt has one.
   *
   * Set on both halves of the pair. There is no row element to hang it on —
   * see the note on `DescriptionList` about why the pairs are direct children
   * — so the pair is the row and both halves say so.
   */
  emphasis?: boolean;
}

export function DescriptionTerm({
  className,
  emphasis = false,
  ...props
}: DescriptionTermProps) {
  return (
    <dt
      data-slot="description-term"
      className={cn(
        emphasis ? 'text-body-md font-semibold text-fg' : 'text-fg-secondary',
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionDetailsProps extends ComponentProps<'dd'> {
  /** See `DescriptionTerm`. */
  emphasis?: boolean;
  /**
   * Tabular figures, so a column of amounts keeps its digits in step. Not
   * automatic: a value can be a date, a name or a row of `Kbd` caps, and
   * tabular figures on a word do nothing but widen its digits.
   *
   * It does not align anything on its own — alignment is the layout's job, and
   * a right-aligned value is wrong in two of the three layouts.
   */
  numeric?: boolean;
}

export function DescriptionDetails({
  className,
  emphasis = false,
  numeric = false,
  ...props
}: DescriptionDetailsProps) {
  return (
    <dd
      data-slot="description-details"
      className={cn(
        'text-pretty text-fg',
        emphasis && 'text-body-md font-semibold',
        numeric && 'tabular-nums',
        className,
      )}
      {...props}
    />
  );
}
