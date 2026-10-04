import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { sidebarVariants } from './Sidebar.variants';

export interface SidebarProps
  extends ComponentProps<'div'>, VariantProps<typeof sidebarVariants> {
  /** Defaults to open, so a sidebar rendered with no props is a usable one. */
  open?: boolean;
}

/**
 * The application rail: a column of destinations down one edge of the page.
 *
 * The root is a plain `<div>`, and `SidebarContent` inside it is the `<nav>`.
 * An `<aside>` here would add a second landmark — `complementary`, which means
 * *tangentially related* content — around the page's primary navigation, and
 * two unnamed landmarks in one page is what axe reports as `landmark-unique`.
 * One landmark, named, is the whole rule.
 *
 * **It holds no state.** `open` is a prop, and the button that changes it is
 * the application's. That is not a limitation being worked around — every
 * component in this system is stateless so it can render on a server with no
 * JavaScript, and a sidebar is the component most likely to want its open state
 * remembered in a URL or a cookie, which is the application's job anyway.
 *
 * The prop is published as `data-open` / `data-closed` on the root, so the
 * children style themselves from it — `SidebarLabel` disappears on the rail
 * without anything being told twice.
 *
 * On a narrow screen, do not shrink this: render it inside a `Sheet` instead.
 * A 64px rail of icons is still 64px a phone does not have.
 *
 * @example
 * const [open, setOpen] = useState(true);
 * <Sidebar open={open} collapsible="icon">
 *   <SidebarHeader>
 *     <IconButton aria-label="Collapse" onClick={() => setOpen(!open)}><MenuIcon /></IconButton>
 *   </SidebarHeader>
 *   <SidebarContent>
 *     <SidebarGroup>
 *       <SidebarGroupLabel>Clinic</SidebarGroupLabel>
 *       <SidebarMenu>
 *         <SidebarMenuItem>
 *           <SidebarMenuButton asChild isActive>
 *             <a href="#/patients"><UserIcon /><SidebarLabel>Patients</SidebarLabel></a>
 *           </SidebarMenuButton>
 *         </SidebarMenuItem>
 *       </SidebarMenu>
 *     </SidebarGroup>
 *   </SidebarContent>
 * </Sidebar>
 */
export function Sidebar({
  className,
  collapsible,
  variant,
  width,
  open = true,
  ...props
}: SidebarProps) {
  return (
    <div
      data-slot="sidebar"
      data-open={open ? '' : undefined}
      data-closed={open ? undefined : ''}
      className={cn(sidebarVariants({ collapsible, variant, width }), className)}
      {...props}
    />
  );
}

const headerSizes = {
  md: 'h-16',
  sm: 'h-12',
  auto: 'flex-col items-stretch gap-3 py-3',
} as const;

export interface SidebarHeaderProps extends ComponentProps<'div'> {
  /**
   * `sm` is 48px, for a single line of context — a unit and a shift. `auto`
   * is a column of controls that stays put while the list below scrolls: a
   * new-item button, a filter.
   */
  size?: keyof typeof headerSizes;
}

export function SidebarHeader({ className, size = 'md', ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn('flex shrink-0 items-center gap-2 px-3', headerSizes[size], className)}
      {...props}
    />
  );
}

/** The scrolling middle. `min-h-0` is what lets it scroll inside a flex column. */
export function SidebarContent({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="sidebar-content"
      className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-2', className)}
      {...props}
    />
  );
}

export interface SidebarFooterProps extends ComponentProps<'div'> {
  /** The line above the footer. Off for a `plain` rail, which has no panel to divide. */
  divider?: boolean;
}

export function SidebarFooter({ className, divider = true, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        'flex shrink-0 flex-col gap-1 border-t border-line-subtle p-3',
        !divider && 'border-t-0',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    />
  );
}

/**
 * The heading over a group. On the rail it becomes screen-reader-only rather
 * than being hidden: there is no room to draw it, but removing it would take
 * the grouping away from everyone who is not looking at the screen.
 */
export function SidebarGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        'px-3 py-1 font-text text-caption font-medium whitespace-nowrap text-fg-muted',
        'group-data-closed/sidebar:sr-only',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex flex-col gap-0.5', className)}
      {...props}
    />
  );
}

/**
 * One row of the menu. Positioned, so a `SidebarMenuAction` can sit at its
 * end beside the menu button rather than inside it.
 */
export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn('group/menu-item relative list-none', className)}
      {...props}
    />
  );
}

export interface SidebarMenuButtonProps extends ComponentProps<'button'> {
  /**
   * The destination this row points at is the one on screen. Rendered as
   * `aria-current="page"`, which is what a screen reader announces — a
   * background colour says nothing.
   */
  isActive?: boolean;
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  isActive,
  asChild,
  ...props
}: SidebarMenuButtonProps) {
  const Root = asChild ? Slot : 'button';
  return (
    <Root
      data-slot="sidebar-menu-button"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3',
        'font-text text-body-sm text-fg no-underline',
        'transition-[color,background-color,border-color] duration-fast ease-out hover:bg-ghost-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-[current="page"]:bg-selected aria-[current="page"]:font-medium',
        'aria-[current="page"]:text-on-selected',
        '[--icon-size:var(--icon-md)] [&_svg]:shrink-0',
        // Room for the action button laid over the end of the row.
        'group-has-data-[slot=sidebar-menu-action]/menu-item:pe-11',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The wording inside a menu button. A separate element so the rail can take it
 * off the screen without taking the icon with it.
 *
 * On the rail it becomes `sr-only`, **not** `hidden`, and the difference is the
 * whole component: `hidden` removes the text from the accessibility tree, which
 * leaves a row of icon-only buttons with no accessible name at all, and axe
 * reports `button-name` for every one of them.
 */
export function SidebarLabel({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="sidebar-label"
      className={cn('truncate group-data-closed/sidebar:sr-only', className)}
      {...props}
    />
  );
}

/**
 * A control at the end of a menu row — a "more" menu for one conversation —
 * placed beside the menu button, never inside it. A button inside the link
 * would be one interactive element nested in another: a click on it follows
 * the link too, and a screen reader announces one control where there are
 * two.
 *
 * Put it after the `SidebarMenuButton` in the same `SidebarMenuItem`. It goes
 * with the labels when the rail closes, because there is no room for it.
 *
 * @example
 * <SidebarMenuItem>
 *   <SidebarMenuButton asChild isActive><a href="#/c/12"><SidebarLabel>Trip plan</SidebarLabel></a></SidebarMenuButton>
 *   <SidebarMenuAction>
 *     <DropdownMenu>
 *       <DropdownMenuTrigger asChild>
 *         <IconButton aria-label="More for Trip plan" size="sm" variant="ghost"><MoreIcon /></IconButton>
 *       </DropdownMenuTrigger>
 *       <DropdownMenuContent>…</DropdownMenuContent>
 *     </DropdownMenu>
 *   </SidebarMenuAction>
 * </SidebarMenuItem>
 */
export function SidebarMenuAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-action"
      className={cn(
        'absolute inset-e-1 top-1/2 flex -translate-y-1/2 items-center',
        'group-data-closed/sidebar:hidden',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A count at the end of a menu button — unread messages. Inside the button,
 * so it is part of the button's name. On a closed rail it leaves the screen
 * but not the accessibility tree, like the label.
 *
 * @example
 * <SidebarMenuButton asChild>
 *   <a href="#/notifications"><BellIcon /><SidebarLabel>Notifications</SidebarLabel>
 *     <SidebarMenuBadge><Badge status="info">3</Badge></SidebarMenuBadge>
 *   </a>
 * </SidebarMenuButton>
 */
export function SidebarMenuBadge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="sidebar-menu-badge"
      className={cn(
        'ms-auto flex shrink-0 items-center group-data-closed/sidebar:sr-only',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-separator"
      role="presentation"
      className={cn('mx-3 h-px shrink-0 bg-line-subtle', className)}
      {...props}
    />
  );
}
