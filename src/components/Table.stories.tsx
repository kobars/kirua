import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Badge } from './Badge';
import { Card } from './Card';
import { IconButton } from './IconButton';
import { MoreIcon } from './icons';
import {
  Table,
  type TableProps,
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
  ['7:30 AM', 'Maria Gonzalez', 'Family Medicine', 'Andrew Park, MD', 'success', 'Completed'],
  ['8:00 AM', 'James Whitaker', 'Orthopedics', 'Thomas Brennan, MD', 'warning', 'Checked in'],
  ['8:15 AM', 'Aaliyah Johnson', 'Pediatrics', 'Rachel Levin, MD', 'info', 'With provider'],
  ['9:00 AM', 'Robert Chen', 'Ophthalmology', 'Mei Zhao, MD', 'neutral', 'Scheduled'],
] as const;

export const Playground: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Today's appointments — 4 patients</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map(([time, patient, department, provider, status, label]) => (
          <TableRow key={patient}>
            <TableCell className="tabular-nums">{time}</TableCell>
            <TableCell className="font-medium text-fg">{patient}</TableCell>
            <TableCell>{department}</TableCell>
            <TableCell>{provider}</TableCell>
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
      <TableCaption>Office visit charge by department</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Self-pay</TableHead>
          <TableHead>Medicare allowed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">Family Medicine</TableHead>
          <TableCell>$165.00</TableCell>
          <TableCell>$92.47</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">Cardiology</TableHead>
          <TableCell>$310.00</TableCell>
          <TableCell>$131.28</TableCell>
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
            {['Time', 'Patient', 'Department', 'Provider', 'Reason for visit', 'Status'].map(
              (h) => (
                <TableHead key={h}>{h}</TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>7:30 AM</TableCell>
            <TableCell>Maria Gonzalez</TableCell>
            <TableCell>Family Medicine</TableCell>
            <TableCell>Andrew Park, MD</TableCell>
            <TableCell>Annual physical</TableCell>
            <TableCell>Completed</TableCell>
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

function PinnedTable({ surface, label }: { surface: TableProps['surface']; label: string }) {
  return (
    <Table surface={surface} data-testid={label}>
      <TableCaption className="sr-only">{label}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead sticky="start">Patient</TableHead>
          {['Time', 'Department', 'Provider', 'Status'].map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
          <TableHead sticky="end">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map(([time, patient, department, provider, status, label]) => (
          <TableRow key={patient}>
            <TableCell sticky="start" nowrap>
              {patient}
            </TableCell>
            <TableCell nowrap>{time}</TableCell>
            <TableCell nowrap>{department}</TableCell>
            <TableCell nowrap>{provider}</TableCell>
            <TableCell>
              <Badge status={status}>{label}</Badge>
            </TableCell>
            <TableCell sticky="end">
              <IconButton aria-label={`Actions for ${patient}`} size="sm" variant="ghost">
                <MoreIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const StickyColumns: Story = {
  render: () => (
    <div className="grid w-80 grid-cols-[minmax(0,1fr)] gap-6">
      <PinnedTable surface="page" label="On the page" />
      <Card padding="sm">
        <PinnedTable surface="raised" label="In a card" />
      </Card>
    </div>
  ),
  /**
   * What would fail silently: a pinned cell that scrolls with the rest, and a
   * pinned cell whose fill does not match what it sits on — the page's fill
   * inside a card reads as a patch over the table. The hovered and selected
   * fills need a real pointer and are in `hover.test.tsx`.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1);

    for (const label of ['On the page', 'In a card']) {
      const table = canvas.getByTestId(label);
      const scroller = table.closest('[data-slot="table-scroll"]') as HTMLElement;
      await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);

      scroller.scrollLeft = scroller.scrollWidth;
      await new Promise(requestAnimationFrame);

      const box = scroller.getBoundingClientRect();
      const row = within(table).getAllByRole('row')[1] as HTMLElement;
      const first = row.firstElementChild as HTMLElement;
      const last = row.lastElementChild as HTMLElement;
      close(first.getBoundingClientRect().left, box.left);
      close(last.getBoundingClientRect().right, box.right);
      await expect(getComputedStyle(last).position).toBe('sticky');
    }

    const card = canvasElement.querySelector('[data-slot="card"]') as HTMLElement;
    const inCard = canvas.getByTestId('In a card');
    const row = within(inCard).getAllByRole('row')[1] as HTMLElement;
    const pinned = row.lastElementChild as HTMLElement;
    await expect(getComputedStyle(pinned).backgroundColor).toBe(
      getComputedStyle(card).backgroundColor,
    );
  },
};

export const NumericToneAndNowrap: Story = {
  render: () => (
    <Table>
      <TableCaption>Stock on hand</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell tone="primary">amoxicillin 500 MG Oral Capsule</TableCell>
          <TableCell nowrap tone="secondary" data-testid="nowrap">
            Mar 12, 2027
          </TableCell>
          <TableCell numeric data-testid="numeric">
            1,240
          </TableCell>
          <TableCell tone="muted">Par level 200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByTestId('numeric')).fontVariantNumeric).toBe(
      'tabular-nums',
    );
    await expect(getComputedStyle(canvas.getByTestId('nowrap')).whiteSpace).toBe('nowrap');
  },
};

function SortableTable() {
  const [up, setUp] = useState(true);
  const rows = [
    ['Acetaminophen', 820],
    ['Amoxicillin', 1240],
    ['Ibuprofen', 310],
  ] as const;
  const sorted = [...rows].sort((a, b) => (up ? a[1] - b[1] : b[1] - a[1]));
  return (
    <Table>
      <TableCaption>Medications by stock</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead sort={up ? 'ascending' : 'descending'} onSort={() => setUp(!up)}>
            Stock
          </TableHead>
          <TableHead sort="none" onSort={() => undefined}>
            Bin
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(([name, stock]) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell numeric>{stock}</TableCell>
            <TableCell>A-12</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const SortableColumns: Story = {
  render: () => <SortableTable />,
  /**
   * `aria-sort` is on the header cell, where a screen reader reads it, and the
   * button inside it is what changes it.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: 'Stock' });

    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(canvas.getByRole('columnheader', { name: 'Bin' })).toHaveAttribute(
      'aria-sort',
      'none',
    );
    const button = within(header).getByRole('button', { name: 'Stock' });
    // Not the native `submit`, so a sortable table inside a form never sends it.
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(canvas.getAllByRole('row')[1]).toHaveTextContent('Amoxicillin');
  },
};

export const SelectedRows: Story = {
  render: () => (
    <Table>
      <TableCaption>Visits to review</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(
          [
            ['Maria Gonzalez', true],
            ['Ahmed Khan', false],
          ] as const
        ).map(([name, selected]) => (
          <TableRow key={name} data-selected={selected}>
            <TableCell>{name}</TableCell>
            <TableCell sticky="end">Open</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  /** `data-selected={false}` renders `"false"`, which must not select the row. */
  play: async ({ canvasElement }) => {
    const [selected, unselected] = within(canvasElement).getAllByRole('row').slice(1);
    const fill = (row: HTMLElement) => getComputedStyle(row).backgroundColor;

    await expect(unselected).toHaveAttribute('data-selected', 'false');
    await expect(fill(selected!)).not.toBe(fill(unselected!));
    await expect(fill(unselected!)).toBe('rgba(0, 0, 0, 0)');
  },
};
