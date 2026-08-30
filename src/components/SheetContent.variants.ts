import { cva } from '@/lib/cva';

/**
 * Three sides. The horizontal two are logical — `inset-s-0` is the start edge.
 *
 * The arrival animation cannot be, because `transform` is physical. The variant
 * contributes a sign, `--sheet-side`, which `styles/kirua.css` multiplies by
 * `--sheet-rtl` so one `@keyframes` covers all four combinations.
 */
export const sheetContentVariants = cva(
  ['fixed z-modal flex flex-col gap-0 bg-raised text-fg shadow-overlay', 'focus:outline-none'],
  {
    variants: {
      side: {
        start: [
          'inset-block-0 inset-s-0 h-full w-[min(20rem,calc(100vw-3rem))] p-6',
          'border-e border-line-subtle [--sheet-side:1]',
          'data-open:animate-slide-in-side data-closed:animate-slide-out-side',
        ],
        end: [
          'inset-block-0 inset-e-0 h-full w-[min(24rem,calc(100vw-3rem))] p-6',
          'border-s border-line-subtle [--sheet-side:-1]',
          'data-open:animate-slide-in-side data-closed:animate-slide-out-side',
        ],
        bottom: [
          'inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-xl p-6',
          'border-t border-line-subtle',
          'data-open:animate-slide-in-bottom data-closed:animate-slide-out-bottom',
        ],
      },
    },
    defaultVariants: { side: 'end' },
  },
);
