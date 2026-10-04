import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';
import { Checkbox } from './Checkbox';

/**
 * `args` is declared and never spread: Radix types the root as a discriminated
 * union on `type`, which cannot be spread under `exactOptionalPropertyTypes`.
 */
const meta = {
  tags: ['autodocs'],
  title: 'Components/Accordion',
  component: Accordion,
  args: { type: 'single' },
  parameters: {
    docs: {
      description: {
        component:
          'Expandable sections for FAQs or grouped settings. Use type="single" for one open section or type="multiple" to let readers compare several sections.',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible defaultValue="size">
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>S, M, L and XL, with a size guide for each cut.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="colour">
          <AccordionTrigger>Colour</AccordionTrigger>
          <AccordionContent>Eleven colours, six of them in every size.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>From Rp 89,000 to Rp 750,000.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const SeveralOpenAtOnce: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="multiple" defaultValue={['size', 'colour']}>
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>A filter panel keeps its groups open.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="colour">
          <AccordionTrigger>Colour</AccordionTrigger>
          <AccordionContent>Closing one to open another would be maddening.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const TheTriggerIsAHeading: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="size">
          <AccordionTrigger headingLevel="h2">Size</AccordionTrigger>
          <AccordionContent>S, M, L and XL.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2, name: 'Size' })).toBeVisible();

    const trigger = canvas.getByRole('button', { name: 'Size' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByText('S, M, L and XL.')).toBeVisible();
    });
  },
};

export const AControlInTheFirstRow: Story = {
  render: () => (
    <div className="w-72">
      <Accordion type="single" defaultValue="brand">
        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <Checkbox aria-label="Dusk" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  /**
   * A 20px checkbox right under the trigger keeps its 24px target circle clear
   * of the trigger's box, which is what WCAG 2.5.8's spacing exception asks.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Brand' }).getBoundingClientRect();
    const box = canvas.getByRole('checkbox', { name: 'Dusk' }).getBoundingClientRect();
    const centre = box.top + box.height / 2;
    await expect(centre - 12).toBeGreaterThanOrEqual(trigger.bottom);
  },
};
