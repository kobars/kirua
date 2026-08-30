import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { headingVariants } from './Heading.variants';

export interface HeadingProps
  extends ComponentProps<'h2'>, VariantProps<typeof headingVariants> {
  /**
   * The outline level, and it is required rather than defaulted.
   *
   * A hand-written `<h3>` cannot be asked to be an `<h2>`, so before this
   * component existed the level was decided by whichever size class looked
   * right — and three composed screens skipped a level that way, which only an
   * axe run over a whole page can see. Requiring the prop makes the author
   * choose the outline, and the size prop makes that choice free of how big the
   * text is.
   */
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * A heading, with its level and its size as separate decisions.
 *
 * Colour is not an axis. A heading is `text-fg` on every surface this system
 * defines, because the surface contexts re-point that token — a heading on
 * `.ctx-brand` is white without asking.
 *
 * To hide one visually, pass `className="sr-only"`: a section that needs a name
 * for the accessibility tree and not on the screen is a real case, and the
 * heading must stay in the tree rather than leave it.
 *
 * @example
 * <Heading as="h1" size="heading-lg">Three plans, and the free one is not a trial</Heading>
 *
 * @example
 * // The level and the size disagreeing on purpose: a section heading that
 * // reads at body size but is still an h2 in the outline.
 * <Heading as="h2" size="body-md">Delivery history</Heading>
 */
export function Heading({ as: Comp, size, className, ...props }: HeadingProps) {
  return (
    <Comp data-slot="heading" className={cn(headingVariants({ size }), className)} {...props} />
  );
}
