import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { Field } from './Field';
import { Input } from './Input';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    docs: {
      story: { height: '400px' },
      description: {
        component:
          'A floating panel for supporting information or controls. Provide an accessible name and a clear trigger. Use Tooltip for a short noninteractive hint.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Filters</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <Field controlId="pop-q" label="Keyword">
          <Input id="pop-q" placeholder="kacamata" />
        </Field>
      </PopoverContent>
    </Popover>
  ),
};

export const ItsContentIsReachable: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Filters</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <Field controlId="reach-q" label="Keyword">
          <Input id="reach-q" />
        </Field>
        <Button size="sm" className="mt-4">
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));

    // Portalled to the end of <body>, and marked open one commit before its
    // children commit.
    const panel = within(document.body).getByRole('dialog');
    await waitFor(async () => {
      await expect(panel).toBeVisible();
    });

    const input = within(panel).getByLabelText('Keyword');
    input.focus();
    await expect(input).toHaveFocus();

    // Focus return is asynchronous: on the tick after Escape it is still on
    // the input inside the closing panel.
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveFocus();
    });
  },
};

export const OpensWithAnimation: Story = {
  render: (args) => (
    <Popover {...args} defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open already</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters">Anchored, and animated in.</PopoverContent>
    </Popover>
  ),
  play: async () => {
    const panel = document.querySelector('[data-slot="popover-content"]')!;

    // `data-open` matches Radix's `data-state="open"`, so the vendor spelling
    // stays out of the component.
    await expect(getComputedStyle(panel).animationName).toBe('pop-in');
  },
};
