import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  args: { size: 'sm', children: 'K' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  parameters: {
    docs: {
      description: {
        component:
          'One key cap. A chord is several elements with plain text between them, so a screen reader reads "Control K" rather than "ControlK".',
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6 text-fg">
      <span className="inline-flex items-center gap-1 text-body-sm">
        <Kbd {...args} size="sm">
          ⌘
        </Kbd>
        <Kbd {...args} size="sm">
          K
        </Kbd>
      </span>
      <span className="inline-flex items-center gap-1 text-body-md">
        <Kbd {...args} size="md">
          Ctrl
        </Kbd>
        <Kbd {...args} size="md">
          /
        </Kbd>
      </span>
    </div>
  ),
};

/**
 * A chord is separate elements. Asserted because the tempting shortcut —
 * `<Kbd>⌘K</Kbd>` — reads aloud as one nonsense word.
 */
export const AChordIsSeparateKeys: Story = {
  render: (args) => (
    <p className="text-body-md text-fg" data-testid="hint">
      Press{' '}
      <span className="inline-flex items-center gap-1">
        <Kbd {...args}>Ctrl</Kbd> <Kbd {...args}>K</Kbd>
      </span>{' '}
      to search.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const caps = canvasElement.querySelectorAll('[data-slot="kbd"]');

    await expect(caps).toHaveLength(2);
    await expect(canvas.getByTestId('hint')).toHaveTextContent('Press Ctrl K to search.');
  },
};
