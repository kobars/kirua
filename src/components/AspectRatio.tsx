import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type AspectRatioProps = ComponentProps<typeof AspectRatioPrimitive.Root>;

/**
 * Reserves the box before its content arrives, so a loading image does not
 * shift everything under it.
 *
 * `ratio` is width divided by height: `16 / 9` for video, `1` for a square. The
 * child fills the box — give an `<img>` `size-full object-cover`.
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src={poster} alt="" className="size-full object-cover" />
 * </AspectRatio>
 */
export function AspectRatio({ className, ...props }: AspectRatioProps) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn('overflow-hidden', className)}
      {...props}
    />
  );
}
