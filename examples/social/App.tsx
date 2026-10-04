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
  Badge,
  BottomNav,
  BottomNavLink,
  Button,
  Card,
  CommentIcon,
  Container,
  GridIcon,
  Heading,
  HeartIcon,
  IconButton,
  Inline,
  SearchIcon,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
  SparkleIcon,
  Stack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UserIcon,
  VisuallyHidden,
  Wordmark,
} from 'kirua';
import { Composer } from './Composer';
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
  const [route, navigate] = useHashRoute('social', '');
  const [loadingMore, setLoadingMore] = useState(false);
  const [published, setPublished] = useState<Post[]>([]);
  const [shown, setShown] = useState(3);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string[]>([]);

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
    <AppShell>
      <AppHeader
        width="4xl"
        actions={
          <>
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
          </>
        }
      >
        <Wordmark href="#/social/" icon={<SparkleIcon />}>
          Commons
        </Wordmark>
      </AppHeader>

      <AppBody width="4xl">
        {/* The rail repeats the bottom bar, which is why it starts at `md`:
            below that the bar is the navigation and a second copy would be
            two ways to reach the same five places on a 375px screen. */}
        <AppRail aria-label="Sections" from="md">
          <Sidebar collapsible="none" variant="plain" width="sm">
            <SidebarContent aria-label="Main">
              <SidebarGroup>
                <SidebarMenu>
                  {nav.map(({ route: target, label, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild isActive={route === target}>
                        <a href={`#/social/${target}`}>
                          <Icon aria-hidden="true" />
                          <SidebarLabel>{label}</SidebarLabel>
                          {label === 'Notifications' && unread > 0 && (
                            <SidebarMenuBadge>
                              <Badge status="info">{unread}</Badge>
                            </SidebarMenuBadge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </AppRail>

        <AppMain>
          <Container width="full" gap="sm">
            {profile ? (
              <Profile person={profile} />
            ) : route === 'explore' ? (
              <Explore onOpen={(handle) => navigate(`profile/${handle}`)} />
            ) : route === 'notifications' ? (
              <Notifications />
            ) : route === 'messages' ? (
              <Messages />
            ) : (
              <>
                {/* The other four routes name themselves on the screen and a
                    timeline does not, so the page needs a heading it never
                    shows — visually hidden rather than hidden, which would take
                    it out of the accessibility tree and leave the page unnamed
                    either way. */}
                <VisuallyHidden asChild>
                  <Heading as="h1">Home</Heading>
                </VisuallyHidden>

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
                  <PostCard key={post.id} post={post} onDelete={setDeleting} />
                ))}

                {loadingMore && (
                  <Stack as="output" gap={4} aria-busy="true" aria-label="Loading posts">
                    {/* A `Card`, because the thing it stands in for is a `Card`,
                        so the two cannot drift apart in size or shape. */}
                    {[0, 1].map((n) => (
                      <Card key={n} radius="lg" padding="sm" gap={3}>
                        <Inline gap={3}>
                          <Skeleton shape="circle" />
                          <Stack gap={2}>
                            <Skeleton shape="caption" width="sm" />
                            <Skeleton shape="caption" width="xs" />
                          </Stack>
                        </Inline>
                        <Skeleton shape="caption" width="full" />
                        <Skeleton shape="caption" width="4/5" />
                        <Skeleton shape="media" width="full" />
                      </Card>
                    ))}
                  </Stack>
                )}

                {shown < feed.length && !loadingMore && (
                  <Button variant="secondary" fullWidth onClick={() => setLoadingMore(true)}>
                    Load more
                  </Button>
                )}
              </>
            )}
          </Container>
        </AppMain>
      </AppBody>

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

      {/* A phone-only bottom bar. Everything in it is reachable from the rail
          on a wide screen, so it is hidden rather than duplicated there. */}
      <BottomNav aria-label="Main">
        {nav.map(({ route: target, label, icon: Icon }) => (
          <BottomNavLink
            key={label}
            href={`#/social/${target}`}
            icon={<Icon />}
            current={route === target}
          >
            {label}
            {label === 'Notifications' && unread > 0 && (
              <VisuallyHidden>, {unread} unread</VisuallyHidden>
            )}
          </BottomNavLink>
        ))}
      </BottomNav>
    </AppShell>
  );
}
