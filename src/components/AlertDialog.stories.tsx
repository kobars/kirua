import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';
import { Button } from './Button';

const meta = {
  tags: ['autodocs'],
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: {
    docs: {
      story: { height: '480px' },
      description: {
        component:
          'A confirmation dialog for consequential actions. Provide a clear title, explain the consequence and label the confirm action specifically. Initial focus goes to cancel.',
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Delete visit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete this visit?</AlertDialogTitle>
        <AlertDialogDescription>
          The notes and the prescription go with it, and neither can be recovered.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Keep it</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="danger">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const OpenAndPassesItsAccessibilityRun: Story = {
  render: () => (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogTitle>Discard the draft?</AlertDialogTitle>
        <AlertDialogDescription>Nothing has been sent yet.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Keep editing</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="danger">Discard</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ItIsAnAlertdialogAndFocusStartsOnCancel: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Remove patient</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Remove this patient?</AlertDialogTitle>
        <AlertDialogDescription>Their record stays in the archive.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="danger">Remove</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async () => {
    await userEvent.click(await screen.findByRole('button', { name: 'Remove patient' }));

    const panel = await screen.findByRole('alertdialog');
    await expect(panel).toHaveAccessibleName('Remove this patient?');
    await expect(panel).toHaveAccessibleDescription('Their record stays in the archive.');

    await waitFor(async () => {
      await expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });

    // A press on the scrim must do nothing. Radix listens for `pointerdown` on
    // the document to dismiss, so that is the event to send — and it is sent
    // directly rather than through `userEvent`, which refuses to click into a
    // page the dialog has already marked `pointer-events: none`.
    const scrim = document.querySelector('[data-slot="alert-dialog-overlay"]') as HTMLElement;
    scrim.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    scrim.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  },
};
