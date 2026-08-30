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
    'transition-[width] duration-base ease-out',
  ],
  {
    variants: {
      collapsible: {
        /** Narrows to a rail of icons. The labels are hidden, the targets stay. */
        icon: 'w-64 data-closed:w-16',
        /** Leaves the layout entirely. Pair with a `Sheet` on a small screen. */
        offcanvas: 'w-64 data-closed:w-0 data-closed:overflow-hidden data-closed:border-e-0',
        /** Always open. The right choice on a screen wide enough to spare it. */
        none: 'w-64',
      },
    },
    defaultVariants: { collapsible: 'icon' },
  },
);
