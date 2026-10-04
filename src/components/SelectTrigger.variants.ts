import { cva } from '@/lib/cva';
import { controlWidthScale } from './layout.styles';

/** The trigger's width from `sm` up — the same steps as `InputGroup`'s, so a filter row lines up. */
export const selectTriggerVariants = cva('', {
  variants: {
    width: controlWidthScale,
  },
});
