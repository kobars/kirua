import { cva } from '@/lib/cva';
import { innerGapScale } from './layout.styles';

export const cardVariants = cva(
  // A small gap, so a title, body, badge and button do not touch. No larger:
  // a card has no header to group a title with its description, so a large
  // gap would split them.
  ['relative flex flex-col gap-3', 'transition-colors duration-base ease-out'],
  {
    variants: {
      /**
       * Every filled card carries the Clay edge. Only the light card casts the
       * offset shadow: behind a black or brand card it reads as a misprint, so
       * those keep the edge in their own context's colour and nothing else.
       */
      variant: {
        light: 'border-(length:--clay-edge) border-line-card bg-raised text-fg shadow-card',
        dark: 'ctx-inverse border-(length:--clay-edge) border-line-inverse bg-page text-fg',
        brand: 'ctx-brand border-(length:--clay-edge) border-line-subtle bg-brand text-fg',
        ghost: 'bg-transparent',
      },
      /**
       * **`lg` at `md` and above is the measured value.** The reference's black
       * card is the only card in the file with auto layout, and it declares
       * `padding: 31`. `p-8` is 32px — one pixel out, and on the 4px grid the
       * spacing scale is built from, where 31 is not.
       *
       * That one pixel is why these stay on the scale instead of becoming
       * `p-[1.9375rem]`. The `[FIGMA]` arbitrary values in this repository
       * are all cases where the measurement is *structural* — a 54px call to
       * action, a 70px nav pill. A card's inner padding is not one of those, and
       * an arbitrary value here would cost the scale and buy a pixel.
       *
       * **The smaller steps below `md` were chosen, not measured.** The reference
       * is one desktop screen and contains no narrow layout at all, so there is
       * nothing to be faithful to: 16 / 20 / 24 is the scale continuing downward.
       * `src/components/fidelity.test.tsx` holds both halves of that statement.
       */
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-5 md:p-6',
        lg: 'p-6 md:p-8' /* 32px at md+, against a measured 31 [FIGMA] */,
        /** A full-width band — a quotation, a call to action — not a card in a grid. */
        xl: 'p-8 md:p-12',
      },
      /** The rhythm between the card's direct children, replacing the base gap. */
      gap: innerGapScale,
      /**
       * Clip children to the rounded corner: a `Pane`, a full-bleed image, a
       * resizable group running edge to edge.
       */
      clip: { true: 'overflow-hidden', false: '' },
      /**
       * As tall as the cell it sits in, so a row of cards in a grid ends on
       * one line and a `CardFooter` or the content after a growing
       * `CardContent` lines up across the row.
       */
      fill: { true: 'h-full', false: '' },
      /**
       * **`card` is 24px, and the reference file disagrees with itself.** Its
       * white card (`35:19`) is a rectangle at radius 22 and its black card
       * (`35:188`) a frame at radius 24. The Clay card takes the frame's 24 as
       * its own step, `--radius-card`, so the `--radius` knob and every step
       * derived from it stay where the other two nodes put them. `lg` keeps the
       * 22 for a screen rebuilt to the reference.
       */
      radius: {
        md: 'rounded-md',
        lg: 'rounded-lg' /* 22px [FIGMA] — the reference's white card corner */,
        card: 'rounded-card' /* 24px [FIGMA] — the reference's black card corner */,
        xl: 'rounded-xl',
      },
    },
    defaultVariants: { variant: 'light', padding: 'md', radius: 'card' },
  },
);
