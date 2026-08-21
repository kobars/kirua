import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Label } from './Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  args: { htmlFor: 'display-name', children: 'Display name' },
  argTypes: {
    htmlFor: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A styled native label. Native association is the feature: clicking its visible text focuses the matching control and the same text becomes that control’s accessible name without JavaScript.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-2">
      <Label {...args} />
      <input
        id={args.htmlFor}
        className="h-11 rounded-md border border-field-line bg-field px-3 text-on-field"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Display name');
    const input = canvas.getByRole('textbox', { name: 'Display name' });

    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
};
