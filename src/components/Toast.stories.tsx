import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from './Toast';
import { CheckIcon, CloseIcon } from './icons';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: { status: 'neutral' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The VIEWPORT is the live region, not the toast: a region has to exist before a message is inserted into it, or the insertion is often not announced at all. role follows the status — alert interrupts, status waits for a pause.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rendered in place rather than in the fixed viewport, so the gallery can show
 * them side by side. A real application renders one `ToastViewport` in its shell.
 */
export const Statuses: Story = {
  render: (args) => (
    <div className="grid max-w-100 gap-3">
      <Toast {...args} status="neutral">
        <ToastTitle>Draft saved</ToastTitle>
      </Toast>
      <Toast {...args} status="info">
        <ToastTitle>Sync started</ToastTitle>
        <ToastDescription>Twelve records queued.</ToastDescription>
      </Toast>
      <Toast {...args} status="success" icon={<CheckIcon />}>
        <ToastTitle>Added to cart</ToastTitle>
        <ToastDescription>Kacamata bulat — 1 item.</ToastDescription>
      </Toast>
      <Toast {...args} status="warning">
        <ToastTitle>Only two left</ToastTitle>
      </Toast>
      <Toast {...args} status="danger" icon={<CloseIcon />}>
        <ToastTitle>Payment declined</ToastTitle>
        <ToastDescription>Try another card, or pay on delivery.</ToastDescription>
      </Toast>
    </div>
  ),
};

export const AnchoredToTheCorner: Story = {
  render: (args) => (
    <div className="relative min-h-72">
      <p className="text-body-md text-fg">
        The viewport is fixed to the bottom end corner, at the top of the stacking order.
      </p>
      <ToastViewport>
        <Toast {...args} status="success" icon={<CheckIcon />}>
          <ToastTitle>Added to cart</ToastTitle>
          <ToastDescription>Kacamata bulat — 1 item.</ToastDescription>
        </Toast>
        <ToastClose />
      </ToastViewport>
    </div>
  ),
};

/** The role split: only `danger` gets `alert`, which interrupts. */
export const OnlyFailureInterrupts: Story = {
  render: (args) => (
    <div className="grid max-w-100 gap-3">
      <Toast {...args} status="success">
        <ToastTitle>Saved</ToastTitle>
      </Toast>
      <Toast {...args} status="danger">
        <ToastTitle>Payment declined</ToastTitle>
      </Toast>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('status')).toHaveTextContent('Saved');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Payment declined');
  },
};

/**
 * The pointer-events split. The viewport spans a strip of the screen, so if it
 * swallowed clicks the page behind it would be dead while a toast showed.
 */
export const TheViewportDoesNotSwallowClicks: Story = {
  render: (args) => (
    <div className="relative min-h-72">
      <ToastViewport data-testid="viewport">
        <Toast {...args} status="neutral" data-testid="toast">
          <ToastTitle>Draft saved</ToastTitle>
        </Toast>
      </ToastViewport>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(getComputedStyle(canvas.getByTestId('viewport')).pointerEvents).toBe('none');
    await expect(getComputedStyle(canvas.getByTestId('toast')).pointerEvents).toBe('auto');
  },
};
