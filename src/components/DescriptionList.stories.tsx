import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from './DescriptionList';
import { Kbd } from './Kbd';

const meta = {
  tags: ['autodocs'],
  title: 'Components/DescriptionList',
  component: DescriptionList,
  args: { layout: 'split', gap: 'md' },
  argTypes: {
    layout: { control: 'inline-radio', options: ['split', 'aligned', 'stacked'] },
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Aligned terms and values using native description-list semantics. Use it for order details, profile facts or summary metadata.',
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-80">
      <DescriptionList {...args}>
        <DescriptionTerm>Subtotal</DescriptionTerm>
        <DescriptionDetails numeric>Rp 1,200,000</DescriptionDetails>
        <DescriptionTerm>Delivery</DescriptionTerm>
        <DescriptionDetails numeric>Rp 30,000</DescriptionDetails>
        <DescriptionTerm emphasis>Total</DescriptionTerm>
        <DescriptionDetails emphasis numeric>
          Rp 1,230,000
        </DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};

export const Layouts: Story = {
  render: (args) => (
    <div className="grid max-w-80 gap-6">
      {(['split', 'aligned', 'stacked'] as const).map((layout) => (
        <DescriptionList {...args} key={layout} layout={layout}>
          <DescriptionTerm>Layout</DescriptionTerm>
          <DescriptionDetails>{layout}</DescriptionDetails>
          <DescriptionTerm>Address</DescriptionTerm>
          <DescriptionDetails>14 Cendana Street, Yogyakarta 55223</DescriptionDetails>
        </DescriptionList>
      ))}
    </div>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <div className="grid max-w-80 gap-6">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <DescriptionList {...args} key={gap} gap={gap}>
          <DescriptionTerm>Gap</DescriptionTerm>
          <DescriptionDetails>{gap}</DescriptionDetails>
          <DescriptionTerm>Delivery</DescriptionTerm>
          <DescriptionDetails>Two to four days</DescriptionDetails>
        </DescriptionList>
      ))}
    </div>
  ),
};

export const AValueCanBeAnything: Story = {
  render: (args) => (
    <div className="max-w-80">
      <DescriptionList {...args}>
        <DescriptionTerm>Search</DescriptionTerm>
        <DescriptionDetails>
          <span className="inline-flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};

export const TheValueColumnLinesUp: Story = {
  render: (args) => (
    <div className="max-w-80">
      <DescriptionList {...args} layout="split">
        <DescriptionTerm>A short term</DescriptionTerm>
        <DescriptionDetails numeric>7</DescriptionDetails>
        <DescriptionTerm>A considerably longer term</DescriptionTerm>
        <DescriptionDetails numeric>1.234.567</DescriptionDetails>
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvasElement.querySelector('[data-slot="description-list"]')!;
    const values = [...list.querySelectorAll('dd')];

    await expect(list.tagName).toBe('DL');
    await expect(canvas.getAllByRole('term')).toHaveLength(2);
    await expect(values[0]!.getBoundingClientRect().right).toBeCloseTo(
      values[1]!.getBoundingClientRect().right,
      1,
    );
  },
};
