import { cva } from '@/lib/cva';

/**
 * `wrap` lets a group of many toggles — a row of time slots — run onto a
 * second line instead of overflowing a narrow screen. Arrow-key order is the
 * DOM order either way.
 */
export const toggleGroupVariants = cva('', {
  variants: {
    wrap: { true: 'flex-wrap', false: '' },
  },
});
