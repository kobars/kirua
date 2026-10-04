import { cva } from '@/lib/cva';

/**
 * `AvatarStack`'s size steps, named rather than repeated, so a stacked and a
 * standalone `sm` avatar are the same circle. The text step falls with the
 * circle to keep initials inside it.
 */
export const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-pill bg-sunken align-middle',
  {
    variants: {
      size: {
        xs: 'size-6 text-caption',
        sm: 'size-8 text-caption',
        md: 'size-10 text-body-sm',
        lg: 'size-14 text-body-md',
        xl: 'size-20 text-heading-sm',
      },
      /**
       * A ring in the page colour, which separates an avatar laid over a cover
       * image or another avatar from what is behind it.
       */
      ring: { true: 'ring-4 ring-page', false: '' },
    },
    defaultVariants: { size: 'md' },
  },
);
