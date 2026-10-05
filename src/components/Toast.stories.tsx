import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from './Toast';
import { CheckIcon, CloseIcon } from './icons';

const meta = {
  tags: ['autodocs'],
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
      story: { height: '360px' },
      description: {
        component:
          'Temporary feedback after an action. Keep ToastViewport mounted before inserting messages so live updates can be announced. The application owns message state and dismissal.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        <ToastDescription>Round Glasses — 1 item.</ToastDescription>
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
        <Toast {...args} status="success" icon={<CheckIcon />} close={<ToastClose />}>
          <ToastTitle>Added to cart</ToastTitle>
          <ToastDescription>Round Glasses — 1 item.</ToastDescription>
        </Toast>
      </ToastViewport>
    </div>
  ),
};

export const OnlyFailureInterrupts: Story = {
  render: (args) => (
    <div className="relative min-h-72">
      <ToastViewport data-testid="viewport">
        <Toast {...args} status="success" data-testid="success">
          <ToastTitle>Saved</ToastTitle>
        </Toast>
        <Toast {...args} status="danger">
          <ToastTitle>Payment declined</ToastTitle>
        </Toast>
      </ToastViewport>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The viewport is the polite live region, present before any toast is.
    await expect(canvas.getByTestId('viewport')).toHaveAttribute('aria-live', 'polite');
    // A toast inside it is not a second region, or it would announce twice.
    await expect(canvas.getByTestId('success')).not.toHaveAttribute('role');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Payment declined');
  },
};

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

export const TheCloseControlIsInsideTheToastAndClickable: Story = {
  render: (args) => {
    const dismiss = () => {
      document.querySelector('[data-slot="toast"]')?.setAttribute('data-dismissed', 'yes');
    };
    return (
      <div className="relative min-h-72">
        <ToastViewport>
          <Toast
            {...args}
            status="neutral"
            data-testid="toast"
            close={<ToastClose onClick={dismiss} />}
          >
            <ToastTitle>Draft saved</ToastTitle>
          </Toast>
        </ToastViewport>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByTestId('toast');
    const close = canvas.getByRole('button', { name: 'Dismiss' });

    // Inside the panel, not a sibling of it.
    await expect(toast.contains(close)).toBe(true);

    // Within the panel's box, so it is not drawn over the page behind it.
    const t = toast.getBoundingClientRect();
    const c = close.getBoundingClientRect();
    await expect(c.top).toBeGreaterThanOrEqual(t.top - 1);
    await expect(c.bottom).toBeLessThanOrEqual(t.bottom + 1);
    await expect(c.right).toBeLessThanOrEqual(t.right + 1);

    // And it really receives the click.
    await expect(getComputedStyle(close).pointerEvents).toBe('auto');
    await userEvent.click(close);
    await expect(toast).toHaveAttribute('data-dismissed', 'yes');
  },
};
