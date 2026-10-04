import { cva } from '@/lib/cva';
import { gapScale } from './layout.styles';

/**
 * Two regions side by side from a breakpoint up, stacked below it.
 *
 * Three axes meet here — the shape, the breakpoint and the side column's width
 * — and writing every combination out would be sixty literal templates. So
 * the axes talk through two custom properties instead: `layout` writes the
 * template into `--split-columns`, `asideWidth` writes a length into
 * `--split-aside`, and `from` decides at which width the template replaces the
 * single stacked column. Each value is still one literal class.
 *
 * Every flexible track is `minmax(0, …)`, so a table in either region scrolls
 * inside it. `auto` (in `fit-start` and `fit-end`) is the one track sized by
 * its content, which is the point of it: a quantity stepper keeps its width
 * and the button beside it takes the rest.
 *
 * `base` puts the two side by side at every width.
 */
export const splitVariants = cva('grid grid-cols-[minmax(0,1fr)] content-start', {
  variants: {
    layout: {
      halves: '[--split-columns:minmax(0,1fr)_minmax(0,1fr)]',
      'wide-narrow': '[--split-columns:minmax(0,3fr)_minmax(0,2fr)]',
      'fit-start': '[--split-columns:auto_minmax(0,1fr)]',
      'fit-end': '[--split-columns:minmax(0,1fr)_auto]',
      'aside-start': '[--split-columns:var(--split-aside)_minmax(0,1fr)]',
      'aside-end': '[--split-columns:minmax(0,1fr)_var(--split-aside)]',
    },
    asideWidth: {
      sm: '[--split-aside:12rem]',
      md: '[--split-aside:16rem]',
      lg: '[--split-aside:20rem]',
    },
    from: {
      base: 'grid-cols-(--split-columns)',
      sm: 'sm:grid-cols-(--split-columns)',
      md: 'md:grid-cols-(--split-columns)',
      lg: 'lg:grid-cols-(--split-columns)',
    },
    gap: gapScale,
    align: {
      stretch: 'items-stretch',
      start: 'items-start',
      center: 'items-center',
    },
  },
  defaultVariants: {
    layout: 'halves',
    asideWidth: 'md',
    from: 'md',
    gap: 6,
    align: 'stretch',
  },
});
