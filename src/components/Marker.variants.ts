import { cva } from '@/lib/cva';

/**
 * A quiet line in a conversation or a feed — "Today", "Rin joined".
 *
 * `divider` draws a rule on each side of centred text. The rules are borders on
 * the two pseudo-elements, not filled boxes: Windows high contrast replaces
 * every background with the page colour, which would erase a `bg-` line, and
 * keeps borders in the text colour. `min-w-4` keeps a stub of rule on each
 * side when the text is long enough to wrap; the text shrinks, the rules stay.
 *
 * `border` is a rule under the line, for a label that heads what follows it.
 */
export const markerVariants = cva(
  'flex w-full items-center gap-2 text-start font-text text-caption font-medium text-fg-secondary [--icon-size:var(--icon-sm)]',
  {
    variants: {
      variant: {
        plain: '',
        divider: [
          'text-center',
          'before:min-w-4 before:flex-1 before:border-t before:border-line-subtle',
          'after:min-w-4 after:flex-1 after:border-t after:border-line-subtle',
        ],
        border: 'border-b border-line-subtle pb-2',
      },
    },
    defaultVariants: { variant: 'plain' },
  },
);
