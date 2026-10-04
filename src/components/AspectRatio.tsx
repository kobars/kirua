import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { aspectRatioVariants } from './AspectRatio.variants';

export interface AspectRatioProps
  extends
    ComponentProps<typeof AspectRatioPrimitive.Root>,
    VariantProps<typeof aspectRatioVariants> {}

/**
 * Reserves the box before its content arrives, so a loading image does not
 * shift everything under it.
 *
 * `ratio` is width divided by height: `16 / 9` for video, `1` for a square. The
 * child fills the box — give an `<img>` `size-full object-cover`, or put a
 * `Placeholder` inside while there is no image.
 *
 * @example
 * <AspectRatio ratio={1} radius="md">
 *   <Placeholder>R</Placeholder>
 * </AspectRatio>
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src={poster} alt="" className="size-full object-cover" />
 * </AspectRatio>
 */
export function AspectRatio({ className, radius, ...props }: AspectRatioProps) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn('overflow-hidden', aspectRatioVariants({ radius }), className)}
      {...props}
    />
  );
}
