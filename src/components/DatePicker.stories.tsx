import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { Field } from './Field';

const MARCH_2026 = new Date(2026, 2, 1);
const TODAY = new Date(2026, 2, 12);

/** Local parts, not `toISOString()` — see the note in `Calendar.stories.tsx`. */
const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: { month: MARCH_2026, today: TODAY, locale: 'en-US', panelLabel: 'Choose a visit date' },
  argTypes: { onSelect: { control: false }, onMonthChange: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          'Popover + Calendar + a trigger that shows the chosen date. month and value are separate props on purpose: a reader may page through March without choosing anything in it, and one prop would snap the calendar back every time.',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <DatePicker {...args} aria-label="Visit date" />
    </div>
  ),
};

/**
 * The trigger label is formatted by `Intl`, so one value reads "14 Maret 2026"
 * in Indonesian and "March 14, 2026" in English with no pattern string.
 */
export const ChosenAndNotYetChosen: Story = {
  render: (args) => (
    <div className="grid w-72 gap-4">
      <Field controlId="dp-empty" label="Tanggal kunjungan">
        <DatePicker {...args} id="dp-empty" placeholder="Pilih tanggal" locale="id-ID" />
      </Field>
      <Field controlId="dp-filled" label="Tanggal kunjungan">
        <DatePicker {...args} id="dp-filled" value={new Date(2026, 2, 14)} locale="id-ID" />
      </Field>
      <Field controlId="dp-en" label="Visit date">
        <DatePicker {...args} id="dp-en" value={new Date(2026, 2, 14)} locale="en-US" />
      </Field>
    </div>
  ),
};

/** Opens the panel, checks it is named, and chooses a day. */
export const OpenAndChoose: Story = {
  render: (args) => (
    <div className="w-72">
      <DatePicker
        {...args}
        aria-label="Visit date"
        onSelect={(date) => {
          document.body.dataset['pickedDate'] = localDay(date);
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Visit date/ });

    await userEvent.click(trigger);

    const panel = within(document.body).getByRole('dialog', { name: 'Choose a visit date' });
    await waitFor(async () => {
      await expect(panel).toBeVisible();
    });

    await userEvent.click(
      within(panel).getByRole('button', { name: 'Tuesday, March 17, 2026' }),
    );
    await waitFor(async () => {
      await expect(document.body.dataset['pickedDate']).toBe('2026-03-17');
    });
    delete document.body.dataset['pickedDate'];
  },
};
