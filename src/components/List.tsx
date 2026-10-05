import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { listVariants } from './List.variants';

export interface ListProps
  extends Omit<ComponentProps<'ul'>, 'type'>, VariantProps<typeof listVariants> {}

/**
 * A list a reader reads, as opposed to a list a layout happens to be.
 *
 * `variant="number"` renders an `<ol>`; the other two render a `<ul>`. That is
 * one prop rather than two because the element and the marker never disagree
 * on a real page — an ordered list without numbers is a list whose
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
 *   <ListItem icon={<CheckIcon tone="accent" />}>Unlimited galleries</ListItem>
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
      // WebKit drops the list role from a list styled `list-style: none`, so
      // VoiceOver reads the plain variant as loose lines; the explicit role
      // keeps it announced as a list.
      role={variant === 'plain' ? 'list' : undefined}
      className={cn(listVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export interface ListItemProps extends ComponentProps<'li'> {
  /**
   * A leading mark in place of a bullet — a tick in a list of features. It is
   * decorative, and it stays on the first line when the text wraps.
   */
  icon?: ReactNode;
}

/**
 * One item. It carries no classes of its own by default — the spacing and the
 * marker belong to the list, so that a nested list is spaced by *its* parent
 * rather than by whichever level happened to set a margin first.
 */
export function ListItem({ className, icon, children, ...props }: ListItemProps) {
  if (icon === undefined || icon === null) {
    return (
      <li data-slot="list-item" className={cn(className)} {...props}>
        {children}
      </li>
    );
  }
  return (
    <li data-slot="list-item" className={cn('flex items-start gap-2', className)} {...props}>
      {/* The first line's height, so the icon centres on it however many lines follow. */}
      <span aria-hidden="true" className="flex h-lh shrink-0 items-center">
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}
