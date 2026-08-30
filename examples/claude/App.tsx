import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Button,
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
import { ThemeMenu } from '../shared/ThemeMenu';
import { EN } from '../shared/themeLabels';
import { useTheme } from '../shared/useTheme';
import { SearchPalette } from './SearchPalette';
import { SettingsDialog } from './SettingsDialog';
import { Sidebar } from './Sidebar';
import { Transcript } from './Transcript';
import { Usage } from './Usage';
import { allConversations } from './data';
import { useHashRoute } from '../shared/useHashRoute';

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
  const [route, navigate] = useHashRoute(allConversations[0]!.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const { preference, choose } = useTheme();

  const visible = allConversations.filter((c) => !hidden.includes(c.id));
  const conversation =
    visible.find((c) => c.id === route) ?? visible[0] ?? allConversations[0]!;

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
        <Sidebar
          current={conversation.id}
          onPick={pick}
          onSearch={() => setSearchOpen(true)}
          onDelete={setDeleting}
          hidden={hidden}
        />
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
                onDelete={setDeleting}
                hidden={hidden}
              />
            </SheetContent>
          </Sheet>

          {/* The wordmark goes below `sm`. At 375 the row is a drawer button,
              this, Usage, Settings and the theme menu, and every one of those
              is `shrink-0` — so the five of them overran the header by five
              pixels while the truncating title had already given up its width. */}
          <span className="flex items-center gap-2 text-body-sm font-semibold [--icon-size:var(--icon-md)]">
            <SparkleIcon className="text-fg-accent" />
            <span className="hidden sm:inline">Assistant</span>
          </span>

          <span className="min-w-0 flex-1 truncate text-body-sm text-fg-muted">
            <span className="hidden sm:inline">— {conversation.title}</span>
          </span>

          <Button
            variant="ghost"
            size="sm"
            aria-current={route === 'penggunaan' ? 'page' : undefined}
            onClick={() => navigate(route === 'penggunaan' ? conversation.id : 'penggunaan')}
          >
            {route === 'penggunaan' ? 'Back to chat' : 'Usage'}
          </Button>

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

          {/* The one app of the four written in English, so the one that has to
              pass the labels the shared menu takes as a parameter. */}
          <ThemeMenu labels={EN} />
        </header>

        {/* Every heading and turn below has to sit inside a landmark, or axe
            reports `region` for each one on top of `landmark-one-main`. This
            repeats the outer column's flex classes rather than replacing the
            `<div>`: the transcript scrolls and the composer does not, so the
            route content stays a `min-h-0` flex column of its own. */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {route === 'penggunaan' ? (
            <Usage />
          ) : (
            <>
              <Transcript conversation={conversation} pending={pending} />

              <Composer
                busy={pending}
                onSend={() => {
                  setPending(true);
                  window.setTimeout(() => setPending(false), 1400);
                }}
              />
            </>
          )}
        </main>
      </div>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
          <AlertDialogDescription>
            Every turn in it goes too, and none of it can be recovered from here.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep it</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (deleting) setHidden((all) => [...all, deleting]);
                  setDeleting(null);
                }}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
