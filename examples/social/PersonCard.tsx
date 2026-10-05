import { useState, type ReactNode } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Inline,
  Link,
  Split,
  Stack,
  Text,
} from '@kobars/kirua';
import { compactCount, initials, people, type Person } from './data';

export interface FollowCountsProps {
  person: Person;
  /** Further facts after the two counts, such as when the person joined. */
  children?: ReactNode;
}

/** Followers and following, each figure as loud as a label and tabular. */
export function FollowCounts({ person, children }: FollowCountsProps) {
  return (
    <Inline as="p" wrap gap={4}>
      <Text inline size="sm">
        <Text inline size="sm" weight="semibold" tone="primary" numeric>
          {compactCount(person.followers)}
        </Text>{' '}
        followers
      </Text>
      <Text inline size="sm">
        <Text inline size="sm" weight="semibold" tone="primary" numeric>
          {compactCount(person.following)}
        </Text>{' '}
        following
      </Text>
      {children}
    </Inline>
  );
}

export interface PersonLinkProps {
  handle: string;
}

/**
 * A profile preview on hover — and the trigger is a real link, because a hover
 * card never opens on focus or on touch. For a keyboard user and for everyone
 * on a phone, the link IS the feature.
 */
export function PersonLink({ handle }: PersonLinkProps) {
  const [following, setFollowing] = useState(false);
  const person = people[handle];
  if (!person) return null;

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Link href={`#/social/profile/${handle}`} variant="block">
          <Text inline size="sm" weight="semibold" tone="primary">
            {person.name}
          </Text>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <Stack gap={3}>
          <Split layout="fit-start" from="base" gap={3} align="center">
            <Avatar size="lg">
              {person.photo && <AvatarImage src={person.photo} alt="" />}
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <Stack gap={0}>
              <Text weight="semibold" tone="primary" truncate>
                {person.name}
              </Text>
              <Text size="sm" tone="muted" truncate>
                @{person.handle}
              </Text>
            </Stack>
          </Split>
          <Text size="sm" wrap="pretty">
            {person.bio}
          </Text>
          <FollowCounts person={person} />
          <Button
            size="sm"
            fullWidth
            aria-pressed={following}
            onClick={() => setFollowing(!following)}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
        </Stack>
      </HoverCardContent>
    </HoverCard>
  );
}
