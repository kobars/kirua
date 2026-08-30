import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardBody,
  CloseIcon,
  EmptyState,
  Heading,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  SearchIcon,
  Text,
} from 'kirua';
import { compactCount, initials, people, posts, topics } from './data';

export interface ExploreProps {
  onOpen: (handle: string) => void;
}

/** People and posts, searchable, grouped by topic. */
export function Explore({ onOpen }: ExploreProps) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string | null>(null);

  const handles = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inTopic = topic
      ? (topics.find((t) => t.id === topic)?.handles ?? [])
      : Object.keys(people);
    return inTopic.filter((handle) => {
      const person = people[handle];
      if (!person) return false;
      return (
        q === '' ||
        person.name.toLowerCase().includes(q) ||
        person.handle.toLowerCase().includes(q) ||
        person.bio.toLowerCase().includes(q)
      );
    });
  }, [query, topic]);

  const matchingPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return [];
    return posts.filter((post) => post.text.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <Heading as="h1" size="heading-sm">
        Jelajah
      </Heading>

      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          aria-label="Cari orang atau kiriman"
          placeholder="Cari orang atau kiriman"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query !== '' && (
          <InputGroupAddon>
            <IconButton
              aria-label="Hapus pencarian"
              size="sm"
              variant="ghost"
              className="-me-1.5"
              onClick={() => setQuery('')}
            >
              <CloseIcon />
            </IconButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <ul className="flex flex-wrap gap-2">
        {topics.map((item) => (
          <li key={item.id}>
            <Button
              variant={topic === item.id ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={topic === item.id}
              onClick={() => setTopic(topic === item.id ? null : item.id)}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>

      {handles.length === 0 && matchingPosts.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="Tidak ada yang cocok"
          description="Coba kata lain, atau lepas topiknya."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setTopic(null);
              }}
            >
              Tampilkan semua
            </Button>
          }
        />
      ) : (
        <>
          <ItemGroup className="rounded-lg border border-line-subtle">
            {handles.map((handle, index) => {
              const person = people[handle];
              if (!person) return null;
              return (
                <div key={handle}>
                  {index > 0 && <ItemSeparator />}
                  <Item interactive onClick={() => onOpen(handle)}>
                    <ItemMedia>
                      <Avatar size="sm">
                        <AvatarFallback>{initials(person.name)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{person.name}</ItemTitle>
                      <ItemDescription>{person.bio}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="text-caption text-fg-muted tabular-nums">
                      {compactCount(person.followers)}
                    </ItemActions>
                  </Item>
                </div>
              );
            })}
          </ItemGroup>

          {matchingPosts.length > 0 && (
            <section className="grid gap-3">
              <Heading as="h2" size="body-md">
                Kiriman
              </Heading>
              {matchingPosts.map((post) => (
                <Card key={post.id}>
                  <CardBody>
                    <Text size="sm">
                      {people[post.handle]?.name ?? post.handle} · {post.when}
                    </Text>
                    <Text tone="primary" className="mt-1 text-pretty">
                      {post.text}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
