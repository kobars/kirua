import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardTitle } from './Card';
import { CornerGlint } from './CornerGlint';
import { SpotlightContent, SpotlightPanel } from './SpotlightPanel';

const meta = {
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
        component: [
          'The corner ornament from the reference design: a flat, solid blade tucked into a rounded corner, thickest partway round the turn and tapering to a sharp point at each end.',
          '',
          '**It is deliberately flat.** A first attempt drew this as a stroke with a soft gradient fade. That reads as a bevel highlight — a 3D lighting cue — and it is wrong for a system whose whole character is flat 2D anime. This is one solid fill, one colour, hard edges, no gradient.',
          '',
          '**Colour is a rule, not a value.** Measured from Figma, the blade is always a lighter tint of the surface beneath it: `#6CB5FF` on the `#0A84FF` panel, `#555555` on the black card. Drawing it in translucent white composites to *exactly* those two values — 40% white over the blue, 33.3% over the black — so one token is correct on every surface, including ones added later.',
          '',
          "**It is inset, not welded to the edge.** This was the detail that took two attempts to get right. In Figma the card's corner arc is centred at `(872.41, 753)` and the glint's arc at `(871.25, 752.61)` — the same point. The glint is *concentric* with the corner and one radius smaller: 22 − 14 = an 8px inset, so a band of surface shows between the border and the blade.",
          '',
          "**Geometry, all from the Figma paths.** Outer edge = the inset arc plus two straight runs tangent to it. Inner edge = a second arc joined to each tip by that tip's tangent line, which is what tapers the ends to true points. Tails are asymmetric — about 1.57× the arc radius one way, 0.29× the other. At the reference's own `radius=22, inset=8` this reproduces the Figma asset's 36 × 18 bounding box exactly.",
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof CornerGlint>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag `weight`, `sweep` and `bias` to see how the blade is constructed. */
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

/**
 * The blade is drawn on whatever radius it is given, so it stays flush on every
 * corner size. Card passes its own radius variant through automatically.
 */
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

/** How it is actually used: one blade per card, on the corner facing the panel. */
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
