import { cva } from '@/lib/cva';

/**
 * One message in a conversation, sitting on the speaker's side.
 *
 * The two speakers differ in three ways, so the difference survives any one of
 * them being taken away: the side (`ms-auto` / `me-auto`, which mirror in a
 * right-to-left page), the fill, and the squared corner on the speaker's side
 * at the bottom. Windows high contrast replaces every fill and drops every
 * shadow but keeps borders and geometry — so the border is present on both,
 * transparent where it is not wanted, and the corner carries the meaning when
 * the colours are gone.
 *
 * `w-fit` and the auto margin let a short message stay short in any parent —
 * a grid row, a list item, a plain block.
 */
export const messageBubbleVariants = cva(
  'grid w-fit max-w-[85%] rounded-lg border font-text wrap-anywhere text-fg',
  {
    variants: {
      from: {
        self: 'ms-auto rounded-ee-xs border-line-accent bg-brand-subtle',
        other: 'me-auto rounded-es-xs border-transparent bg-sunken',
      },
      size: {
        sm: 'gap-2 px-3 py-2 text-body-sm',
        md: 'gap-4 px-4 py-3 text-body-md',
      },
    },
    defaultVariants: { from: 'other', size: 'md' },
  },
);
