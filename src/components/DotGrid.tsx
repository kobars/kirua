import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { Corner } from '@/lib/glint';

/** 32px in from the corner, over the panel's content layer. */
const placements = {
  'top-start': 'absolute top-8 inset-s-8 z-raised',
  'top-end': 'absolute top-8 inset-e-8 z-raised',
  'bottom-start': 'absolute bottom-8 inset-s-8 z-raised',
  'bottom-end': 'absolute bottom-8 inset-e-8 z-raised',
} as const satisfies Record<Corner, string>;

/** `brand` is the vivid blue the reference draws its dots in beside the navigation. */
const tones = { muted: 'text-fg-muted', brand: 'text-brand-vivid', current: '' } as const;

export interface DotGridProps extends Omit<ComponentProps<'span'>, 'color'> {
  rows?: number;
  cols?: number;
  /** Diameter, px. */
  dotSize?: number;
  /** Centre-to-centre distance, px. */
  spacing?: number;
  /**
   * Pin the grid into a corner of the nearest positioned ancestor — a
   * `SpotlightPanel` or a `Card`, both of which are positioned.
   */
  placement?: Corner;
  /** `muted` on a brand or inverse surface, `brand` on the page; unset follows the text colour. */
  tone?: keyof typeof tones;
}

/**
 * The reference design's decorative dot matrix. Ornamental, so hidden from
 * assistive technology; colour comes from `currentColor`.
 *
 * @example <DotGrid rows={5} cols={5} />
 * @example <Visible from="md"><DotGrid rows={4} cols={4} placement="bottom-start" tone="muted" /></Visible>
 */
export function DotGrid({
  rows = 5,
  cols = 5,
  dotSize = 4,
  spacing = 10,
  placement,
  tone = 'current',
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
      className={cn(
        'pointer-events-none inline-block select-none',
        placement && placements[placement],
        tones[tone],
        className,
      )}
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
