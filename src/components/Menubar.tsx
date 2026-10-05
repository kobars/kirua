import * as MenubarPrimitive from '@radix-ui/react-menubar';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';
import {
  menuContentStyles,
  menuDangerItemStyles,
  menuIndicatorItemStyles,
  menuIndicatorStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
  menuShortcutStyles,
} from './menu.styles';

/**
 * The horizontal File / Edit / View strip of an application.
 *
 * It behaves as one tab stop, not as a row of buttons: Tab enters the bar and
 * leaves it, and the arrow keys move between the top-level menus. Once a menu
 * is open the arrows keep working across the bar, so a reader can walk every
 * command without closing anything. That is the whole reason to reach for this
 * instead of several `DropdownMenu`s side by side.
 *
 * It is a desktop shape. On a narrow screen the bar wraps or scrolls, and the
 * right answer there is usually one `DropdownMenu` behind a single button.
 *
 * @example
 * <Menubar>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>New visit<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 */
export function Menubar({ className, ...props }: ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        'flex items-center gap-1 rounded-md border border-line-subtle bg-raised p-1',
        'shadow-resting',
        className,
      )}
      {...props}
    />
  );
}

// Annotated: inferred, the emitted declaration would need Radix's `Scope` type,
// which its package does not export.
export const MenubarMenu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export function MenubarTrigger({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-pointer items-center rounded-sm px-3 py-1.5 select-none',
        'font-text text-body-sm font-medium text-fg',
        'transition-[color,background-color,border-color] duration-fast ease-out hover:bg-ghost-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-open:bg-ghost-hover',
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({
  className,
  align = 'start',
  sideOffset = 8,
  container,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Content> & {
  /** See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof MenubarPrimitive.Portal>['container'];
}) {
  return (
    <MenubarPrimitive.Portal container={container}>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          menuContentStyles,
          'origin-(--radix-menubar-content-transform-origin)',
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}

export function MenubarItem({
  className,
  variant = 'default',
  ...props
}: ComponentProps<typeof MenubarPrimitive.Item> & {
  /** `danger` for a row that destroys something. Published as `data-variant`. */
  variant?: 'default' | 'danger';
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-variant={variant}
      className={cn(menuItemStyles, variant === 'danger' && menuDangerItemStyles, className)}
      {...props}
    />
  );
}

export function MenubarCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <MenubarPrimitive.ItemIndicator className={menuIndicatorStyles}>
        <CheckIcon />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

export function MenubarRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <MenubarPrimitive.ItemIndicator className={menuIndicatorStyles}>
        <span className="size-2 rounded-pill bg-fg" />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

export function MenubarLabel({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Label>) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      className={cn(menuLabelStyles, className)}
      {...props}
    />
  );
}

export function MenubarSeparator({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(menuSeparatorStyles, className)}
      {...props}
    />
  );
}

/** See `ContextMenuShortcut` — the same hint, in the same place. */
export function MenubarShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(menuShortcutStyles, className)}
      {...props}
    />
  );
}
