import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RouterLink } from '@/test/RouterLink';
import { MD, atLeast } from '@/test/viewport';
import { IconButton } from './IconButton';
import { NavBar, NavBarLink } from './NavBar';
import { GridIcon, SearchIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/NavBar',
  component: NavBar,
  args: {
    'aria-label': 'Main',
    items: [
      { label: 'Home', href: '#home', current: true },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  argTypes: { actions: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'A navigation bar with links and an actions slot. It uses an inverse surface context so its child controls adapt to the dark background.',
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

export const CentresItsLinksAtMd: Story = {
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="nav-bar"] ul');
    await expect(list).not.toBeNull();

    const justify = getComputedStyle(list as Element).justifyContent;
    await expect(justify).toBe(atLeast(MD) ? 'center' : 'flex-start');
  },
};

export const MarksTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    // Exactly one. Two would be a contradiction rather than extra emphasis, and
    // `aria-current` absent is the correct state for the rest — not `false`,
    // which some assistive technology still announces.
    for (const label of ['Portfolio', 'About', 'Contact']) {
      await expect(canvas.getByRole('link', { name: label })).not.toHaveAttribute(
        'aria-current',
      );
    }
  },
};

/**
 * Composed from `NavBarLink`s, each rendered onto the router's link, so a
 * change of page never reloads the document.
 */
export const OnRouterLinks: Story = {
  render: (args) => (
    <NavBar aria-label={args['aria-label'] ?? 'Main'}>
      <NavBarLink asChild current>
        <RouterLink href="#/">Home</RouterLink>
      </NavBarLink>
      <NavBarLink asChild>
        <RouterLink href="#/about">About</RouterLink>
      </NavBarLink>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const home = canvas.getByRole('link', { name: 'Home' });

    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await expect(home).toHaveAttribute('data-router-link');
    await expect(home).toHaveAttribute('data-slot', 'nav-bar-link');
    await expect(home).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'About' })).not.toHaveAttribute(
      'aria-current',
    );
  },
};
