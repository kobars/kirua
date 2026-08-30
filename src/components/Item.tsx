import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { itemVariants } from './Item.variants';

export interface ItemProps extends ComponentProps<'div'>, VariantProps<typeof itemVariants> {
  asChild?: boolean;
}

/**
 * One row: something at the start, a title and description in the middle,
 * controls at the end.
 *
 * It carries no ARIA role. A row is a paragraph in a settings panel, a
 * `listitem` in a list, and an `option` in a picker, and only the caller knows
 * which — `role="list"` in particular obliges every child to be a `listitem`,
 * which axe enforces as `aria-required-children`.
 *
 * @example
 * <ItemGroup>
 *   <Item asChild interactive>
 *     <a href="#/invoices/812">
 *       <ItemMedia><Avatar size="sm" /></ItemMedia>
 *       <ItemContent>
 *         <ItemTitle>Invoice 812</ItemTitle>
 *         <ItemDescription>Due 12 March</ItemDescription>
 *       </ItemContent>
 *       <ItemActions><Badge>Unpaid</Badge></ItemActions>
 *     </a>
 *   </Item>
 * </ItemGroup>
 */
export function Item({ className, variant, size, interactive, asChild, ...props }: ItemProps) {
  const Root = asChild ? Slot : 'div';
  return (
    <Root
      data-slot="item"
      className={cn(itemVariants({ variant, size, interactive }), className)}
      {...props}
    />
  );
}

export function ItemGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="item-group" className={cn('flex flex-col', className)} {...props} />;
}

/** The leading figure — an avatar, an icon, a thumbnail. Never grows. */
export function ItemMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-media"
      className={cn('flex shrink-0 items-center justify-center text-fg-muted', className)}
      {...props}
    />
  );
}

/** `min-w-0` is what lets a long title truncate instead of widening the row. */
export function ItemContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

export function ItemTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn('truncate font-text font-medium text-fg', className)}
      {...props}
    />
  );
}

export function ItemDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn('truncate font-text text-body-sm text-fg-secondary', className)}
      {...props}
    />
  );
}

export function ItemActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex shrink-0 items-center gap-1.5', className)}
      {...props}
    />
  );
}

export function ItemSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-separator"
      role="presentation"
      className={cn('h-px shrink-0 bg-line-subtle', className)}
      {...props}
    />
  );
}
