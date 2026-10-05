/* oxlint-disable jsx-a11y/no-noninteractive-tabindex --
 * axe requires a scrolling region to be keyboard reachable
 * (`scrollable-region-focusable`); this rule forbids a tabindex on a div. The
 * scroll box needs the tabindex or its right-hand columns are pointer-only.
 * File-level because the next-line form does not take for jsx-a11y rules in
 * oxlint 1.75. */
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { tableCellVariants } from './TableCell.variants';

/**
 * Rows of data. Sorting, selection and paging are the consumer's state and are
 * deliberately absent; `Pagination` is the separate control.
 *
 * The table wraps itself in its own scrolling box, so a wide table scrolls
 * instead of its page.
 *
 * `TableCaption` is the accessible name. Wrap its text in `VisuallyHidden`
 * when a visible heading above already names the table.
 *
 * `sticky` on a `TableHead` and the `TableCell`s below it pins that column
 * while the rest scroll: `start` for the column that names the row, `end`
 * for its actions. Pass `surface="raised"` when the table sits in a `Card`,
 * so the pinned cells paint the card's fill rather than the page's.
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
export interface TableProps extends ComponentProps<'table'> {
  /**
   * The surface the table sits on, which a pinned column paints as its fill.
   * `raised` inside a `Card`, `page` everywhere else. Only pinned cells read
   * it; every other cell is transparent.
   */
  surface?: 'page' | 'raised' | undefined;
}

export function Table({ className, surface = 'page', ...props }: TableProps) {
  return (
    <div
      data-slot="table-scroll"
      data-surface={surface}
      tabIndex={0}
      className={cn(
        'w-full overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        '[--table-fill:var(--color-page)] data-[surface=raised]:[--table-fill:var(--color-raised)]',
      )}
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

/**
 * A row. Mark a selected row with `data-selected`: the row and any pinned
 * cell take the selected fill. `data-selected={row.isSelected}` is safe —
 * React writes `"false"` for an unselected row, and that does not match.
 * Selection itself is the consumer's state, usually a `Checkbox` in the
 * first cell.
 *
 * @example
 * <TableRow data-selected={selected.has(id)}>
 *   <TableCell><Checkbox aria-label={`Select ${name}`} checked={selected.has(id)} /></TableCell>
 *   <TableCell>{name}</TableCell>
 * </TableRow>
 */
export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'group/row border-b border-line-subtle transition-colors duration-fast ease-out',
        'hover:bg-sunken',
        'data-selected:bg-selected data-selected:text-on-selected',
        className,
      )}
      {...props}
    />
  );
}

export interface TableHeadProps
  extends ComponentProps<'th'>, Pick<VariantProps<typeof tableCellVariants>, 'sticky'> {
  /**
   * Makes the column sortable: the label becomes a button that calls
   * `onSort`, and the cell carries `aria-sort` with this value. The sort
   * itself is the consumer's state.
   */
  sort?: 'ascending' | 'descending' | 'none' | undefined;
  onSort?: (() => void) | undefined;
}

/**
 * A header cell. `scope` defaults to `col`: without one, a screen reader cannot
 * tell which header describes which cell in a table that has both.
 *
 * It is positioned, as `TableCell` is, so a `VisuallyHidden` label inside —
 * the name of an actions column — is contained by the cell. Otherwise its
 * containing block is the page, and in a table that scrolls sideways it lands
 * at the table's full width and widens the document.
 *
 * `aria-sort` belongs on the cell, not on the button inside it, which is why
 * sorting is a prop here rather than a button the consumer places.
 *
 * @example
 * <TableHead sort={by === 'stock' ? direction : 'none'} onSort={() => toggle('stock')}>
 *   Stock
 * </TableHead>
 */
export function TableHead({
  className,
  scope = 'col',
  sort,
  onSort,
  sticky,
  children,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      aria-sort={sort}
      className={cn(
        'border-b border-line px-3 py-2.5 text-start font-semibold text-nowrap text-fg',
        'relative',
        tableCellVariants({ sticky }),
        className,
      )}
      {...props}
    >
      {sort === undefined ? (
        children
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-mx-2"
          onClick={onSort}
          trailingIcon={
            sort === 'ascending' ? (
              <ChevronUpIcon />
            ) : sort === 'descending' ? (
              <ChevronDownIcon />
            ) : undefined
          }
        >
          {children}
        </Button>
      )}
    </th>
  );
}

export interface TableCellProps
  extends ComponentProps<'td'>, VariantProps<typeof tableCellVariants> {}

export function TableCell({
  className,
  numeric,
  tone,
  nowrap,
  sticky,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'relative px-3 py-2.5 align-middle',
        tableCellVariants({ numeric, tone, nowrap, sticky }),
        className,
      )}
      {...props}
    />
  );
}
