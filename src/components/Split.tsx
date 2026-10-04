import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { splitVariants } from './Split.variants';

export interface SplitProps extends ComponentProps<'div'>, VariantProps<typeof splitVariants> {}

/**
 * Two regions that sit side by side once there is room, and stack when there
 * is not.
 *
 * Give it exactly two children, in reading order. The layouts name where the
 * narrow region is, so the DOM order and the picture agree:
 *
 * - `halves` — two equal columns.
 * - `wide-narrow` — 3 : 2, a body and its companion.
 * - `fit-start` — the first child at its own width, the second takes the rest.
 * - `fit-end` — the first child takes the rest, the second keeps its own width.
 * - `aside-start` — a fixed side column (`asideWidth`) first, then the content.
 * - `aside-end` — the content first, then the fixed side column.
 *
 * Below `from` both regions are one full-width column, first child on top.
 * A child that renders nothing at a width — one wrapped in `Visible` — leaves
 * the other alone in the first track.
 *
 * @example
 * <Split layout="aside-end" asideWidth="lg" from="lg" align="start">
 *   <CheckoutForm />
 *   <OrderSummary />
 * </Split>
 *
 * @example
 * // A header bar that takes the row, and an ornament at its own width.
 * <Split layout="fit-end" from="base" align="center" gap={4}>
 *   <NavBar … />
 *   <Visible from="xl"><DotGrid rows={5} cols={5} /></Visible>
 * </Split>
 */
export function Split({
  layout,
  asideWidth,
  from,
  gap,
  align,
  className,
  ...props
}: SplitProps) {
  return (
    <div
      data-slot="split"
      className={cn(splitVariants({ layout, asideWidth, from, gap, align }), className)}
      {...props}
    />
  );
}
