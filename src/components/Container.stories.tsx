import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Container } from './Container';
import { Heading } from './Heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { Text } from './Text';

const WIDTHS = ['md', '3xl', '4xl', '6xl', '7xl', 'full'] as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Container',
  component: Container,
  args: { width: '4xl', gap: 'md', pad: 'sm' },
  argTypes: {
    width: { control: 'inline-radio', options: WIDTHS },
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pad: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A responsive page shell with shared width, gutter and spacing choices. Wide tables and charts should retain their own scroll containers.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Container {...args}>
      <Heading as="h1" size="heading-lg">
        Publishing your first gallery
      </Heading>
      <Text>Four steps, and none of them needs a developer.</Text>
    </Container>
  ),
};

export const Widths: Story = {
  render: (args) => (
    <div className="grid gap-2">
      {WIDTHS.map((width) => (
        <Container {...args} key={width} width={width} pad="sm" className="bg-sunken">
          <Text size="sm">max-w-{width}</Text>
        </Container>
      ))}
    </div>
  ),
};

export const Rhythm: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(['sm', 'md', 'lg'] as const).map((step) => (
        <Container {...args} key={step} gap={step} pad={step} className="bg-sunken">
          <Text size="sm">gap and pad: {step}</Text>
          <Text size="sm">second block</Text>
        </Container>
      ))}
    </div>
  ),
};

export const Pads: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map((step) => (
        <Container {...args} key={step} pad={step} className="bg-sunken" data-testid={step}>
          <Text size="sm">pad: {step}</Text>
        </Container>
      ))}
    </div>
  ),
  /** 16, 24, 32 and 40 pixels above and below, from the spacing scale. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pad = (step: string) => getComputedStyle(canvas.getByTestId(step)).paddingTop;
    await expect(pad('xs')).toBe('16px');
    await expect(pad('sm')).toBe('24px');
    await expect(pad('md')).toBe('32px');
    await expect(pad('lg')).toBe('40px');
  },
};

export const AWideChildDoesNotStretchThePage: Story = {
  render: (args) => (
    <Container {...args} width="md" data-testid="shell">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'Plan',
              'Price',
              'Galleries',
              'Custom domain',
              'Commissions',
              'Platform fee per sale',
            ].map((head) => (
              <TableHead key={head} className="whitespace-nowrap">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {['Atelier', '$40 a month', 'Unlimited', 'Yes', 'Shared queue', '2%'].map(
              (cell) => (
                <TableCell key={cell} className="whitespace-nowrap">
                  {cell}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shell = canvas.getByTestId('shell');
    const scroller = shell.querySelector('[data-slot="table-scroll"]')!;

    // The scroller really is narrower than its content, so the assertion below
    // is about a table that genuinely overflows rather than one that fits.
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    await expect(shell.scrollWidth).toBeLessThanOrEqual(shell.clientWidth);
  },
};
