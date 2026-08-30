/* oxlint-disable jsx-a11y/no-noninteractive-tabindex --
 * axe requires a scrolling region to be keyboard reachable
 * (`scrollable-region-focusable`); this rule forbids a tabindex on a div. The
 * scroll box needs the tabindex or its right-hand columns are pointer-only.
 * File-level because the next-line form does not take for jsx-a11y rules in
 * oxlint 1.75. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Rows of data. Sorting, selection and paging are the consumer's state and are
 * deliberately absent; `Pagination` is the separate control.
 *
 * The table wraps itself in its own scrolling box, so a wide table scrolls
 * instead of its page.
 *
 * `TableCaption` is the accessible name. Give it `className="sr-only"` when a
 * visible heading above already names the table.
 *
 * @example
 * <Table>
 *   <TableCaption>Today's appointments</TableCaption>
 *   <TableHeader>
 *     <TableRow><TableHead scope="col">Patient</TableHead></TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow><TableCell>Siti Rahayu</TableCell></TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-scroll"
      tabIndex={0}
      className="w-full overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <table
        data-slot="table"
        className={cn('w-full border-collapse font-text text-body-sm text-fg', className)}
        {...props}
      />
    </div>
  );
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('pb-3 text-start font-text text-body-sm text-fg-secondary', className)}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t border-line font-medium', className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-line-subtle transition-colors duration-fast ease-out',
        'hover:bg-sunken',
        'data-selected:bg-selected data-selected:text-on-selected',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A header cell. `scope` defaults to `col`: without one, a screen reader cannot
 * tell which header describes which cell in a table that has both.
 */
export function TableHead({ className, scope = 'col', ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        'border-b border-line px-3 py-2.5 text-start font-semibold text-nowrap text-fg',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('px-3 py-2.5 align-middle', className)}
      {...props}
    />
  );
}
