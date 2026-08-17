import type { SVGProps } from 'react';

/** Inline icon set matching the reference's outline style: 1.75px strokes,
 *  round caps and joins, 24x24 box. Colour follows `currentColor`. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
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
