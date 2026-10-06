import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { contrastRatio, resolveColor } from '@/lib/contrast';
import { Avatar, AvatarFallback } from './Avatar';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageReaction,
  MessageReactions,
} from './Message';
import { MessageBubble } from './MessageBubble';
import { Text } from './Text';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Message',
  component: Message,
  args: { from: 'other' },
  argTypes: {
    from: { control: 'inline-radio', options: ['self', 'other'] },
    as: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'One sender’s turn in a conversation: an avatar, and a column of a header, MessageBubbles, reactions and a footer, on the sender’s side. MessageGroup is the ordered list of turns. Name the speaker in the header; the side and the fill say nothing to a screen reader.',
      },
    },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <MessageGroup>
        <Message {...args}>
          {args.from !== 'self' && (
            <MessageAvatar aria-hidden="true">
              <Avatar size="sm">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </MessageAvatar>
          )}
          <MessageContent>
            <MessageHeader>
              {args.from === 'self' ? <VisuallyHidden>You</VisuallyHidden> : 'Maya Kusuma'}
              <time dateTime="09:15">09:15</time>
            </MessageHeader>
            <MessageBubble from={args.from} size="sm">
              The proofs for your zine came back today.
            </MessageBubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  ),
};

/** The same thread, in whichever direction the frame is given. */
function Thread({ dir }: { dir: 'ltr' | 'rtl' }) {
  return (
    <div dir={dir} className="w-96" data-testid="frame">
      <MessageGroup>
        <Message from="other" data-testid="other">
          <MessageAvatar aria-hidden="true" data-testid="avatar">
            <Avatar size="sm">
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <Text inline size="caption" weight="medium" tone="secondary">
                Maya Kusuma
              </Text>
              <time dateTime="09:15">09:15</time>
            </MessageHeader>
            <MessageBubble from="other" size="sm">
              The proofs for your zine came back today.
            </MessageBubble>
            <MessageBubble from="other" size="sm">
              Page six prints much warmer than it looks on screen.
            </MessageBubble>
            <MessageReactions aria-label="Reactions">
              <MessageReaction label="You reacted with a thumbs up">👍 1</MessageReaction>
              <MessageReaction label="Rin and Agus reacted with a laugh">😂 2</MessageReaction>
            </MessageReactions>
          </MessageContent>
        </Message>
        <Message from="self" data-testid="self">
          <MessageContent>
            <MessageHeader data-testid="self-header">
              <VisuallyHidden>You</VisuallyHidden>
              <time dateTime="09:16">09:16</time>
            </MessageHeader>
            <MessageBubble from="self" size="sm">
              Send me a photo and I will adjust the file tonight.
            </MessageBubble>
            <MessageFooter>Seen</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  );
}

/** What is left for a screen reader once everything `aria-hidden` is gone. */
function spokenText(element: Element) {
  const copy = element.cloneNode(true) as Element;
  copy.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove());
  return copy.textContent?.trim() ?? '';
}

export const AThread: Story = {
  render: () => <Thread dir="ltr" />,
  /**
   * The two turns end up on opposite sides: the other person's at the start,
   * after the avatar, and yours at the end — bubble, header and footer all on
   * that edge. Each turn is a list item, and each reaction reads as the
   * sentence it was given rather than as an emoji and a number.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame').getBoundingClientRect();
    const self = canvas.getByTestId('self');
    const other = canvas.getByTestId('other');
    const avatar = canvas.getByTestId('avatar').getBoundingClientRect();
    const box = (root: HTMLElement, slot: string) =>
      root.querySelector(`[data-slot="${slot}"]`)!.getBoundingClientRect();

    const group = canvasElement.querySelector('[data-slot="message-group"]')!;
    await expect(group.tagName).toBe('OL');
    await expect([...group.children].map((turn) => turn.tagName)).toEqual(['LI', 'LI']);

    await expect(Math.round(avatar.left)).toBe(Math.round(frame.left));
    await expect(box(other, 'message-bubble').left).toBeGreaterThan(avatar.right);
    await expect(Math.round(box(self, 'message-bubble').right)).toBe(Math.round(frame.right));
    await expect(Math.round(box(self, 'message-footer').right)).toBe(Math.round(frame.right));
    await expect(Math.round(box(self, 'message-header').right)).toBe(Math.round(frame.right));

    // The header names the speaker in text for both turns.
    await expect(spokenText(canvas.getByTestId('self-header'))).toMatch(/^You/);
    await expect(canvas.getByText('Maya Kusuma')).toBeVisible();
    await expect(canvas.getByText('Seen')).toBeVisible();

    const reactions = within(canvas.getByRole('list', { name: 'Reactions' })).getAllByRole(
      'listitem',
    );
    await expect(reactions.map(spokenText)).toEqual([
      'You reacted with a thumbs up',
      'Rin and Agus reacted with a laugh',
    ]);
  },
};

export const RightToLeft: Story = {
  render: () => <Thread dir="rtl" />,
  /** The same thread mirrored: yours on the left, the avatar on the right. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame').getBoundingClientRect();
    const self = canvas.getByTestId('self').querySelector('[data-slot="message-bubble"]')!;
    const other = canvas.getByTestId('other').querySelector('[data-slot="message-bubble"]')!;
    const avatar = canvas.getByTestId('avatar').getBoundingClientRect();

    await expect(Math.round(self.getBoundingClientRect().left)).toBe(Math.round(frame.left));
    await expect(Math.round(avatar.right)).toBe(Math.round(frame.right));
    await expect(other.getBoundingClientRect().right).toBeLessThan(avatar.left);
  },
};

export const ReactionCountsAreReadable: Story = {
  render: () => <Thread dir="ltr" />,
  /**
   * A count is text, and small text at that: it has to clear 4.5:1 against
   * the reaction's own fill, measured from the shipped tokens in whichever
   * theme and night the story runs under.
   */
  play: async ({ canvasElement }) => {
    const reaction = canvasElement.querySelector('[data-slot="message-reaction"]')!;
    const style = getComputedStyle(reaction);
    const ratio = contrastRatio(resolveColor(style.color), resolveColor(style.backgroundColor));
    await expect(ratio).toBeGreaterThanOrEqual(4.5);
  },
};

export const AvatarAlignment: Story = {
  render: () => (
    <div className="w-96">
      <MessageGroup>
        {(['top', 'bottom'] as const).map((align) => (
          <Message key={align} from="other" data-testid={align}>
            <MessageAvatar align={align} aria-hidden="true">
              <Avatar size="sm">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>Maya Kusuma</MessageHeader>
              <MessageBubble from="other" size="sm">
                Avatar at the {align}.
              </MessageBubble>
              <MessageFooter>Delivered</MessageFooter>
            </MessageContent>
          </Message>
        ))}
      </MessageGroup>
    </div>
  ),
  /** `top` meets the turn's first line, `bottom` its last. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const edges = (align: string) => {
      const turn = canvas.getByTestId(align);
      return {
        turn: turn.getBoundingClientRect(),
        avatar: turn.querySelector('[data-slot="message-avatar"]')!.getBoundingClientRect(),
      };
    };
    const top = edges('top');
    const bottom = edges('bottom');
    await expect(Math.round(top.avatar.top)).toBe(Math.round(top.turn.top));
    await expect(Math.round(bottom.avatar.bottom)).toBe(Math.round(bottom.turn.bottom));
    await expect(bottom.avatar.top).toBeGreaterThan(bottom.turn.top);
  },
};
