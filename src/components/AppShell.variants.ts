import { cva } from '@/lib/cva';

/**
 * The application frame.
 *
 * It declares `--app-header-height` once, and `AppHeader`, `AppRail` and a
 * `Pane` of `height="screen"` all read it: the rail sticks under the header and
 * fills the rest of the viewport, and nothing has to repeat the number. 68px
 * is a 44px control with 12px above and below it.
 *
 * `overflow-x-clip` rather than `overflow-x-hidden`: `clip` does not make the
 * shell a scroll container, so the sticky header and rail inside it still
 * stick to the viewport.
 *
 * `scroll="page"` is a document that scrolls. `scroll="panes"` is an
 * application that fits the viewport exactly and scrolls inside its panes —
 * a chat, a mail client — so the shell itself never scrolls.
 */
export const appShellVariants = cva(
  ['flex flex-col overflow-x-clip bg-page text-fg', '[--app-header-height:--spacing(17)]'],
  {
    variants: {
      scroll: {
        page: 'min-h-dvh',
        panes: 'h-dvh overflow-hidden',
      },
    },
    defaultVariants: { scroll: 'page' },
  },
);
