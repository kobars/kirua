import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { linkVariants } from './Link.variants';

export interface LinkProps extends ComponentProps<'a'>, VariantProps<typeof linkVariants> {}

/**
 * An ordinary link — the one this system had no way to write.
 *
 * There were three link components before this (`BreadcrumbLink`,
 * `PaginationLink`, `NavigationMenuLink`), each locked inside its own pattern,
 * so a plain anchor was written by hand six times with six different class
 * strings — and every one of them retyped the same four-class focus ring.
 * That is the failure this closes: a ring copied by hand at every call site is
 * a ring somebody eventually leaves off, and nothing catches it.
 *
 * `Button` has `asChild` for the case where an action navigates. This is the
 * other direction: a link that reads as text rather than as a control. It has
 * no `asChild` of its own, because an anchor's semantics never legitimately
 * become something else — a link that is not a link is a bug.
 *
 * @example
 * // In a sentence. Underlined always, never only on hover.
 * <Text>Read the <Link href="#/guide">publishing guide</Link> first.</Text>
 *
 * @example
 * // The link is the whole thing you click, so it keeps the text colour it is in.
 * <CardTitle as="h2"><Link variant="block" href="#/produk/1">Kacamata bulat</Link></CardTitle>
 */
export function Link({ className, variant, children, ...props }: LinkProps) {
  return (
    // `children` is written out rather than left inside the spread, so
    // `jsx-a11y/anchor-has-content` can see that this anchor has content. The
    // rule reads the JSX it is given; a bare spread tells it nothing, and a
    // suppression here would switch the rule off for every consumer's anchor
    // that this component now stands in front of.
    <a data-slot="link" className={cn(linkVariants({ variant }), className)} {...props}>
      {children}
    </a>
  );
}
