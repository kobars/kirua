import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface AvatarItem {
  name: string;
  src?: string;
}

export interface AvatarStackProps extends ComponentProps<'span'> {
  items: AvatarItem[];
  size?: 'sm' | 'md' | 'lg';
  /** Show at most this many, then a "+N" counter. */
  max?: number;
  /**
   * Builds the accessible name of the whole stack. Takes the total number of
   * people, not the number shown, because that is what is being announced.
   * Defaults to English — replace it to translate, including the plural rule,
   * which differs by language.
   */
  label?: (count: number) => string;
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

const defaultLabel = (count: number) => `${count} ${count === 1 ? 'person' : 'people'}`;

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
 * nothing useful. That label is the only text this component produces, so it is
 * a prop and not a constant.
 *
 * @example <AvatarStack items={[{ name: 'Rin' }, { name: 'Kai' }]} max={3} />
 * @example <AvatarStack items={people} label={(n) => `${n} personnes`} />
 */
export function AvatarStack({
  items,
  size = 'md',
  max = 3,
  label = defaultLabel,
  className,
  ...props
}: AvatarStackProps) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;

  return (
    <span
      data-slot="avatar-stack"
      className={cn('inline-flex items-center', className)}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a stack of DOM children has no single src, so <img> cannot replace it
      role="img"
      aria-label={label(items.length)}
      {...props}
    >
      {shown.map((item) => (
        <span
          key={item.name}
          className={cn(
            'relative -mr-2 inline-flex items-center justify-center overflow-hidden',
            'rounded-pill font-semibold text-white ring-2 ring-page last:mr-0',
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
            'rounded-pill bg-fg font-semibold text-page ring-2 ring-page',
            sizes[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
