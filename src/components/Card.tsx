import type { VariantProps } from '@/lib/cva';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { cardVariants } from './Card.variants';
import { cardBodyVariants } from './CardBody.variants';
import { cardContentVariants } from './CardContent.variants';
import { cardTitleVariants } from './CardTitle.variants';
import { resolveGlints, type Corner } from '@/lib/glint';
import { CARD_EDGE_PX, CARD_RADIUS_PX } from '@/lib/radius';
import { CornerGlint } from './CornerGlint';

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {
  /**
   * Corner ornament. Off by default — it is a highlight, so it only reads on a
   * dark or brand surface and just adds noise on a white one.
   *
   * @example <Card variant="brand" glint={['top-start', 'bottom-end']}>
   */
  glint?: Corner | Corner[] | false;
}

/**
 * `dark` and `brand` do more than change colour — they declare a surface
 * context, so a `Button` or `Chip` inside re-colours itself with no prop and no
 * override class.
 *
 * `gap` spaces the card's direct children, so a title and the block under it
 * need no margin. Block content — a table, a chart, a list — goes in
 * `CardContent`; `CardBody` is a paragraph and may only hold text.
 *
 * @example
 * <Card variant="dark" padding="lg">
 *   <CardTitle>Join our anime class</CardTitle>
 *   <Button variant="primary">Enroll</Button>
 * </Card>
 *
 * @example
 * <Card gap={4}>
 *   <CardTitle as="h2" size="heading-sm">Visits this week</CardTitle>
 *   <CardContent><BarChart … /></CardContent>
 * </Card>
 *
 * @example
 * // A grid of product cards whose prices and buttons line up.
 * <Grid as="ul" sm={2} lg={3}>
 *   <li><Card fill><CardContent grow>…</CardContent><Price amount="$24" /></Card></li>
 * </Grid>
 */
export function Card({
  className,
  variant,
  padding,
  radius,
  gap,
  clip,
  fill,
  glint = false,
  children,
  ...props
}: CardProps) {
  // cva variants widen to `| null`, so normalise before using it as a key.
  const radiusKey = radius ?? 'card';
  // The ornament is placed inside the edge, so it follows the inner corner.
  const glintRadius = CARD_RADIUS_PX[radiusKey] - (variant === 'ghost' ? 0 : CARD_EDGE_PX);
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant, padding, radius: radiusKey, gap, clip, fill }),
        className,
      )}
      {...props}
    >
      {resolveGlints(glint).map((corner) => (
        <CornerGlint key={corner} corner={corner} radius={glintRadius} />
      ))}
      {children}
    </div>
  );
}

export function CardEyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-eyebrow"
      className={cn('font-text text-body-md font-medium text-fg', className)}
      {...props}
    />
  );
}

export interface CardTitleProps
  extends ComponentProps<'h3'>, VariantProps<typeof cardTitleVariants> {
  /**
   * Set to match the page outline. Levels must not skip — an `h1` followed by an
   * `h3` reads as a missing section to anyone navigating by headings. Visual
   * size comes from `size`, never from the level.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * The card's heading. A title that wraps is balanced, so a two-line name in a
 * grid does not leave one word alone on its second line.
 *
 * @example
 * <CardTitle as="h3" size="display-md" numeric>
 *   $12 <Text inline size="md" weight="normal">per month</Text>
 * </CardTitle>
 */
export function CardTitle({
  className,
  as: Comp = 'h3',
  size,
  numeric,
  ...props
}: CardTitleProps) {
  return (
    <Comp
      data-slot="card-title"
      className={cn(
        'font-text text-heading-lg font-semibold text-balance text-fg',
        cardTitleVariants({ size, numeric }),
        className,
      )}
      {...props}
    />
  );
}

export interface CardBodyProps
  extends ComponentProps<'p'>, VariantProps<typeof cardBodyVariants> {}

/** A paragraph of the card's copy. For anything that is not a paragraph, `CardContent`. */
export function CardBody({ className, size, ...props }: CardBodyProps) {
  return (
    <p
      data-slot="card-body"
      className={cn(
        'font-text text-body-md text-fg-secondary',
        cardBodyVariants({ size }),
        className,
      )}
      {...props}
    />
  );
}

export interface CardContentProps
  extends ComponentProps<'div'>, VariantProps<typeof cardContentVariants> {}

/**
 * The card's block content: a table, a chart, a list, a group of paragraphs.
 *
 * `CardBody` is a `<p>`, and a heading, a list or a table inside a paragraph
 * is invalid HTML — a server-rendered page has its paragraph closed early by
 * the parser, and the hydrated tree no longer matches. This is a `div`.
 *
 * @example
 * <CardContent gap={4}>
 *   <Table>…</Table>
 *   <Text size="sm">Updated an hour ago</Text>
 * </CardContent>
 */
export function CardContent({ className, gap, grow, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ gap, grow }), className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('mt-auto flex items-center gap-4 pt-6', className)}
      {...props}
    />
  );
}
