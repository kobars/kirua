import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AppBody,
  AppHeader,
  AppMain,
  AppRail,
  AppShell,
  Button,
  IconButton,
  Pane,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Visible,
  VisuallyHidden,
  Wordmark,
  MenuIcon,
  MoreIcon,
  SparkleIcon,
} from 'kirua';
import { Composer } from './Composer';
import { ThemeMenu } from '../shared/ThemeMenu';
import { useTheme } from '../shared/useTheme';
import { SearchPalette } from './SearchPalette';
import { SettingsDialog } from './SettingsDialog';
import { ConversationSidebar } from './Sidebar';
import { Transcript } from './Transcript';
import { Usage } from './Usage';
import { allConversations, type Turn } from './data';
import { useHashRoute } from '../shared/useHashRoute';

/**
 * An application that fits the viewport and scrolls inside its panes: the
 * conversation list in the rail, the transcript between a header that stays
 * and a composer that stays.
 */
export function App() {
  const [route, navigate] = useHashRoute('assistant', allConversations[0]!.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [addedTurns, setAddedTurns] = useState<Record<string, Turn[]>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const { preference, choose } = useTheme();

  const visible = allConversations.filter((c) => !hidden.includes(c.id));
  const conversation =
    visible.find((c) => c.id === route) ?? visible[0] ?? allConversations[0]!;

  useEffect(() => {
    if (pendingId === null) return;
    const timer = window.setTimeout(() => {
      setAddedTurns((all) => ({
        ...all,
        [pendingId]: [
          ...(all[pendingId] ?? []),
          {
            id: crypto.randomUUID(),
            from: 'assistant',
            text: 'This is a local demo reply. Explore the sample conversations for worked examples of tokens, accessibility and layout. No message was sent to a server.',
          },
        ],
      }));
      setPendingId(null);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [pendingId]);

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
    <AppShell scroll="panes">
      <AppHeader
        width="full"
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              aria-current={route === 'usage' ? 'page' : undefined}
              onClick={() => navigate(route === 'usage' ? conversation.id : 'usage')}
            >
              {route === 'usage' ? 'Back to chat' : 'Usage'}
            </Button>

            <SettingsDialog
              theme={preference}
              onThemeChange={choose}
              trigger={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton aria-label="Settings" variant="ghost">
                      <MoreIcon />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              }
            />

            <ThemeMenu />
          </>
        }
      >
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Visible below="md">
            <SheetTrigger asChild>
              <IconButton aria-label="Conversations" variant="ghost">
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
          </Visible>
          <SheetContent side="start" padding="none">
            <VisuallyHidden asChild>
              <SheetTitle>Conversations</SheetTitle>
            </VisuallyHidden>
            <ConversationSidebar
              variant="plain"
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

        {/* Below `sm` the row is a drawer button, the mark and three controls,
            so the name and the title leave the screen first. */}
        <Wordmark icon={<SparkleIcon />} size="sm" compact>
          Assistant
        </Wordmark>

        <Visible from="sm">
          <Text inline size="sm" tone="muted" truncate>
            — {conversation.title}
          </Text>
        </Visible>
      </AppHeader>

      <AppBody width="full">
        <AppRail aria-label="Conversations" from="md">
          <ConversationSidebar
            current={conversation.id}
            onPick={pick}
            onSearch={() => setSearchOpen(true)}
            onDelete={setDeleting}
            hidden={hidden}
          />
        </AppRail>

        <AppMain>
          {route === 'usage' ? (
            <Usage />
          ) : (
            <Pane height="screen">
              <Transcript
                conversation={{
                  ...conversation,
                  turns: [...conversation.turns, ...(addedTurns[conversation.id] ?? [])],
                }}
                pending={pendingId === conversation.id}
              />

              <Composer
                busy={pendingId !== null}
                onSend={(text) => {
                  if (pendingId !== null) return;
                  setAddedTurns((all) => ({
                    ...all,
                    [conversation.id]: [
                      ...(all[conversation.id] ?? []),
                      { id: crypto.randomUUID(), from: 'you', text },
                    ],
                  }));
                  setPendingId(conversation.id);
                }}
              />
            </Pane>
          )}
        </AppMain>
      </AppBody>

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
    </AppShell>
  );
}
