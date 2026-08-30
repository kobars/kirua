/**
 * The look every menu in this system shares.
 *
 * Four Radix packages — dropdown, context, menubar and select — render the same
 * roles with the same keyboard behaviour and differ only in what opens them. A
 * copy of these class lists per package is four places for a padding value to
 * drift, and the drift is invisible until two menus are open beside each other.
 *
 * Not a `*.variants.ts` file on purpose: there is no variant axis here, and
 * that suffix is what `variants.test.tsx` globs for — it would then demand a
 * story rendering `data-slot="menu"`, which nothing exports.
 */

/** The floating panel. Each menu adds its own animation origin. */
export const menuContentStyles = [
  'z-popover min-w-52 rounded-md bg-raised p-1.5 shadow-overlay',
  'border border-line-subtle',
  'data-open:animate-pop-in data-closed:animate-pop-out',
];

/**
 * One row. `data-[highlighted]` and `data-[disabled]` are spelled the vendor's
 * way because they carry no value — the three `@custom-variant` rules in
 * `index.css` exist for `data-state`, which does.
 */
export const menuItemStyles = [
  'relative flex cursor-pointer select-none items-center gap-2.5',
  'rounded-sm px-3 py-2.5 font-text text-body-sm text-fg outline-none',
  '[--icon-size:var(--icon-sm)]',
  'transition-colors duration-fast ease-out',
  'data-[highlighted]:bg-ghost-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-fg-muted',
];

/** Extra inline padding on a row that reserves room for a tick or a dot. */
export const menuIndicatorItemStyles = [...menuItemStyles, 'ps-9'];

export const menuIndicatorStyles = 'absolute inset-s-3 flex items-center';

export const menuLabelStyles = 'px-3 py-2 font-text text-caption font-medium text-fg-muted';

export const menuSeparatorStyles = 'my-1.5 h-px bg-line-subtle';
