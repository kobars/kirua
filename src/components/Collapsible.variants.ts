import { cva } from '@/lib/cva';

/**
 * `gap` is the space between the trigger row and the panel, owned by the
 * disclosure rather than written as a top padding on every panel.
 *
 * `rail` draws a rule down the leading edge and no fill: an aside — the
 * reasoning behind an answer — that must not look like the code block or the
 * question beside it. A border survives forced colours, where a fill would
 * not.
 */
export const collapsibleVariants = cva('', {
  variants: {
    variant: {
      plain: '',
      rail: 'border-s-2 border-line-subtle ps-3',
    },
    gap: {
      1: 'grid gap-1',
      2: 'grid gap-2',
      3: 'grid gap-3',
      4: 'grid gap-4',
    },
  },
});
