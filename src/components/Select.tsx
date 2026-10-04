import * as SelectPrimitive from '@radix-ui/react-select';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { NamedPanel } from './aria';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

/**
 * Choosing one value from a list too long for radio buttons. A native
 * `<select>` draws its option list in the operating system and cannot be made
 * to match the field family.
 *
 * The trigger is `h-11`, the same step as `Input` and `Button`, so a row of
 * controls lines up.
 *
 * @example
 * <Select defaultValue="general">
 *   <SelectTrigger aria-label="Clinic"><SelectValue /></SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="general">General practice</SelectItem>
 *     <SelectItem value="dental">Dental</SelectItem>
 *   </SelectContent>
 * </Select>
 */
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex h-11 w-full items-center justify-between gap-2 rounded-md px-3',
        'border border-field-line bg-field font-text text-body-md text-on-field',
        'shadow-resting [--icon-size:var(--icon-md)]',
        'transition-[border-color] duration-fast ease-out',
        'hover:border-field-line-hover',
        'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-field-line-invalid',
        'data-placeholder:text-placeholder',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
        // A long value is cut with an ellipsis rather than wrapping out of
        // the fixed height. Radix renders the value as the one span here.
        '[&>span]:min-w-0 [&>span]:truncate',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="shrink-0 opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * The panel is a `role="listbox"` and needs a name of its own — Radix does not
 * link it to the trigger, so naming only the trigger leaves it unnamed.
 */
export type SelectContentProps = ComponentProps<typeof SelectPrimitive.Content> &
  NamedPanel & {
    container?: ComponentProps<typeof SelectPrimitive.Portal>['container'];
  };

export function SelectContent({
  className,
  children,
  position = 'popper',
  sideOffset = 6,
  container,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          // Capped by the room Radix measures below or above the trigger, so
          // on a short screen the list scrolls rather than running off it.
          'z-popover max-h-[min(18rem,var(--radix-select-content-available-height))]',
          'min-w-(--radix-select-trigger-width) overflow-hidden',
          'rounded-lg border border-line-subtle bg-raised text-fg shadow-overlay',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center [--icon-size:var(--icon-sm)]">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center [--icon-size:var(--icon-sm)]">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-2 ps-8 pe-2',
        'font-text text-body-sm text-fg outline-none select-none',
        '[--icon-size:var(--icon-sm)]',
        // `data-highlighted` rather than `:hover`: the keyboard moves it too.
        'data-highlighted:bg-selected data-highlighted:text-on-selected',
        'data-disabled:pointer-events-none data-disabled:text-on-disabled',
        className,
      )}
      {...props}
    >
      <span className="absolute inset-s-2 flex items-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-2 py-1.5 font-text text-caption text-fg-muted uppercase', className)}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('my-1 h-px bg-line-subtle', className)}
      {...props}
    />
  );
}
