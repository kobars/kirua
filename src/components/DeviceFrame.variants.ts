import { cva } from '@/lib/cva';

/**
 * A phone's screen, in CSS pixels, as the page inside the frame sees it.
 *
 * `box-content`, so the size is the page's viewport and the Clay edge is drawn
 * outside it: a 390px phone shows a page whose `innerWidth` is 390, which is
 * what its media queries answer to.
 *
 * The height gives way to a short window, under the shell's header when there
 * is one, so the whole screen stays in view without scrolling the page.
 *
 * The sizes are devices rather than layout choices, so they are fixed values
 * and do not follow the spacing scale.
 */
export const deviceFrameVariants = cva(
  [
    'box-content block max-w-full shrink-0 bg-page',
    'max-h-[calc(100dvh-var(--app-header-height,0px)-4rem)]',
    'rounded-2xl border-(length:--clay-edge) border-line-card shadow-card',
  ],
  {
    variants: {
      device: {
        /* oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- a device's screen, not a layout step */
        sm: 'h-[35.5rem] w-[20rem]' /* 320 × 568, the smallest phone still sold second-hand */,
        /* oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- a device's screen, not a layout step */
        md: 'h-[52.75rem] w-[24.375rem]' /* 390 × 844, the most common phone screen */,
        /* oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes -- a device's screen, not a layout step */
        lg: 'h-[58.25rem] w-[26.875rem]' /* 430 × 932, the largest */,
      },
    },
    defaultVariants: { device: 'md' },
  },
);
