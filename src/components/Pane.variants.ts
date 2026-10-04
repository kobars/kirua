import { cva } from '@/lib/cva';

/**
 * A fixed-height column: a header, a body that scrolls, a footer.
 *
 * The column has to be given a height, or there is nothing for the body to
 * scroll inside of. `fill` takes the parent's — a resizable panel, a card the
 * parent already sized. `screen` is the viewport under the application header,
 * read from the shell's `--app-header-height` (zero outside a shell). The
 * three fixed steps are for a pane that sits inside a page among other
 * blocks.
 *
 * `min-h-0` is what lets the body shrink inside a flex column at all; without
 * it the body grows to its content and the pane overflows instead of
 * scrolling.
 */
export const paneVariants = cva('flex min-h-0 flex-col', {
  variants: {
    height: {
      fill: 'h-full',
      screen: 'h-[calc(100dvh-var(--app-header-height,0rem))]',
      sm: 'h-96',
      md: 'h-128',
      lg: 'h-160',
    },
  },
  defaultVariants: { height: 'fill' },
});
