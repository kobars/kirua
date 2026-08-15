import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { BookmarkIcon, HeartIcon, SearchIcon, SendIcon } from './icons';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Built on Radix Primitives. Radix shows the hint on keyboard focus as well as hover, shares one open-delay timer across a group so a row of icons does not stutter, dismisses on Escape, and positions with collision detection. A tooltip is a hint and never the only source of a control\'s name — every IconButton here still carries its own aria-label, which is why the component requires one.',
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
