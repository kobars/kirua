import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { listVariants } from './List.variants';

export interface ListProps
  extends Omit<ComponentProps<'ul'>, 'type'>, VariantProps<typeof listVariants> {}

/**
 * A list a reader reads, as opposed to a list a layout happens to be.
 *
 * `variant="number"` renders an `<ol>`; the other two render a `<ul>`. That is
 * one prop rather than two because the element and the marker have never
 * disagreed on a real page — an ordered list without numbers is a list whose
 * order nothing conveys, which is a bug rather than a style.
 *
 * Known limitation, same shape as `asChild`'s: with `variant="number"` the ref
 * reaches the `<ol>` at runtime but its type stays `HTMLUListElement`.
 *
 * @example
 * <List>
 *   <ListItem>The artwork is the interface.</ListItem>
 *   <ListItem>A price is a sentence, not a table.</ListItem>
 * </List>
 *
 * @example
 * // Items carrying their own leading icon. Still a list; just not a bulleted one.
 * <List variant="plain">
 *   <ListItem className="flex gap-2"><CheckIcon /> Unlimited galleries</ListItem>
 * </List>
 */
export function List({ className, variant, size, ...props }: ListProps) {
  // The element really is an `<ol>` for `number`, and the ref really reaches
  // it. Its *type* stays `HTMLUListElement`, because `variant` is a string and
  // not a type parameter — the same limitation `asChild` has. A consumer
  // needing the narrow type casts; `HTMLOListElement` adds only `start` and
  // `reversed`, which nothing reads off a ref.
  const Comp = (variant === 'number' ? 'ol' : 'ul') as 'ul';
  return (
    <Comp
      data-slot="list"
      className={cn(listVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/**
 * One item. It carries no classes of its own by default — the spacing and the
 * marker belong to the list, so that a nested list is spaced by *its* parent
 * rather than by whichever level happened to set a margin first.
 */
export function ListItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="list-item" className={cn(className)} {...props} />;
}
