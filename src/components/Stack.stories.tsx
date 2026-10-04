import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { Field } from './Field';
import { Input } from './Input';
import { Stack } from './Stack';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';
import { Text } from './Text';

const GAPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12] as const;
const ALIGNS = ['stretch', 'start', 'center', 'end'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Stack',
  component: Stack,
  args: { gap: 4, align: 'stretch' },
  argTypes: {
    gap: { control: 'select', options: GAPS },
    align: { control: 'inline-radio', options: ALIGNS },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Blocks one under another with one gap between them. The column may shrink below its content, so a wide table inside scrolls in its own box.',
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Block = ({ children }: { children: string }) => (
  <Text size="sm" className="rounded-sm bg-sunken px-3 py-2">
    {children}
  </Text>
);

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Block>First block</Block>
      <Block>Second block</Block>
      <Block>Third block</Block>
    </Stack>
  ),
};

export const Gaps: Story = {
  render: () => (
    <div className="grid gap-6">
      {GAPS.map((gap) => (
        <Stack key={gap} gap={gap} data-testid={`gap-${gap}`}>
          <Block>{`gap={${gap}}`}</Block>
          <Block>second</Block>
        </Stack>
      ))}
    </div>
  ),
  /** The prop is the spacing scale's step: `gap={4}` is 16px, `gap={0.5}` is 2px. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const gap of GAPS) {
      const stack = canvas.getByTestId(`gap-${gap}`);
      await expect(getComputedStyle(stack).rowGap).toBe(`${gap * 4}px`);
    }
  },
};

export const Alignment: Story = {
  render: () => (
    <div className="grid gap-6">
      {ALIGNS.map((align) => (
        <Stack key={align} align={align} gap={2} data-testid={`align-${align}`}>
          <Button size="sm" variant="secondary">
            align=&quot;{align}&quot;
          </Button>
        </Stack>
      ))}
    </div>
  ),
  /** `start` lets a button in a form keep its own width; `stretch` fills the column. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const width = (align: string) =>
      canvas.getByTestId(`align-${align}`).querySelector('button')!.getBoundingClientRect()
        .width;
    const column = canvas.getByTestId('align-stretch').getBoundingClientRect().width;

    await expect(Math.round(width('stretch'))).toBe(Math.round(column));
    await expect(width('start')).toBeLessThan(column);
  },
};

export const AsAForm: Story = {
  render: () => (
    <Stack
      as="form"
      gap={4}
      align="start"
      aria-label="Profile"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field controlId="stack-name" label="Name">
        <Input />
      </Field>
      <Button type="submit">Save</Button>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', { name: 'Profile' });
    await expect(form.tagName).toBe('FORM');
    await expect(form).toHaveAttribute('data-slot', 'stack');
  },
};

export const AWideChildScrollsInside: Story = {
  render: () => (
    <div className="w-72 border border-line-subtle" data-testid="frame">
      <Stack gap={3} data-testid="stack">
        <Text size="sm">A table wider than its column:</Text>
        <Table>
          <TableCaption className="sr-only">Appointments</TableCaption>
          <TableHeader>
            <TableRow>
              {['Time', 'Patient', 'Clinic', 'Doctor', 'Reason', 'Status'].map((head) => (
                <TableHead key={head}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {['07:30', 'Siti Rahayu', 'General practice', 'Dr. Andi', 'Check-up', 'Done'].map(
                (cell) => (
                  <TableCell key={cell} nowrap>
                    {cell}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </div>
  ),
  /**
   * The failure this column exists to prevent: a plain `grid` sizes its column
   * to the widest child, so the table would stretch the stack, and the stack
   * the page.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame');
    const stack = canvas.getByTestId('stack');
    const scroller = stack.querySelector('[data-slot="table-scroll"]') as HTMLElement;

    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    await expect(stack.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
    await expect(frame.scrollWidth).toBe(frame.clientWidth);
  },
};
