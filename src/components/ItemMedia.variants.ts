import { cva } from '@/lib/cva';

/**
 * What leads the row. `icon` centres an avatar, an icon or a thumbnail.
 * `figure` is a short value read at a glance — a time, a queue number — set
 * small and tabular, so a column of them lines up digit for digit.
 */
export const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center text-fg-muted',
  {
    variants: {
      variant: {
        icon: '',
        figure: 'font-text text-caption tabular-nums',
      },
    },
    defaultVariants: { variant: 'icon' },
  },
);
