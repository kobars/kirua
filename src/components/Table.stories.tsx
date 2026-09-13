import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      story: { height: '440px' },
      description: {
        component:
          'A data table with an internal scroll container. Add headers and a caption or accessible name. The application owns sorting, selection, paging and data updates.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const visits = [
  ['07:30', 'Siti Rahayu', 'General practice', 'dr. Andi', 'success', 'Done'],
  ['08:00', 'Budi Santoso', 'Dental', 'drg. Maya', 'warning', 'Waiting'],
  ['08:15', 'Ayu Lestari', 'Paediatrics', 'dr. Rina', 'info', 'In consultation'],
  ['09:00', 'Joko Widodo', 'Ophthalmology', 'dr. Hendra', 'neutral', 'Scheduled'],
] as const;

export const Playground: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Today's visits — 4 patients</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Clinic</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map(([time, patient, clinic, doctor, status, label]) => (
          <TableRow key={patient}>
            <TableCell className="tabular-nums">{time}</TableCell>
            <TableCell className="font-medium text-fg">{patient}</TableCell>
            <TableCell>{clinic}</TableCell>
            <TableCell>{doctor}</TableCell>
            <TableCell>
              <Badge status={status}>{label}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell>4 patients</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const RowHeaders: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Fee by clinic</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Clinic</TableHead>
          <TableHead>Self-pay</TableHead>
          <TableHead>BPJS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">General practice</TableHead>
          <TableCell>Rp 75,000</TableCell>
          <TableCell>Rp 0</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">Dental</TableHead>
          <TableCell>Rp 150,000</TableCell>
          <TableCell>Rp 25,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const AWideTableScrollsItself: Story = {
  render: (args) => (
    <div className="w-72 border border-line-subtle" data-testid="frame">
      <Table {...args}>
        <TableCaption className="sr-only">A table wider than its frame</TableCaption>
        <TableHeader>
          <TableRow>
            {['Time', 'Patient', 'Clinic', 'Doctor', 'Reason', 'Status'].map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>07:30</TableCell>
            <TableCell>Siti Rahayu</TableCell>
            <TableCell>General practice</TableCell>
            <TableCell>dr. Andi Wijaya</TableCell>
            <TableCell>General examination</TableCell>
            <TableCell>Done</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame');
    const scroller = frame.querySelector('[data-slot="table-scroll"]') as HTMLElement;

    // The table is wider than its container,
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    // and the container, not the page, is what scrolls.
    await expect(frame.scrollWidth).toBe(frame.clientWidth);
    // A scrolling region has to be reachable by keyboard.
    await expect(scroller).toHaveAttribute('tabindex', '0');
  },
};
