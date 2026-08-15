import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  /** Already formatted for display — "100k". */
  value: string;
  label: string;
}

/**
 * One icon-and-number pair from the reference design's engagement row.
 *
 * The icon is decorative; the accessible name comes from the visible text, so
 * a screen reader announces "100k Likes" rather than "heart image, 100k".
 *
 * @example <Stat icon={<HeartIcon />} value="100k" label="Likes" />
 */
export function Stat({ icon, value, label, className, ...props }: StatProps) {
  return (
    <div
      data-slot="stat"
      className={cn('inline-flex items-center gap-2 text-fg-secondary', className)}
      {...props}
    >
      {icon}
      <span className="font-text text-body-sm font-medium">
        {value} {label}
      </span>
    </div>
  );
}

export function StatRow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stat-row"
      className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', className)}
      {...props}
    />
  );
}
