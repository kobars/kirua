import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { chipVariants } from './Chip.variants';

export interface ChipProps extends ComponentProps<'span'>, VariantProps<typeof chipVariants> {
  /** Leading slot — an avatar stack, a dot, or a small icon. */
  leading?: ReactNode;
  children: ReactNode;
}

/**
 * A compact pill label. In the reference these float over the artwork carrying
 * social proof and attribution. The `dark` variant sets `ctx-inverse`, so
 * anything nested inside flips to its on-black colours automatically. The
 * `brand` variant keeps a contextual border so it still has an edge when its
 * fill matches a brand surface.
 *
 * @example <Chip leading={<AvatarStack items={people} />}>+1M Likes</Chip>
 */
export function Chip({ className, variant, size, leading, children, ...props }: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(chipVariants({ variant, size }), className)}
      {...props}
    >
      {leading}
      {children}
    </span>
  );
}
