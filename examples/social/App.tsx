import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CommentIcon,
  GridIcon,
  Heading,
  HeartIcon,
  IconButton,
  Link,
  SearchIcon,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
  SparkleIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UserIcon,
} from 'kirua';
import { Composer } from './Composer';
import { ExperimentBar } from './ExperimentBar';
import { readSurface, writeSurface, type CardSurface } from './experiment';
import { Explore } from './Explore';
import { Messages } from './Messages';
import { Notifications } from './Notifications';
import { PostCard } from './PostCard';
import { ThemeMenu } from '../shared/ThemeMenu';
import { Profile } from './Profile';
import { notices, people, posts, type Post } from './data';
import { useHashRoute } from '../shared/useHashRoute';

/** The destinations, shared by the rail, the header and the bottom bar. */
const nav = [
  { route: '', label: 'Home', icon: GridIcon },
  { route: 'explore', label: 'Explore', icon: SearchIcon },
  { route: 'notifications', label: 'Notifications', icon: HeartIcon },
  { route: 'messages', label: 'Messages', icon: CommentIcon },
  { route: 'profile/rin', label: 'Profile', icon: UserIcon },
] as const;

/**
 * Phone first: the single column is the layout, and a wide screen only adds a
 * rail beside it.
 */
export function App() {
  const [route, navigate] = useHashRoute('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [published, setPublished] = useState<Post[]>([]);
  const [shown, setShown] = useState(3);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string[]>([]);
  /** TEMPORARY — see `experiment.tsx`. */
  const [surface, setSurface] = useState<CardSurface>(readSurface);

  useEffect(() => {
    if (!loadingMore) return;
    const timer = window.setTimeout(() => {
      setShown((n) => n + 3);
      setLoadingMore(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [loadingMore]);

  const profile = route.startsWith('profile/')
    ? people[route.slice('profile/'.length)]
    : undefined;
  const feed = [...published, ...posts].filter((post) => !deleted.includes(post.id));
  const unread = notices.filter((notice) => notice.unread).length;

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-page/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 py-3">
          <Link
            href="#/"
            variant="block"
            className="flex items-center gap-2 text-body-md font-semibold [--icon-size:var(--icon-lg)]"
          >
            <SparkleIcon aria-hidden="true" className="text-fg-accent" />
            Commons
          </Link>
          <span className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label="Search"
                variant="ghost"
                onClick={() => navigate('explore')}
              >
                <SearchIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label="Profile"
                variant="ghost"
                onClick={() => navigate('profile/rin')}
              >
                <UserIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>

          <ThemeMenu />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl gap-6">
        {/* The rail repeats the bottom bar, which is why it starts at `md`:
            below that the bar is the navigation and a second copy would be
            two ways to reach the same five places on a 375px screen. */}
        <div className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] md:block">
          <Sidebar collapsible="none" className="w-52 border-e-0 bg-transparent">
            <SidebarContent aria-label="Main">
              <SidebarGroup>
                <SidebarMenu>
                  {nav.map(({ route: target, label, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild isActive={route === target}>
                        <a href={`#/${target}`}>
                          <Icon aria-hidden="true" />
                          <SidebarLabel>{label}</SidebarLabel>
                          {label === 'Notifications' && unread > 0 && (
                            <Badge status="info" className="ms-auto">
                              {unread}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>

        <main className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 p-4 pb-24 md:pb-4">
          {profile ? (
            <Profile person={profile} surface={surface} />
          ) : route === 'explore' ? (
            <Explore onOpen={(handle) => navigate(`profile/${handle}`)} />
          ) : route === 'notifications' ? (
            <Notifications />
          ) : route === 'messages' ? (
            <Messages />
          ) : (
            <>
              {/* The other four routes name themselves on the screen and a
                  timeline does not, so the page needs a heading it never shows.
                  `sr-only` rather than `hidden`, which would take it out of the
                  accessibility tree and leave the page unnamed either way. */}
              <Heading as="h1" className="sr-only">
                Home
              </Heading>

              <ExperimentBar
                value={surface}
                onChange={(next) => {
                  setSurface(next);
                  writeSurface(next);
                }}
              />
              <Composer
                onPublish={(text, audience, image) => {
                  setPublished((all) => [
                    {
                      id: crypto.randomUUID(),
                      handle: 'rin',
                      when: `Now · ${audience}`,
                      text,
                      likes: 0,
                      comments: 0,
                      ...(image
                        ? { media: { ratio: 16 / 9, caption: 'Demo image attachment' } }
                        : {}),
                    },
                    ...all,
                  ]);
                }}
              />
              {feed.slice(0, shown).map((post) => (
                <PostCard key={post.id} post={post} onDelete={setDeleting} surface={surface} />
              ))}

              {loadingMore && (
                <output aria-busy="true" aria-label="Loading posts" className="grid gap-4">
                  {/* A `Card`, because the thing it stands in for is a `Card`.
                      This was three utilities typed by hand, which happened to
                      draw a box the same size and shape and would have drifted
                      away from PostCard the first time either changed. */}
                  {[0, 1].map((n) => (
                    <Card key={n} radius="lg" padding="none" className="grid gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-pill" />
                        <div className="grid gap-2">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-44 w-full rounded-md" />
                    </Card>
                  ))}
                </output>
              )}

              {shown < feed.length && !loadingMore && (
                <Button variant="secondary" fullWidth onClick={() => setLoadingMore(true)}>
                  Load more
                </Button>
              )}
            </>
          )}
        </main>
      </div>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            The post and every reply to it go too, and none of it can be recovered.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep it</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (deleting) setDeleted((all) => [...all, deleting]);
                  setDeleting(null);
                }}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* A phone-only bottom bar. Everything in it is reachable from the header
          on a wide screen, so it is hidden rather than duplicated there. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-sticky border-t border-line-subtle bg-page px-4 py-2 md:hidden"
      >
        <ul className="mx-auto flex max-w-2xl items-center justify-around">
          {nav.map(({ route: target, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={`#/${target}`}
                aria-current={route === target ? 'page' : undefined}
                variant="block"
                className="relative flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-md px-2 text-caption text-fg-secondary [--icon-size:var(--icon-lg)] hover:text-fg aria-[current=page]:text-fg"
              >
                <Icon aria-hidden="true" />
                {label}
                {label === 'Notifications' && unread > 0 && (
                  <span className="sr-only">, {unread} unread</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
