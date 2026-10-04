import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { QuantityStepper } from './QuantityStepper';

const meta = {
  tags: ['autodocs'],
  title: 'Components/QuantityStepper',
  component: QuantityStepper,
  args: { value: 1, min: 1, max: 5, label: 'Quantity, Round Glasses' },
  argTypes: { onDecrement: { control: false }, onIncrement: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'Increment or decrement a controlled quantity. The application supplies the value, limits and change handler. Label the control with the item being changed.',
      },
    },
  },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AtTheEndsOfItsRange: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <QuantityStepper {...args} value={1} label="At the minimum" />
      <QuantityStepper {...args} value={3} label="In the middle" />
      <QuantityStepper {...args} value={5} label="At the maximum" />
    </div>
  ),
};

export const TheEndControlIsUnavailableAndStaysPut: Story = {
  render: (args) => <QuantityStepper {...args} value={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const minus = canvas.getByRole('button', { name: 'Decrease quantity' });
    const plus = canvas.getByRole('button', { name: 'Increase quantity' });

    await expect(minus).toHaveAttribute('aria-disabled', 'true');
    await expect(minus).toBeVisible();
    await expect(plus).not.toHaveAttribute('aria-disabled');

    // The group carries the name; "1" on its own means nothing.
    await expect(canvas.getByRole('group', { name: /Quantity/ })).toBeVisible();
  },
};

/**
 * Pressing Increase up to the maximum leaves focus on Increase. A `disabled`
 * button would leave the tab order on the press that reached the limit, and
 * focus would fall to `<body>`.
 */
export const FocusSurvivesTheLimit: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(3);
    const [calls, setCalls] = useState(0);
    return (
      <div className="flex flex-col items-start gap-2">
        <QuantityStepper
          {...args}
          value={value}
          onDecrement={() => setValue((n) => n - 1)}
          onIncrement={() => {
            setCalls((n) => n + 1);
            setValue((n) => n + 1);
          }}
        />
        <output data-testid="calls">{calls}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const plus = canvas.getByRole('button', { name: 'Increase quantity' });

    plus.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('group')).toHaveTextContent('5');
    await expect(plus).toHaveFocus();
    await expect(plus).toHaveAttribute('aria-disabled', 'true');

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('calls')).toHaveTextContent('2');
    await expect(canvas.getByRole('group')).toHaveTextContent('5');
  },
};

export const TheHandlersAreTheConsumers: Story = {
  render: (args) => {
    let calls = 0;
    return (
      <QuantityStepper
        {...args}
        value={2}
        onIncrement={() => {
          calls += 1;
          document.body.dataset['stepperCalls'] = String(calls);
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase quantity' }));

    await expect(document.body.dataset['stepperCalls']).toBe('1');
    delete document.body.dataset['stepperCalls'];
  },
};
