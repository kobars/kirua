import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { Corner } from '@/lib/glint';

export type { Corner };

export interface CornerGlintProps extends HTMLAttributes<HTMLSpanElement> {
  corner?: Corner;
  /** Corner radius of the surface this sits inside. 22 = --radius-lg. */
  radius?: number;
  /**
   * Gap between the surface edge and the blade.
   *
   * In Figma the card's corner arc is centred at (872.41, 753) and the glint's
   * at (871.25, 752.61) — the same point. The blade is concentric with the
   * corner and one radius smaller: 22 - 14 = 8.
   */
  inset?: number;
  /** Long tail, as a multiple of the blade's own arc radius. */
  longTail?: number;
  /** Short tail, as a multiple of the blade's own arc radius. */
  shortTail?: number;
  /** Thickest point, as a multiple of the blade's own arc radius. */
  weight?: number;
}

const mirror: Record<Corner, string> = {
  tl: 'none',
  tr: 'scaleX(-1)',
  bl: 'scaleY(-1)',
  br: 'scale(-1, -1)',
};

const edges: Record<Corner, (inset: number) => CSSProperties> = {
  tl: (i) => ({ top: i, left: i }),
  tr: (i) => ({ top: i, right: i }),
  bl: (i) => ({ bottom: i, left: i }),
  br: (i) => ({ bottom: i, right: i }),
};

type Point = { x: number; y: number };

/**
 * The reference design's corner ornament: a flat blade following the inside of a
 * rounded corner, thickest at the turn and tapering to a point where each tail
 * runs out along the straight edge.
 *
 * Flat by design — one solid fill, no gradient. A gradient fade reads as a bevel
 * highlight, and this system is 2D.
 *
 * Drawn once for the top-left corner and mirrored into the other three. Mirrors
 * rather than rotations: the bounding box is not square, so a rotation would
 * leave the blade hanging off the corner.
 *
 * At the reference's own numbers (radius 22, inset 8) this reproduces the Figma
 * asset's 36 x 18 bounding box.
 *
 * @example <CornerGlint corner="tr" radius={22} />
 */
export function CornerGlint({
  corner = 'tl',
  radius = 22,
  inset = 8,
  longTail = 1.57,
  shortTail = 0.29,
  weight = 0.19,
  className,
  style,
  ...props
}: CornerGlintProps) {
  const arc = Math.max(radius - inset, 1);
  const innerArc = arc * (1 - weight);
  const width = arc + arc * longTail;
  const height = arc + arc * shortTail;
  const centre: Point = { x: arc, y: arc };

  const tipTop: Point = { x: width, y: 0 };
  const tipLeft: Point = { x: 0, y: height };

  /** Where a line from `tip` meets the inner arc tangentially; `side` picks the
   *  tangent lying on the corner side. This is what tapers the ends to a point. */
  const tangentFrom = (tip: Point, side: 1 | -1): Point => {
    const dx = centre.x - tip.x;
    const dy = centre.y - tip.y;
    const distance = Math.hypot(dx, dy);
    const along = Math.sqrt(Math.max(distance * distance - innerArc * innerArc, 0));
    const angle = Math.atan2(dy, dx) + side * Math.asin(Math.min(1, innerArc / distance));
    return { x: tip.x + along * Math.cos(angle), y: tip.y + along * Math.sin(angle) };
  };

  const at = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const d = [
    `M ${at(tipLeft)}`,
    `L ${at({ x: 0, y: arc })}`,
    `A ${arc} ${arc} 0 0 1 ${at({ x: arc, y: 0 })}`,
    `L ${at(tipTop)}`,
    `L ${at(tangentFrom(tipTop, 1))}`,
    `A ${innerArc.toFixed(2)} ${innerArc.toFixed(2)} 0 0 0 ${at(tangentFrom(tipLeft, -1))}`,
    'Z',
  ].join(' ');

  return (
    <span
      data-slot="corner-glint"
      aria-hidden="true"
      className={cn('pointer-events-none absolute text-glint', className)}
      style={{ ...edges[corner](inset), transform: mirror[corner], ...style }}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        display="block"
      >
        <path d={d} fill="currentColor" />
      </svg>
    </span>
  );
}
