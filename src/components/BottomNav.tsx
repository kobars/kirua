import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface BottomNavProps extends ComponentProps<'nav'> {
  /** Required: a page with a header menu and this bar has two navigation landmarks. */
  'aria-label': string;
}

/**
 * A phone's tab bar: the few places an application has, at the bottom of the
 * screen where a thumb reaches them. Hidden from `md`, where a rail or the
 * header carries the same links.
 *
 * It is `sticky`, not `fixed`. Put it last inside `AppShell`: the shell is a
 * full-height column, so the bar stays at the foot of the viewport, and
 * because it still occupies its own space in the flow nothing has to pad the
 * page to keep the last row out from under it.
 *
 * @example
 * <BottomNav aria-label="Main">
 *   <BottomNavLink href="#/" icon={<GridIcon />} current>Home</BottomNavLink>
 *   <BottomNavLink href="#/messages" icon={<SendIcon />}>Messages</BottomNavLink>
 * </BottomNav>
 */
export function BottomNav({ className, children, ...props }: BottomNavProps) {
  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        'sticky bottom-0 z-sticky border-t border-line-subtle bg-page px-4 py-2 md:hidden',
        'print:hidden',
        className,
      )}
      {...props}
    >
      <ul className="mx-auto flex max-w-2xl items-center justify-around">{children}</ul>
    </nav>
  );
}

export interface BottomNavLinkProps extends ComponentProps<'a'> {
  href: string;
  icon: ReactNode;
  /** This destination is the one on screen. Rendered as `aria-current="page"`. */
  current?: boolean;
}

/**
 * One destination: an icon over a short label, at least 44px square. Extra
 * words for a screen reader — an unread count — go in a `VisuallyHidden`
 * after the label; the link is positioned so that text stays inside it.
 */
export function BottomNavLink({
  icon,
  current = false,
  className,
  children,
  ...props
}: BottomNavLinkProps) {
  return (
    <li>
      <a
        data-slot="bottom-nav-link"
        aria-current={current ? 'page' : undefined}
        className={cn(
          'relative flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-md px-2',
          'font-text text-caption text-fg-secondary no-underline [--icon-size:var(--icon-lg)]',
          'transition-colors duration-fast ease-out hover:text-fg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'aria-[current=page]:font-medium aria-[current=page]:text-fg',
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="flex">
          {icon}
        </span>
        {children}
      </a>
    </li>
  );
}
