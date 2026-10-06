import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { VisuallyHidden } from './VisuallyHidden';

/** The current price and the struck one move in step, so they are one table. */
const sizes = {
  md: { root: 'gap-2', amount: 'text-body-lg', was: 'text-body-sm' },
  lg: { root: 'gap-3', amount: 'text-heading-lg', was: 'text-body-md' },
} as const;

export interface PriceProps extends ComponentProps<'p'> {
  /** The price to pay, already formatted for the locale. */
  amount: ReactNode;
  /** The previous price, shown struck through. */
  was?: ReactNode;
  /** Read before `was`, because a strike-through is not announced. */
  wasLabel?: string;
  /** `md` in a card or a list; `lg` on the product's own page. */
  size?: keyof typeof sizes;
}

/**
 * A price, and the price it replaced.
 *
 * Formatting is the caller's: currency, grouping and decimals depend on a
 * locale this component does not know. Both figures are tabular, so a column
 * of prices lines up digit for digit.
 *
 * A screen reader does not announce `<s>`, so a reduced price read aloud as
 * "Rp 120,000 Rp 150,000" sounds like two prices. The struck figure is
 * preceded by `wasLabel`, off the screen.
 *
 * @example <Price amount={idr(120000)} was={idr(150000)} />
 * @example <Price size="lg" amount={idr(product.price)} />
 */
export function Price({
  amount,
  was,
  wasLabel = 'Was',
  size = 'md',
  className,
  ...props
}: PriceProps) {
  const step = sizes[size];
  return (
    <p
      data-slot="price"
      className={cn('relative flex flex-wrap items-baseline font-text', step.root, className)}
      {...props}
    >
      <span
        data-slot="price-amount"
        className={cn('font-semibold text-fg tabular-nums', step.amount)}
      >
        {amount}
      </span>
      {was !== undefined && was !== null && (
        <s data-slot="price-was" className={cn('text-fg-muted tabular-nums', step.was)}>
          <VisuallyHidden>{wasLabel} </VisuallyHidden>
          {was}
        </s>
      )}
    </p>
  );
}
