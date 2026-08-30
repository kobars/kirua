import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface SpinnerProps extends ComponentProps<'output'> {
  /** What the wait is for. */
  label?: string;
}

/**
 * A busy indicator that follows `--icon-size`, so inside a `Button` it is
 * already the size of the icon it replaces and the control keeps its width.
 *
 * The root is an `<output>`, which already is a polite live region.
 *
 * @example <Button disabled><Spinner /> Saving…</Button>
 */
export function Spinner({ className, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <output data-slot="spinner" className={cn('inline-flex shrink-0', className)} {...props}>
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
