import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { CloseIcon, GridIcon, HeartIcon, SearchIcon } from './icons';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    'aria-label': 'Search the gallery',
    variant: 'ghost',
    size: 'md',
    children: <SearchIcon />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
    asChild: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`aria-label` is a required prop, not an optional one. An icon-only control has no text for a screen reader to announce, so without it the control is simply unusable without sight. Making it required in TypeScript is the cheapest possible enforcement — the build fails rather than the user.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <IconButton {...args}>
      <SearchIcon />
    </IconButton>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} variant="primary" aria-label="Search the gallery">
        <SearchIcon />
      </IconButton>
      <IconButton {...args} variant="secondary" aria-label="Like this artwork">
        <HeartIcon />
      </IconButton>
      <IconButton {...args} variant="ghost" aria-label="Open menu">
        <GridIcon />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} size="sm" aria-label="Close">
        <CloseIcon size={16} />
      </IconButton>
      <IconButton {...args} size="md" aria-label="Close">
        <CloseIcon size={20} />
      </IconButton>
      <IconButton {...args} size="lg" aria-label="Close">
        <CloseIcon size={24} />
      </IconButton>
    </div>
  ),
};
