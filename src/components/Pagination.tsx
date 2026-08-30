/* oxlint-disable jsx-a11y/anchor-has-content --
 * The previous and next links are usually icon-only and named by `aria-label`.
 * The rule looks for literal children; the stories assert the names. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './Button.variants';
import { ChevronEndIcon, ChevronStartIcon, MoreIcon } from './icons';

export interface PaginationProps extends ComponentProps<'nav'> {
  /** Names the navigation landmark. Overridable, because it is user-visible text. */
  label?: string;
}

/**
 * Moving between pages of a list. These are links, not buttons: a page of
 * results has a URL, so it can be opened in a new tab, bookmarked and reached
 * with the Back button.
 *
 * @example
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
 *     <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
 *     <PaginationItem><PaginationLink href="?page=2" isCurrent>2</PaginationLink></PaginationItem>
 *     <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 */
export function Pagination({ className, label = 'Pagination', ...props }: PaginationProps) {
  return (
    <nav
      data-slot="pagination"
      aria-label={label}
      className={cn('flex w-full justify-center', className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-wrap items-center gap-1', className)}
      {...props}
    />
  );
}

export function PaginationItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" className={cn(className)} {...props} />;
}

export interface PaginationLinkProps extends ComponentProps<'a'> {
  isCurrent?: boolean;
}

/** Borrows `buttonVariants` so the look cannot drift from `Button`. */
export function PaginationLink({ className, isCurrent, ...props }: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: isCurrent ? 'primary' : 'ghost', size: 'md' }),
        'min-w-11 rounded-md px-3',
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  label = 'Previous page',
  children,
  ...props
}: ComponentProps<'a'> & { label?: string }) {
  return (
    <a
      data-slot="pagination-previous"
      aria-label={label}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'md' }),
        'gap-1 rounded-md px-3',
        className,
      )}
      {...props}
    >
      <ChevronStartIcon className="rtl:-scale-x-100" />
      {children}
    </a>
  );
}

export function PaginationNext({
  className,
  label = 'Next page',
  children,
  ...props
}: ComponentProps<'a'> & { label?: string }) {
  return (
    <a
      data-slot="pagination-next"
      aria-label={label}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'md' }),
        'gap-1 rounded-md px-3',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronEndIcon className="rtl:-scale-x-100" />
    </a>
  );
}

/** The gap in a long trail of pages. Decorative. */
export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn(
        'flex size-11 items-center justify-center text-fg-muted',
        '[--icon-size:var(--icon-sm)]',
        className,
      )}
      {...props}
    >
      <MoreIcon />
    </span>
  );
}
