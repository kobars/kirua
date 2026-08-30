import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  BookmarkIcon,
  Card,
  CommentIcon,
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

export function PostCard({ post, onDelete, surface = 'netral' }: PostCardProps) {
  const person = people[post.handle];
  if (!person) return null;

  const look = SURFACE_PROPS[surface];

  const card = (
    <Card variant={look.variant} className={cn('grid gap-3 p-4', look.className)}>
      <header className="flex items-start gap-3">
        <Avatar size="md">
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
              aria-label={`Opsi untuk kiriman ${person.name}`}
              variant="ghost"
              size="sm"
            >
              <MoreIcon />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Salin tautan</DropdownMenuItem>
            <DropdownMenuItem>Sematkan</DropdownMenuItem>
            <DropdownMenuItem>Laporkan</DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger-fg" onSelect={() => onDelete(post.id)}>
                  Hapus kiriman
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Text tone="primary" className="text-pretty">
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
          defaultPressed={post.liked ?? false}
          aria-label={`Suka kiriman ${person.name}`}
        >
          <HeartIcon />
          <span className="tabular-nums">{compactCount(post.likes)}</span>
        </Toggle>
        <IconButton aria-label={`${post.comments} komentar`} variant="ghost" size="sm">
          <CommentIcon />
        </IconButton>
        <span className="text-body-sm text-fg-secondary tabular-nums">
          {compactCount(post.comments)}
        </span>
        <span className="flex-1" />
        <IconButton aria-label="Bagikan" variant="ghost" size="sm">
          <ShareIcon />
        </IconButton>
        <Toggle size="sm" aria-label="Simpan">
          <BookmarkIcon />
        </Toggle>
      </footer>
    </Card>
  );

  /**
   * The right-click menu repeats what the card's own "more" button already
   * offers. It is a shortcut for a mouse and never the only way in — a
   * right-click has no keyboard equivalent and none at all on a touch screen.
   */
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{card}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Salin tautan
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Sematkan</ContextMenuItem>
        <ContextMenuItem>Laporkan</ContextMenuItem>
        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-danger-fg" onSelect={() => onDelete(post.id)}>
              Hapus kiriman
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
