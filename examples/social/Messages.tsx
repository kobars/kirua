import { useState } from 'react';
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
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  SendIcon,
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
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Record<string, string[]>>({});

  const open = threads.find((thread) => thread.id === openId) ?? threads[0];

  const list = (
    <ItemGroup>
      {threads.map((thread, index) => {
        const person = people[thread.handle];
        const last = thread.messages[thread.messages.length - 1];
        return (
          <div key={thread.id}>
            {index > 0 && <ItemSeparator />}
            <Item
              interactive
              size="sm"
              aria-current={thread.id === openId ? 'true' : undefined}
              className={thread.id === openId ? 'bg-selected text-on-selected' : undefined}
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
          </div>
        );
      })}
    </ItemGroup>
  );

  const conversation = open && (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line-subtle p-3">
        <IconButton
          aria-label="Back to the list"
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setOpenId('')}
        >
          <ChevronStartIcon />
        </IconButton>
        <Avatar size="sm">
          <AvatarFallback>{initials(people[open.handle]?.name ?? open.handle)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-fg">{people[open.handle]?.name ?? open.handle}</span>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
        {[
          ...open.messages,
          ...(sent[open.id] ?? []).map((text) => ({ from: 'me' as const, at: 'Now', text })),
        ].map((message, index) => (
          <li
            key={`${message.at}-${index}`}
            className={message.from === 'me' ? 'flex justify-end' : 'flex justify-start'}
          >
            <span
              className={[
                'max-w-[80%] rounded-lg px-3 py-2 text-body-sm',
                // `ctx-brand` is what makes the text legible on a brand fill, and
                // it is the recipe `Card`'s own brand variant uses. `text-on-primary`
                // belongs to the *action* family, not the surface family: under
                // `.dark` it inverts to near-black while `bg-brand` stays a dark
                // blue, so the pair reads only in light mode.
                message.from === 'me' ? 'ctx-brand bg-brand text-fg' : 'bg-sunken text-fg',
              ].join(' ')}
            >
              {message.text}
            </span>
          </li>
        ))}
      </ul>

      <form
        className="border-t border-line-subtle p-3"
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
              className="-me-1.5"
              disabled={draft.trim() === ''}
            >
              <SendIcon />
            </IconButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <Heading as="h1" size="heading-sm">
        Messages
      </Heading>

      {/* Phone: one pane at a time, chosen by whether a thread is open. */}
      <Card className="overflow-hidden md:hidden">{openId === '' ? list : conversation}</Card>

      <Card className="hidden h-128 overflow-hidden md:block">
        <ResizableGroup orientation="horizontal">
          <ResizablePanel defaultSize="34" minSize="24" className="overflow-y-auto">
            {list}
          </ResizablePanel>
          <ResizableHandle withGrip />
          <ResizablePanel>{conversation}</ResizablePanel>
        </ResizableGroup>
      </Card>

      {openId === '' && (
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setOpenId(threads[0]?.id ?? '')}
        >
          Open the first conversation
        </Button>
      )}
    </div>
  );
}
