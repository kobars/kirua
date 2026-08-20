import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';

/**
 * Radix supplies typeahead, roving focus, Home/End, the menu/menuitem roles,
 * collision-aware positioning that flips near a viewport edge, and focus return
 * to the trigger.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild><IconButton aria-label="More"><GridIcon /></IconButton></DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuLabel>Sort by</DropdownMenuLabel>
 *     <DropdownMenuItem>Newest</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
/**
 * `modal` defaults to **false** here, where Radix defaults it to true.
 *
 * A modal menu locks page scroll and marks everything outside itself
 * `aria-hidden` — including its own trigger, which is a `<button>` and stays
 * focusable. axe reports that as `aria-hidden-focus`, and it is not a false
 * positive: an element cannot be both hidden from assistive technology and
 * reachable by Tab. Found by opening a menu inside a story for the first time;
 * no story had ever opened one, so the whole system's menus had never been
 * checked in their open state.
 *
 * A dropdown menu is also not a modal dialog. Scroll locking and inerting the
 * page are what a `Dialog` is for. Pass `modal` back to Radix's default if a
 * particular menu really does need it.
 */
export function DropdownMenu({
  modal = false,
  ...props
}: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root modal={modal} {...props} />;
}

export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

const itemStyles = [
  'relative flex cursor-pointer select-none items-center gap-2.5',
  'rounded-sm px-3 py-2.5 font-text text-body-sm text-fg outline-none',
  '[--icon-size:var(--icon-sm)]',
  'transition-colors duration-fast ease-out',
  'data-[highlighted]:bg-ghost-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-fg-muted',
];

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  container,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content> & {
  /** See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof MenuPrimitive.Portal>['container'];
}) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'z-popover min-w-52 rounded-md bg-raised p-1.5 shadow-overlay',
          'border border-line-subtle',
          'data-open:animate-pop-in data-closed:animate-pop-out',
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(itemStyles, className)}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemStyles, 'ps-9', className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator className="absolute inset-s-3 flex items-center">
        <CheckIcon />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(itemStyles, 'ps-9', className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator className="absolute inset-s-3 flex items-center">
        <span className="size-2 rounded-pill bg-fg" />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn('px-3 py-2 font-text text-caption font-medium text-fg-muted', className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('my-1.5 h-px bg-line-subtle', className)}
      {...props}
    />
  );
}
