import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Text } from './Text';
import { Timeline, TimelineItem, TimelineTime } from './Timeline';

const EVENTS = [
  {
    at: '2026-03-11T09:12',
    shown: '11 Mar 2026, 09:12',
    what: 'Arrived at the Bandung warehouse',
  },
  { at: '2026-03-10T18:40', shown: '10 Mar 2026, 18:40', what: 'Left Jakarta' },
  { at: '2026-03-09T11:05', shown: '9 Mar 2026, 11:05', what: 'Handed to the courier' },
];

const meta = {
  tags: ['autodocs'],
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    docs: {
      description: {
        component:
          'A sequence of events with dates or times. Use machine-readable datetime values where available. Use Stepper for a process with a current position.',
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

export const APendingMoment: Story = {
  render: (args) => (
    <div className="max-w-96">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineTime dateTime="2026-03-11T09:12">11 Mar 2026, 09:12</TimelineTime>
          <Text size="sm" tone="primary">
            Arrived at the Bandung warehouse
          </Text>
        </TimelineItem>
        <TimelineItem state="pending">
          <Text size="sm">Awaiting delivery</Text>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

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
