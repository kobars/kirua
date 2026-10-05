import { Fragment, useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CloseIcon,
  EmptyState,
  Heading,
  IconButton,
  Inline,
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
  Stack,
  Text,
} from '@kobars/kirua';
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
    <Stack gap={4}>
      <Heading as="h1" size="heading-sm">
        Explore
      </Heading>

      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          aria-label="Search people or posts"
          placeholder="Search people or posts"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query !== '' && (
          <InputGroupAddon>
            <IconButton
              aria-label="Clear search"
              size="sm"
              variant="ghost"
              onClick={() => setQuery('')}
            >
              <CloseIcon />
            </IconButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <Inline as="ul" wrap gap={2}>
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
      </Inline>

      {handles.length === 0 && matchingPosts.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="Nothing matches"
          description="Try another word, or drop the topic."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setTopic(null);
              }}
            >
              Show everything
            </Button>
          }
        />
      ) : (
        <>
          <ItemGroup variant="outlined">
            {handles.map((handle, index) => {
              const person = people[handle];
              if (!person) return null;
              return (
                <Fragment key={handle}>
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
                    <ItemActions>
                      <Text inline size="caption" tone="muted" numeric>
                        {compactCount(person.followers)}
                      </Text>
                    </ItemActions>
                  </Item>
                </Fragment>
              );
            })}
          </ItemGroup>

          {matchingPosts.length > 0 && (
            <Stack as="section" gap={3}>
              <Heading as="h2" size="body-md">
                Posts
              </Heading>
              {matchingPosts.map((post) => (
                <Card key={post.id}>
                  <Stack gap={1}>
                    <Text size="sm">
                      {people[post.handle]?.name ?? post.handle} · {post.when}
                    </Text>
                    <Text tone="primary" wrap="pretty">
                      {post.text}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}
