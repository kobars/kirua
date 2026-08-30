import { cva } from '@/lib/cva';

/**
 * Buttons joined into one control. The inner corners are squared and the
 * shared edge is pulled together, so the group reads as a single object.
 *
 * The corner rules are logical on the inline axis (`rounded-s`, `rounded-e`)
 * because that axis mirrors in a right-to-left page. The block axis does not
 * mirror, so `rounded-t` and `rounded-b` are correct there.
 */
export const buttonGroupVariants = cva('isolate inline-flex', {
  variants: {
    orientation: {
      horizontal: [
        'flex-row',
        '[&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none',
        '[&>*:not(:last-child)]:rounded-e-none',
      ],
      vertical: [
        'flex-col',
        '[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none',
        '[&>*:not(:last-child)]:rounded-b-none',
      ],
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});
