import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
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
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Built on Radix Primitives. Radix supplies the behaviour that is easy to get wrong and invisible when it is wrong: focus trapping, focus return to the trigger on close, marking the rest of the page inert, Escape to dismiss, and background scroll locking. This file adds appearance only — which is why the dialog can look nothing like a default component library and still behave correctly. Try it with the keyboard: Tab cycles inside the panel and never escapes it.',
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
          Enroll Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join the anime class</DialogTitle>
        <DialogDescription>
          Two live sessions a week, plus a critique thread. Cancel any time — the first week is
          free.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Not now</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Claim 50% off</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * The close button is the one piece of text this component supplies itself, so
 * `closeLabel` exists to replace it. Everything else was already a child.
 *
 * The play function is the proof, not the rendering: it opens the dialog and
 * finds the button by its accessible name, which is the same lookup a screen
 * reader makes. If the label stopped reaching the accessibility tree, this
 * story would fail rather than look correct.
 */
export const TranslatedCloseLabel: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Ouvrir</Button>
      </DialogTrigger>
      <DialogContent closeLabel="Fermer">
        <DialogTitle>Rejoindre le cours</DialogTitle>
        <DialogDescription>Deux séances en direct par semaine.</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Ouvrir' }));
    // Radix portals the panel to document.body, so it is outside canvasElement.
    await expect(await screen.findByRole('button', { name: 'Fermer' })).toBeInTheDocument();
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
