import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';
import {
  menuContentStyles,
  menuContentWidths,
  menuDangerItemStyles,
  menuIndicatorItemStyles,
  menuIndicatorStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
  menuShortcutStyles,
} from './menu.styles';

/**
 * Radix supplies typeahead, roving focus, Home/End, the menu/menuitem roles,
 * collision-aware positioning that flips near a viewport edge, and focus return
 * to the trigger.
 *
 * `modal` defaults to **false** here, where Radix defaults it to true.
 *
 * A modal menu locks page scroll and marks everything outside itself
 * `aria-hidden` — including its own trigger, which is a `<button>` and stays
 * focusable. axe reports that as `aria-hidden-focus`, and it is not a false
 * positive: an element cannot be both hidden from assistive technology and
 * reachable by Tab. It only shows while the menu is open, which makes it easy
 * to miss.
 *
 * A dropdown menu is also not a modal dialog. Scroll locking and inerting the
 * page are what a `Dialog` is for. Pass `modal` back to Radix's default if a
 * particular menu really does need it.
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
export function DropdownMenu({
  modal = false,
  ...props
}: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root modal={modal} {...props} />;
}

export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  container,
  width,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content> & {
  /** See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof MenuPrimitive.Portal>['container'];
  /** A fixed width. Unset, the menu is as wide as its longest row, and never narrower than 13rem. */
  width?: keyof typeof menuContentWidths;
}) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          menuContentStyles,
          'origin-(--radix-dropdown-menu-content-transform-origin)',
          width && menuContentWidths[width],
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  variant = 'default',
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & {
  /** `danger` for a row that destroys something. Published as `data-variant`. */
  variant?: 'default' | 'danger';
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(menuItemStyles, variant === 'danger' && menuDangerItemStyles, className)}
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
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator
        data-slot="dropdown-menu-checkbox-item-indicator"
        className={menuIndicatorStyles}
      >
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
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator
        data-slot="dropdown-menu-radio-item-indicator"
        className={menuIndicatorStyles}
      >
        <span data-slot="dropdown-menu-radio-item-dot" className="size-2 rounded-pill bg-fg" />
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
      className={cn(menuLabelStyles, className)}
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
      className={cn(menuSeparatorStyles, className)}
      {...props}
    />
  );
}

/**
 * The keyboard equivalent of a row, set at its end. The same hint as
 * `ContextMenuShortcut`, so one command shows one shortcut in either menu.
 *
 * @example <DropdownMenuItem>Rename<DropdownMenuShortcut>F2</DropdownMenuShortcut></DropdownMenuItem>
 */
export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(menuShortcutStyles, className)}
      {...props}
    />
  );
}
