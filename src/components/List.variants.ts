import { cva } from '@/lib/cva';

/**
 * A prose list: the list a reader reads. A grid of product cards, a row of
 * chips and a column of message bubbles are semantically lists too, and none
 * of them wants a marker; they are layout, and this is not.
 *
 * **The marker is a decision, not the browser's default.** A default disc is
 * `currentColor` at the text's own size, which puts a full-strength dot beside
 * every line and makes a three-item list look like a warning. It is muted here,
 * and an ordered list's numbers are tabular so a run past nine keeps its
 * column.
 *
 * **`plain` is not "no list".** An item that carries its own leading icon still
 * belongs in a `<ul>` — a screen reader should still say "list, 5 items" — and
 * dropping to a `<div>` to lose a bullet is how that gets thrown away.
 *
 * **Nesting is styled from the parent.** A second level switches `disc` to
 * `circle` and `decimal` to `lower-alpha`, which is what makes two levels
 * readable; a `List` cannot know its own depth, but its ancestor can say what
 * happens below it.
 */
/**
 * What a second level looks like, written by the level above it.
 *
 * A descendant selector (`.parent ul`) outranks the nested list's own
 * `list-disc`, which is what lets the outer list decide. `plain` therefore has
 * to say `list-none!` to keep its own answer — an icon list nested inside a
 * bulleted one is the case that needs it, and without the `!` it would sprout
 * circles it never asked for.
 */
const NESTED = '[&_ul]:list-[circle] [&_ol]:list-[lower-alpha]';

export const listVariants = cva(
  ['font-text text-fg-secondary', '[&>li+li]:mt-2', '[&_ol]:mt-2 [&_ul]:mt-2'],
  {
    variants: {
      variant: {
        bullet: `list-disc ps-5 marker:text-fg-muted ${NESTED}`,
        number: `list-decimal ps-5 marker:font-medium marker:text-fg-muted marker:tabular-nums ${NESTED}`,
        plain: 'list-none! ps-0',
      },
      size: { sm: 'text-body-sm', md: 'text-body-md' },
    },
    defaultVariants: { variant: 'bullet', size: 'md' },
  },
);
