import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RouterLink } from '@/test/RouterLink';
import { SM, atLeast } from '@/test/viewport';
import { SparkleIcon, StethoscopeIcon } from './icons';
import { Wordmark } from './Wordmark';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Wordmark',
  component: Wordmark,
  args: { href: '#/', icon: <SparkleIcon />, children: 'Commons', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  parameters: {
    docs: {
      description: {
        component:
          'An application’s mark and name as one lockup. With href it is a link that keeps the surrounding text colour; a short name or a compact mark covers a narrow header.',
      },
    },
  },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Commons' });
    await expect(link).toHaveAttribute('data-slot', 'wordmark');
    await expect(link.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  },
};

export const AShortNameOnAPhone: Story = {
  args: {
    icon: <StethoscopeIcon />,
    shortName: 'Larkspur',
    children: 'Larkspur · Juniper Valley',
  },
  /** One name at a time, so the link is never announced twice. */
  play: async ({ canvasElement }) => {
    const name = atLeast(SM) ? 'Larkspur · Juniper Valley' : 'Larkspur';
    await expect(within(canvasElement).getByRole('link', { name })).toBeVisible();
  },
};

export const CompactKeepsTheName: Story = {
  render: () => (
    <Wordmark icon={<SparkleIcon />} compact size="sm">
      Assistant
    </Wordmark>
  ),
  /** Below `sm` only the mark shows, and the name stays in the tree. */
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector('[data-slot="wordmark"]')!;
    await expect(mark.tagName).toBe('SPAN');
    await expect(mark).toHaveTextContent('Assistant');
  },
};

/** The mark and the name go inside the router's link, which is the anchor. */
export const OnARouterLink: Story = {
  render: () => (
    <Wordmark asChild icon={<SparkleIcon />} shortName="Commons">
      <RouterLink href="#/">Commons · Neighbourhood</RouterLink>
    </Wordmark>
  ),
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector('[data-slot="wordmark"]')!;
    const name = atLeast(SM) ? 'Commons · Neighbourhood' : 'Commons';

    await expect(mark).toHaveAttribute('data-router-link');
    await expect(mark).toHaveAttribute('href', '#/');
    await expect(mark.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    await expect(within(canvasElement).getByRole('link', { name })).toBe(mark);
  },
};
