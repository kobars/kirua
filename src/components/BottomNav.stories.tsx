import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RouterLink } from '@/test/RouterLink';
import { MD, atLeast } from '@/test/viewport';
import { BottomNav, BottomNavLink } from './BottomNav';
import { GridIcon, SearchIcon, SendIcon, UserIcon } from './icons';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  tags: ['autodocs'],
  title: 'Components/BottomNav',
  component: BottomNav,
  args: { 'aria-label': 'Main' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A phone tab bar, hidden from md. Sticky rather than fixed: placed last in AppShell it stays at the foot of the viewport without the page having to pad itself.',
      },
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <BottomNav {...args} data-testid="nav">
      <BottomNavLink href="#/" icon={<GridIcon />} current>
        Home
      </BottomNavLink>
      <BottomNavLink href="#/explore" icon={<SearchIcon />}>
        Explore
      </BottomNavLink>
      <BottomNavLink href="#/messages" icon={<SendIcon />}>
        Messages
        <VisuallyHidden>, 3 unread</VisuallyHidden>
      </BottomNavLink>
      <BottomNavLink href="#/profile" icon={<UserIcon />}>
        Profile
      </BottomNavLink>
    </BottomNav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByTestId('nav');

    await expect(getComputedStyle(nav).display === 'none').toBe(atLeast(MD));
    if (atLeast(MD)) return;

    const home = canvas.getByRole('link', { name: 'Home' });
    await expect(home).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: /^Messages\s*, 3 unread$/ })).toBeVisible();
    // Every destination is a 44px target.
    for (const link of canvas.getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
      await expect(link.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    }
  },
};

/** Each tab renders onto the router's link, with the icon inside it. */
export const OnRouterLinks: Story = {
  render: (args) => (
    <BottomNav {...args}>
      <BottomNavLink asChild icon={<GridIcon />} current>
        <RouterLink href="#/">Home</RouterLink>
      </BottomNavLink>
      <BottomNavLink asChild icon={<SendIcon />}>
        <RouterLink href="#/messages">Messages</RouterLink>
      </BottomNavLink>
    </BottomNav>
  ),
  play: async ({ canvasElement }) => {
    const anchors = canvasElement.querySelectorAll('[data-slot="bottom-nav-link"]');
    await expect(anchors).toHaveLength(2);
    for (const anchor of anchors) {
      await expect(anchor).toHaveAttribute('data-router-link');
      await expect(anchor.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
    }
    await expect(anchors[0]).toHaveAttribute('aria-current', 'page');
    await expect(anchors[0]).toHaveTextContent('Home');
    await expect(anchors[1]).toHaveAttribute('href', '#/messages');
  },
};
