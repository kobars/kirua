import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Link,
  Text,
} from 'kirua';
import { compactCount, initials, people } from './data';

export interface PersonLinkProps {
  handle: string;
}

/**
 * A profile preview on hover — and the trigger is a real link, because a hover
 * card never opens on focus or on touch. For a keyboard user and for everyone
 * on a phone, the link IS the feature.
 */
export function PersonLink({ handle }: PersonLinkProps) {
  const person = people[handle];
  if (!person) return null;

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Link href={`#/profil/${handle}`} variant="block" className="font-semibold text-fg">
          {person.name}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {person.photo && <AvatarImage src={person.photo} alt="" />}
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-body-md font-semibold text-fg">{person.name}</p>
              <p className="truncate text-body-sm text-fg-muted">@{person.handle}</p>
            </div>
          </div>
          <Text size="sm" className="text-pretty">
            {person.bio}
          </Text>
          <p className="flex gap-4 text-body-sm text-fg-secondary">
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
          </p>
          <Button size="sm" fullWidth>
            Ikuti
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
