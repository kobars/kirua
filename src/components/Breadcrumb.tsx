import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { ChevronEndIcon, MoreIcon } from './icons';

export interface BreadcrumbProps extends ComponentProps<'nav'> {
  /** Names the navigation landmark. Overridable, because it is user-visible text. */
  label?: string;
}

/**
 * Where this page sits in the structure above it. A named `<nav>` landmark; the
 * current page is `aria-current="page"` and not a link; separators are hidden.
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbPage>Siti Rahayu</BreadcrumbPage></BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 */
export function Breadcrumb({ className, label = 'Breadcrumb', ...props }: BreadcrumbProps) {
  return <nav data-slot="breadcrumb" aria-label={label} className={cn(className)} {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 font-text text-body-sm text-fg-secondary',
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  className,
  asChild = false,
  ...props
}: ComponentProps<'a'> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'a';

  return (
    <Component
      data-slot="breadcrumb-link"
      className={cn(
        'rounded-xs underline-offset-4 transition-colors duration-fast ease-out',
        'hover:text-fg hover:underline',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    />
  );
}

/** The current page: `aria-current`, and deliberately not a link. */
export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('font-medium text-fg', className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ className, children, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      // `role="presentation"` as well as `aria-hidden`: a bare `<li>` still
      // counts towards the item total a screen reader announces.
      role="presentation"
      aria-hidden="true"
      className={cn('flex items-center text-fg-muted [--icon-size:var(--icon-sm)]', className)}
      {...props}
    >
      {children ?? <ChevronEndIcon className="rtl:-scale-x-100" />}
    </li>
  );
}

/** A collapsed middle, for a trail too long for a phone. */
export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex items-center text-fg-muted [--icon-size:var(--icon-sm)]', className)}
      {...props}
    >
      <MoreIcon />
    </span>
  );
}
