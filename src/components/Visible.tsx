import { Slot } from '@radix-ui/react-slot';
import { isValidElement, type ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { visibleVariants } from './Visible.variants';

export interface VisibleProps
  extends ComponentProps<'span'>, VariantProps<typeof visibleVariants> {}

/**
 * Shows its child only at some widths, or not on paper.
 *
 * **It renders no element of its own.** The classes land on the child, through
 * Radix `Slot`, because a wrapper would break the places this is most needed:
 * `ButtonGroup` styles its *direct* children, and a `BreadcrumbList` is an `ol`
 * that may only hold `li`s. Give it exactly one element child. Anything else —
 * a bare string, or text with a value in it such as `Show {count}` — is
 * wrapped in a `span`, which is the only case that carries
 * `data-slot="visible"`.
 *
 * For the same reason the child's own `data-slot` is never touched: Slot lets
 * the child's props win, and a slot name of ours would replace the
 * `data-slot="button"` a consumer selects on.
 *
 * Hidden means `display: none`, which also takes the child out of the
 * accessibility tree. That is right for a duplicate — a short label that
 * stands in for a long one — and wrong for the only copy of a name; for that,
 * use `VisuallyHidden`.
 *
 * @example
 * <ButtonGroup aria-label="Filter orders">
 *   <Visible from="sm"><ButtonGroupText>Show</ButtonGroupText></Visible>
 *   <Button>All</Button>
 * </ButtonGroup>
 *
 * @example
 * // A drawer button that only phones need, kept off the printed page too.
 * <Visible below="md" print={false}>
 *   <IconButton aria-label="Menu"><MenuIcon /></IconButton>
 * </Visible>
 */
export function Visible({ from, below, print, className, children, ...props }: VisibleProps) {
  const classes = cn(visibleVariants({ from, below, print }), className);
  if (!isValidElement(children)) {
    return (
      <span data-slot="visible" className={classes} {...props}>
        {children}
      </span>
    );
  }
  return (
    <Slot className={classes} {...props}>
      {children}
    </Slot>
  );
}
