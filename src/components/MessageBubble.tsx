import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { messageBubbleVariants } from './MessageBubble.variants';

export type MessageBubbleProps<T extends 'div' | 'li' = 'div'> = Omit<ComponentProps<T>, 'as'> &
  VariantProps<typeof messageBubbleVariants> & {
    /** `li` when the conversation is a list — a `Stack as="ul"`. */
    as?: T;
  };

/**
 * A message, on the side of whoever sent it.
 *
 * The side and the shape say who is speaking to anyone looking. They say
 * nothing to a screen reader, so a conversation that does not name its
 * speakers in text needs a `VisuallyHidden` name or heading per message.
 *
 * @example
 * <Stack as="ul" gap={2}>
 *   {messages.map((message) => (
 *     <MessageBubble as="li" key={message.id} from={message.mine ? 'self' : 'other'} size="sm">
 *       {message.text}
 *     </MessageBubble>
 *   ))}
 * </Stack>
 */
export function MessageBubble<T extends 'div' | 'li' = 'div'>({
  as,
  from,
  size,
  className,
  ...props
}: MessageBubbleProps<T>) {
  // One concrete element type for the checker; `as` is constrained to the union above.
  const Comp = (as ?? 'div') as 'div';
  return (
    <Comp
      data-slot="message-bubble"
      data-from={from ?? 'other'}
      className={cn(messageBubbleVariants({ from, size }), className)}
      {...(props as ComponentProps<'div'>)}
    />
  );
}
