/**
 * The look every menu in this system shares.
 *
 * Three Radix packages — dropdown, context and menubar — render the same roles
 * with the same keyboard behaviour and differ only in what opens them. A copy
 * of these class lists per package is three places for a padding value to
 * drift, and the drift is invisible until two menus are open beside each other.
 *
 * `Select` is deliberately not one of them. It renders a listbox, a field's
 * list of values rather than a menu of commands, and it shares its look with
 * the other listboxes, `Combobox` and `Command`: the field family's selected
 * fill on the highlighted row, the larger panel corner, a start-side tick for
 * the chosen value and an uppercase group heading.
 *
 * Not a `*.variants.ts` file on purpose: there is no variant axis here, and
 * that suffix is what `variants.test.tsx` globs for — it would then demand a
 * story rendering `data-slot="menu"`, which nothing exports.
 */

/**
 * The floating panel. Each menu adds its own animation origin, because Radix
 * names the transform-origin variable after the package.
 */
export const menuContentStyles = [
  'z-popover min-w-52 rounded-md bg-raised p-1.5 shadow-overlay',
  'border border-line-subtle',
  'data-open:animate-pop-in data-closed:animate-pop-out',
];

/**
 * One row. Radix marks the row the pointer or the arrow keys are on with
 * `data-highlighted`, so hover and keyboard share one highlight.
 */
export const menuItemStyles = [
  'relative flex cursor-pointer select-none items-center gap-2.5',
  'rounded-sm px-3 py-2.5 font-text text-body-sm text-fg outline-none',
  '[--icon-size:var(--icon-sm)]',
  'transition-colors duration-fast ease-out',
  'data-[highlighted]:bg-ghost-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-fg-muted',
];

/**
 * A row that destroys something — delete, remove, leave. The colour is a
 * second signal, never the only one: the label still has to say what goes.
 */
export const menuDangerItemStyles = 'text-danger-fg data-[highlighted]:text-danger-fg';

/** Fixed widths for a menu whose labels would otherwise set an uneven one. */
export const menuContentWidths = { md: 'w-56', lg: 'w-64' } as const;

/** Extra inline padding on a row that reserves room for a tick or a dot. */
export const menuIndicatorItemStyles = [...menuItemStyles, 'ps-9'];

export const menuIndicatorStyles = 'absolute inset-s-3 flex items-center';

export const menuLabelStyles = 'px-3 py-2 font-text text-caption font-medium text-fg-muted';

export const menuSeparatorStyles = 'my-1.5 h-px bg-line-subtle';

/** The keyboard equivalent at the end of a row. A hint, not a control. */
export const menuShortcutStyles = 'ms-auto ps-4 font-text text-caption text-fg-muted';
