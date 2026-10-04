import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { gridVariants } from './Grid.variants';

/** The elements a grid of equal cells can honestly be. */
export type GridElement = 'div' | 'ul' | 'ol' | 'section' | 'dl';

export type GridProps<T extends GridElement = 'div'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof gridVariants> & {
    /** A grid of product cards is a list of products: render it as a `ul`. */
    as?: T;
  };

/**
 * Equal columns that change count at a breakpoint.
 *
 * `columns` is the count on the smallest screen, and `sm`, `md` and `lg` each
 * take over from their own width upwards — the same mobile-first reading as
 * the utilities, so `columns={1} sm={2} lg={3}` is one column on a phone, two
 * from 640px and three from 1024px.
 *
 * For two regions of different widths — content and a side column — use
 * `Split`.
 *
 * @example
 * <Grid as="ul" columns={1} sm={2} lg={3} gap={4}>
 *   {products.map((product) => <li key={product.id}><ProductCard … /></li>)}
 * </Grid>
 */
export function Grid<T extends GridElement = 'div'>({
  as,
  columns,
  sm,
  md,
  lg,
  gap,
  align,
  className,
  ...props
}: GridProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'div') as 'div';
  return (
    <Comp
      data-slot="grid"
      className={cn(gridVariants({ columns, sm, md, lg, gap, align }), className)}
      {...(props as ComponentProps<'div'>)}
    />
  );
}
