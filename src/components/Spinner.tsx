import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { IconSize } from './icons';

/** Literal strings, because Tailwind reads source text: a computed name generates nothing. */
const SIZES = {
  xs: '[--icon-size:var(--icon-xs)]',
  sm: '[--icon-size:var(--icon-sm)]',
  md: '[--icon-size:var(--icon-md)]',
  lg: '[--icon-size:var(--icon-lg)]',
  xl: '[--icon-size:var(--icon-xl)]',
  '2xl': '[--icon-size:var(--icon-2xl)]',
} as const satisfies Record<IconSize, string>;

export interface SpinnerProps extends ComponentProps<'output'> {
  /** What the wait is for. */
  label?: string;
  /**
   * A step of the icon scale. Unset follows the `--icon-size` of the control
   * it sits in, which is what a spinner inside a button wants.
   */
  size?: IconSize;
}

/**
 * A busy indicator that follows `--icon-size`, so inside a `Button` it is
 * already the size of the icon it replaces and the control keeps its width.
 *
 * The root is an `<output>`, which already is a polite live region.
 *
 * Inside a button, prefer `Button`'s `loading`, which renders this in place of
 * the leading icon and keeps the button focusable, where `disabled` drops the
 * focus to the page.
 *
 * @example <Button loading loadingLabel="Saving">Save</Button>
 * @example <Spinner label="Loading results" size="sm" />
 */
export function Spinner({ className, label = 'Loading', size, ...props }: SpinnerProps) {
  return (
    <output
      data-slot="spinner"
      className={cn('inline-flex shrink-0', size && SIZES[size], className)}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="size-(--icon-size,var(--icon-md)) animate-spin-steady"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </output>
  );
}
