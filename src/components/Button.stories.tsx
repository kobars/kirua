import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { ArrowRightIcon, SparkleIcon } from './icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Start now', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    // These take React nodes, so a text control would produce nonsense.
    leadingIcon: { control: false },
    trailingIcon: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Delete
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        Small — 36px
      </Button>
      <Button {...args} size="md">
        Medium — 44px
      </Button>
      <Button {...args} size="lg">
        Large — 54px
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Large is 54px, the exact call-to-action height measured in the reference Figma file. Medium is the default at 44px, which meets the 44px minimum touch target.',
      },
    },
  },
};

/** Stretches to its container — a form's submit row, a card footer, a sheet. */
export const FullWidth: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-3">
      <Button {...args} fullWidth>
        Continue
      </Button>
      <Button {...args} variant="secondary" fullWidth>
        Back
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} leadingIcon={<SparkleIcon />}>
        Generate
      </Button>
      <Button {...args} variant="secondary" trailingIcon={<ArrowRightIcon />}>
        Enroll Now
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} disabled variant="primary">
        Primary
      </Button>
      <Button {...args} disabled variant="secondary">
        Secondary
      </Button>
      <Button {...args} disabled variant="danger">
        Delete
      </Button>
    </div>
  ),
};

/**
 * The point of the token architecture, in one story.
 *
 * These are the SAME components with the SAME props. Only the surrounding
 * surface changes. Because `.ctx-brand` and `.ctx-inverse` re-point the action
 * tokens, the primary button becomes a white pill on blue and on black without
 * a prop, a variant, or an override class.
 */
export const AcrossSurfaces: Story = {
  parameters: { surface: 'page' },
  render: (args) => (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { label: 'Page (default)', cls: 'bg-page border border-line-subtle' },
        { label: 'ctx-brand', cls: 'ctx-brand bg-brand' },
        { label: 'ctx-inverse', cls: 'ctx-inverse bg-page' },
      ].map((surface) => (
        <div
          key={surface.label}
          className={`flex flex-col gap-4 rounded-xl p-6 ${surface.cls}`}
        >
          <span className="font-mono text-caption text-fg-secondary">{surface.label}</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button {...args} variant="primary">
              Start now
            </Button>
            <Button {...args} variant="secondary">
              Enroll
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * `asChild` renders the button's styling onto a different element. Use it for
 * links, so the browser gives real link behaviour — middle-click, open in new
 * tab, and the correct role for a screen reader.
 */
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#signup">Go to sign up</a>
    </Button>
  ),
};
