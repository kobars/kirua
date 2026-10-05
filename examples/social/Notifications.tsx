import { Fragment, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  CommentIcon,
  EmptyState,
  HeartIcon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  PageHeader,
  SparkleIcon,
  Stack,
  ToggleGroup,
  ToggleGroupItem,
  UserIcon,
  VisuallyHidden,
} from '@kobars/kirua';
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
    <Stack gap={4}>
      <PageHeader
        size="heading-sm"
        align="center"
        title={<>Notifications {unread > 0 && <Badge status="info">{unread} new</Badge>}</>}
        actions={
          <ToggleGroup
            type="single"
            value={tab}
            onValueChange={(next) => (next === 'all' || next === 'unread') && setTab(next)}
            aria-label="Filter notifications"
          >
            <ToggleGroupItem value="all" size="sm" variant="outline">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="unread" size="sm" variant="outline">
              Unread
            </ToggleGroupItem>
          </ToggleGroup>
        }
      />

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
              <Fragment key={notice.id}>
                {index > 0 && <ItemSeparator />}
                <Item
                  interactive
                  variant={isUnread(notice) ? 'accent' : 'plain'}
                  onClick={() => setRead((all) => [...all, notice.id])}
                >
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarFallback>{initials(person?.name ?? notice.handle)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {isUnread(notice) && <VisuallyHidden>Unread: </VisuallyHidden>}
                      {person?.name ?? notice.handle} {WORDING[notice.kind]}
                    </ItemTitle>
                    <ItemDescription>{notice.body ?? `${notice.when} ago`}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Icon aria-hidden="true" tone="muted" />
                  </ItemActions>
                </Item>
              </Fragment>
            );
          })}
        </ItemGroup>
      )}
    </Stack>
  );
}
