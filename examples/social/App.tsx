import { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  GridIcon,
  SearchIcon,
  SparkleIcon,
  UserIcon,
} from 'kirua';
import { Composer } from './Composer';
import { PostCard } from './PostCard';
import { Profile } from './Profile';
import { people, posts } from './data';
import { useHashRoute } from './useHashRoute';

/**
 * Phone first: the single column is the layout, and a wide screen only adds a
 * rail beside it.
 */
export function App() {
  const [route, navigate] = useHashRoute('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [shown, setShown] = useState(3);

  useEffect(() => {
    if (!loadingMore) return;
    const timer = window.setTimeout(() => {
      setShown((n) => Math.min(n + 2, posts.length));
      setLoadingMore(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [loadingMore]);

  const profile = route.startsWith('profil/')
    ? people[route.slice('profil/'.length)]
    : undefined;

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-page/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3">
          <a
            href="#/"
            className="flex items-center gap-2 rounded-xs text-body-md font-semibold [--icon-size:var(--icon-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <SparkleIcon aria-hidden="true" className="text-fg-accent" />
            Ruang
          </a>
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
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-2xl gap-4 p-4 pb-24 sm:pb-4">
        {profile ? (
          <Profile person={profile} />
        ) : (
          <>
            <Composer />
            {posts.slice(0, shown).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {loadingMore && (
              <output aria-busy="true" aria-label="Memuat kiriman" className="grid gap-4">
                {[0, 1].map((n) => (
                  <div key={n} className="grid gap-3 rounded-lg border border-line-subtle p-4">
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
                  </div>
                ))}
              </output>
            )}

            {shown < posts.length && !loadingMore && (
              <Button variant="secondary" fullWidth onClick={() => setLoadingMore(true)}>
                Muat lebih banyak
              </Button>
            )}
          </>
        )}
      </main>

      {/* A phone-only bottom bar. Everything in it is reachable from the header
          on a wide screen, so it is hidden rather than duplicated there. */}
      <nav
        aria-label="Utama"
        className="fixed inset-x-0 bottom-0 z-sticky border-t border-line-subtle bg-page px-4 py-2 sm:hidden"
      >
        <ul className="mx-auto flex max-w-2xl items-center justify-around">
          {(
            [
              ['Beranda', '', GridIcon],
              ['Cari', '', SearchIcon],
              ['Profil', 'profil/rin', UserIcon],
            ] as const
          ).map(([label, target, Icon]) => (
            <li key={label}>
              <a
                href={`#/${target}`}
                className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-md px-3 text-caption text-fg-secondary [--icon-size:var(--icon-lg)] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Icon aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
