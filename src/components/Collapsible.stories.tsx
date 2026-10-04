import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';
import { ChevronDownIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component:
          'One section of content that can expand or collapse. Give the trigger a clear label. Use Accordion for a coordinated set of sections.',
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-96">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" trailingIcon={<ChevronDownIcon />}>
          Delivery details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        Sent from Bandung by overnight courier. Two to four working days to Java, four to seven
        elsewhere.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-96">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" trailingIcon={<ChevronDownIcon />}>
          Returns
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        Thirty days, unworn, with the tag attached.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const OpensWithItsOwnAnimation: Story = {
  render: () => (
    <Collapsible className="w-96">
      <CollapsibleTrigger asChild>
        <Button variant="ghost">More filters</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Colour, condition, and seller rating.</CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'More filters' }));

    const panel = canvasElement.querySelector(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;

    await expect(getComputedStyle(panel).animationName).toBe('collapsible-down');
    await waitFor(async () => {
      await expect(panel.getBoundingClientRect().height).toBeGreaterThan(0);
    });
  },
};

export const TheTriggerAnnouncesItsState: Story = {
  render: () => (
    <Collapsible className="w-96">
      <CollapsibleTrigger asChild>
        <Button variant="ghost">Payment methods</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Card, transfer, or on delivery.</CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Payment methods' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-controls');
  },
};

export const ARailWithAGap: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      {([1, 2, 3, 4] as const).map((gap) => (
        <Collapsible key={gap} defaultOpen variant="rail" gap={gap} data-testid={`gap-${gap}`}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              justify="between"
              trailingIcon={<ChevronDownIcon />}
            >
              How it got there (gap {gap})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            The reasoning, set apart by a rule rather than a fill.
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  ),
  /** The disclosure owns the space under its trigger, and the rule is a border. */
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByTestId('gap-3');
    await expect(root).toHaveAttribute('data-slot', 'collapsible');
    await expect(getComputedStyle(root).rowGap).toBe('12px');
    await expect(getComputedStyle(root).borderInlineStartWidth).toBe('2px');
  },
};
