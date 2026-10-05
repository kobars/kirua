import type { VariantProps } from '@/lib/cva';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { statVariants } from './Stat.variants';
import { statRowVariants } from './StatRow.variants';
import { statLabel, statValue } from './Stat.styles';

export interface StatProps extends ComponentProps<'div'>, VariantProps<typeof statVariants> {
  icon?: ReactNode;
  /** Already formatted for display — "100k". */
  value: string;
  label: string;
}

/**
 * A number and the word that says what it counts.
 *
 * The icon is decorative; the accessible name comes from the visible text, so
 * a screen reader announces "100k Likes" rather than "heart image, 100k". That
 * holds in both variants — the tile puts the value and the label in separate
 * spans, and reading order still gives one phrase.
 *
 * @example <Stat icon={<HeartIcon />} value="100k" label="Likes" />
 *
 * @example
 * // What a dashboard opens with. Use `StatRow variant="tile"` around it.
 * <Stat variant="tile" value="128" label="Visits today" />
 */
export function Stat({ icon, value, label, variant, className, ...props }: StatProps) {
  const key = variant ?? 'inline';
  return (
    <div data-slot="stat" className={cn(statVariants({ variant }), className)} {...props}>
      {icon}
      {key === 'tile' ? (
        <>
          <span data-slot="stat-value" className={statValue[key]}>
            {value}
          </span>
          <span data-slot="stat-label" className={statLabel[key]}>
            {label}
          </span>
        </>
      ) : (
        <span data-slot="stat-value" className={statValue[key]}>
          {value} {label}
        </span>
      )}
    </div>
  );
}

export interface StatRowProps
  extends ComponentProps<'div'>, VariantProps<typeof statRowVariants> {}

/**
 * The layout for a set of stats. `tile` is a grid rather than a wrapping flex
 * row, because a wrapping row leaves the last tile a different width from the
 * rest and a row of tiles that do not line up has stopped being a comparison.
 *
 * @example
 * <StatRow variant="tile">
 *   <Stat variant="tile" value="128" label="Visits today" />
 *   <Stat variant="tile" value="34" label="In consultation" />
 * </StatRow>
 */
export function StatRow({ className, variant, ...props }: StatRowProps) {
  return (
    <div
      data-slot="stat-row"
      className={cn(statRowVariants({ variant }), className)}
      {...props}
    />
  );
}
