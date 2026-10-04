import { cva } from '@/lib/cva';

/**
 * Body copy: how big, and how loud.
 *
 * Two axes rather than one, because they are genuinely independent — a caption
 * can be the primary voice of its block, and a body paragraph is usually the
 * secondary one. Collapsing them would let `text-body-sm text-fg` and
 * `text-body-sm text-fg-secondary` both mean "small print".
 *
 * `secondary` is the default because that is what body copy is next to a
 * heading, and it is what `CardBody` uses too.
 *
 * There is no `tone: 'accent'`. Accent is the link colour, and a paragraph
 * coloured like a link is a paragraph people click.
 */
export const textVariants = cva('font-text', {
  variants: {
    size: {
      lg: 'text-body-lg',
      md: 'text-body-md',
      sm: 'text-body-sm',
      caption: 'text-caption',
      /** The size of the text around it — a count inside a button or a toggle. */
      inherit: '',
    },
    tone: {
      primary: 'text-fg',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
      /** A limit passed or a value refused — a counter over its maximum. */
      danger: 'text-danger-fg',
      /**
       * The colour of the text around it, so a figure inside a control follows
       * the control's own states — pressed, highlighted, disabled.
       */
      inherit: '',
    },
    /** Unset inherits, which is what a run of body copy wants. */
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    /** Tabular figures, so a column of numbers lines up digit for digit. */
    numeric: { true: 'tabular-nums', false: '' },
    /**
     * One line, cut with an ellipsis. On inline text it needs a box to cut
     * against: it works as a flex or grid item, which is where a truncating
     * title sits.
     */
    truncate: { true: 'truncate', false: '' },
    /**
     * `pretty` avoids a lone last word, `balance` evens out a short block of
     * two or three lines, `anywhere` breaks a long unbroken string — a URL, a
     * hash — instead of letting it widen the page.
     */
    wrap: {
      pretty: 'text-pretty',
      balance: 'text-balance',
      anywhere: 'wrap-anywhere',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    /**
     * A readable line length. `prose` is about 65 characters, for paragraphs;
     * `wide` is the 44rem a lead paragraph or a quotation spans.
     */
    measure: {
      prose: 'max-w-prose',
      wide: 'max-w-176',
    },
  },
  defaultVariants: { size: 'md', tone: 'secondary' },
});
