import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BookmarkIcon, HeartIcon } from './icons';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { variant: 'plain', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A button that stays pressed. The difference from a Button is aria-pressed — a bold control that only changes colour tells a sighted reader its state and a screen-reader user nothing.',
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Toggle {...args}>Bold</Toggle>,
};

export const VariantsAndSizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Toggle {...args} variant="plain" size="sm">
          Plain small
        </Toggle>
        <Toggle {...args} variant="plain" size="md" defaultPressed>
          Plain medium
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <Toggle {...args} variant="outline" size="sm">
          Outline small
        </Toggle>
        <Toggle {...args} variant="outline" size="md" defaultPressed>
          Outline medium
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <Toggle {...args} aria-label="Save for later">
          <BookmarkIcon />
        </Toggle>
        <Toggle {...args} aria-label="Like" defaultPressed>
          <HeartIcon />
        </Toggle>
        <Toggle {...args} disabled>
          Unavailable
        </Toggle>
      </div>
    </div>
  ),
};

/**
 * `aria-pressed` is the assertion. A test on the class list would pass with the
 * ARIA removed, which is precisely the defect this component exists to prevent.
 */
export const PressedIsAnnounced: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Like">
      <HeartIcon />
    </Toggle>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Like' });

    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
