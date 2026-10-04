import { useState } from 'react';
import {
  AspectRatio,
  Button,
  Input,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  BookmarkIcon,
  Card,
  CommentIcon,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HeartIcon,
  IconButton,
  MoreIcon,
  Separator,
  ShareIcon,
  Text,
  Toggle,
} from 'kirua';
import { PersonLink } from './PersonCard';
import { SURFACE_PROPS, type CardSurface } from './experiment';
import { cn } from './cn';
import { compactCount, initials, people, type Post } from './data';

export interface PostCardProps {
  post: Post;
  /** Offered on the card's own menu. Omit it and the entry is not drawn. */
  onDelete?: (id: string) => void;
  /** TEMPORARY — see `experiment.tsx`. Remove with the experiment. */
  surface?: CardSurface | undefined;
}

/** How the replies under a post are ordered. Two answers, so a radio group. */
const REPLY_ORDERS = [
  { value: 'newest', label: 'Newest replies first' },
  { value: 'popular', label: 'Most liked replies first' },
];

export function PostCard({ post, onDelete, surface = 'neutral' }: PostCardProps) {
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(post.liked ?? false);
  const [pinned, setPinned] = useState(false);
  const [notice, setNotice] = useState('');
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState<string[]>([]);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${post.text}\n${location.origin}${location.pathname}#/profile/${post.handle}`,
      );
      setNotice('Post and profile link copied.');
    } catch {
      setNotice('Could not copy. Select the post text to copy it manually.');
    }
  };
  const report = () => setNotice('Report recorded for this demo session. Nothing was sent.');
  const [replyOrder, setReplyOrder] = useState('newest');
  const person = people[post.handle];
  if (!person) return null;

  const look = SURFACE_PROPS[surface];

  const card = (
    <Card variant={look.variant} className={cn('grid gap-3 p-4', look.className)}>
      <header className="flex items-start gap-3">
        <Avatar size="md">
          {/* Half the people here have a portrait and half do not, which is the
              only way to see that both halves of `Avatar` work. `alt=""` — the
              name is right beside it, and reading it twice helps nobody. */}
          {person.photo && <AvatarImage src={person.photo} alt="" />}
          <AvatarFallback>{initials(person.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 text-body-sm">
            <PersonLink handle={post.handle} />
            <span className="text-fg-muted">@{person.handle}</span>
            <span className="text-fg-muted">· {post.when}</span>
          </p>
        </div>
        {/* A menu of commands, so `DropdownMenu` rather than a `Popover` of
            buttons: a menu answers the arrow keys, jumps to an item by its
            first letter, closes on Escape, and reports itself as a `menu` of
            `menuitem`s. The same four commands are `ContextMenuItem`s at the
            bottom of this file for the right-click path, so the two paths share
            one keyboard model. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={`Options for ${person.name}’s post`}
              variant="ghost"
              size="sm"
            >
              <MoreIcon />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Grouped, because the three commands, the two settings and the
                destructive one are three different kinds of thing and a menu
                that does not say so is a list of six. */}
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => void copy()}>Copy post</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPinned(!pinned)}>
                {pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={report}>Report</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={muted} onCheckedChange={setMuted}>
              Mute @{person.handle}
            </DropdownMenuCheckboxItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger-fg" onSelect={() => onDelete(post.id)}>
                  Delete post
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {pinned && <Text size="sm">Pinned in this session</Text>}
      {muted && <Text size="sm">Muted in this session</Text>}
      <Text tone="primary" className="text-pretty wrap-anywhere">
        {post.text}
      </Text>

      {post.media && (
        // The box is reserved before the picture arrives, so the feed cannot
        // jump as posts load — once per post, which is the whole reason
        // AspectRatio exists.
        <AspectRatio ratio={post.media.ratio} className="rounded-md bg-sunken">
          <div className="grid size-full place-content-center px-6 text-center text-body-sm text-fg-muted">
            {post.media.caption}
          </div>
        </AspectRatio>
      )}

      <Separator />

      <footer className="flex flex-wrap items-center gap-1">
        <Toggle
          size="sm"
          pressed={liked}
          onPressedChange={setLiked}
          aria-label={`Like ${person.name}’s post`}
        >
          <HeartIcon />
          <span className="tabular-nums">
            {compactCount(post.likes + Number(liked) - Number(post.liked ?? false))}
          </span>
        </Toggle>
        <CollapsibleTrigger asChild>
          <IconButton aria-label="Reply to post" variant="ghost" size="sm">
            <CommentIcon />
          </IconButton>
        </CollapsibleTrigger>
        <span className="text-body-sm text-fg-secondary tabular-nums">
          {compactCount(post.comments + replies.length)}
        </span>
        <span className="flex-1" />
        <IconButton aria-label="Share" variant="ghost" size="sm" onClick={() => void copy()}>
          <ShareIcon />
        </IconButton>
        <Toggle size="sm" aria-label="Save">
          <BookmarkIcon />
        </Toggle>
      </footer>
      <CollapsibleContent className="grid gap-3">
        <Text size="sm">Replies added here stay in this demo session.</Text>
        {(replyOrder === 'newest' ? [...replies].reverse() : replies).map((text, index) => (
          <Text key={`${index}-${text}`} className="wrap-anywhere">
            {text}
          </Text>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!reply.trim()) return;
            setReplies((all) => [...all, reply.trim()]);
            setReply('');
          }}
        >
          <Input
            aria-label="Write a reply"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
          />
          <Button type="submit" size="sm" aria-disabled={!reply.trim() || undefined}>
            Reply
          </Button>
        </form>
      </CollapsibleContent>
      <output className="text-body-sm text-fg-secondary">{notice}</output>
    </Card>
  );

  /**
   * The right-click menu repeats what the card's own "more" button already
   * offers. It is a shortcut for a mouse and never the only way in — a
   * right-click has no keyboard equivalent and none at all on a touch screen.
   */
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Collapsible open={repliesOpen} onOpenChange={setRepliesOpen} asChild>
          {card}
        </Collapsible>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onSelect={() => void copy()}>Copy post</ContextMenuItem>
          <ContextMenuItem onSelect={() => setPinned(!pinned)}>
            {pinned ? 'Unpin' : 'Pin'}
          </ContextMenuItem>
          <ContextMenuItem onSelect={report}>Report</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={muted} onCheckedChange={setMuted}>
          Mute @{person.handle}
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        {/* The right-click path carries the same commands as the button menu
            above, so the two share one keyboard model. The reply order lives
            here as well for that reason. */}
        <ContextMenuRadioGroup value={replyOrder} onValueChange={setReplyOrder}>
          {REPLY_ORDERS.map((order) => (
            <ContextMenuRadioItem key={order.value} value={order.value}>
              {order.label}
            </ContextMenuRadioItem>
          ))}
        </ContextMenuRadioGroup>
        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-danger-fg" onSelect={() => onDelete(post.id)}>
              Delete post
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
