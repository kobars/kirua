import { cva } from '@/lib/cva';
import { gapScale } from './layout.styles';

/**
 * A row of things.
 *
 * `align` defaults to `center` because a row of a button, a badge and a line of
 * text is what this replaces in most places, and those only line up centred.
 * `baseline` is there for a number beside its unit, where centring puts the two
 * on different lines of type.
 *
 * There is no child-sizing prop. A child that has to give up width — a title
 * that truncates — is an `ItemContent` or a `Text truncate`, which already
 * shrink, rather than a flag the row hands out.
 */
export const inlineVariants = cva('flex', {
  variants: {
    gap: gapScale,
    align: {
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    wrap: {
      true: 'flex-wrap',
      false: '',
    },
  },
  defaultVariants: { gap: 2, align: 'center', justify: 'start', wrap: false },
});
