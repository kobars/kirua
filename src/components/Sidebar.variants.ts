import { cva } from '@/lib/cva';

/**
 * How the rail behaves when it is closed, and nothing else — `open` is a
 * separate prop rendered as `data-open` / `data-closed`, because a variant axis
 * would have to multiply the two and produce a compound variant for every
 * combination.
 */
export const sidebarVariants = cva(
  [
    'group/sidebar flex h-full shrink-0 flex-col border-e border-line-subtle bg-sunken',
    'transition-[width,visibility] duration-base ease-out',
  ],
  {
    variants: {
      collapsible: {
        /** Narrows to a rail of icons. The labels are hidden, the targets stay. */
        icon: 'w-64 data-closed:w-16',
        /**
         * Leaves the layout entirely. Pair with a `Sheet` on a small screen.
         * `invisible` is what takes a closed rail out of the tab order and the
         * accessibility tree: a 0px box still holds focusable links.
         * Visibility flips at the end of the width transition, so the close
         * still animates.
         */
        offcanvas:
          'w-64 data-closed:invisible data-closed:w-0 data-closed:overflow-hidden data-closed:border-e-0',
        /** Always open. The right choice on a screen wide enough to spare it. */
        none: 'w-64',
      },
      /**
       * `plain` drops the fill and the dividing edge, for a rail that sits on
       * the page background beside the content rather than as a panel.
       */
      variant: {
        panel: '',
        plain: 'border-e-0 bg-transparent',
      },
      /**
       * The open width. `sm` is 13rem, for a rail of five short destinations;
       * `lg` is 18rem, for a list of long titles — conversations, documents.
       */
      width: {
        md: '',
        sm: 'w-52',
        lg: 'w-72',
      },
    },
    defaultVariants: { collapsible: 'icon' },
  },
);
