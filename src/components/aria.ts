/**
 * A panel whose role needs an accessible name — `role="dialog"` for a popover,
 * `role="listbox"` for a select. Use `aria-label` when there is no visible
 * heading, `aria-labelledby` when there is.
 *
 * A union rather than two optional props: "at least one of these" is what the
 * axe rule checks, and two optional props do not say it.
 */
export type NamedPanel = { 'aria-label': string } | { 'aria-labelledby': string };
