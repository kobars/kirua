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
