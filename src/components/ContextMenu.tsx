import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './icons';
import {
  menuContentStyles,
  menuIndicatorItemStyles,
  menuIndicatorStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from './menu.styles';

/**
 * The menu a right-click opens, positioned at the pointer rather than anchored
 * to a trigger.
 *
 * It is never the only way to reach a command. A right-click has no keyboard
 * equivalent on most platforms and no equivalent at all on a touch screen, so
 * every item here must also exist somewhere a Tab key can reach — usually the
 * row's own "more" button. Radix does open it with the Menu key and with a long
 * press, and neither is discoverable.
 *
 * `ContextMenuTrigger` renders a `<span>` that fills its parent. Give it
 * `asChild` to make the row itself the trigger.
 *
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger asChild><Item>Invoice 812</Item></ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Open</ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuItem>Delete</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export function ContextMenuContent({
  className,
  container,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Content> & {
  /** See `DialogContent`'s `container`. */
  container?: ComponentProps<typeof ContextMenuPrimitive.Portal>['container'];
}) {
  return (
    <ContextMenuPrimitive.Portal container={container}>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(menuContentStyles, className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Item>) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      className={cn(menuItemStyles, className)}
      {...props}
    />
  );
}

export function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <ContextMenuPrimitive.ItemIndicator className={menuIndicatorStyles}>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(menuIndicatorItemStyles, className)}
      {...props}
    >
      <ContextMenuPrimitive.ItemIndicator className={menuIndicatorStyles}>
        <span className="size-2 rounded-pill bg-fg" />
      </ContextMenuPrimitive.ItemIndicator>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export function ContextMenuLabel({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(menuLabelStyles, className)}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(menuSeparatorStyles, className)}
      {...props}
    />
  );
}

/**
 * The keyboard hint on the end of a row. Presentational: the shortcut it names
 * is the consumer's own key handler, and this only writes it down.
 */
export function ContextMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn('ms-auto ps-4 font-text text-caption text-fg-muted', className)}
      {...props}
    />
  );
}
