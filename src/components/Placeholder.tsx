import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { placeholderVariants } from './Placeholder.variants';

export interface PlaceholderProps
  extends ComponentProps<'div'>, VariantProps<typeof placeholderVariants> {}

/**
 * The box where a picture would be.
 *
 * Decorative by default — `aria-hidden` — because the thing it stands in for is
 * named elsewhere: the product's title, the person's name. If the placeholder
 * is the only carrier of a meaning, pass `aria-hidden={false}`, `role="img"`
 * and an `aria-label`.
 *
 * @example
 * <AspectRatio ratio={1} radius="md">
 *   <Placeholder>{product.name.charAt(0)}</Placeholder>
 * </AspectRatio>
 *
 * @example
 * <ItemMedia><Placeholder size="md"><BoxIcon /></Placeholder></ItemMedia>
 */
export function Placeholder({ tone, size, shape, className, ...props }: PlaceholderProps) {
  return (
    <div
      data-slot="placeholder"
      aria-hidden="true"
      className={cn(placeholderVariants({ tone, size, shape }), className)}
      {...props}
    />
  );
}
