import { cva } from '@/lib/cva';

/**
 * The underline decision, made once.
 *
 * The examples answered it two ways in one system: two of six anchors carried
 * `underline-offset-4 hover:underline` and four carried nothing, with no
 * reasoning recorded either way. The axis that actually separates them is not
 * taste, it is whether the link sits *inside a sentence*.
 *
 * **`inline` is always underlined, and never only on hover.** A link inside
 * running text that is told apart from the words around it by colour alone
 * fails WCAG 1.4.1, and an underline that appears on hover helps nobody
 * reading with a keyboard, a touch screen, or their eyes. So the underline is
 * permanent and the colour is the accent token, which is re-pointed in all
 * four surface contexts.
 *
 * **`block` never carries a colour of its own.** When the link *is* the thing
 * you click — a wordmark, a name in a table cell, a title on a card, a
 * navigation tile — its position already says so, and forcing accent blue onto
 * a card title would make every list look like a search result. It inherits
 * whatever the surrounding text is and underlines on hover, which is the
 * affordance four of the six anchors were missing.
 *
 * The focus ring is in the base and cannot be opted out of. That is the whole
 * reason the component exists: a wrong colour is visible to whoever wrote it,
 * and a missing focus ring is invisible until a keyboard user reaches it.
 */
export const linkVariants = cva(
  [
    'rounded-xs underline-offset-4',
    'transition-colors duration-fast ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      variant: {
        inline: 'text-fg-accent underline hover:text-fg',
        block: 'hover:underline',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);
