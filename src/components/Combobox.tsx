/* oxlint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/prefer-tag-over-role, jsx-a11y/role-has-required-aria-props --
 * `<ul role="listbox">` with `<li role="option">` is the ARIA 1.2 combobox
 * pattern. The native tags these rules suggest cannot be filtered by typing.
 * The required ARIA props arrive from the consumer through a spread, which a
 * static rule cannot follow; `Combobox.stories.tsx` asserts them at runtime. */
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';

export interface ComboboxProps extends ComponentProps<'div'> {
  /**
   * Whether the list may show. Defaults to `true`, so a list the consumer
   * renders is a list on screen; pass the consumer's own open state to let a
   * press outside the field or Escape close it through `onOpenChange`.
   */
  open?: boolean;
  /** Called with `false` when Escape is pressed or the pointer goes down outside. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * A text box that filters a list. The query, the filtered items and the
 * highlighted row are the consumer's state; this supplies the ARIA wiring and
 * places the list.
 *
 * The list is positioned against the input by Radix and portalled, so a dialog
 * that scrolls cannot clip it, it flips above the input near the bottom of the
 * screen, and it is capped at the room available. Focus never leaves the input.
 *
 * `aria-activedescendant` on the input is required: focus never leaves the
 * input, so without it a screen reader announces nothing as the arrows move.
 * The consumer's key handler should also:
 *
 * - keep the active row in view, with
 *   `document.getElementById(id)?.scrollIntoView({ block: 'nearest' })`;
 * - open a closed list on ArrowDown and highlight the first row;
 * - drop `aria-controls` and set `aria-expanded={false}` while `ComboboxEmpty`
 *   is shown, because there is no listbox to point at;
 * - leave Home and End to the caret.
 *
 * @example
 * <Combobox open={open} onOpenChange={setOpen}>
 *   <ComboboxInput
 *     aria-expanded={open}
 *     aria-controls="city-list"
 *     aria-activedescendant={active ? `city-${active}` : undefined}
 *   />
 *   {open && (
 *     <ComboboxList id="city-list" aria-label="Cities">
 *       <ComboboxItem id="city-bdg" isActive={active === 'bdg'} aria-selected={value === 'bdg'}>
 *         Bandung
 *       </ComboboxItem>
 *     </ComboboxList>
 *   )}
 * </Combobox>
 */
export function Combobox({ className, open = true, onOpenChange, ...props }: ComboboxProps) {
  return (
    <PopoverPrimitive.Root
      open={open}
      {...(onOpenChange === undefined ? {} : { onOpenChange })}
    >
      <div data-slot="combobox" className={cn('relative', className)} {...props} />
    </PopoverPrimitive.Root>
  );
}

/** The field the list is positioned against. Render it inside `Combobox`. */
export function ComboboxInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <PopoverPrimitive.Anchor asChild>
      <input
        data-slot="combobox-input"
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        className={cn(
          'flex h-11 w-full min-w-0 rounded-md border border-field-line bg-field px-3',
          'font-text text-body-md text-on-field shadow-resting placeholder:text-placeholder',
          'transition-[border-color] duration-fast ease-out hover:border-field-line-hover',
          'focus-visible:border-ring',
          'aria-invalid:border-field-line-invalid',
          'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Anchor>
  );
}

type PanelProps = Pick<ComponentProps<typeof PopoverPrimitive.Content>, 'side' | 'align'> & {
  /** Where the list is rendered. See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof PopoverPrimitive.Portal>['container'];
};

/**
 * Radix's popover behaviour, minus what a combobox must not do: it never takes
 * focus, on opening or closing, and a press on its own field is not a press
 * outside. The field is found through the focus, which a combobox keeps in
 * its input for as long as the list is open.
 */
const panelBehaviour = {
  sideOffset: 4,
  collisionPadding: 8,
  onOpenAutoFocus: (event: Event) => event.preventDefault(),
  onCloseAutoFocus: (event: Event) => event.preventDefault(),
  onInteractOutside: (event: { target: EventTarget | null; preventDefault: () => void }) => {
    const owner = document.activeElement?.closest('[data-slot="combobox"]');
    if (owner && event.target instanceof Node && owner.contains(event.target)) {
      event.preventDefault();
    }
  },
} as const;

const panelClasses = [
  'z-popover w-(--radix-popover-trigger-width) rounded-lg border border-line-subtle bg-raised',
  'shadow-overlay data-open:animate-pop-in data-closed:animate-pop-out focus:outline-none',
];

/**
 * The options. A press anywhere in the list keeps focus in the input, so an
 * option needs no `onMouseDown` of its own to stop the input blurring.
 */
export function ComboboxList({
  className,
  side = 'bottom',
  align = 'start',
  container,
  onMouseDown,
  ...props
}: ComponentProps<'ul'> & PanelProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content asChild side={side} align={align} {...panelBehaviour}>
        <ul
          data-slot="combobox-list"
          role="listbox"
          onMouseDown={(event) => {
            onMouseDown?.(event);
            event.preventDefault();
          }}
          className={cn(
            panelClasses,
            'max-h-[min(16rem,var(--radix-popover-content-available-height))]',
            'scroll-py-1 overflow-y-auto p-1',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export interface ComboboxItemProps extends ComponentProps<'li'> {
  /** Whether the arrow keys have moved to this row. Not the same as selected. */
  isActive?: boolean;
}

export function ComboboxItem({ className, isActive, children, ...props }: ComboboxItemProps) {
  // React passes `aria-selected` through untouched, so the string form a
  // consumer may write is as valid as the boolean.
  const selected = props['aria-selected'] === true || props['aria-selected'] === 'true';
  return (
    <li
      data-slot="combobox-item"
      role="option"
      className={cn(
        'flex cursor-default items-center justify-between gap-2 rounded-sm px-3 py-2',
        'font-text text-body-sm text-fg select-none',
        '[--icon-size:var(--icon-sm)]',
        'hover:bg-ghost-hover',
        isActive && 'bg-selected text-on-selected hover:bg-selected',
        'aria-disabled:pointer-events-none aria-disabled:text-on-disabled',
        className,
      )}
      {...props}
    >
      {children}
      {selected && <CheckIcon aria-hidden="true" />}
    </li>
  );
}

/**
 * The "no matches" message. Render it **instead of** `ComboboxList`, never
 * inside it: a `role="listbox"` must contain options, and axe enforces that as
 * `aria-required-children`. It is placed like the list.
 *
 * @example
 * {results.length > 0 ? (
 *   <ComboboxList id="city-list">…</ComboboxList>
 * ) : (
 *   <ComboboxEmpty>No city matches.</ComboboxEmpty>
 * )}
 */
export function ComboboxEmpty({
  className,
  side = 'bottom',
  align = 'start',
  container,
  ...props
}: ComponentProps<'div'> & PanelProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content asChild side={side} align={align} {...panelBehaviour}>
        {/* `none` replaces the dialog role Radix gives a popover: this is a
            line of text, not a panel to move into. */}
        <div
          data-slot="combobox-empty"
          role="none"
          className={cn(
            panelClasses,
            'px-3 py-6 text-center font-text text-body-sm text-fg-muted',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
