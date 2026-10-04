import { cva } from '@/lib/cva';

/**
 * A data cell's figures, tone and wrapping.
 *
 * `numeric` is tabular figures, so a column of amounts lines up digit for
 * digit. `nowrap` keeps a date or a code on one line; the table scrolls
 * sideways in its own box rather than breaking "Mar 12, 2026" in two.
 */
export const tableCellVariants = cva('', {
  variants: {
    numeric: { true: 'tabular-nums', false: '' },
    tone: {
      primary: 'text-fg',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
    },
    nowrap: { true: 'whitespace-nowrap', false: '' },
    /**
     * Pins the column to one edge of the table's scroll box: `start` for the
     * column that names the row, `end` for the row's actions. A pinned cell
     * paints its own fill — the table's surface, the row's hover, the
     * selected fill — because the columns scrolling under it would show
     * through a transparent one. The resting fill is a variable the table
     * sets, not a surface variant here: a variant would match the hover and
     * selected rules' specificity and could win over them. The hairline on its inner edge is a
     * pseudo-element: with collapsed borders, a sticky cell's own border
     * stays behind in the grid and scrolls away.
     */
    sticky: {
      start: [
        'sticky inset-s-0 z-raised bg-(--table-fill)',
        'group-hover/row:bg-sunken group-data-selected/row:bg-selected',
        'after:pointer-events-none after:absolute after:inset-y-0 after:inset-e-0 after:w-px after:bg-line-subtle',
      ],
      end: [
        'sticky inset-e-0 z-raised bg-(--table-fill)',
        'group-hover/row:bg-sunken group-data-selected/row:bg-selected',
        'after:pointer-events-none after:absolute after:inset-y-0 after:inset-s-0 after:w-px after:bg-line-subtle',
      ],
    },
  },
});
