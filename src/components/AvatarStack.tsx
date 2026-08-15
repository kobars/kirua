import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface AvatarItem {
  name: string;
  src?: string;
}

export interface AvatarStackProps extends HTMLAttributes<HTMLSpanElement> {
  items: AvatarItem[];
  size?: 'sm' | 'md' | 'lg';
  /** Show at most this many, then a "+N" counter. */
  max?: number;
}

const sizes = {
  sm: 'size-5 text-[0.5rem]',
  md: 'size-6 text-[0.625rem]',
  lg: 'size-8 text-caption',
} as const;

/** Deterministic swatch per name, so the same person keeps the same colour. */
const swatches = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-blue-300',
];

function swatchFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return swatches[hash % swatches.length];
}

/**
 * Overlapping circular avatars, used as the leading slot of a `Chip` to carry
 * social proof.
 *
 * The whole stack is announced as one label rather than as N separate images,
 * because individually announcing six cropped faces tells a screen reader user
 * nothing useful.
 *
 * @example <AvatarStack items={[{ name: 'Rin' }, { name: 'Kai' }]} max={3} />
 */
export function AvatarStack({
  items,
  size = 'md',
  max = 3,
  className,
  ...props
}: AvatarStackProps) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;

  return (
    <span
      data-slot="avatar-stack"
      className={cn('inline-flex items-center', className)}
      role="img"
      aria-label={`${items.length} ${items.length === 1 ? 'person' : 'people'}`}
      {...props}
    >
      {shown.map((item) => (
        <span
          key={item.name}
          className={cn(
            'relative -mr-2 inline-flex items-center justify-center overflow-hidden',
            'rounded-pill ring-2 ring-page font-semibold text-white last:mr-0',
            sizes[size],
            !item.src && swatchFor(item.name),
          )}
        >
          {item.src ? (
            <img src={item.src} alt="" className="size-full object-cover" />
          ) : (
            item.name.charAt(0).toUpperCase()
          )}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'relative inline-flex items-center justify-center',
            // Inverted against whatever surface context this sits in, so the
            // counter stays legible on a black chip and on a white one.
            'rounded-pill bg-fg text-page ring-2 ring-page font-semibold',
            sizes[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
