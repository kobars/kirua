import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { Field } from './Field';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './NativeSelect';

const meta = {
  tags: ['autodocs'],
  title: 'Components/NativeSelect',
  component: NativeSelect,
  args: {
    disabled: false,
    'aria-invalid': false,
  },
  argTypes: {
    width: { control: 'select', options: [undefined, 'xs', 'sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The browser’s own select, drawn as a field. Use it for long plain-text lists, on screens used mostly on a phone, and in forms that must work without JavaScript. Use Select when the options or the open list need the system’s styling.',
      },
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const clinics = ['General practice', 'Dental', 'Paediatrics', 'Ophthalmology'];

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field controlId="clinic" label="Clinic">
        <NativeSelect {...args} defaultValue="Dental">
          {clinics.map((clinic) => (
            <NativeSelectOption key={clinic}>{clinic}</NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox', { name: 'Clinic' });

    await expect(select.tagName).toBe('SELECT');
    await expect(select).toHaveValue('Dental');
    // The chevron is drawn for the eye only: the select announces itself.
    const chevron = canvasElement.querySelector('[data-slot="native-select-icon"]');
    await expect(chevron).toHaveAttribute('aria-hidden', 'true');
    await expect(getComputedStyle(chevron!).pointerEvents).toBe('none');
  },
};

/**
 * The value is a real form field: it posts under its `name` with no hidden
 * input beside it, and a reset puts back the default without any state.
 */
export const PostsInAForm: Story = {
  render: (args) => (
    <form aria-label="Visit" className="flex max-w-md flex-col gap-4">
      <Field controlId="language" label="Preferred language">
        <NativeSelect {...args} name="language" defaultValue="English">
          <NativeSelectOptGroup label="Most requested">
            <NativeSelectOption>English</NativeSelectOption>
            <NativeSelectOption>Spanish</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Other languages">
            <NativeSelectOption>Amharic</NativeSelectOption>
            <NativeSelectOption value="tl">Tagalog</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Field>
      <Button type="reset" variant="secondary">
        Clear
      </Button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form', { name: 'Visit' }) as HTMLFormElement;
    const select = canvas.getByRole('combobox', { name: 'Preferred language' });

    await expect(canvas.getByRole('group', { name: 'Other languages' })).toBeInTheDocument();
    await userEvent.selectOptions(select, 'Tagalog');
    await expect(new FormData(form).get('language')).toBe('tl');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(new FormData(form).get('language')).toBe('English');
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field controlId="ward" label="Ward" error="Choose the ward the patient is admitted to.">
        <NativeSelect {...args} defaultValue="">
          <NativeSelectOption value="" disabled>
            Choose a ward
          </NativeSelectOption>
          <NativeSelectOption>Ward A</NativeSelectOption>
          <NativeSelectOption>Ward B</NativeSelectOption>
        </NativeSelect>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Ward' });

    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(select).toHaveAccessibleDescription(
      'Choose the ward the patient is admitted to.',
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="max-w-md">
      <Field controlId="provider" label="Provider" description="Choose a department first.">
        <NativeSelect {...args}>
          <NativeSelectOption>Dr. Rivera</NativeSelectOption>
        </NativeSelect>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Provider' }),
    ).toBeDisabled();
  },
};

/**
 * `width` sizes the wrapper, so the chevron stays at the control's end — in a
 * right-to-left page too, where the end is the left.
 */
export const WidthAndDirection: Story = {
  args: { width: 'xs' },
  render: (args) => (
    <div dir="rtl" className="max-w-md">
      <NativeSelect {...args} aria-label="Clinic">
        {clinics.map((clinic) => (
          <NativeSelectOption key={clinic}>{clinic}</NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Clinic' });
    const chevron = canvasElement.querySelector('[data-slot="native-select-icon"]')!;
    const box = select.getBoundingClientRect();
    const mark = chevron.getBoundingClientRect();

    // At the end of the line, which in RTL is the left, and inside the control.
    await expect(mark.left).toBeGreaterThanOrEqual(box.left);
    await expect(mark.left - box.left).toBeLessThan(box.width / 2);
    // Centred in the control's height.
    await expect(
      Math.abs(mark.top + mark.height / 2 - (box.top + box.height / 2)),
    ).toBeLessThanOrEqual(1);
  },
};
