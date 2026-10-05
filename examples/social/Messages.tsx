import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  ChevronStartIcon,
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
  MessageBubble,
  Pane,
  PaneBody,
  PaneFooter,
  PaneHeader,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  SendIcon,
  Stack,
  Text,
  Visible,
} from 'kirua';
import { initials, people, threads } from './data';

/**
 * A two-pane inbox on a wide screen, one pane at a time on a phone.
 *
 * The split is a `ResizableGroup`, and it is deliberately not rendered below
 * `md`: a draggable divider needs two panes worth of room, and at 375 pixels
 * there is barely one.
 */
export function Messages() {
  const [openId, setOpenId] = useState(threads[0]?.id ?? '');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const root = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState<Record<string, string[]>>({});

  const open = threads.find((thread) => thread.id === openId) ?? threads[0];

  const draft = drafts[open?.id ?? ''] ?? '';
  const setDraft = (value: string) => {
    if (open) setDrafts((all) => ({ ...all, [open.id]: value }));
  };
  useEffect(() => {
    // Only a transcript follows the newest message; any other scroll area on
    // the screen stays where the reader left it.
    root.current
      ?.querySelectorAll('[data-transcript] [data-slot="scroll-area-viewport"]')
      .forEach((viewport) => {
        viewport.scrollTop = viewport.scrollHeight;
      });
  }, [openId, sent]);

  const list = (
    <Pane height="fill">
      <PaneBody>
        <ItemGroup variant="flush">
          {threads.map((thread, index) => {
            const person = people[thread.handle];
            const last = thread.messages[thread.messages.length - 1];
            return (
              <Fragment key={thread.id}>
                {index > 0 && <ItemSeparator />}
                <Item
                  interactive
                  size="sm"
                  aria-current={thread.id === openId ? 'true' : undefined}
                  onClick={() => setOpenId(thread.id)}
                >
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarFallback>{initials(person?.name ?? thread.handle)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{person?.name ?? thread.handle}</ItemTitle>
                    <ItemDescription>{last?.text}</ItemDescription>
                  </ItemContent>
                  {thread.unread > 0 && (
                    <ItemActions>
                      <Badge status="info">{thread.unread}</Badge>
                    </ItemActions>
                  )}
                </Item>
              </Fragment>
            );
          })}
        </ItemGroup>
      </PaneBody>
    </Pane>
  );

  const conversation = open && (
    <Pane height="fill">
      <PaneHeader>
        <Visible below="md">
          <IconButton
            aria-label="Back to the list"
            variant="ghost"
            size="sm"
            onClick={() => setOpenId('')}
          >
            <ChevronStartIcon />
          </IconButton>
        </Visible>
        <Avatar size="sm">
          <AvatarFallback>{initials(people[open.handle]?.name ?? open.handle)}</AvatarFallback>
        </Avatar>
        <Text inline weight="medium" tone="primary" truncate>
          {people[open.handle]?.name ?? open.handle}
        </Text>
      </PaneHeader>

      <PaneBody padding="sm" data-transcript="">
        <Stack as="ul" gap={2}>
          {[
            ...open.messages,
            ...(sent[open.id] ?? []).map((text) => ({ from: 'me' as const, at: 'Now', text })),
          ].map((message, index) => (
            <MessageBubble
              as="li"
              size="sm"
              key={`${message.at}-${index}`}
              from={message.from === 'me' ? 'self' : 'other'}
            >
              {message.text}
            </MessageBubble>
          ))}
        </Stack>
      </PaneBody>

      <PaneFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim() === '') return;
            setSent((all) => ({ ...all, [open.id]: [...(all[open.id] ?? []), draft.trim()] }));
            setDraft('');
          }}
        >
          <InputGroup>
            <InputGroupInput
              value={draft}
              aria-label={`Reply to ${people[open.handle]?.name ?? open.handle}`}
              placeholder="Write a reply"
              onChange={(event) => setDraft(event.target.value)}
            />
            <InputGroupAddon>
              <IconButton
                aria-label="Send"
                type="submit"
                size="sm"
                variant="ghost"
                // Focusable while empty: the submit handler already ignores an
                // empty draft, and a disabled button would drop focus after a send.
                aria-disabled={draft.trim() === '' || undefined}
              >
                <SendIcon />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </PaneFooter>
    </Pane>
  );

  return (
    <Stack ref={root} gap={4}>
      <Heading as="h1" size="heading-sm">
        Messages
      </Heading>

      {/* Phone: one pane at a time, chosen by whether a thread is open. */}
      <Visible below="md">
        <Card padding="none" clip>
          <Pane height="md">{openId === '' ? list : conversation}</Pane>
        </Card>
      </Visible>

      <Visible from="md">
        <Card padding="none" clip>
          <Pane height="md">
            <ResizableGroup orientation="horizontal">
              <ResizablePanel defaultSize="34" minSize="24">
                {list}
              </ResizablePanel>
              <ResizableHandle withGrip />
              <ResizablePanel>{conversation}</ResizablePanel>
            </ResizableGroup>
          </Pane>
        </Card>
      </Visible>

      {openId === '' && (
        <Visible below="md">
          <Button variant="ghost" onClick={() => setOpenId(threads[0]?.id ?? '')}>
            Open the first conversation
          </Button>
        </Visible>
      )}
    </Stack>
  );
}
