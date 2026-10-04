import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { Button } from './Button';
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

WithDisabledDates.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Unavailable, not removed: the day can still be reached and says why it
  // cannot be chosen.
  const saturday = canvas.getByRole('button', { name: 'Saturday, March 14, 2026' });
  await expect(saturday).toHaveAttribute('aria-disabled', 'true');
  await expect(saturday).toBeEnabled();

  canvas.getByRole('button', { name: 'Friday, March 13, 2026' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(saturday).toHaveFocus();
};

/**
 * The date grid pattern: one tab stop, then the arrow, Home, End and Page keys.
 * The month is the story's state, as it would be the application's.
 */
export const TheKeyboardMovesThroughTheGrid: Story = {
  render: function Render(args) {
    const [month, setMonth] = useState(MARCH_2026);
    const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 2, 17));
    return (
      <Calendar
        {...args}
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvasElement.querySelector('[data-slot="calendar-title"]')!;
    const day = (name: string) => canvas.getByRole('button', { name });

    // Three tab stops: the two month buttons and one day, the selected one.
    canvas.getByRole('button', { name: 'Previous month' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next month' })).toHaveFocus();
    await userEvent.tab();
    await expect(day('Tuesday, March 17, 2026')).toHaveFocus();
    await expect(
      canvasElement.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]'),
    ).toHaveLength(1);

    await expect(day('Thursday, March 12, 2026')).toHaveAttribute('aria-current', 'date');

    await userEvent.keyboard('{ArrowRight}');
    await expect(day('Wednesday, March 18, 2026')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(day('Wednesday, March 25, 2026')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    await expect(day('Tuesday, March 17, 2026')).toHaveFocus();

    // en-US weeks run Sunday to Saturday.
    await userEvent.keyboard('{End}');
    await expect(day('Saturday, March 21, 2026')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(day('Sunday, March 15, 2026')).toHaveFocus();

    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(day('Wednesday, April 15, 2026')).toHaveFocus());
    await expect(title).toHaveTextContent('April 2026');

    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
    await waitFor(() => expect(day('Thursday, April 15, 2027')).toHaveFocus());
    await expect(title).toHaveTextContent('April 2027');

    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    await waitFor(() => expect(day('Wednesday, April 15, 2026')).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(day('Wednesday, April 15, 2026')).toHaveAttribute('aria-pressed', 'true');
  },
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

/**
 * The one tab stop follows focus: Tab out of the grid and Shift+Tab back lands
 * on the day last focused, not on the selected day the grid started from.
 */
export const TheTabStopFollowsFocus: Story = {
  render: (args) => (
    <div className="grid justify-items-start gap-4">
      <Calendar {...args} selected={new Date(2026, 2, 17)} />
      <Button variant="secondary" size="sm">
        After the calendar
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = (name: string) => canvas.getByRole('button', { name });
    const stops = () =>
      canvasElement.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]');

    day('Tuesday, March 17, 2026').focus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(day('Wednesday, March 25, 2026')).toHaveFocus();
    await expect(stops()).toHaveLength(1);

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After the calendar' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(day('Wednesday, March 25, 2026')).toHaveFocus();

    // A pointer focuses a day too, and the stop moves with it.
    await userEvent.click(day('Friday, March 6, 2026'));
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(day('Friday, March 6, 2026')).toHaveFocus();
    await expect(stops()).toHaveLength(1);
  },
};
