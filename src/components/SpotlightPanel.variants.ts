import { cva } from '@/lib/cva';

export const spotlightPanelVariants = cva(['relative isolate', 'rounded-xl', 'ctx-brand'], {
  variants: {
    tone: {
      /** blue-600 — white body text is 4.67:1 here. Safe for copy. */
      default: 'bg-brand',
      /** blue-500, the measured reference colour. White body copy is 3.65:1 and
       *  fails AA — display type only, where AA Large's 3:1 applies. */
      vivid: 'bg-brand-vivid',
      inverse: 'ctx-inverse bg-page',
    },
    padding: {
      md: 'px-5 py-7 md:px-8 md:py-10',
      lg: 'px-6 py-8 md:px-12 md:py-14',
      xl: 'px-6 py-9 md:px-16 md:py-20',
    },
  },
  defaultVariants: { tone: 'default', padding: 'lg' },
});
