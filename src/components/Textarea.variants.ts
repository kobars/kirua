import { cva } from '@/lib/cva';

/**
 * `bare` draws no box: the field is the whole surface it sits on, as in a
 * composer card whose own border is the field's. It keeps a focus outline,
 * because with the border gone nothing else would show where typing goes.
 *
 * `grow` sizes the field to its text, from one line up to 15rem, then scrolls.
 * It uses `field-sizing`, so no script measures anything; where a browser does
 * not support it the field keeps its minimum height and scrolls.
 */
export const textareaVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bare: [
        'resize-none rounded-none border-0 bg-transparent px-0 shadow-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      ],
    },
    grow: {
      true: 'field-sizing-content max-h-60 min-h-11 resize-none',
      false: '',
    },
  },
});
