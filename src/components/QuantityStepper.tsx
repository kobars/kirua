/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * `<fieldset>` needs a `<legend>` and belongs around form controls being
 * submitted. This is two buttons and a readout, which is what `role="group"`
 * is for. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';
import { MinusIcon, PlusIcon } from './icons';

export interface QuantityStepperProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
  min?: number;
  max?: number;
  /** Names the whole group. Required, because "3" on its own means nothing. */
  label: string;
  decrementLabel?: string;
  incrementLabel?: string;
}

/**
 * A number that is safe to change with a thumb: two real buttons instead of the
 * few-pixel spinners on `<input type="number">`. Controlled — the consumer owns
 * the quantity.
 *
 * A button that would leave the range is disabled, not hidden, so the one
 * beside it does not move under the finger about to tap it.
 *
 * @example
 * <QuantityStepper
 *   label="Quantity, Kacamata bulat"
 *   value={qty}
 *   min={1}
 *   max={10}
 *   onDecrement={() => setQty((n) => n - 1)}
 *   onIncrement={() => setQty((n) => n + 1)}
 * />
 */
export function QuantityStepper({
  className,
  value,
  onDecrement,
  onIncrement,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  label,
  decrementLabel = 'Decrease quantity',
  incrementLabel = 'Increase quantity',
  ...props
}: QuantityStepperProps) {
  return (
    <div
      data-slot="quantity-stepper"
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border border-field-line bg-field p-1',
        className,
      )}
      {...props}
    >
      <IconButton
        type="button"
        aria-label={decrementLabel}
        size="sm"
        variant="ghost"
        disabled={value <= min}
        onClick={onDecrement}
      >
        <MinusIcon />
      </IconButton>
      <output
        data-slot="quantity-stepper-value"
        aria-live="polite"
        className="min-w-8 text-center font-text text-body-md text-on-field tabular-nums"
      >
        {value}
      </output>
      <IconButton
        type="button"
        aria-label={incrementLabel}
        size="sm"
        variant="ghost"
        disabled={value >= max}
        onClick={onIncrement}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
}
