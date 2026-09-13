import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { ArrowRightIcon, SparkleIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Trigger an action such as saving, joining or submitting. Use primary for the main action, secondary or ghost for supporting actions, and danger for destructive actions. For navigation, use asChild with an anchor.',
      },
    },
  },
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
          'Use medium for everyday controls, small for compact supporting actions, and large for prominent calls to action. Keep enough spacing around compact controls for comfortable touch use.',
      },
    },
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div className="flex w-full max-w-80 flex-col gap-3">
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

export const AcrossSurfaces: Story = {
  globals: { surface: 'page' },
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

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#signup">Go to sign up</a>
    </Button>
  ),
};
