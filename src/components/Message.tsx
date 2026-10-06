/* oxlint-disable jsx-a11y/no-redundant-roles --
 * `role="list"` on `MessageGroup` and `MessageReactions` is not redundant in
 * WebKit, which drops the implicit role from a list styled `list-style: none`.
 * File-level because oxlint ignores a next-line disable for a `jsx-a11y` rule. */
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { messageVariants } from './Message.variants';
import { messageAvatarVariants } from './MessageAvatar.variants';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * A run of turns in a conversation, as an ordered list.
 *
 * Ordered, because the order is the meaning: a reply read before its question
 * is a different conversation. A screen reader announces the list and its
 * length, and moves turn by turn. Every child is therefore a `Message`, which
 * renders a list item; a day break is a `Marker` *between* two groups rather
 * than an item inside one, so "Today" is not counted as a message.
 *
 * @example
 * <Marker variant="divider"><MarkerContent>Today</MarkerContent></Marker>
 * <MessageGroup>
 *   <Message from="other">…</Message>
 *   <Message from="self">…</Message>
 * </MessageGroup>
 */
export function MessageGroup({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="message-group"
      role="list"
      className={cn('grid grid-cols-[minmax(0,1fr)] gap-4', className)}
      {...props}
    />
  );
}

/** The elements one turn can honestly be. */
export type MessageElement = 'li' | 'div' | 'article';

export type MessageProps<T extends MessageElement = 'li'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof messageVariants> & {
    /**
     * `li` inside a `MessageGroup`, which is the default. `div` or `article`
     * for a turn shown on its own — a quoted message, a notification preview.
     */
    as?: T;
  };

/**
 * One sender's turn: an avatar, and a column holding a header, one or more
 * `MessageBubble`s, their reactions and a footer.
 *
 * `from` matches `MessageBubble`'s naming and sets the side: `self` at the end
 * of the line, `other` at the start, mirrored in a right-to-left page by
 * logical properties alone. Pass the same `from` to the bubbles inside — the
 * turn places the column, the bubble chooses its own fill and corner.
 *
 * A turn holds every consecutive bubble from one sender, so the avatar appears
 * once per turn by construction. There is no rule that hides a "repeated"
 * avatar: in a group conversation two neighbouring `other` turns can be two
 * different people, and nothing but the data can tell them apart.
 *
 * The side, the fill and the avatar say who is speaking to anyone looking, and
 * nothing to a screen reader. Name the speaker in `MessageHeader` — a visible
 * name for others, a `VisuallyHidden` "You" for yourself — and mark the avatar
 * `aria-hidden` when the header already says who it is.
 *
 * @example
 * <MessageGroup>
 *   <Message from="other">
 *     <MessageAvatar aria-hidden="true">
 *       <Avatar size="sm"><AvatarFallback>MK</AvatarFallback></Avatar>
 *     </MessageAvatar>
 *     <MessageContent>
 *       <MessageHeader>
 *         Maya Kusuma <time dateTime="09:15">09:15</time>
 *       </MessageHeader>
 *       <MessageBubble from="other" size="sm">The proofs came back today.</MessageBubble>
 *       <MessageReactions aria-label="Reactions">
 *         <MessageReaction label="Rin reacted with a thumbs up">👍 1</MessageReaction>
 *       </MessageReactions>
 *     </MessageContent>
 *   </Message>
 *   <Message from="self">
 *     <MessageContent>
 *       <MessageHeader>
 *         <VisuallyHidden>You</VisuallyHidden> <time dateTime="09:16">09:16</time>
 *       </MessageHeader>
 *       <MessageBubble from="self" size="sm">Send me a photo of page six.</MessageBubble>
 *       <MessageFooter>Seen</MessageFooter>
 *     </MessageContent>
 *   </Message>
 * </MessageGroup>
 */
export function Message<T extends MessageElement = 'li'>({
  as,
  from,
  className,
  ...props
}: MessageProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'li') as 'li';
  return (
    <Comp
      data-slot="message"
      data-from={from ?? 'other'}
      className={cn(messageVariants({ from }), className)}
      {...(props as ComponentProps<'li'>)}
    />
  );
}

export interface MessageAvatarProps
  extends ComponentProps<'div'>, VariantProps<typeof messageAvatarVariants> {}

/**
 * The slot an `Avatar` sits in, beside the column. Leave it out of a turn of
 * your own; a conversation does not need to show you your own face.
 *
 * @example
 * <MessageAvatar align="bottom" aria-hidden="true">
 *   <Avatar size="sm"><AvatarFallback>MK</AvatarFallback></Avatar>
 * </MessageAvatar>
 */
export function MessageAvatar({ align, className, ...props }: MessageAvatarProps) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(messageAvatarVariants({ align }), className)}
      {...props}
    />
  );
}

/**
 * The column of a turn. It takes the width beside the avatar and aligns its
 * children to the sender's side, so a short bubble stays short and a header
 * sits over the edge its bubbles start from.
 *
 * @example
 * <MessageContent>
 *   <MessageBubble from="other" size="sm">Are we still on for Thursday?</MessageBubble>
 * </MessageContent>
 */
export function MessageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-content"
      className={cn('flex min-w-0 flex-1 flex-col items-start gap-1', className)}
      {...props}
    />
  );
}

/**
 * Who sent the turn, and when, above its bubbles. Quiet on purpose: the
 * message is the content, the header is its caption. The `<time>` is yours to
 * write, with a `dateTime` a machine can read.
 *
 * @example
 * <MessageHeader>
 *   Maya Kusuma <time dateTime="09:15">09:15</time>
 * </MessageHeader>
 */
export function MessageHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        'flex flex-wrap items-baseline gap-x-2 px-3 font-text text-caption text-fg-secondary',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A status line under the turn — "Seen", "Delivered", "Edited". Text, not an
 * icon: two ticks mean nothing to a screen reader and little to anyone who has
 * not used the one messenger that draws them.
 *
 * @example <MessageFooter>Seen</MessageFooter>
 */
export function MessageFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        'flex flex-wrap items-center gap-x-2 px-3 font-text text-caption text-fg-secondary',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The reactions under a bubble, as a list. Place it straight after the
 * `MessageBubble` it reacts to; give it an `aria-label` such as "Reactions"
 * so the list says what it is.
 *
 * @example
 * <MessageReactions aria-label="Reactions">
 *   <MessageReaction label="2 people reacted with a thumbs up">👍 2</MessageReaction>
 * </MessageReactions>
 */
export function MessageReactions({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="message-reactions"
      role="list"
      className={cn('flex flex-wrap gap-1 px-2', className)}
      {...props}
    />
  );
}

export interface MessageReactionProps extends ComponentProps<'li'> {
  /**
   * What a screen reader hears in place of the emoji and the count — "Maya and
   * Rin reacted with a thumbs up". Required, because the visible pair reads as
   * "thumbs up sign 2", which says neither who nor what the number counts.
   */
  label: string;
}

/**
 * One reaction: an emoji and a count, read aloud as the sentence in `label`.
 *
 * The visible pair is `aria-hidden` and the label is `VisuallyHidden` beside
 * it, rather than an `aria-label` on the item: a list item's own name is
 * announced inconsistently across screen readers, and text in the item is
 * read by all of them. The count is primary text on a raised fill, a pair
 * measured above 4.5:1 in light mode and on every night: it is small text, and
 * the one figure in the row.
 *
 * Read-only. A reaction you can add or remove is a pressed state, which is a
 * `Toggle`, not this.
 *
 * @example <MessageReaction label="Sari reacted with a heart">❤️ 1</MessageReaction>
 */
export function MessageReaction({
  label,
  className,
  children,
  ...props
}: MessageReactionProps) {
  return (
    <li
      data-slot="message-reaction"
      className={cn(
        'relative inline-flex h-6 items-center rounded-pill border border-line-subtle bg-raised px-2 font-text text-caption font-medium text-fg tabular-nums [--icon-size:var(--icon-xs)]',
        className,
      )}
      {...props}
    >
      <span
        data-slot="message-reaction-content"
        aria-hidden="true"
        className="inline-flex items-center gap-1"
      >
        {children}
      </span>
      <VisuallyHidden>{label}</VisuallyHidden>
    </li>
  );
}
