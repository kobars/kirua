import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { NavBar } from './NavBar';
import { GridIcon, SearchIcon } from './icons';

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    'aria-label': 'Main',
    items: [
      { label: 'Home', href: '#home', current: true },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'About', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
  argTypes: { actions: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'Measured from Figma: 70px tall, 22px corner radius, pure black fill. It sets `ctx-inverse`, so any Button or IconButton passed through `actions` picks up its on-black colours with no override. It renders a real `nav` wrapping a list, because "list of 4 navigation links" is exactly what a screen reader should announce.',
      },
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <IconButton aria-label="Search the gallery" variant="primary">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="Open menu" variant="ghost">
          <GridIcon />
        </IconButton>
      </>
    ),
  },
};
