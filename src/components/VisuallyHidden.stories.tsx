import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Heading } from './Heading';
import { Button } from './Button';
import { BookmarkIcon } from './icons';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  tags: ['autodocs'],
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  args: { children: ' saves' },
  parameters: {
    docs: {
      description: {
        component:
          'Off the screen, still in the accessibility tree: a page title only the outline needs, an extra word in a control’s name.',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Button variant="ghost" leadingIcon={<BookmarkIcon />}>
      12
      <VisuallyHidden {...args} />
    </Button>
  ),
  /** A bare "12" is a number; the hidden word makes it a count of something. */
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '12 saves' })).toBeVisible();
  },
};

export const AHeadingOnlyTheOutlineSees: Story = {
  render: () => (
    <VisuallyHidden asChild>
      <Heading as="h1">Home</Heading>
    </VisuallyHidden>
  ),
  /** In the tree with its own slot, and one pixel on the screen. */
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 1, name: 'Home' });
    await expect(heading).toHaveAttribute('data-slot', 'heading');
    await expect(heading.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  },
};

export const InsideATableThatScrolls: Story = {
  render: () => (
    <div className="w-64" data-testid="frame">
      <Table>
        <TableCaption>
          <VisuallyHidden>Medicines</VisuallyHidden>
        </TableCaption>
        <TableHeader>
          <TableRow>
            {['Medicine', 'Shelf', 'Stock', 'Expires', 'Supplier'].map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
            <TableHead>
              <VisuallyHidden>Actions</VisuallyHidden>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {['Amoxicillin 500mg', 'A-12', '240', '2027-03', 'Northfield Supply', '…'].map(
              (cell) => (
                <TableCell key={cell} nowrap>
                  {cell}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  /**
   * `sr-only` is absolutely positioned. With no positioned ancestor its box is
   * placed against the page, at the table's full width, and the document
   * scrolls sideways for a 1px span. The header cell is positioned, so it is not.
   */
  play: async ({ canvasElement }) => {
    const frame = within(canvasElement).getByTestId('frame');
    const label = within(frame).getByText('Actions');
    const cell = label.closest('th')!;

    await expect(getComputedStyle(cell).position).toBe('relative');
    await expect(document.documentElement.scrollWidth).toBe(
      document.documentElement.clientWidth,
    );
  },
};
