import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { utilityValue } from '@/test/utility';
import { Checkbox } from './Checkbox';
import { DatePicker } from './DatePicker';
import { Field, FieldLegend, FieldSet } from './Field';
import { Input } from './Input';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { Label } from './Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Switch } from './Switch';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Field',
  component: Field,
  args: {
    controlId: 'email',
    label: 'Email address',
    description: 'We will only use this for receipts.',
    required: false,
    children: <Input type="email" name="email" autoComplete="email" />,
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      story: { height: '300px' },
      description: {
        component:
          'Connect one form control to a visible label, description and error. Supply a unique controlId. The application validates input and passes error; Field then exposes the invalid state and supporting text.',
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: {
    controlId: 'invalid-email',
    required: true,
    error: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('textbox', { name: 'Email address' });
    const description = canvas.getByText('We will only use this for receipts.');
    const error = canvas.getByText('Enter a valid email address.');

    await expect(control).toBeRequired();
    await expect(control).toHaveAttribute('aria-required', 'true');
    await expect(control).toHaveAttribute('aria-invalid', 'true');
    await expect(control).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`);
    await expect(description.id).toBe('invalid-email-description');
    await expect(error.id).toBe('invalid-email-error');
  },
};

/**
 * `required` means nothing on a `<button>`, which is what a select trigger and
 * a date picker render, and the asterisk is hidden from assistive technology.
 * `aria-required` is what announces it on every kind of control.
 */
export const RequiredOnEveryControl: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <Field controlId="req-name" label="Patient name" required>
        <Input />
      </Field>
      {/* The Field wraps the trigger, inside the Select, so its wiring lands
          on the element that has the role. */}
      <Select>
        <Field controlId="req-clinic" label="Clinic" required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a clinic" />
          </SelectTrigger>
        </Field>
        <SelectContent aria-label="Clinics">
          <SelectItem value="general">General practice</SelectItem>
          <SelectItem value="dental">Dental</SelectItem>
        </SelectContent>
      </Select>
      <Field controlId="req-date" label="Visit date" required>
        <DatePicker month={new Date(2026, 2, 1)} today={new Date(2026, 2, 12)} />
      </Field>
      {/* Required on the child alone still shows the asterisk. */}
      <Field controlId="req-email" label="Email">
        <Input type="email" required />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ['Patient name', 'Email']) {
      await expect(canvas.getByRole('textbox', { name })).toHaveAttribute(
        'aria-required',
        'true',
      );
    }
    for (const name of [/Clinic/, /Visit date/]) {
      await expect(canvas.getByRole('combobox', { name })).toHaveAttribute(
        'aria-required',
        'true',
      );
    }
    const email = canvasElement.querySelector('label[for="req-email"]')!;
    await expect(email.querySelector('[aria-hidden="true"]')).toHaveTextContent('*');
  },
};

/** A disabled control dims its label and description with it. */
export const Disabled: Story = {
  args: { controlId: 'disabled-email', children: <Input type="email" disabled /> },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('[data-slot="field"]') as HTMLElement;
    await expect(field).toHaveAttribute('data-disabled');
    const dimmed = utilityValue('text-on-field-disabled', 'color', field);
    for (const slot of ['field-label', 'field-description']) {
      const node = field.querySelector(`[data-slot="${slot}"]`) as HTMLElement;
      await expect(getComputedStyle(node).color).toBe(dimmed);
    }
  },
};

/**
 * The row a checkbox or switch belongs in: the control first, then its label,
 * description and error in a second column. The wiring is the same as the
 * vertical field's.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <Field
        orientation="horizontal"
        controlId="terms"
        label="I accept the delivery terms"
        error="Accept the terms to continue."
      >
        <Checkbox />
      </Field>
      <Field
        orientation="horizontal"
        controlId="reminders"
        label="Send reminders"
        description="A message the day before each visit."
      >
        <Switch defaultChecked />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'I accept the delivery terms' });
    const error = canvas.getByText('Accept the terms to continue.');

    await expect(box).toHaveAttribute('aria-invalid', 'true');
    await expect(box.getAttribute('aria-describedby')).toContain(error.id);
    await userEvent.click(canvas.getByText('I accept the delivery terms'));
    await expect(box).toBeChecked();

    const field = box.closest('[data-slot="field"]') as HTMLElement;
    await expect(getComputedStyle(field).gridTemplateColumns.split(' ')).toHaveLength(2);
    // The control comes first in the DOM, and so on screen at the start.
    await expect(field.firstElementChild).toBe(box);
    await expect(canvas.getByRole('switch', { name: 'Send reminders' })).toBeChecked();
  },
};

/**
 * One question answered by several controls. The legend names the group, so
 * the radio group inside carries no name of its own and nothing is read
 * twice. `disabled` on the set disables every control in it.
 */
export const GroupedWithAFieldSet: Story = {
  render: () => (
    <div className="grid w-80 gap-6">
      <FieldSet>
        <FieldLegend>Delivery</FieldLegend>
        <RadioGroup defaultValue="standard">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="standard" id="delivery-standard" />
            <Label htmlFor="delivery-standard">Standard, 3 to 5 days</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="express" id="delivery-express" />
            <Label htmlFor="delivery-express">Express, next day</Label>
          </div>
        </RadioGroup>
      </FieldSet>
      <FieldSet disabled>
        <FieldLegend>Gift wrap</FieldLegend>
        <RadioGroup defaultValue="none">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="wrap-none" />
            <Label htmlFor="wrap-none">No wrapping</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="paper" id="wrap-paper" />
            <Label htmlFor="wrap-paper">Paper and ribbon</Label>
          </div>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delivery = canvas.getByRole('group', { name: 'Delivery' });
    const radios = within(delivery).getByRole('radiogroup');
    await expect(radios).not.toHaveAttribute('aria-label');
    await expect(radios).not.toHaveAttribute('aria-labelledby');

    const paper = canvas.getByRole('radio', { name: 'Paper and ribbon' });
    await expect(paper.matches(':disabled')).toBe(true);
    await expect(getComputedStyle(canvas.getByText('Paper and ribbon')).color).toBe(
      utilityValue('text-on-field-disabled', 'color', paper.parentElement!),
    );
  },
};
