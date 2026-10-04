import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface VisuallyHiddenProps extends ComponentProps<'span'> {
  /**
   * Hide the child element itself instead of wrapping it in a `span` — a
   * heading that names a page for the outline but not on the screen, or a live
   * `<output>` that only a screen reader needs to hear.
   */
  asChild?: boolean;
}

/**
 * Off the screen, still in the accessibility tree.
 *
 * The opposite of `Visible`'s hiding: `display: none` removes a name from
 * everyone, and this keeps it for the people who are not looking. A page with
 * no visible title still needs an `h1`; an icon-only control's count still
 * needs words.
 *
 * `sr-only` positions the text absolutely. Inside a box that scrolls sideways
 * — a table cell — its containing block must be that box, or the text lands at
 * the page's edge and widens the document. `TableHead` and `TableCell` are
 * positioned for that reason; anywhere else, give the parent `relative`.
 *
 * With `asChild` the child keeps its own `data-slot`.
 *
 * @example
 * <VisuallyHidden asChild><Heading as="h1">Home</Heading></VisuallyHidden>
 *
 * @example
 * <TableHead><VisuallyHidden>Actions</VisuallyHidden></TableHead>
 */
export function VisuallyHidden({ asChild = false, className, ...props }: VisuallyHiddenProps) {
  if (asChild) return <Slot className={cn('sr-only', className)} {...props} />;
  return <span data-slot="visually-hidden" className={cn('sr-only', className)} {...props} />;
}
