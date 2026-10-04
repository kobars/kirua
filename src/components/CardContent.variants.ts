import { cva } from '@/lib/cva';
import { innerGapScale } from './layout.styles';

/**
 * A card's block content — a table, a chart, a list, a group of paragraphs —
 * as a one-column grid that lets its children shrink.
 *
 * `grow` takes the card's spare height, which pushes whatever follows to the
 * bottom: the price row and the button in a grid of cards of uneven text.
 */
export const cardContentVariants = cva('grid grid-cols-[minmax(0,1fr)] content-start', {
  variants: {
    gap: innerGapScale,
    grow: { true: 'flex-1', false: '' },
  },
  defaultVariants: { gap: 3, grow: false },
});
