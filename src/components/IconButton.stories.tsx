import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { CloseIcon, GridIcon, HeartIcon, SearchIcon } from './icons';

const meta = {
  tags: ['autodocs'],
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
          'An action represented by an icon. aria-label is required to name the action. A tooltip may add a hint, but the control must already have an accessible name.',
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
        <CloseIcon />
      </IconButton>
      <IconButton {...args} size="md" aria-label="Close">
        <CloseIcon />
      </IconButton>
      <IconButton {...args} size="lg" aria-label="Close">
        <CloseIcon />
      </IconButton>
    </div>
  ),
};
