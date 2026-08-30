import { useEffect, useState } from 'react';
import {
  IconButton,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  MenuIcon,
  MoreIcon,
  SparkleIcon,
} from 'kirua';
import { Composer } from './Composer';
import { ThemeMenu } from './ThemeMenu';
import { useTheme } from './useTheme';
import { SearchPalette } from './SearchPalette';
import { SettingsDialog } from './SettingsDialog';
import { Sidebar } from './Sidebar';
import { Transcript } from './Transcript';
import { conversations } from './data';
import { useHashRoute } from './useHashRoute';

/**
 * A full-height three-region shell: a fixed sidebar, a scrolling transcript, a
 * composer pinned to the bottom.
 *
 * `h-dvh` rather than `h-screen`, because on a phone `100vh` is the tall value
 * and a composer against it sits below the fold. `min-h-0` on every flex
 * ancestor of the scrolling region, or the transcript pushes the composer off
 * the screen instead of scrolling.
 */
export function App() {
  const [route, navigate] = useHashRoute(conversations[0]!.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const { preference, choose } = useTheme();

  const conversation = conversations.find((c) => c.id === route) ?? conversations[0]!;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pick = (id: string) => {
    navigate(id);
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-dvh min-h-0 bg-page text-fg">
      <aside className="hidden w-72 shrink-0 border-e border-line-subtle md:block">
        <Sidebar current={conversation.id} onPick={pick} onSearch={() => setSearchOpen(true)} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-line-subtle px-3 py-2 md:px-8">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <IconButton aria-label="Conversations" variant="ghost" className="md:hidden">
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetContent side="start" className="p-0">
              <SheetTitle className="sr-only">Conversations</SheetTitle>
              <Sidebar
                current={conversation.id}
                onPick={pick}
                onSearch={() => {
                  setDrawerOpen(false);
                  setSearchOpen(true);
                }}
              />
            </SheetContent>
          </Sheet>

          <span className="flex items-center gap-2 text-body-sm font-semibold [--icon-size:var(--icon-md)]">
            <SparkleIcon className="text-fg-accent" />
            Assistant
          </span>

          <span className="min-w-0 flex-1 truncate text-body-sm text-fg-muted">
            <span className="hidden sm:inline">— {conversation.title}</span>
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label="Settings"
                variant="ghost"
                onClick={() => setSettingsOpen(true)}
              >
                <MoreIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <ThemeMenu />
        </header>

        <Transcript conversation={conversation} pending={pending} />

        <Composer
          busy={pending}
          onSend={() => {
            setPending(true);
            window.setTimeout(() => setPending(false), 1400);
          }}
        />
      </div>

      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} onPick={pick} />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={preference}
        onThemeChange={choose}
      />
    </div>
  );
}
