import type { CSSProperties, SVGProps } from 'react';

/** The `--icon-*` tokens, by name. Values live in `tokens.primitives.css`. */
const ICON_SIZES = {
  xs: 'var(--icon-xs)',
  sm: 'var(--icon-sm)',
  md: 'var(--icon-md)',
  lg: 'var(--icon-lg)',
  xl: 'var(--icon-xl)',
  '2xl': 'var(--icon-2xl)',
} as const;

export type IconSize = keyof typeof ICON_SIZES;

/** Inline icon set matching the reference's outline style: 1.75px strokes,
 *  round caps and joins, 24x24 box. Colour follows `currentColor`. */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  /**
   * A name from the icon scale. Leave it unset inside a component that sets
   * `--icon-size` — `Button`, `IconButton`, `Badge`, `Chip`, `Stat` and the
   * menu items all do — so the icon follows the control it sits in.
   *
   * A raw number is accepted as an escape hatch for a one-off ornament.
   */
  size?: IconSize | number;
};

function Icon({ size, children, style, ...props }: IconProps) {
  const resolved =
    size === undefined
      ? 'var(--icon-size, var(--icon-md))'
      : typeof size === 'number'
        ? `${size}px`
        : ICON_SIZES[size];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      // Width and height rather than the SVG attributes, so a token can be a
      // `var()` and a consumer's `className` can still win.
      style={{ width: resolved, height: resolved, ...style } as CSSProperties}
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const GridIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={0} fill="currentColor">
    {[5, 12, 19].map((y) =>
      [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />),
    )}
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.5-4.7-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20Z" />
  </Icon>
);

export const BookmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4.5h12v15l-6-4.2-6 4.2v-15Z" />
  </Icon>
);

export const SendIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.5 3.5 3.5 10.2l7 2.3 2.3 7 7.7-16Z" />
    <path d="m10.5 12.5 4-4" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const SparkleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 2L12 18.5 10.1 12.9 4.5 10.9 10.1 9 12 3.5Z" />
  </Icon>
);

/* Icons below were added for the application screens. Same 24x24 box, same
 * 1.75px stroke, same `currentColor`. */

export const ChevronUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 15 6-6 6 6" />
  </Icon>
);

/**
 * Points at the end of the line. The component using it owns the mirror —
 * `rtl:-scale-x-100`, because `transform` has no logical form.
 */
export const ChevronEndIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ChevronStartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const MoreIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={0} fill="currentColor">
    <circle cx="5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="19" cy="12" r="1.7" />
  </Icon>
);

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M4.5 20c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5" />
  </Icon>
);

export const CartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 4h2.2l2 11h10.4l2-8H6.4" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </Icon>
);

export const StarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.8Z" />
  </Icon>
);

export const CommentIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.5 12c0 4.1-3.8 7.4-8.5 7.4a10 10 0 0 1-2.8-.4L4 20.5l1.6-4.1A7 7 0 0 1 3.5 12c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4Z" />
  </Icon>
);

export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4" />
  </Icon>
);

export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" />
  </Icon>
);

export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h16l-6.2 7.3V19l-3.6-2v-3.7L4 6Z" />
  </Icon>
);

export const PrintIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 9V4h10v5" />
    <rect x="4" y="9" width="16" height="7" rx="2" />
    <path d="M7 14h10v6H7z" />
  </Icon>
);

export const StethoscopeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3.5v5a4 4 0 0 0 8 0v-5" />
    <path d="M10 12.5v2a5 5 0 0 0 10 0v-1" />
    <circle cx="20" cy="10.5" r="2" />
  </Icon>
);

export const PillIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)" />
    <path d="M9.2 9.2l5.6 5.6" />
  </Icon>
);
