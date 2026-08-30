import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  Card,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Toggle,
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  ShareIcon,
} from 'kirua';
import { PersonLink } from './PersonCard';
import { compactCount, initials, people, type Post } from './data';

export interface PostCardProps {
  post: Post;
  /** Offered on the card's own menu. Omit it and the entry is not drawn. */
  onDelete?: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const person = people[post.handle];
  if (!person) return null;

  const card = (
    <Card className="grid gap-3 p-4">
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
        <Popover>
          <PopoverTrigger asChild>
            <IconButton
              aria-label={`Opsi untuk kiriman ${person.name}`}
              variant="ghost"
              size="sm"
            >
              <MoreIcon />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent aria-label="Opsi kiriman" className="w-56 p-2">
            <div className="grid">
              {['Salin tautan', 'Sematkan', 'Laporkan'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-sm px-3 py-2 text-start text-body-sm text-fg hover:bg-ghost-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  {label}
                </button>
              ))}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(post.id)}
                  className="rounded-sm px-3 py-2 text-start text-body-sm text-danger-fg hover:bg-ghost-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  Hapus kiriman
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </header>

      <p className="text-body-md text-pretty text-fg">{post.text}</p>

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
            <ContextMenuItem onSelect={() => onDelete(post.id)}>Hapus kiriman</ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
