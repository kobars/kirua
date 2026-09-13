import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Calendar } from './Calendar';

/** Every story pins `month` and `today`, so no screenshot depends on the clock. */
const MARCH_2026 = new Date(2026, 2, 1);
const TODAY = new Date(2026, 2, 12);

/**
 * Built from local parts. `toISOString()` converts to UTC, so a date picked in
 * UTC+7 serialises as the day before.
 */
const localMonth = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Calendar',
  component: Calendar,
  args: { month: MARCH_2026, today: TODAY, locale: 'en-US' },
  argTypes: {
    locale: { control: 'inline-radio', options: ['en-US', 'en-GB', 'id-ID'] },
    onSelect: { control: false },
    onMonthChange: { control: false },
  },
  parameters: {
    docs: {
      story: { height: '460px' },
      description: {
        component:
          'A controlled month grid for choosing a date. The application owns the displayed month and selected date. Set locale for calendar names and the first weekday; engines without week-info support fall back to Monday.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Calendar {...args} selected={new Date(2026, 2, 17)} />,
};

export const TheWeekStartsWhereTheLocaleSaysItDoes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {(['en-US', 'en-GB', 'id-ID'] as const).map((locale) => (
        <div key={locale} className="grid gap-2">
          <span className="text-body-sm text-fg-secondary">{locale}</span>
          <Calendar {...args} locale={locale} className="border border-line-subtle" />
        </div>
      ))}
    </div>
  ),
};

export const WithDisabledDates: Story = {
  render: (args) => (
    <Calendar
      {...args}
      selected={new Date(2026, 2, 12)}
      disabledDates={[
        new Date(2026, 2, 14),
        new Date(2026, 2, 15),
        new Date(2026, 2, 21),
        new Date(2026, 2, 22),
      ]}
    />
  ),
};

export const EveryDayIsNamedInFull: Story = {
  render: (args) => <Calendar {...args} selected={new Date(2026, 2, 17)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const seventeenth = canvas.getByRole('button', { name: 'Tuesday, March 17, 2026' });
    await expect(seventeenth).toHaveAttribute('aria-pressed', 'true');

    // Today is marked, and it is not the selection.
    await expect(
      canvas.getByRole('button', { name: 'Thursday, March 12, 2026' }),
    ).toHaveAttribute('aria-pressed', 'false');

    const title = canvasElement.querySelector('[data-slot="calendar-title"]')!;
    await expect(title).toHaveAttribute('aria-live', 'polite');
    await expect(title).toHaveTextContent('March 2026');
  },
};

export const MovingMonthIsTheConsumersToDo: Story = {
  render: (args) => (
    <Calendar
      {...args}
      onMonthChange={(next) => {
        document.body.dataset['calendarMonth'] = localMonth(next);
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvasElement.querySelector('[data-slot="calendar-title"]')!;

    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await waitFor(async () => {
      await expect(document.body.dataset['calendarMonth']).toBe('2026-04');
    });

    // The view itself did not move, because nothing told it to.
    await expect(title).toHaveTextContent('March 2026');
    delete document.body.dataset['calendarMonth'];
  },
};
