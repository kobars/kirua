import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Links, not buttons. A page of results has a URL, so it can be opened in a new tab, bookmarked, shared and reached with Back. A button that calls a handler throws all of that away and looks identical.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1">Previous</PaginationPrevious>
        </PaginationItem>
        {[1, 2, 3].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={`?page=${page}`} isCurrent={page === 2}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=24">24</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3">Next</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const IconsOnly: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=4" />
        </PaginationItem>
        {[4, 5, 6].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={`?page=${page}`} isCurrent={page === 5}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="?page=6" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Every control is a real link, the current page is announced as such, and the
 * previous and next controls meet the 44px touch target.
 */
export const LinksWithRealDestinations: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isCurrent>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('link', { name: '1' })).toHaveAttribute('href', '?page=1');
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);

    const next = canvas.getByRole('link', { name: 'Next page' });
    await expect(next.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};
