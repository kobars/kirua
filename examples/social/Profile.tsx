import { useState } from 'react';
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
  CardContent,
  Chart,
  ChartCaption,
  Grid,
  Heading,
  Inline,
  Placeholder,
  Separator,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'kirua';
import { FollowCounts } from './PersonCard';
import { PostCard } from './PostCard';
import { initials, people, posts, postsPerMonth, type Person } from './data';

export interface ProfileProps {
  person: Person;
}

export function Profile({ person }: ProfileProps) {
  const [following, setFollowing] = useState(false);
  const theirs = posts.filter((p) => p.handle === person.handle);
  const others = Object.values(people).filter((p) => p.handle !== person.handle);

  return (
    <Stack gap={4}>
      <Card padding="sm" gap={3}>
        <AspectRatio ratio={16 / 5} radius="md" aria-hidden="true">
          <Placeholder tone="brand" />
        </AspectRatio>

        <Inline wrap justify="between" align="end" gap={3}>
          <Avatar size="xl">
            {person.photo && <AvatarImage src={person.photo} alt="" />}
            <AvatarFallback>{initials(person.name)}</AvatarFallback>
          </Avatar>
          {/* `AlertDialogTrigger` and not a boolean: Radix owns the open
              state, marks the trigger `aria-expanded`, and returns focus to
              it on cancel. Blocking is the one action on this page that has
              to be confirmed. */}
          <Inline gap={2}>
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
            <Button size="sm" aria-pressed={following} onClick={() => setFollowing(!following)}>
              {following ? 'Following' : 'Follow'}
            </Button>
          </Inline>
        </Inline>

        <Stack gap={0}>
          <Heading as="h1" size="heading-sm">
            {person.name}
          </Heading>
          <Text size="sm" tone="muted">
            @{person.handle}
          </Text>
        </Stack>

        <Text wrap="pretty">{person.bio}</Text>

        <FollowCounts person={person}>
          <Text inline size="sm" tone="muted">
            Joined {person.joined}
          </Text>
        </FollowCounts>

        <Separator />

        <Inline gap={3}>
          <AvatarStack items={others.map((p) => ({ name: p.name }))} />
          <Text size="sm">Followed by people you follow</Text>
        </Inline>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Stack gap={4}>
            {theirs.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>
        </TabsContent>

        <TabsContent value="media">
          <Grid columns={2} sm={3} gap={3}>
            {theirs
              .filter((post) => post.media)
              .map((post) => (
                <AspectRatio key={post.id} ratio={1} radius="md">
                  <Placeholder>
                    <Text size="caption" tone="muted" align="center">
                      {post.media?.caption}
                    </Text>
                  </Placeholder>
                </AspectRatio>
              ))}
          </Grid>
        </TabsContent>

        <TabsContent value="likes">
          <Text size="sm">Liked posts are private on this example screen.</Text>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent>
              <Chart label={`Posts by ${person.name} per month, the last twelve months`}>
                <BarChart data={postsPerMonth} series={2} />
                <ChartCaption>
                  These numbers are made up for the example, not measured from anywhere.
                </ChartCaption>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
