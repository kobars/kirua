import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      story: { height: '480px' },
      description: {
        component:
          'A modal panel for a focused task. Supply a title and description, and use a visible trigger. Radix handles focus trapping, Escape dismissal and focus return.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          Join the class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join the drawing class</DialogTitle>
        <DialogDescription>
          Weekly lessons in character design, inking and colour, with feedback on your own
          pages. Your first month is half price, and you can cancel any time.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Not now</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Claim offer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A title long enough to fill its first line stops short of the close button
 * and wraps, rather than running underneath it.
 */
export const ALongTitleKeepsClearOfTheCloseButton: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Remove</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Remove this item from your cart and every saved list?</DialogTitle>
        <DialogDescription>It stays in the shop.</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    // The pop-in animation starts transparent and can outlast the default wait.
    await waitFor(() => expect(dialog).toBeVisible(), { timeout: 5000 });
    const title = within(dialog).getByRole('heading');
    const close = within(dialog).getByRole('button', { name: 'Close' });

    // The end of the title's text box against the start of the button, in
    // this left-to-right story.
    const box = title.getBoundingClientRect();
    const end = box.right - Number.parseFloat(getComputedStyle(title).paddingRight);
    await expect(end).toBeLessThanOrEqual(close.getBoundingClientRect().left);
  },
};

export const CustomCloseLabel: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Join the course</Button>
      </DialogTrigger>
      <DialogContent closeLabel="Close the course details">
        <DialogTitle>Join the course</DialogTitle>
        <DialogDescription>
          Weekly lessons in character design, inking and colour.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Join the course' }),
    );
    // Radix portals the panel to document.body, so it is outside canvasElement.
    await expect(
      await screen.findByRole('button', { name: 'Close the course details' }),
    ).toBeInTheDocument();
  },
};

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete artwork</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete this artwork?</DialogTitle>
        <DialogDescription>
          This removes it from your portfolio and from every collection that features it. It
          cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Keep it</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Delete permanently</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const TrapsAndRestoresFocus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Join the class' });

    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');

    // Tab far enough to have left any real panel, then check where focus sits.
    // A count larger than the number of focusable children is the point: the
    // trap has to survive a wrap, not merely a first Tab.
    for (let i = 0; i < 8; i += 1) await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);

    // And backwards, which is a separate code path in every focus trap.
    for (let i = 0; i < 8; i += 1) await userEvent.tab({ shift: true });
    await expect(dialog.contains(document.activeElement)).toBe(true);

    await userEvent.keyboard('{Escape}');

    // Escape marks it closed *immediately*; the node stays mounted for as long
    // as its exit animation runs, which is the whole reason those exits are
    // real `@keyframes` and not transitions. Asserting removal without waiting
    // reads the panel mid-animation and fails on behaviour that is correct.
    await expect(dialog).toHaveAttribute('data-state', 'closed');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    // Restore. Without it a keyboard user is returned to the top of the
    // document and has to walk back to where they were.
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  },
};
