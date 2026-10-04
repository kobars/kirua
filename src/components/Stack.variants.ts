import { cva } from '@/lib/cva';
import { gapScale } from './layout.styles';

/**
 * A column of blocks.
 *
 * It is a one-column grid rather than a flex column, and the column is
 * `minmax(0,1fr)` in the base where nobody can leave it off. A grid item keeps
 * `min-width: auto`, so a plain `grid` sizes its column to its widest child: a
 * table or a four-tab `TabsList` one level down then stretches the page instead
 * of scrolling inside itself. Container and Section carry the same column for
 * the same reason.
 *
 * `content-start` stops a short stack from spreading its rows over a tall box.
 *
 * `align` is the inline axis (`justify-items`), because a grid's block axis is
 * already decided by its rows: `start` is what lets a button in a form keep its
 * own width instead of stretching to the form's.
 */
export const stackVariants = cva('grid grid-cols-[minmax(0,1fr)] content-start', {
  variants: {
    gap: gapScale,
    align: {
      stretch: 'justify-items-stretch',
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
    },
  },
  defaultVariants: { gap: 4, align: 'stretch' },
});
