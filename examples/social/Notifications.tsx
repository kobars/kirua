import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ButtonGroup,
  CommentIcon,
  EmptyState,
  Heading,
  HeartIcon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  SparkleIcon,
  UserIcon,
} from 'kirua';
import { initials, notices, people, type Notice } from './data';

const ICON = {
  like: HeartIcon,
  comment: CommentIcon,
  follow: UserIcon,
  mention: SparkleIcon,
};

const WORDING = {
  like: 'liked your post',
  comment: 'replied to your post',
  follow: 'started following you',
  mention: 'mentioned you',
};

type Tab = 'all' | 'unread';

export function Notifications() {
  const [tab, setTab] = useState<Tab>('all');
  const [read, setRead] = useState<string[]>([]);

  const isUnread = (notice: Notice) => Boolean(notice.unread) && !read.includes(notice.id);
  const shown = notices.filter((notice) => tab === 'all' || isUnread(notice));
  const unread = notices.filter(isUnread).length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading as="h1" size="heading-sm">
          Notifications{' '}
          {unread > 0 && (
            <Badge status="info" className="ms-1">
              {unread} new
            </Badge>
          )}
        </Heading>
        <ButtonGroup aria-label="Filter notifications">
          {(['all', 'unread'] as const).map((value) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
              className={tab === value ? 'bg-selected text-on-selected' : undefined}
            >
              {value === 'all' ? 'All' : 'Unread'}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<SparkleIcon size="2xl" />}
          title="Everything is read"
          description="No new notifications for you."
          action={
            <Button variant="secondary" onClick={() => setTab('all')}>
              Show all
            </Button>
          }
        />
      ) : (
        <ItemGroup variant="outlined">
          {shown.map((notice, index) => {
            const person = people[notice.handle];
            const Icon = ICON[notice.kind];
            return (
              <div key={notice.id}>
                {index > 0 && <ItemSeparator />}
                <Item
                  interactive
                  className={isUnread(notice) ? 'bg-brand-subtle' : undefined}
                  onClick={() => setRead((all) => [...all, notice.id])}
                >
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarFallback>{initials(person?.name ?? notice.handle)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {person?.name ?? notice.handle} {WORDING[notice.kind]}
                    </ItemTitle>
                    <ItemDescription>{notice.body ?? `${notice.when} lalu`}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Icon aria-hidden="true" className="text-fg-muted" />
                  </ItemActions>
                </Item>
              </div>
            );
          })}
        </ItemGroup>
      )}
    </div>
  );
}
