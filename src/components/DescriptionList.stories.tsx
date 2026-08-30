import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from './DescriptionList';
import { Kbd } from './Kbd';

const meta = {
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
          'Term and value as a real `<dl>`. The pairs are direct children of the list, which is what puts every value in one grid column — the five hand-written versions each wrapped a pair in its own flex row, so every row aligned itself and no two agreed.',
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
        <DescriptionDetails numeric>Rp 1.200.000</DescriptionDetails>
        <DescriptionTerm>Delivery</DescriptionTerm>
        <DescriptionDetails numeric>Rp 30.000</DescriptionDetails>
        <DescriptionTerm emphasis>Total</DescriptionTerm>
        <DescriptionDetails emphasis numeric>
          Rp 1.230.000
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
          <DescriptionDetails>Jalan Cendana 14, Yogyakarta 55223</DescriptionDetails>
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
          <DescriptionTerm>Second</DescriptionTerm>
          <DescriptionDetails>row</DescriptionDetails>
        </DescriptionList>
      ))}
    </div>
  ),
};

/**
 * A value does not have to be text. Here it is a chord of key caps, which is
 * why `numeric` is a prop rather than something the component decides.
 */
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

/**
 * The claim the component exists to keep. Every value starts at the same x,
 * which a per-row flex container cannot promise and the five hand-written
 * lists did not.
 */
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
