import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MessageBubble } from './MessageBubble';
import { Stack } from './Stack';

const meta = {
  tags: ['autodocs'],
  title: 'Components/MessageBubble',
  component: MessageBubble,
  args: { from: 'self', size: 'md', children: 'Can you summarise the meeting notes?' },
  argTypes: {
    from: { control: 'inline-radio', options: ['self', 'other'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A message on the side of whoever sent it. Side, fill and a squared corner all mark the speaker, so the difference survives forced colours.',
      },
    },
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AConversation: Story = {
  render: () => (
    <div dir="ltr" className="w-96" data-testid="frame">
      <Stack as="ul" gap={2} aria-label="Messages">
        <MessageBubble as="li" from="other" size="sm" data-testid="other">
          Are we still on for Thursday?
        </MessageBubble>
        <MessageBubble as="li" from="self" size="sm" data-testid="self">
          Yes — see you then.
        </MessageBubble>
      </Stack>
    </div>
  ),
  /**
   * Each message sits on its speaker's side and stays as short as its text,
   * and the corner squared at the bottom is on that same side.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame').getBoundingClientRect();
    const self = canvas.getByTestId('self');
    const other = canvas.getByTestId('other');

    await expect(self.tagName).toBe('LI');
    await expect(Math.round(self.getBoundingClientRect().right)).toBe(Math.round(frame.right));
    await expect(Math.round(other.getBoundingClientRect().left)).toBe(Math.round(frame.left));
    await expect(self.getBoundingClientRect().width).toBeLessThan(frame.width * 0.85);

    const corner = (element: HTMLElement, side: 'Left' | 'Right') =>
      parseFloat(getComputedStyle(element)[`borderBottom${side}Radius`]);
    await expect(corner(self, 'Right')).toBeLessThan(corner(self, 'Left'));
    await expect(corner(other, 'Left')).toBeLessThan(corner(other, 'Right'));
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={3}>
      <MessageBubble from="other" size="sm">
        A short reply in a compact thread.
      </MessageBubble>
      <MessageBubble from="self" size="md">
        A question in an assistant transcript, with more room around it.
      </MessageBubble>
    </Stack>
  ),
};
