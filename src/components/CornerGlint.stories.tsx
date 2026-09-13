import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardTitle } from './Card';
import { CornerGlint } from './CornerGlint';
import { SpotlightContent, SpotlightPanel } from './SpotlightPanel';

const meta = {
  tags: ['autodocs'],
  title: 'Components/CornerGlint',
  component: CornerGlint,
  args: {
    corner: 'top-start',
    radius: 22,
    inset: 8,
    longTail: 1.57,
    shortTail: 0.29,
    weight: 0.19,
  },
  argTypes: {
    corner: {
      control: 'inline-radio',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    radius: { control: { type: 'range', min: 12, max: 80, step: 1 } },
    inset: { control: { type: 'range', min: 0, max: 24, step: 1 } },
    longTail: { control: { type: 'range', min: 0, max: 3, step: 0.05 } },
    shortTail: { control: { type: 'range', min: 0, max: 3, step: 0.05 } },
    weight: { control: { type: 'range', min: 0.04, max: 0.5, step: 0.01 } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flat corner accent for the base style. Use it sparingly on brand or inverse panels, where its translucent fill contrasts with the surface. Prefer Card glint or SpotlightPanel for automatic placement. Direct use requires radius and inset values that match the containing shape.',
      },
    },
  },
} satisfies Meta<typeof CornerGlint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="ctx-inverse relative size-72 rounded-xl bg-page">
      <CornerGlint {...args} />
    </div>
  ),
};

export const AllFourCorners: Story = {
  render: (args) => (
    <div className="ctx-brand relative h-72 w-full max-w-2xl rounded-xl bg-brand">
      <CornerGlint {...args} corner="top-start" />
      <CornerGlint {...args} corner="top-end" />
      <CornerGlint {...args} corner="bottom-start" />
      <CornerGlint {...args} corner="bottom-end" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The shape is drawn once for the top-left corner and mirrored into the other three. Mirrors rather than rotations, because a rotation would also swap the box dimensions and leave the blade hanging off the corner.',
      },
    },
  },
};

export const FollowsTheRadius: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(['md', 'lg', 'xl'] as const).map((radius) => (
        <Card
          key={radius}
          variant="dark"
          radius={radius}
          padding="md"
          glint="top-end"
          className="w-56"
        >
          <CardTitle className="text-heading-md">radius=&quot;{radius}&quot;</CardTitle>
          <CardBody className="mt-1 text-body-sm">
            {{ md: 16, lg: 22, xl: 32 }[radius]}px corner
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SpotlightPanel padding="lg" className="min-h-52">
        <SpotlightContent className="gap-2">
          <h3 className="font-display text-display-md text-fg">Panel</h3>
          <p className="font-text text-body-md text-fg-secondary">
            Defaults to the top-left and bottom-left corners.
          </p>
        </SpotlightContent>
      </SpotlightPanel>
      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="dark" padding="lg" glint="top-end">
          <CardTitle>glint=&quot;tr&quot;</CardTitle>
          <CardBody className="mt-1">Faces the panel from the left.</CardBody>
        </Card>
        <Card variant="dark" padding="lg" glint="top-start">
          <CardTitle>glint=&quot;tl&quot;</CardTitle>
          <CardBody className="mt-1">Faces the panel from the right.</CardBody>
        </Card>
      </div>
    </div>
  ),
};
