import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDownIcon } from './icons';

/**
 * A site header whose items can open a panel of links.
 *
 * It is **not** a menu, and the difference decides the markup: this renders a
 * `<nav>` full of links, so a screen reader announces "navigation" and the
 * links are links. `Menubar` renders `menuitem`s, which are commands that act
 * on the page. Using a menu for site navigation is the most common way to make
 * a header unusable, because a menu traps the arrow keys and a link list must
 * not.
 *
 * A panel opens on hover **and** on click, and stays open while the pointer
 * travels towards it — Radix handles the pointer-safety triangle that
 * otherwise closes the panel the moment the cursor leaves the trigger.
 *
 * `NavigationMenuLink` is the piece that must wrap every anchor inside a panel.
 * Radix uses it to close the panel after a selection and to mark the current
 * page.
 *
 * @example
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *       <NavigationMenuContent>
 *         <NavigationMenuLink href="#/bags">Bags</NavigationMenuLink>
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 */
export function NavigationMenu({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn('relative flex max-w-full items-center justify-center', className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  );
}

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        'group inline-flex h-9 cursor-pointer items-center gap-1 rounded-pill px-4',
        'font-text text-body-sm font-medium text-fg',
        'transition-[color,background-color,border-color] duration-fast ease-out hover:bg-ghost-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-open:bg-ghost-hover',
        '[--icon-size:var(--icon-sm)]',
        className,
      )}
      {...props}
    >
      {children}
      {/* Rotation is symmetrical, so this needs no right-to-left mirror. */}
      <ChevronDownIcon
        aria-hidden="true"
        className="text-fg-muted transition-transform duration-fast group-data-open:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

const contentWidths = { sm: 'md:w-sm', md: 'md:w-md', lg: 'md:w-lg' } as const;

export interface NavigationMenuContentProps extends ComponentProps<
  typeof NavigationMenuPrimitive.Content
> {
  /**
   * A fixed width from `md` up. Unset, the panel is as wide as its content —
   * which, for a grid of links, is as wide as the menu before Radix has
   * measured anything, so a two-column panel needs one. Below `md` the panel
   * spans the menu.
   */
  width?: keyof typeof contentWidths;
}

/**
 * One panel of links.
 *
 * @example
 * <NavigationMenuContent width="md">
 *   <Grid columns={2} gap={1}>
 *     <NavigationMenuLink href="#/bags">Bags</NavigationMenuLink>
 *     <NavigationMenuLink href="#/shoes">Shoes</NavigationMenuLink>
 *   </Grid>
 * </NavigationMenuContent>
 */
export function NavigationMenuContent({
  className,
  width,
  ...props
}: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'w-full p-3 md:w-auto',
        width && contentWidths[width],
        'data-open:animate-fade-in data-closed:animate-fade-out',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Where every panel is drawn. Rendered by `NavigationMenu` itself, because a
 * viewport in the wrong place is a panel that opens under the page.
 *
 * Radix measures the active panel and publishes the size as
 * `--radix-navigation-menu-viewport-width/height`, which is what lets the box
 * resize between panels of different sizes instead of jumping.
 */
function NavigationMenuViewport({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    // Not portalled, so it names its layer: positioned content later in the
    // page would otherwise paint over the open panel.
    <div
      data-slot="navigation-menu-viewport-wrapper"
      className="absolute top-full z-popover flex w-full justify-center"
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'relative mt-2 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden',
          'origin-top rounded-lg border border-line-subtle bg-raised shadow-overlay',
          'md:w-(--radix-navigation-menu-viewport-width)',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          className,
        )}
        {...props}
      />
    </div>
  );
}

const linkShapes = {
  /** A tile in a panel: a name, and a line under it. */
  panel: 'flex flex-col gap-1 rounded-sm p-3',
  /** A link in the menu's own row, shaped like the triggers beside it. */
  top: 'inline-flex h-9 items-center rounded-pill px-4 font-medium',
} as const;

export interface NavigationMenuLinkProps extends ComponentProps<
  typeof NavigationMenuPrimitive.Link
> {
  /** `top` for a link that sits in the list beside the triggers, not inside a panel. */
  variant?: keyof typeof linkShapes;
}

/**
 * A link, in a panel or in the menu's own row.
 *
 * @example
 * <NavigationMenuItem>
 *   <NavigationMenuLink variant="top" href="#/orders">Orders</NavigationMenuLink>
 * </NavigationMenuItem>
 */
export function NavigationMenuLink({
  className,
  variant = 'panel',
  ...props
}: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        linkShapes[variant],
        'font-text text-body-sm text-fg no-underline select-none',
        'transition-[color,background-color,border-color] duration-fast ease-out hover:bg-ghost-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-active:bg-ghost-hover data-active:font-medium',
        className,
      )}
      {...props}
    />
  );
}
