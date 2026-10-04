/**
 * The spacing steps a layout prop may take, shared by every component that
 * spaces its children.
 *
 * The keys are the spacing scale's own step numbers, so `gap={4}` is the same
 * 16px a `gap-4` utility is, and a reader who knows the scale knows the prop.
 * One named scale (`sm | md | lg`) is the alternative, and it drifts: each
 * component ends up giving `sm` a size of its own.
 *
 * Every value is a literal class string, because Tailwind finds classes by
 * reading source text and a computed `gap-${n}` would generate nothing.
 *
 * Not a `*.variants.ts` file: `variants.test.tsx` globs that suffix and pairs
 * each module with a `data-slot` of the same name.
 */
export const gapScale = {
  0: 'gap-0',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
} as const;

export type Gap = keyof typeof gapScale;

/** The steps a component's inner rhythm uses. A card or a panel never needs 0 or 48px. */
export const innerGapScale = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
} as const;

/**
 * How wide a control may grow from `sm` up. Below `sm` every one of them is
 * full width, because a fixed 18rem field beside a title overflows a 320px
 * phone.
 */
export const controlWidthScale = {
  xs: 'w-full sm:w-48',
  sm: 'w-full sm:w-64',
  md: 'w-full sm:w-72',
  lg: 'w-full sm:w-80',
} as const;

/**
 * The page widths, named by Tailwind's `max-w-*` steps as `Container`'s are, so
 * a header and the page under it can be given the same word.
 */
export const shellWidthScale = {
  md: 'max-w-md',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-none',
} as const;

export type ShellWidth = keyof typeof shellWidthScale;
