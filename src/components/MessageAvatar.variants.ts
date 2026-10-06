import { cva } from '@/lib/cva';

/**
 * Where the avatar sits against its turn. `top` lines it up with the header —
 * the sender's name — which is where the eye looks for who is speaking.
 * `bottom` lines it up with the last line of the turn, footer included, which
 * is the convention of a phone messenger.
 */
export const messageAvatarVariants = cva('flex shrink-0', {
  variants: {
    align: {
      top: 'self-start',
      bottom: 'self-end',
    },
  },
  defaultVariants: { align: 'top' },
});
