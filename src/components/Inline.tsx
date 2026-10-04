import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { inlineVariants } from './Inline.variants';

/** The elements a row can honestly be. */
export type InlineElement =
  | 'div'
  | 'span'
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'header'
  | 'footer'
  | 'nav'
  | 'form'
  | 'output'
  | 'section';

export type InlineProps<T extends InlineElement = 'div'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof inlineVariants> & {
    /** The element to render. A row of tags is a `ul`; a price and its unit are a `p`. */
    as?: T;
  };

/**
 * Things side by side, with one gap between them.
 *
 * Set `wrap` on any row that may meet a narrow screen with more than two
 * things in it: a title and its actions, a group of filters. A row that cannot
 * wrap has a minimum width, and that minimum is what overflows a 320px phone.
 *
 * `justify="between"` replaces the spacer element: two groups, pushed to the
 * two ends, in both reading directions.
 *
 * @example
 * <Inline justify="between" wrap gap={3}>
 *   <Heading as="h2" size="heading-sm">Orders</Heading>
 *   <Button size="sm">Export</Button>
 * </Inline>
 */
export function Inline<T extends InlineElement = 'div'>({
  as,
  gap,
  align,
  justify,
  wrap,
  className,
  ...props
}: InlineProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'div') as 'div';
  return (
    <Comp
      data-slot="inline"
      className={cn(inlineVariants({ gap, align, justify, wrap }), className)}
      {...(props as ComponentProps<'div'>)}
    />
  );
}
