import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { skeletonVariants } from './Skeleton.variants';

export interface SkeletonProps
  extends ComponentProps<'div'>, VariantProps<typeof skeletonVariants> {}

/**
 * A grey block standing in for content that has not arrived.
 *
 * `aria-hidden`, so a feed of eleven placeholders does not announce "loading"
 * eleven times — mark the container `aria-busy` instead. `shape` and `width`
 * draw the shape it replaces, because a skeleton is only useful in that shape.
 *
 * @example
 * <Stack as="output" gap={2} aria-busy="true" aria-label="Loading post">
 *   <Skeleton shape="text" width="md" />
 *   <Skeleton shape="text" width="2/3" />
 * </Stack>
 */
export function Skeleton({ className, shape, width, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'animate-pulse-soft rounded-sm bg-sunken',
        skeletonVariants({ shape, width }),
        className,
      )}
      {...props}
    />
  );
}
