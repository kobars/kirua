import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type SkeletonProps = ComponentProps<'div'>;

/**
 * A grey block standing in for content that has not arrived.
 *
 * `aria-hidden`, so a feed of eleven placeholders does not announce "loading"
 * eleven times — mark the container `aria-busy` instead. Size is the
 * consumer's, because a skeleton is only useful in the shape it replaces.
 *
 * @example
 * <output className="block" aria-busy="true" aria-label="Loading post">
 *   <Skeleton className="h-4 w-40" />
 *   <Skeleton className="mt-2 h-4 w-24" />
 * </output>
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('animate-pulse-soft rounded-sm bg-sunken', className)}
      {...props}
    />
  );
}
