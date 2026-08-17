import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface NavItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  items: NavItem[];
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
 * @example
 * <NavBar
 *   aria-label="Main"
 *   items={[{ label: 'Home', href: '/', current: true }, { label: 'About', href: '/about' }]}
 *   actions={<IconButton aria-label="Search"><SearchIcon /></IconButton>}
 * />
 */
export function NavBar({
  items,
  actions,
  className,
  'aria-label': ariaLabel = 'Main',
  ...props
}: NavBarProps) {
  return (
    <nav
      data-slot="nav-bar"
      aria-label={ariaLabel}
      className={cn(
        // `bg-page` inside `ctx-inverse` resolves to pure black in BOTH light
        // and dark mode. `bg-inverse` would flip to white under `.dark`.
        'ctx-inverse bg-page',
        // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- [FIGMA] 70px, must not track --spacing
        'flex h-[4.375rem] min-w-0 items-center gap-3 rounded-lg px-3 md:gap-6 md:px-8',
        className,
      )}
      {...props}
    >
      {/* Scrolls rather than overflowing once the links stop fitting. The
          scrollbar is hidden because the pill is only 70px tall. */}
      <ul
        className={cn(
          'flex min-w-0 flex-1 items-center justify-start gap-1 md:justify-center md:gap-2',
          'scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden',
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 shrink-0 items-center rounded-pill px-3 md:px-4',
                'font-text text-body-sm text-fg-secondary md:text-body-md',
                'transition-colors duration-200 ease-out',
                'hover:bg-ghost-hover hover:text-fg',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                item.current && 'bg-ghost-hover font-medium text-fg',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </nav>
  );
}
