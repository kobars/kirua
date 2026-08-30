/* oxlint-disable jsx-a11y/prefer-tag-over-role --
 * The rule is right in general and wrong here, and the reasoning is in the
 * JSDoc below: a native `<meter>` keeps its appearance in UA shadow
 * pseudo-elements that `getComputedStyle` will not read back, so no test in
 * this repository could assert the fill is the colour it claims. File-level
 * because the next-line form does not take for jsx-a11y rules in oxlint 1.75
 * — same limitation `Table.tsx` records. */
import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { meterFill, type MeterLevel } from './Meter.styles';
import { meterVariants } from './Meter.variants';

export interface MeterProps
  extends Omit<ComponentProps<'div'>, 'children'>, VariantProps<typeof meterVariants> {
  value: number;
  min?: number;
  max?: number;
  /** The accessible name. Required, because a bar has none of its own. */
  label: string;
  /**
   * What the value *means*, read instead of the bare number: "86 of 120 beds"
   * rather than "86". Without it a screen reader announces a figure with no
   * unit, which is the one thing a measurement must not be.
   */
  valueText?: string;
  /**
   * Where the bar changes colour, **in value units and not percentages** — a
   * meter's `min` is not always 0, and a threshold written as a percentage
   * silently means something different the moment it is not.
   *
   * Thresholds are crossed **upward**: more is worse. A measurement where a
   * *low* value is the problem — a stock level, a battery — has no threshold
   * here on purpose, because inverting the comparison would make the same two
   * numbers mean opposite things depending on a third prop. Carry that meaning
   * beside the bar instead; `examples/simrs/Pharmacy.tsx` uses a `Badge`.
   */
  thresholds?: { warning: number; danger: number };
}

/**
 * A measurement: bed occupancy, disk usage, a stock level, a share of a total.
 *
 * `Progress` is the neighbour and is deliberately not this. It is a Radix
 * primitive with `role="progressbar"`, and that role means one thing — *how far
 * along a task is*. None of the cases above is a task, so reaching for
 * `Progress` there does not merely look wrong, it tells a screen reader
 * something untrue. HTML separates `<progress>` from `<meter>` for this reason
 * and so does this system.
 *
 * `BarChart` is the other neighbour and is a chart: it wants axes and a
 * caption, not a two-pixel bar behind a number in a table cell.
 *
 * ## Why this is not a native `<meter>` element
 *
 * The intention was a real `<meter>`, and the blocker is that its appearance
 * lives in UA shadow pseudo-elements — `::-webkit-meter-bar` and
 * `::-moz-meter-bar` — which `getComputedStyle` does not read back. Probed
 * before this was written: both the bar and the value pseudo-element report
 * `rgba(0, 0, 0, 0)` whether or not a rule targets them, with and without
 * `appearance: none`. So no test in this repository could assert that the fill
 * is the colour it claims, and the vendor prefixes differ across the four
 * declared browsers while the suite runs two of them.
 *
 * `role="meter"` is ARIA's own answer for the same semantics, it styles like
 * any other element, and every claim it makes is assertable. That trade — a
 * verifiable appearance over a native tag — is the one this repository makes
 * everywhere else.
 *
 * @example
 * <Meter value={86} max={120} label="Bed occupancy" valueText="86 of 120 beds" />
 *
 * @example
 * // Amber past 85%, red past 95%, and normal is the brand fill rather than
 * // green — see `Meter.styles.ts`.
 * <Meter value={112} max={120} label="Beds" thresholds={{ warning: 102, danger: 114 }} />
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  valueText,
  thresholds,
  size,
  className,
  ...props
}: MeterProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const fraction = max === min ? 0 : (clamped - min) / (max - min);

  const level: MeterLevel = thresholds
    ? clamped >= thresholds.danger
      ? 'danger'
      : clamped >= thresholds.warning
        ? 'warning'
        : 'normal'
    : 'normal';

  return (
    <div
      data-slot="meter"
      role="meter"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
      data-level={level}
      className={cn(meterVariants({ size }), className)}
      {...props}
    >
      <div
        data-slot="meter-fill"
        className={cn('h-full rounded-pill', meterFill[level])}
        style={{ width: `${fraction * 100}%` }}
      />
    </div>
  );
}
