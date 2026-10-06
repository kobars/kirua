import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { containerVariants } from './Container.variants';

export interface ContainerProps
  extends ComponentProps<'div'>, VariantProps<typeof containerVariants> {}

/**
 * One page's shell: centred, width-limited, padded, and safe to put a table in.
 *
 * Its one grid column may shrink below its widest child, so a wide table or
 * tab list scrolls inside its own wrapper instead of stretching the page. That
 * rule is easy to forget at a page root, so it is built in.
 *
 * @example
 * <Container width="3xl" pad="md">
 *   <Heading as="h1" size="heading-lg">Publishing your first gallery</Heading>
 *   <Section>…</Section>
 * </Container>
 */
export function Container({ className, width, gap, pad, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ width, gap, pad }), className)}
      {...props}
    />
  );
}
