/* oxlint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/prefer-tag-over-role, jsx-a11y/role-has-required-aria-props --
 * `<ul role="listbox">` with `<li role="option">` is the ARIA 1.2 combobox
 * pattern. The native tags these rules suggest cannot be filtered by typing.
 * The required ARIA props arrive from the consumer through a spread, which a
 * static rule cannot follow; `Combobox.stories.tsx` asserts them at runtime. */
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';

/**
 * A text box that filters a list. The query, the filtered items and the
 * highlighted row are the consumer's state; this supplies the ARIA wiring.
 *
 * `aria-activedescendant` on the input is required: focus never leaves the
 * input, so without it a screen reader announces nothing as the arrows move.
 *
 * @example
 * <ComboboxInput
 *   aria-expanded={open}
 *   aria-controls="city-list"
 *   aria-activedescendant={active ? `city-${active}` : undefined}
 * />
 * <ComboboxList id="city-list">
 *   <ComboboxItem id="city-bdg" isActive={active === 'bdg'} aria-selected={value === 'bdg'}>
 *     Bandung
 *   </ComboboxItem>
 * </ComboboxList>
 */
export function Combobox({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="combobox" className={cn('relative', className)} {...props} />;
}

export function ComboboxInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="combobox-input"
      type="text"
      role="combobox"
      autoComplete="off"
      className={cn(
        'flex h-11 w-full rounded-md border border-field-line bg-field px-3',
        'font-text text-body-md text-on-field shadow-resting placeholder:text-placeholder',
        'transition-[border-color] duration-fast ease-out hover:border-field-line-hover',
        'focus-visible:border-ring',
        'aria-invalid:border-field-line-invalid',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled',
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxList({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="combobox-list"
      role="listbox"
      className={cn(
        'absolute inset-s-0 z-popover mt-1 max-h-64 w-full overflow-y-auto',
        'rounded-lg border border-line-subtle bg-raised p-1 shadow-overlay',
        className,
      )}
      {...props}
    />
  );
}

export interface ComboboxItemProps extends ComponentProps<'li'> {
  /** Whether the arrow keys have moved to this row. Not the same as selected. */
  isActive?: boolean;
}

export function ComboboxItem({ className, isActive, children, ...props }: ComboboxItemProps) {
  return (
    <li
      data-slot="combobox-item"
      role="option"
      className={cn(
        'flex cursor-default items-center justify-between gap-2 rounded-sm px-3 py-2',
        'font-text text-body-sm text-fg select-none',
        '[--icon-size:var(--icon-sm)]',
        isActive && 'bg-selected text-on-selected',
        'aria-disabled:pointer-events-none aria-disabled:text-on-disabled',
        className,
      )}
      {...props}
    >
      {children}
      {props['aria-selected'] === true && <CheckIcon aria-hidden="true" />}
    </li>
  );
}

/**
 * The "no matches" message. Render it **instead of** `ComboboxList`, never
 * inside it: a `role="listbox"` must contain options, and axe enforces that as
 * `aria-required-children`.
 *
 * @example
 * {results.length > 0 ? (
 *   <ComboboxList id="city-list">…</ComboboxList>
 * ) : (
 *   <ComboboxEmpty>Tidak ada kota yang cocok.</ComboboxEmpty>
 * )}
 */
export function ComboboxEmpty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="combobox-empty"
      className={cn(
        'absolute inset-s-0 z-popover mt-1 w-full rounded-lg border border-line-subtle bg-raised',
        'px-3 py-6 text-center font-text text-body-sm text-fg-muted shadow-overlay',
        className,
      )}
      {...props}
    />
  );
}
