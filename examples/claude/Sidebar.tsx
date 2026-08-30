import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  CloseIcon,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  MoreIcon,
  PlusIcon,
  ScrollArea,
  SearchIcon,
  Separator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Text,
} from 'kirua';
import { allConversations, type Conversation } from './data';

export interface SidebarProps {
  current: string;
  onPick: (id: string) => void;
  onSearch: () => void;
  /** Asked before anything disappears; the shell owns the dialog. */
  onDelete: (id: string) => void;
  hidden: string[];
}

/**
 * The conversation list. Rendered as a fixed column from `md` up and inside a
 * `Sheet` below it, so it takes no layout classes beyond filling its parent.
 *
 * The rows are the design system's sidebar menu rather than hand-rolled
 * anchors, which is what makes `aria-current="page"` — the part a screen reader
 * announces — arrive with the highlight instead of beside it.
 */
export function Sidebar({ current, onPick, onSearch, onDelete, hidden }: SidebarProps) {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kept = allConversations.filter(
      (c) => !hidden.includes(c.id) && (q === '' || c.title.toLowerCase().includes(q)),
    );
    return kept.reduce<Record<string, Conversation[]>>((acc, c) => {
      (acc[c.when] ??= []).push(c);
      return acc;
    }, {});
  }, [query, hidden]);

  /**
   * One list, rendered twice: once as the right-click menu and once behind the
   * button at the end of the row. The right-click is a shortcut, never the only
   * way in — it has no keyboard equivalent and none at all on a touch screen.
   */
  const commands = (conversation: Conversation) => [
    { label: 'Rename', shortcut: '⌘R', run: () => undefined },
    { label: 'Duplicate', shortcut: undefined, run: () => undefined },
    {
      label: 'Delete',
      shortcut: undefined,
      destructive: true,
      run: () => onDelete(conversation.id),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <Button
        fullWidth
        leadingIcon={<PlusIcon />}
        onClick={() => onPick(allConversations[0]!.id)}
      >
        New chat
      </Button>

      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          aria-label="Filter conversations"
          placeholder="Filter conversations"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query !== '' && (
          <InputGroupAddon>
            <IconButton
              aria-label="Clear filter"
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

      <Button variant="ghost" fullWidth className="justify-between" onClick={onSearch}>
        <span className="flex items-center gap-2">
          <SearchIcon />
          Search everything
        </span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Conversations" className="grid gap-4 pe-2">
          {Object.entries(grouped).length === 0 ? (
            <Text size="sm" className="px-3">
              Nothing matches “{query}”.
            </Text>
          ) : (
            Object.entries(grouped).map(([when, items]) => (
              <SidebarGroup key={when}>
                <SidebarGroupLabel className="uppercase">{when}</SidebarGroupLabel>
                <SidebarMenu>
                  {items.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <SidebarMenuButton asChild isActive={conversation.id === current}>
                            <a
                              href={`#/${conversation.id}`}
                              onClick={() => onPick(conversation.id)}
                            >
                              <SidebarLabel>{conversation.title}</SidebarLabel>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <IconButton
                                    aria-label={`Actions for ${conversation.title}`}
                                    size="sm"
                                    variant="ghost"
                                    className="ms-auto -me-1"
                                    onClick={(event) => event.preventDefault()}
                                  >
                                    <MoreIcon />
                                  </IconButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {commands(conversation).map((command, index) => (
                                    <div key={command.label}>
                                      {command.destructive && index > 0 && (
                                        <DropdownMenuSeparator />
                                      )}
                                      <DropdownMenuItem onSelect={command.run}>
                                        {command.label}
                                      </DropdownMenuItem>
                                    </div>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </a>
                          </SidebarMenuButton>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {commands(conversation).map((command, index) => (
                            <div key={command.label}>
                              {command.destructive && index > 0 && <ContextMenuSeparator />}
                              <ContextMenuItem onSelect={command.run}>
                                {command.label}
                                {command.shortcut && (
                                  <ContextMenuShortcut>{command.shortcut}</ContextMenuShortcut>
                                )}
                              </ContextMenuItem>
                            </div>
                          ))}
                        </ContextMenuContent>
                      </ContextMenu>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))
          )}
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
