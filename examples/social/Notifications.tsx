import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ButtonGroup,
  EmptyState,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  HeartIcon,
  CommentIcon,
  UserIcon,
  SparkleIcon,
} from 'kirua';
import { initials, notices, people, type Notice } from './data';

const ICON = {
  suka: HeartIcon,
  komentar: CommentIcon,
  ikuti: UserIcon,
  sebut: SparkleIcon,
};

const WORDING = {
  suka: 'menyukai kirimanmu',
  komentar: 'membalas kirimanmu',
  ikuti: 'mulai mengikutimu',
  sebut: 'menyebutmu',
};

type Tab = 'semua' | 'belum';

export function Notifications() {
  const [tab, setTab] = useState<Tab>('semua');
  const [read, setRead] = useState<string[]>([]);

  const isUnread = (notice: Notice) => Boolean(notice.unread) && !read.includes(notice.id);
  const shown = notices.filter((notice) => tab === 'semua' || isUnread(notice));
  const unread = notices.filter(isUnread).length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-sm font-semibold text-fg">
          Notifikasi{' '}
          {unread > 0 && (
            <Badge status="info" className="ms-1">
              {unread} baru
            </Badge>
          )}
        </h1>
        <ButtonGroup aria-label="Saring notifikasi">
          {(['semua', 'belum'] as const).map((value) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
              className={tab === value ? 'bg-selected text-on-selected' : undefined}
            >
              {value === 'semua' ? 'Semua' : 'Belum dibaca'}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<SparkleIcon size="2xl" />}
          title="Semua sudah dibaca"
          description="Tidak ada notifikasi baru untuk kamu."
          action={
            <Button variant="secondary" onClick={() => setTab('semua')}>
              Lihat semua
            </Button>
          }
        />
      ) : (
        <ItemGroup className="rounded-lg border border-line-subtle">
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
