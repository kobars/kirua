import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { IconButton } from './IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { BookmarkIcon, HeartIcon, SearchIcon, SendIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'A short hint shown on focus or hover. Keep its content noninteractive and give the trigger its own accessible name. Wrap related controls in TooltipProvider.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const ACTIONS = [
  { label: 'Search the gallery', icon: <SearchIcon /> },
  { label: 'Like this artwork', icon: <HeartIcon /> },
  { label: 'Save to a collection', icon: <BookmarkIcon /> },
  { label: 'Share with a friend', icon: <SendIcon /> },
];

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {ACTIONS.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <IconButton aria-label={action.label} variant="secondary">
              {action.icon}
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>{action.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 py-16">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <IconButton aria-label={`Opens on the ${side}`} variant="secondary">
              <SearchIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const OpensWithAnimation: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton aria-label="Search the gallery" variant="secondary">
          <SearchIcon />
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>Search the gallery</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Search the gallery' });
    await userEvent.hover(trigger);

    // Radix portals the content to document.body, so it is outside canvasElement.
    const content = await waitFor(() => {
      const el = document.querySelector('[data-slot="tooltip-content"]');
      if (!el) throw new Error('the tooltip did not open');
      return el;
    });

    await expect(content).toHaveAttribute('data-state', 'delayed-open');
    await expect(getComputedStyle(content).animationName).toBe('pop-in');
  },
};
