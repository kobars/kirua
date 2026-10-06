import { cva } from '@/lib/cva';

/**
 * A file shown as a small card. It is `Item`'s outline row — a 1px line on a
 * raised fill, not a Clay card's 3px edge and hard shadow — because it sits
 * inside other surfaces (a composer, a message, a record's card) at the size
 * of a control, and a second heavy edge inside a card is a line the design did
 * not ask for.
 *
 * `isolate` makes the card its own stacking context, so the stretched
 * trigger's hit area and the actions above it are ordered against each other
 * with the named layers, and neither competes with anything outside the card.
 *
 * The focus ring is drawn on the card, not on the trigger: the trigger's own
 * box is only the title, while what it opens is the whole card.
 */
export const attachmentVariants = cva(
  [
    'group/attachment relative isolate flex max-w-full min-w-0 rounded-md',
    'border border-line-subtle bg-raised text-start font-text text-fg shadow-resting',
    'transition-colors duration-fast ease-out',
    'has-data-[slot=attachment-trigger]:hover:bg-ghost-hover',
    'has-[[data-slot=attachment-trigger]:focus-visible]:outline-2',
    'has-[[data-slot=attachment-trigger]:focus-visible]:outline-offset-2',
    'has-[[data-slot=attachment-trigger]:focus-visible]:outline-ring',
    // Not uploaded yet: the edge is dashed until the file has arrived.
    'data-[status=uploading]:border-dashed',
    'data-[status=error]:border-danger-solid',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 p-1.5 text-body-sm [--icon-size:var(--icon-sm)]',
        md: 'gap-3 p-2 text-body-md [--icon-size:var(--icon-md)]',
      },
      /**
       * `horizontal` is a row that fills its container, media at the start.
       * `vertical` is a fixed-width tile whose media is a square across the
       * top — an image preview — with the actions over its end corner.
       */
      orientation: {
        horizontal: 'w-full items-center',
        vertical: 'w-36 flex-col',
      },
    },
    defaultVariants: { size: 'md', orientation: 'horizontal' },
  },
);
