import { cva } from '@/lib/cva';

/**
 * The shapes content arrives in.
 *
 * `text` and `caption` are a line of body copy and a line of small print;
 * `circle` is `Avatar`'s `md` circle; `media` is an image or a chart. Widths
 * are fractions for lines that should end raggedly, as a paragraph does, and
 * fixed steps for a name or a date, which have a length of their own.
 *
 * Both axes are unset by default, so a skeleton given neither sizes itself
 * from `className`.
 */
export const skeletonVariants = cva('', {
  variants: {
    shape: {
      text: 'h-4',
      caption: 'h-3',
      circle: 'size-10 rounded-pill',
      media: 'h-44 rounded-md',
    },
    width: {
      full: 'w-full',
      '11/12': 'w-11/12',
      '4/5': 'w-4/5',
      '2/3': 'w-2/3',
      '1/2': 'w-1/2',
      xs: 'w-20',
      sm: 'w-32',
      md: 'w-40',
    },
  },
});
