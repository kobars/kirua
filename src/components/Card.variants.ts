import { cva } from '@/lib/cva';

export const cardVariants = cva(
  ['relative flex flex-col', 'transition-colors duration-base ease-out'],
  {
    variants: {
      variant: {
        light: 'border border-line-subtle bg-raised text-fg',
        dark: 'ctx-inverse bg-page text-fg',
        brand: 'ctx-brand bg-brand text-fg',
        ghost: 'bg-transparent',
      },
      /**
       * **`lg` at `md` and above is the measured value.** The reference's black
       * card is the only card in the file with auto layout, and it declares
       * `padding: 31`. `p-8` is 32px — one pixel out, and on the 4px grid the
       * spacing scale is built from, where 31 is not.
       *
       * That one pixel is why these stay on the scale instead of becoming
       * `p-[1.9375rem]`. The four `[FIGMA]` arbitrary values in this repository
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
      },
      /**
       * **22, not 24, and the reference file disagrees with itself.** Its white
       * card (`35:19`) is a rectangle at radius 22 and its black card (`35:188`)
       * a frame at radius 24. The nav bar is also 22, so two nodes say 22 and one
       * says 24 — and the whole `--radius` scale is derived from a single knob, so
       * adopting 24 would move every step in the system to honour one node.
       *
       * See the note beside `--radius` in `tokens.primitives.css`.
       */
      radius: {
        md: 'rounded-md',
        lg: 'rounded-lg' /* 22px [FIGMA] — the reference's card corner */,
        xl: 'rounded-xl',
      },
    },
    defaultVariants: { variant: 'light', padding: 'md', radius: 'xl' },
  },
);
