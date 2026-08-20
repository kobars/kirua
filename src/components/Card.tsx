import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { resolveGlints, type Corner } from '@/lib/glint';
import { CornerGlint } from './CornerGlint';

const card = cva(['relative flex flex-col', 'transition-colors duration-200 ease-out'], {
  variants: {
    variant: {
      light: 'border border-line-subtle bg-raised text-fg',
      dark: 'ctx-inverse bg-page text-fg',
      brand: 'ctx-brand bg-brand text-fg',
      ghost: 'bg-transparent',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-5 md:p-6',
      lg: 'p-6 md:p-8',
    },
    radius: {
      md: 'rounded-md',
      lg: 'rounded-lg' /* 22px — the reference design's card corner */,
      xl: 'rounded-xl',
    },
  },
  defaultVariants: { variant: 'light', padding: 'md', radius: 'xl' },
});

/** Feeds CornerGlint, whose arc has to match the corner it sits in. */
const radiusPx = { md: 16, lg: 22, xl: 32 } as const;

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof card> {
  /**
   * Corner ornament. Off by default — it is a highlight, so it only reads on a
   * dark or brand surface and just adds noise on a white one.
   *
   * @example <Card variant="brand" glint={['tl', 'br']}>
   */
  glint?: Corner | Corner[] | false;
}

/**
 * `dark` and `brand` do more than change colour — they declare a surface
 * context, so a `Button` or `Chip` inside re-colours itself with no prop and no
 * override class.
 *
 * @example
 * <Card variant="dark" padding="lg">
 *   <CardTitle>Join our anime class</CardTitle>
 *   <Button variant="primary">Enroll</Button>
 * </Card>
 */
export function Card({
  className,
  variant,
  padding,
  radius,
  glint = false,
  children,
  ...props
}: CardProps) {
  // cva variants widen to `| null`, so normalise before using it as a key.
  const radiusKey = radius ?? 'xl';
  return (
    <div
      data-slot="card"
      className={cn(card({ variant, padding, radius: radiusKey }), className)}
      {...props}
    >
      {resolveGlints(glint).map((corner) => (
        <CornerGlint key={corner} corner={corner} radius={radiusPx[radiusKey]} />
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

export interface CardTitleProps extends ComponentProps<'h3'> {
  /**
   * Set to match the page outline. Levels must not skip — an `h1` followed by an
   * `h3` reads as a missing section to anyone navigating by headings. Visual
   * size comes from `className`, never from the level.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ className, as: Comp = 'h3', ...props }: CardTitleProps) {
  return (
    <Comp
      data-slot="card-title"
      className={cn('font-text text-heading-lg font-semibold text-fg', className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-body"
      className={cn('font-text text-body-md text-fg-secondary', className)}
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
