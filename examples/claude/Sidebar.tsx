import {
  Avatar,
  AvatarFallback,
  Button,
  Kbd,
  ScrollArea,
  Separator,
  PlusIcon,
  SearchIcon,
} from 'kirua';
import { conversations } from './data';

export interface SidebarProps {
  current: string;
  onPick: (id: string) => void;
  onSearch: () => void;
}

/**
 * The conversation list. Rendered as a fixed column from `md` up and inside a
 * `Sheet` below it, so it takes no layout classes beyond filling its parent.
 */
export function Sidebar({ current, onPick, onSearch }: SidebarProps) {
  const grouped = conversations.reduce<Record<string, typeof conversations>>((acc, c) => {
    (acc[c.when] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <Button fullWidth leadingIcon={<PlusIcon />} onClick={() => onPick(conversations[0]!.id)}>
        New chat
      </Button>

      <Button variant="ghost" fullWidth className="justify-between" onClick={onSearch}>
        <span className="flex items-center gap-2">
          <SearchIcon />
          Search
        </span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Conversations" className="grid gap-4 pe-2">
          {Object.entries(grouped).map(([when, items]) => (
            <div key={when} className="grid gap-1">
              <h2 className="px-3 text-caption text-fg-muted uppercase">{when}</h2>
              {items.map((c) => (
                <a
                  key={c.id}
                  href={`#/${c.id}`}
                  aria-current={c.id === current ? 'page' : undefined}
                  className={[
                    'truncate rounded-md px-3 py-2 text-body-sm',
                    'transition-colors duration-fast ease-out',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    c.id === current
                      ? 'bg-selected font-medium text-on-selected'
                      : 'text-fg-secondary hover:bg-ghost-hover hover:text-fg',
                  ].join(' ')}
                >
                  {c.title}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="flex items-center gap-3 p-1">
        <Avatar size="sm">
          <AvatarFallback>KS</AvatarFallback>
        </Avatar>
        <span className="min-w-0 truncate text-body-sm text-fg-secondary">Kobar Sumarsono</span>
      </div>
    </div>
  );
}
