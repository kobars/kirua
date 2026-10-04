import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { appShellVariants } from './AppShell.variants';
import { shellWidthScale, type ShellWidth } from './layout.styles';

export interface AppShellProps
  extends ComponentProps<'div'>, VariantProps<typeof appShellVariants> {}

/**
 * The frame of an application: a header, a body that may hold a rail beside
 * the main content, and an optional phone navigation bar at the bottom.
 *
 * The parts read one shared custom property for the header's height, so they
 * belong inside this frame — an `AppRail` outside it does not know where the
 * header ends.
 *
 * @example
 * <AppShell>
 *   <AppHeader actions={<ThemeMenu />}>
 *     <Wordmark href="#/" icon={<SparkleIcon />}>Kirua</Wordmark>
 *   </AppHeader>
 *   <AppBody>
 *     <AppRail aria-label="Sections"><Sidebar>…</Sidebar></AppRail>
 *     <AppMain><Container width="full">…</Container></AppMain>
 *   </AppBody>
 *   <BottomNav aria-label="Main">…</BottomNav>
 * </AppShell>
 */
export function AppShell({ scroll, className, ...props }: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      className={cn(appShellVariants({ scroll }), className)}
      {...props}
    />
  );
}

export interface AppHeaderProps extends ComponentProps<'header'> {
  /** How wide the header's row may grow. Match the widest page below it. */
  width?: ShellWidth;
  /** Controls pushed to the end of the row: search, the theme menu, an account. */
  actions?: ReactNode;
}

/**
 * The application bar. Sticky, translucent over the content scrolling under
 * it, and left off the printed page.
 *
 * Children fill the start of the row and may shrink, so a long title given as
 * `<Text inline truncate>` gives up its width before any control does.
 * `actions` never shrink.
 *
 * Its height is fixed to the shell's `--app-header-height`, which is what lets
 * `AppRail` stick exactly under it.
 *
 * @example
 * <AppHeader width="7xl" actions={<IconButton aria-label="Search"><SearchIcon /></IconButton>}>
 *   <Visible below="md"><IconButton aria-label="Menu"><MenuIcon /></IconButton></Visible>
 *   <Wordmark href="#/" icon={<StethoscopeIcon />} shortName="Larkspur">Larkspur · Juniper Valley</Wordmark>
 * </AppHeader>
 */
export function AppHeader({
  width = '7xl',
  actions,
  className,
  children,
  ...props
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        'sticky top-0 z-sticky h-(--app-header-height) shrink-0',
        'border-b border-line-subtle bg-page/95 backdrop-blur-sm print:hidden',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex size-full items-center gap-2 px-4 md:px-8',
          shellWidthScale[width],
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">{children}</div>
        {actions !== undefined && actions !== null && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </div>
    </header>
  );
}

export interface AppBodyProps extends ComponentProps<'div'> {
  /** How wide the rail and the main content together may grow. */
  width?: ShellWidth;
}

/**
 * The row under the header: an optional `AppRail`, then `AppMain`. It grows to
 * fill the shell, so a short page still pushes a `BottomNav` to the bottom.
 */
export function AppBody({ width = '7xl', className, ...props }: AppBodyProps) {
  return (
    <div
      data-slot="app-body"
      className={cn('mx-auto flex min-h-0 w-full flex-1', shellWidthScale[width], className)}
      {...props}
    />
  );
}

const railFrom = { md: 'md:block', lg: 'lg:block' } as const;

export interface AppRailProps extends ComponentProps<'aside'> {
  /**
   * Required. The rail is an `aside` landmark, so anything above the `nav` in
   * it — a unit name in a `SidebarHeader` — belongs to a named region rather
   * than to none.
   */
  'aria-label': string;
  /** The width from which the rail is shown. Below it, offer the same links in a `Sheet`. */
  from?: keyof typeof railFrom;
}

/**
 * A column beside the main content that sticks under the header and fills
 * the rest of the viewport. It holds a `Sidebar`.
 *
 * Hidden below `from` and on the printed page: a 64px rail of icons is still
 * 64px a phone does not have, and nobody prints navigation.
 *
 * @example
 * <AppRail aria-label="Units and sections">
 *   <Sidebar variant="plain">…</Sidebar>
 * </AppRail>
 */
export function AppRail({ from = 'md', className, ...props }: AppRailProps) {
  return (
    <aside
      data-slot="app-rail"
      className={cn(
        'sticky top-(--app-header-height) hidden h-[calc(100dvh-var(--app-header-height))] shrink-0',
        'print:hidden',
        railFrom[from],
        className,
      )}
      {...props}
    />
  );
}

/**
 * The page's `main` landmark. It takes the width the rail leaves and may
 * shrink below its content, so a wide table inside scrolls rather than pushing
 * the rail off the screen.
 *
 * It adds no padding: the page inside it is a `Container`, which owns the
 * gutters, or a `Pane`, which owns its own edges.
 *
 * @example
 * <AppMain><Container width="full">…</Container></AppMain>
 */
export function AppMain({ className, ...props }: ComponentProps<'main'>) {
  return (
    <main
      data-slot="app-main"
      className={cn('flex min-h-0 min-w-0 flex-1 flex-col', className)}
      {...props}
    />
  );
}
