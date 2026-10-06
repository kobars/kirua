import { cva } from '@/lib/cva';

/**
 * One colour per kind of token. A comment is also italic, so it still reads as
 * a comment where colour is gone: forced colors, a print, a colour-vision
 * deficiency.
 */
export const codeTokenVariants = cva('', {
  variants: {
    kind: {
      keyword: 'text-code-keyword',
      string: 'text-code-string',
      constant: 'text-code-constant',
      function: 'text-code-function',
      parameter: 'text-code-parameter',
      comment: 'text-code-comment italic',
      punctuation: 'text-code-punctuation',
    },
  },
});
