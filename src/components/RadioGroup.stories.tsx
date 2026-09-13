import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Label } from './Label';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

const meta = {
  tags: ['autodocs'],
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A labelled set of mutually exclusive choices. Tab enters or leaves the group; arrow keys move between choices. Supply a visible label for each item.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  ['standard', 'Standard — 3 to 5 days'],
  ['express', 'Express — next day'],
  ['pickup', 'Collect in store'],
] as const;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard" aria-label="Delivery">
      {options.map(([value, label]) => (
        <div className="flex items-center gap-2" key={value}>
          <RadioGroupItem value={value} id={`ship-${value}`} />
          <Label htmlFor={`ship-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard" aria-label="Delivery">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="d-standard" />
        <Label htmlFor="d-standard">Standard</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="express" id="d-express" disabled />
        <Label htmlFor="d-express">Express — unavailable to this address</Label>
      </div>
    </RadioGroup>
  ),
};

export const ArrowKeysMoveWithinTheGroup: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <button type="button" data-testid="before" className="justify-self-start text-fg">
        Before the group
      </button>
      <RadioGroup {...args} defaultValue="standard" aria-label="Delivery">
        {options.map(([value, label]) => (
          <div className="flex items-center gap-2" key={value}>
            <RadioGroupItem value={value} id={`kb-${value}`} />
            <Label htmlFor={`kb-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
      <button type="button" data-testid="after" className="justify-self-start text-fg">
        After the group
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');
    const [standard, express] = radios;

    canvas.getByTestId('before').focus();

    // One Tab reaches the group,
    await userEvent.tab();
    await expect(radios).toContain(document.activeElement);

    // and one more leaves it, without visiting the other two.
    await userEvent.tab();
    await expect(canvas.getByTestId('after')).toHaveFocus();

    standard!.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(express).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
  },
};
