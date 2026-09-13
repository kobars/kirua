import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stepper, StepperItem } from './Stepper';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Stepper',
  component: Stepper,
  args: { 'aria-label': 'Sign in' },
  parameters: {
    docs: {
      description: {
        component:
          'Show progress through a sequence. Distinguish completed, current and upcoming steps, and mark the current step for assistive technology.',
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Stepper {...args}>
        <StepperItem status="done" index={1}>
          Phone number
        </StepperItem>
        <StepperItem status="current" index={2}>
          Confirmation code
        </StepperItem>
        <StepperItem status="upcoming" index={3}>
          Delivery address
        </StepperItem>
      </Stepper>
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div className="grid max-w-96 gap-6">
      {(['done', 'current', 'upcoming'] as const).map((status) => (
        <Stepper {...args} key={status} aria-label={status}>
          <StepperItem status={status} index={1}>
            A step that is {status}
          </StepperItem>
        </Stepper>
      ))}
    </div>
  ),
};

export const PositionIsAnnounced: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Stepper {...args}>
        <StepperItem status="done" index={1}>
          Phone number
        </StepperItem>
        <StepperItem status="current" index={2}>
          Confirmation code
        </StepperItem>
      </Stepper>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Sign in' });
    const current = list.querySelectorAll('[aria-current="step"]');

    await expect(current).toHaveLength(1);
    await expect(current[0]).toHaveTextContent('Confirmation code');
    await expect(canvas.getByText('Done')).toHaveClass('sr-only');
    await expect(canvas.getByText('Current step')).toHaveClass('sr-only');
  },
};
