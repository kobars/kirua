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
import { notices, people, posts } from './data';
import { useHashRoute } from '../shared/useHashRoute';

/** The destinations, shared by the rail, the header and the bottom bar. */
const nav = [
  { route: '', label: 'Beranda', icon: GridIcon },
  { route: 'jelajah', label: 'Jelajah', icon: SearchIcon },
  { route: 'notifikasi', label: 'Notifikasi', icon: HeartIcon },
  { route: 'pesan', label: 'Pesan', icon: CommentIcon },
  { route: 'profil/rin', label: 'Profil', icon: UserIcon },
] as const;

/**
 * Phone first: the single column is the layout, and a wide screen only adds a
 * rail beside it.
 */
export function App() {
  const [route, navigate] = useHashRoute('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [shown, setShown] = useState(3);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string[]>([]);
  /** TEMPORARY — see `experiment.tsx`. */
  const [surface, setSurface] = useState<CardSurface>(readSurface);

  useEffect(() => {
    if (!loadingMore) return;
    const timer = window.setTimeout(() => {
      setShown((n) => Math.min(n + 3, posts.length));
      setLoadingMore(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [loadingMore]);

  const profile = route.startsWith('profil/')
    ? people[route.slice('profil/'.length)]
    : undefined;
  const feed = posts.filter((post) => !deleted.includes(post.id));
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
            Ruang
          </Link>
          <span className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Cari" variant="ghost">
                <SearchIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Cari</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label="Profil"
                variant="ghost"
                onClick={() => navigate('profil/rin')}
              >
                <UserIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Profil</TooltipContent>
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
            <SidebarContent aria-label="Utama">
              <SidebarGroup>
                <SidebarMenu>
                  {nav.map(({ route: target, label, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild isActive={route === target}>
                        <a href={`#/${target}`}>
                          <Icon aria-hidden="true" />
                          <SidebarLabel>{label}</SidebarLabel>
                          {label === 'Notifikasi' && unread > 0 && (
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

        <main className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 p-4 pb-24 sm:pb-4">
          {profile ? (
            <Profile person={profile} surface={surface} />
          ) : route === 'jelajah' ? (
            <Explore onOpen={(handle) => navigate(`profil/${handle}`)} />
          ) : route === 'notifikasi' ? (
            <Notifications />
          ) : route === 'pesan' ? (
            <Messages />
          ) : (
            <>
              {/* The other four routes name themselves on the screen and a
                  timeline does not, so the page needs a heading it never shows.
                  `sr-only` rather than `hidden`, which would take it out of the
                  accessibility tree and leave the page unnamed either way. */}
              <Heading as="h1" className="sr-only">
                Beranda
              </Heading>

              <ExperimentBar
                value={surface}
                onChange={(next) => {
                  setSurface(next);
                  writeSurface(next);
                }}
              />
              <Composer />
              {feed.slice(0, shown).map((post) => (
                <PostCard key={post.id} post={post} onDelete={setDeleting} surface={surface} />
              ))}

              {loadingMore && (
                <output aria-busy="true" aria-label="Memuat kiriman" className="grid gap-4">
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
                  Muat lebih banyak
                </Button>
              )}
            </>
          )}
        </main>
      </div>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Hapus kiriman ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Kiriman dan semua balasannya hilang. Tidak bisa dikembalikan.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Biarkan</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (deleting) setDeleted((all) => [...all, deleting]);
                  setDeleting(null);
                }}
              >
                Hapus
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* A phone-only bottom bar. Everything in it is reachable from the header
          on a wide screen, so it is hidden rather than duplicated there. */}
      <nav
        aria-label="Utama"
        className="fixed inset-x-0 bottom-0 z-sticky border-t border-line-subtle bg-page px-4 py-2 sm:hidden"
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
                {label === 'Notifikasi' && unread > 0 && (
                  <span className="sr-only">, {unread} belum dibaca</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
