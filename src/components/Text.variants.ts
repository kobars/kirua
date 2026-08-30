import { cva } from '@/lib/cva';

/**
 * Body copy: how big, and how loud.
 *
 * Two axes rather than one, because they are genuinely independent — a caption
 * can be the primary voice of its block, and a body paragraph is usually the
 * secondary one. Collapsing them would have produced the same drift the
 * headings had, with `text-body-sm text-fg` and `text-body-sm text-fg-secondary`
 * both meaning "small print".
 *
 * `secondary` is the default because that is what body copy is next to a
 * heading. `Card`'s own `CardBody` had already reached the same answer.
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
    },
    tone: {
      primary: 'text-fg',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
    },
  },
  defaultVariants: { size: 'md', tone: 'secondary' },
});
