import {
  AspectRatio,
  Avatar,
  AvatarFallback,
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
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <Button size="sm">Ikuti</Button>
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
              pengikut
            </span>
            <span>
              <strong className="font-semibold text-fg tabular-nums">
                {compactCount(person.following)}
              </strong>{' '}
              diikuti
            </span>
            <span className="text-fg-muted">Bergabung {person.joined}</span>
          </p>

          <Separator />

          <div className="flex items-center gap-3">
            <AvatarStack
              items={others.map((p) => ({ name: p.name }))}
              className="[--icon-size:var(--icon-sm)]"
            />
            <Text size="sm">Diikuti oleh orang yang kamu ikuti</Text>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="kiriman">
        <TabsList>
          <TabsTrigger value="kiriman">Kiriman</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="suka">Suka</TabsTrigger>
          <TabsTrigger value="aktivitas">Aktivitas</TabsTrigger>
        </TabsList>

        <TabsContent value="kiriman" className="grid gap-4">
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

        <TabsContent value="suka" className="text-body-sm text-fg-secondary">
          <p>Kiriman yang disukai bersifat pribadi di layar contoh ini.</p>
        </TabsContent>

        <TabsContent value="aktivitas">
          <Card>
            <CardBody>
              <Chart label={`Kiriman ${person.name} per bulan, dua belas bulan terakhir`}>
                <BarChart data={postsPerMonth} series={2} />
                <ChartCaption>
                  Angka-angka ini dibuat untuk contoh, bukan diukur dari mana pun.
                </ChartCaption>
              </Chart>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
