import { cva } from '@/lib/cva';
import { controlWidthScale } from './layout.styles';

/**
 * `size="sm"` is `Button`'s `sm` height, for a search field in a header row
 * beside small buttons. `width` caps the group from `sm` up and leaves it full
 * width on a phone.
 */
export const inputGroupVariants = cva('', {
  variants: {
    size: {
      sm: 'h-9',
      md: '',
    },
    width: controlWidthScale,
  },
});
