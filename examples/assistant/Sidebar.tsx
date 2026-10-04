import { Fragment, useMemo, useState } from 'react';
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
  Inline,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  Text,
  type SidebarProps,
} from 'kirua';
import { allConversations, type Conversation } from './data';

export interface ConversationSidebarProps {
  /** `plain` inside the drawer, whose own panel already draws the edge. */
  variant?: SidebarProps['variant'];
  current: string;
  onPick: (id: string) => void;
  onSearch: () => void;
  /** Asked before anything disappears; the shell owns the dialog. */
  onDelete: (id: string) => void;
  hidden: string[];
}

/**
 * The conversation list. Rendered in the rail from `md` up and inside a
 * `Sheet` below it.
 *
 * The rows are the design system's sidebar menu rather than hand-rolled
 * anchors, which is what makes `aria-current="page"` — the part a screen reader
 * announces — arrive with the highlight instead of beside it.
 */
export function ConversationSidebar({
  variant,
  current,
  onPick,
  onSearch,
  onDelete,
  hidden,
}: ConversationSidebarProps) {
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
    // The drawer is narrower than the wide rail, so there it takes the default width.
    <Sidebar collapsible="none" variant={variant} width={variant === 'plain' ? 'md' : 'lg'}>
      {/* New chat, the filter and search stay put while the list scrolls. */}
      <SidebarHeader size="auto">
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
                onClick={() => setQuery('')}
              >
                <CloseIcon />
              </IconButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Button variant="ghost" fullWidth justify="between" onClick={onSearch}>
          <Inline as="span" gap={2}>
            <SearchIcon />
            Search everything
          </Inline>
          <Inline as="span" gap={1}>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </Inline>
        </Button>
        <Separator />
      </SidebarHeader>

      <SidebarContent aria-label="Conversation list">
        {Object.entries(grouped).length === 0 ? (
          <Text size="sm">Nothing matches “{query}”.</Text>
        ) : (
          Object.entries(grouped).map(([when, items]) => (
            <SidebarGroup key={when}>
              <SidebarGroupLabel>{when}</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <SidebarMenuButton asChild isActive={conversation.id === current}>
                          <a
                            href={`#/assistant/${conversation.id}`}
                            onClick={() => onPick(conversation.id)}
                          >
                            <SidebarLabel>{conversation.title}</SidebarLabel>
                          </a>
                        </SidebarMenuButton>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        {commands(conversation).map((command, index) => (
                          <Fragment key={command.label}>
                            {command.destructive && index > 0 && <ContextMenuSeparator />}
                            <ContextMenuItem onSelect={command.run}>
                              {command.label}
                              {command.shortcut && (
                                <ContextMenuShortcut>{command.shortcut}</ContextMenuShortcut>
                              )}
                            </ContextMenuItem>
                          </Fragment>
                        ))}
                      </ContextMenuContent>
                    </ContextMenu>
                    <SidebarMenuAction>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            aria-label={`Actions for ${conversation.title}`}
                            size="sm"
                            variant="ghost"
                          >
                            <MoreIcon />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {commands(conversation).map((command, index) => (
                            <Fragment key={command.label}>
                              {command.destructive && index > 0 && <DropdownMenuSeparator />}
                              <DropdownMenuItem onSelect={command.run}>
                                {command.label}
                              </DropdownMenuItem>
                            </Fragment>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      <SidebarFooter>
        <Inline gap={3}>
          <Avatar size="sm">
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>
          <Text inline size="sm" truncate>
            Kobar Sumarsono
          </Text>
        </Inline>
      </SidebarFooter>
    </Sidebar>
  );
}
