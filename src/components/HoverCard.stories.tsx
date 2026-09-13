import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarFallback } from './Avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

const meta = {
  tags: ['autodocs'],
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    docs: {
      description: {
        component:
          'Supplemental information shown on pointer hover. Keep essential content reachable through the trigger link because hover is unavailable to some users and devices.',
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Card = () => (
  <div className="flex gap-3">
    <Avatar size="lg">
      <AvatarFallback>RN</AvatarFallback>
    </Avatar>
    <div className="min-w-0">
      <p className="text-body-md font-semibold text-fg">Rin Nakamura</p>
      <p className="text-body-sm text-fg-secondary">Draws chibi. Teaches Tuesdays.</p>
      <p className="mt-2 text-caption text-fg-muted">Joined March 2024</p>
    </div>
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <p className="text-body-md text-fg">
      Posted by{' '}
      <HoverCard {...args} openDelay={100}>
        <HoverCardTrigger asChild>
          <a href="#rin" className="font-medium text-fg-accent underline">
            @rin
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <Card />
        </HoverCardContent>
      </HoverCard>{' '}
      three hours ago.
    </p>
  ),
};

export const Open: Story = {
  render: (args) => (
    <div className="pb-56">
      <HoverCard {...args} open>
        <HoverCardTrigger asChild>
          <a href="#rin" className="font-medium text-fg-accent underline">
            @rin
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <Card />
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const TheTriggerWorksWithoutTheCard: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <a href="#rin" className="font-medium text-fg-accent underline">
          @rin
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <Card />
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('link', { name: '@rin' });

    await expect(trigger).toHaveAttribute('href', '#rin');
    await expect(document.querySelector('[data-slot="hover-card-content"]')).toBeNull();
  },
};
