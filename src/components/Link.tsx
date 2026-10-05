import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { linkVariants } from './Link.variants';

export interface LinkProps extends ComponentProps<'a'>, VariantProps<typeof linkVariants> {
  /**
   * Render the styles onto the child, which must itself render an anchor —
   * a router's link component, such as `next/link`, so navigation stays a
   * client transition.
   */
  asChild?: boolean;
}

/**
 * An ordinary link.
 *
 * The other link components (`BreadcrumbLink`, `PaginationLink`,
 * `NavigationMenuLink`) each belong to their own pattern. This one is for any
 * other anchor, and it carries the focus ring so no call site retypes it: a
 * ring copied by hand at every call site is a ring somebody eventually leaves
 * off, and nothing catches it.
 *
 * `Button` has `asChild` for the case where an action navigates. This is the
 * other direction: a link that reads as text rather than as a control. Its own
 * `asChild` is not for changing what the element is — a link that is not a
 * link is a bug — but for changing what renders it: a router's link component
 * still renders an `<a>`, and needs these styles on it.
 *
 * @example
 * // In a sentence. Underlined always, never only on hover.
 * <Text>Read the <Link href="#/guide">publishing guide</Link> first.</Text>
 *
 * @example
 * // The link is the whole thing you click, so it keeps the text colour it is in.
 * <CardTitle as="h2"><Link variant="block" href="#/product/1">Round Glasses</Link></CardTitle>
 *
 * @example
 * // A client-side transition, from a router's own link component.
 * <Link asChild><NextLink href="/guide">publishing guide</NextLink></Link>
 */
export function Link({ className, variant, asChild = false, children, ...props }: LinkProps) {
  if (asChild) {
    return (
      <Slot data-slot="link" className={cn(linkVariants({ variant }), className)} {...props}>
        {children}
      </Slot>
    );
  }
  return (
    // `children` is written out rather than left inside the spread, so
    // `jsx-a11y/anchor-has-content` can see that this anchor has content. The
    // rule reads the JSX it is given; a bare spread tells it nothing, and a
    // suppression here would switch the rule off for every consumer's anchor
    // that this component stands in front of.
    <a data-slot="link" className={cn(linkVariants({ variant }), className)} {...props}>
      {children}
    </a>
  );
}
