import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface NavItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavBarProps extends ComponentProps<'nav'> {
  /** The links, from data. For a router's link component, place `NavBarLink`s
   *  as children instead; both may be used, and the items come first. */
  items?: NavItem[];
  actions?: ReactNode;
  'aria-label'?: string;
}

/**
 * The reference design's black pill navigation. Measured: 70px tall, 22px
 * radius, pure black. Sets `ctx-inverse`, so anything passed via `actions` picks
 * up its on-black colours with no override.
 *
 * Renders a real `<nav>` wrapping a list — "list of 4 navigation links" is what
 * a screen reader should announce.
 *
 * `items` renders plain anchors. With a client router, compose `NavBarLink`s
 * as children and render each onto the router's link with `asChild`, so a
 * change of page is a client transition rather than a document load.
 *
 * @example
 * <NavBar
 *   aria-label="Main"
 *   items={[{ label: 'Home', href: '/', current: true }, { label: 'About', href: '/about' }]}
 *   actions={<IconButton aria-label="Search"><SearchIcon /></IconButton>}
 * />
 *
 * @example
 * <NavBar aria-label="Main">
 *   <NavBarLink asChild current={pathname === '/'}><NextLink href="/">Home</NextLink></NavBarLink>
 *   <NavBarLink asChild current={pathname === '/about'}><NextLink href="/about">About</NextLink></NavBarLink>
 * </NavBar>
 */
export function NavBar({
  items = [],
  actions,
  className,
  children,
  'aria-label': ariaLabel = 'Main',
  ...props
}: NavBarProps) {
  return (
    <nav
      data-slot="nav-bar"
      aria-label={ariaLabel}
      className={cn(
        // `bg-page` inside `ctx-inverse` resolves to pure black in BOTH light
        // and dark mode. `bg-inverse` would flip to white under `.dark`. The
        // Clay edge is drawn inside the box, so the 70px height holds.
        'ctx-inverse bg-page inset-ring-(length:--clay-edge) inset-ring-line-inverse',
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- [FIGMA] 70px, must not track --spacing
        'flex h-[4.375rem] min-w-0 items-center gap-3 rounded-lg px-3 md:gap-6 md:px-8',
        className,
      )}
      {...props}
    >
      {/* Scrolls rather than overflowing once the links stop fitting. The
          scrollbar is hidden because the pill is only 70px tall. */}
      <ul
        data-slot="nav-bar-list"
        className={cn(
          'flex min-w-0 flex-1 items-center justify-start gap-1 md:justify-center md:gap-2',
          'scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden',
        )}
      >
        {items.map((item) => (
          <NavBarLink key={item.href} href={item.href} current={item.current ?? false}>
            {item.label}
          </NavBarLink>
        ))}
        {children}
      </ul>
      {actions && (
        <div data-slot="nav-bar-actions" className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </nav>
  );
}

export interface NavBarLinkProps extends ComponentProps<'a'> {
  /** This destination is the one on screen. Rendered as `aria-current="page"`. */
  current?: boolean;
  /** Render onto the child — a router's link component, which renders the anchor. */
  asChild?: boolean;
}

/**
 * One link in a `NavBar`, in its own list item. `NavBar`'s `items` render
 * these; place them yourself to use a router's link component.
 *
 * @example
 * <NavBarLink asChild current><NextLink href="/">Home</NextLink></NavBarLink>
 */
export function NavBarLink({
  current = false,
  asChild = false,
  className,
  children,
  ...props
}: NavBarLinkProps) {
  const Comp = asChild ? Slot : 'a';
  return (
    <li>
      <Comp
        data-slot="nav-bar-link"
        aria-current={current ? 'page' : undefined}
        className={cn(
          'inline-flex h-11 shrink-0 items-center rounded-pill px-3 md:px-4',
          'font-text text-body-sm text-fg-secondary md:text-body-md',
          'transition-colors duration-fast ease-out',
          'hover:bg-ghost-hover hover:text-fg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'aria-[current=page]:bg-ghost-hover aria-[current=page]:font-medium aria-[current=page]:text-fg',
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    </li>
  );
}
