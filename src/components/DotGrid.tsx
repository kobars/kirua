import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface DotGridProps extends Omit<ComponentProps<'span'>, 'color'> {
  rows?: number;
  cols?: number;
  /** Diameter, px. */
  dotSize?: number;
  /** Centre-to-centre distance, px. */
  spacing?: number;
}

/**
 * The reference design's decorative dot matrix. Ornamental, so hidden from
 * assistive technology; colour comes from `currentColor`.
 *
 * @example <DotGrid rows={5} cols={5} className="text-white/70" />
 */
export function DotGrid({
  rows = 5,
  cols = 5,
  dotSize = 4,
  spacing = 10,
  className,
  ...props
}: DotGridProps) {
  const width = (cols - 1) * spacing + dotSize;
  const height = (rows - 1) * spacing + dotSize;
  const r = dotSize / 2;

  return (
    <span
      data-slot="dot-grid"
      aria-hidden="true"
      className={cn('pointer-events-none inline-block select-none', className)}
      {...props}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="currentColor">
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <circle key={`${row}-${col}`} cx={col * spacing + r} cy={row * spacing + r} r={r} />
          )),
        )}
      </svg>
    </span>
  );
}
