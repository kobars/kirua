import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarFallback } from './Avatar';
import { Card } from './Card';
import { IconButton } from './IconButton';
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup';
import { SendIcon } from './icons';
import { MessageBubble } from './MessageBubble';
import { Pane, PaneBody, PaneFooter, PaneHeader } from './Pane';
import { Stack } from './Stack';
import { Text } from './Text';

const HEIGHTS = ['fill', 'screen', 'sm', 'md', 'lg'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Pane',
  component: Pane,
  args: { height: 'md' },
  argTypes: { height: { control: 'inline-radio', options: HEIGHTS } },
  parameters: {
    docs: {
      description: {
        component:
          'A column that fits a height and scrolls in the middle. Only PaneBody scrolls, so the header and the reply box stay on the screen.',
      },
    },
  },
} satisfies Meta<typeof Pane>;

export default meta;
type Story = StoryObj<typeof meta>;

const MESSAGES = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  mine: index % 3 === 0,
  text: index % 3 === 0 ? 'Sounds good, see you then.' : 'Are we still on for Thursday?',
}));

export const AThread: Story = {
  render: (args) => (
    <Card padding="none" clip data-testid="card">
      <Pane {...args} data-testid="pane">
        <PaneHeader>
          <Avatar size="sm">
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <Text inline weight="medium" tone="primary">
            Rin Kobayashi
          </Text>
        </PaneHeader>
        <PaneBody padding="sm" data-testid="body">
          <Stack as="ul" gap={2} aria-label="Messages">
            {MESSAGES.map((message) => (
              <MessageBubble
                as="li"
                key={message.id}
                from={message.mine ? 'self' : 'other'}
                size="sm"
              >
                {message.text}
              </MessageBubble>
            ))}
          </Stack>
        </PaneBody>
        <PaneFooter data-testid="footer">
          <InputGroup>
            <InputGroupInput aria-label="Reply to Rin" placeholder="Write a reply" />
            <InputGroupAddon>
              <IconButton aria-label="Send" size="sm" variant="ghost">
                <SendIcon />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        </PaneFooter>
      </Pane>
    </Card>
  ),
  /**
   * The pane keeps its height, the body is the part that scrolls, and the
   * footer stays inside the pane's box however long the thread is.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pane = canvas.getByTestId('pane');
    const footer = canvas.getByTestId('footer');
    const viewport = canvas
      .getByTestId('body')
      .querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;

    await expect(Math.round(pane.getBoundingClientRect().height)).toBe(512);
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await expect(Math.round(footer.getBoundingClientRect().bottom)).toBe(
      Math.round(pane.getBoundingClientRect().bottom),
    );
  },
};

export const Heights: Story = {
  render: () => (
    <div className="grid gap-4">
      {HEIGHTS.map((height) => (
        <div key={height} className={height === 'fill' ? 'h-40' : undefined}>
          <Pane height={height} data-testid={height} className="border border-line-subtle">
            <PaneHeader>
              <Text inline size="sm">
                height=&quot;{height}&quot;
              </Text>
            </PaneHeader>
            <PaneBody padding="sm">
              <Text size="sm">Body</Text>
            </PaneBody>
          </Pane>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = (step: string) =>
      Math.round(canvas.getByTestId(step).getBoundingClientRect().height);

    await expect(height('fill')).toBe(160);
    // No shell here, so `screen` is the whole viewport.
    await expect(height('screen')).toBe(window.innerHeight);
    await expect(height('sm')).toBe(384);
    await expect(height('md')).toBe(512);
    await expect(height('lg')).toBe(640);
  },
};
