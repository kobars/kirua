import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStack,
  BarChart,
  Button,
  Card,
  CardBody,
  Chart,
  ChartCaption,
  Heading,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'kirua';
import { PostCard } from './PostCard';
import type { CardSurface } from './experiment';
import { compactCount, initials, people, posts, postsPerMonth, type Person } from './data';

export interface ProfileProps {
  person: Person;
  /** TEMPORARY — see `experiment.tsx`. */
  surface?: CardSurface | undefined;
}

export function Profile({ person, surface }: ProfileProps) {
  const theirs = posts.filter((p) => p.handle === person.handle);
  const others = Object.values(people).filter((p) => p.handle !== person.handle);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <Card className="grid gap-4 overflow-hidden p-0">
        <AspectRatio ratio={16 / 5} className="bg-brand-subtle">
          <div className="size-full" aria-hidden="true" />
        </AspectRatio>

        <div className="grid gap-3 px-4 pb-4">
          <div className="-mt-12 flex items-end justify-between gap-3">
            <Avatar size="xl" className="ring-4 ring-page">
              {person.photo && <AvatarImage src={person.photo} alt="" />}
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            {/* `AlertDialogTrigger` and not a boolean: Radix owns the open
                state, marks the trigger `aria-expanded`, and returns focus to
                it on cancel. Blocking is the one action on this page that has
                to be confirmed. */}
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    Block
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Block @{person.handle}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Neither of you would see the other's posts. This is an example screen, so
                    nobody is really blocked.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Block</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm">Follow</Button>
            </div>
          </div>

          <div>
            <Heading as="h1" size="heading-sm">
              {person.name}
            </Heading>
            <Text size="sm" tone="muted">
              @{person.handle}
            </Text>
          </div>

          <Text className="text-pretty">{person.bio}</Text>

          <p className="flex flex-wrap gap-4 text-body-sm text-fg-secondary">
            <span>
              <strong className="font-semibold text-fg tabular-nums">
                {compactCount(person.followers)}
              </strong>{' '}
              followers
            </span>
            <span>
              <strong className="font-semibold text-fg tabular-nums">
                {compactCount(person.following)}
              </strong>{' '}
              following
            </span>
            <span className="text-fg-muted">Joined {person.joined}</span>
          </p>

          <Separator />

          <div className="flex items-center gap-3">
            <AvatarStack
              items={others.map((p) => ({ name: p.name }))}
              className="[--icon-size:var(--icon-sm)]"
            />
            <Text size="sm">Followed by people you follow</Text>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="grid gap-4">
          {theirs.map((post) => (
            <PostCard key={post.id} post={post} surface={surface} />
          ))}
        </TabsContent>

        <TabsContent value="media" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {theirs
            .filter((post) => post.media)
            .map((post) => (
              <AspectRatio key={post.id} ratio={1} className="rounded-md bg-sunken">
                <div className="grid size-full place-content-center px-3 text-center text-caption text-fg-muted">
                  {post.media?.caption}
                </div>
              </AspectRatio>
            ))}
        </TabsContent>

        <TabsContent value="likes" className="text-body-sm text-fg-secondary">
          <p>Liked posts are private on this example screen.</p>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardBody>
              <Chart label={`Posts by ${person.name} per month, the last twelve months`}>
                <BarChart data={postsPerMonth} series={2} />
                <ChartCaption>
                  These numbers are made up for the example, not measured from anywhere.
                </ChartCaption>
              </Chart>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
