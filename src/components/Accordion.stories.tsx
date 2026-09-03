import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

/**
 * `args` is declared and never spread: Radix types the root as a discriminated
 * union on `type`, which cannot be spread under `exactOptionalPropertyTypes`.
 */
const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { type: 'single' },
  parameters: {
    docs: {
      description: {
        component:
          'single closes the open section when another opens — a FAQ. multiple lets any number stand open — a filter panel, where closing the size filter to open the colour filter would be maddening.',
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

/**
 * Two things a screenshot cannot show: the trigger sits inside a real heading,
 * and `aria-expanded` follows the panel.
 */
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
