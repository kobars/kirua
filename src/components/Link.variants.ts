import { cva } from '@/lib/cva';

/**
 * The underline decision, made once.
 *
 * The axis that decides it is not taste, it is whether the link sits *inside a
 * sentence*.
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
 * whatever the surrounding text is and underlines on hover.
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
        /**
         * At least 24px tall, the WCAG 2.5.8 minimum for a target that is not
         * inside a sentence: one line of body text is about 19px, and a name in
         * a table row is exactly such a target. Flex centres the line in the
         * extra height, and an inline-flex box still wraps a long title.
         *
         * The box is atomic, so a truncating parent cannot put its ellipsis
         * inside it. `max-w-full` holds the link to the parent's width, and
         * the text inside truncates itself:
         * `<Link variant="block"><Text inline truncate>…</Text></Link>`.
         * Never inside running text either: the 24px box would make its own
         * line taller than the lines around it. That is `inline`'s job.
         */
        block: 'inline-flex min-h-6 max-w-full items-center hover:underline',
        /**
         * Underlined always, in the colour of the text around it: a link on a
         * tinted surface — an alert — where the accent colour was measured
         * against the page and not against the tint.
         */
        inherit: 'underline',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);
