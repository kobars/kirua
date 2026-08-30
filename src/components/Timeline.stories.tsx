import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Text } from './Text';
import { Timeline, TimelineItem, TimelineTime } from './Timeline';

const EVENTS = [
  { at: '2026-03-11T09:12', shown: '11 Mar 2026, 09:12', what: 'Tiba di gudang Bandung' },
  { at: '2026-03-10T18:40', shown: '10 Mar 2026, 18:40', what: 'Berangkat dari Jakarta' },
  { at: '2026-03-09T11:05', shown: '9 Mar 2026, 11:05', what: 'Diserahkan ke kurir' },
];

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    docs: {
      description: {
        component:
          'What happened, and when. It shares its rail with Stepper and nothing else: a timeline marks its moments with `<time datetime>`, a stepper marks its position with `aria-current="step"`, and a mode flag on one component would have made one of those wrong on every render.',
      },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Timeline {...args}>
        {EVENTS.map((event) => (
          <TimelineItem key={event.at}>
            <TimelineTime dateTime={event.at}>{event.shown}</TimelineTime>
            <Text size="sm" tone="primary">
              {event.what}
            </Text>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  ),
};

/** A moment that has not happened yet is drawn hollow. */
export const APendingMoment: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineTime dateTime="2026-03-11T09:12">11 Mar 2026, 09:12</TimelineTime>
          <Text size="sm" tone="primary">
            Tiba di gudang Bandung
          </Text>
        </TimelineItem>
        <TimelineItem state="pending">
          <Text size="sm">Menunggu pengantaran</Text>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

/**
 * The two things a rail cannot say on its own. The timestamps are machine
 * readable, and the last item does not trail a connector into nothing.
 */
export const MomentsAreMachineReadable: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Timeline {...args} data-testid="rail">
        {EVENTS.map((event) => (
          <TimelineItem key={event.at}>
            <TimelineTime dateTime={event.at}>{event.shown}</TimelineTime>
            <Text size="sm" tone="primary">
              {event.what}
            </Text>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvas.getByTestId('rail');
    const times = [...rail.querySelectorAll('time')];
    const items = [...rail.querySelectorAll('li')];

    await expect(rail.tagName).toBe('OL');
    await expect(times).toHaveLength(3);
    for (const time of times) {
      await expect(Number.isNaN(Date.parse(time.dateTime))).toBe(false);
    }

    const connectorOf = (item: Element) => item.querySelector('.group-last\\/rail\\:hidden')!;
    await expect(getComputedStyle(connectorOf(items[0]!)).display).not.toBe('none');
    await expect(getComputedStyle(connectorOf(items[2]!)).display).toBe('none');
  },
};
