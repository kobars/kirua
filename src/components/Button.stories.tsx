import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ArrowRightIcon, ChevronDownIcon, SendIcon, SparkleIcon } from './icons';

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
    loading: { control: 'boolean' },
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

/**
 * A button standing on its own carries the Clay edge and a hard press shadow,
 * and lifts under a fine pointer. Joined into a `ButtonGroup` it keeps the
 * plain shape, so the group reads as one control with one selected part.
 */
export const StandingAndJoined: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Button {...args} variant="primary">
        Standing
      </Button>
      <ButtonGroup aria-label="View">
        <Button {...args} variant="secondary">
          Grid
        </Button>
        <Button {...args} variant="secondary">
          List
        </Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [standing, joined] = within(canvasElement).getAllByRole('button');
    await expect(getComputedStyle(standing!).borderTopWidth).toBe('3px');
    await expect(getComputedStyle(standing!).boxShadow).not.toBe('none');
    await expect(getComputedStyle(joined!).borderTopWidth).toBe('2px');
    await expect(getComputedStyle(joined!).boxShadow).toBe('none');
  },
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
        Join the class
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
 * `loading` in place of `disabled`: the button stays where focus is, so a
 * keyboard user who pressed it is not dropped onto `<body>`.
 */
export const Loading: Story = {
  render: function Render(args) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(0);
    return (
      <div className="flex flex-col items-start gap-3">
        <Button
          {...args}
          type="submit"
          loading={loading}
          loadingLabel="Sending"
          leadingIcon={<SendIcon />}
          onClick={() => {
            setSent((n) => n + 1);
            setLoading(true);
          }}
        >
          Send
        </Button>
        <output data-testid="sent">{sent}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Send/ });
    const width = button.getBoundingClientRect().width;

    button.focus();
    await userEvent.keyboard('{Enter}');

    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button.getBoundingClientRect().width).toBe(width);
    await expect(within(button).getByText('Sending')).toBeInTheDocument();

    // A second Enter reaches no handler.
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('sent')).toHaveTextContent('1');
  },
};

/**
 * An svg from another icon set follows the size step like kirua's own icons,
 * instead of rendering at its intrinsic 24px.
 */
export const ThirdPartyIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button {...args} key={size} size={size} data-testid={size}>
          <SparkleIcon />
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" data-raw="">
            <circle cx="12" cy="12" r="9" fill="currentColor" />
          </svg>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expected = { sm: 16, md: 18, lg: 20 };
    for (const size of ['sm', 'md', 'lg'] as const) {
      const button = canvas.getByTestId(size);
      const [own, raw] = Array.from(button.querySelectorAll('svg'));
      await expect(raw?.getBoundingClientRect().width).toBe(expected[size]);
      await expect(raw?.getBoundingClientRect().width).toBe(own?.getBoundingClientRect().width);
    }
  },
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
              Join
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

/**
 * With `asChild` the icons land inside the link, around its text, so the
 * link keeps one element and the icons keep the button's spacing.
 */
export const AsLinkWithIcons: Story = {
  render: (args) => (
    <Button
      {...args}
      asChild
      leadingIcon={<SparkleIcon data-testid="leading" />}
      trailingIcon={<ArrowRightIcon data-testid="trailing" />}
    >
      <a href="#signup">Go to sign up</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Go to sign up' });
    await expect(link).toHaveAttribute('data-slot', 'button');
    await expect(link.firstElementChild).toBe(within(link).getByTestId('leading'));
    await expect(link.lastElementChild).toBe(within(link).getByTestId('trailing'));
  },
};

/** `loading` replaces the leading icon with the spinner on a link too. */
export const AsLinkLoading: Story = {
  render: (args) => (
    <Button {...args} asChild loading leadingIcon={<SparkleIcon data-testid="leading" />}>
      <a href="#signup">Go to sign up</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: /Go to sign up/ });
    await expect(link).toHaveAttribute('aria-busy', 'true');
    await expect(within(link).queryByTestId('leading')).toBeNull();
    await expect(link.querySelector('[data-slot="spinner"]')).not.toBeNull();
  },
};

export const OnlyAChevronTurnsOver: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="secondary" aria-expanded="true" trailingIcon={<ChevronDownIcon />}>
        Open menu
      </Button>
      <Button variant="secondary" aria-expanded="true" trailingIcon={<ArrowRightIcon />}>
        Open step
      </Button>
    </div>
  ),
  /**
   * An expanded control turns its chevron over, and nothing else: an arrow
   * turned over points backwards, which is a different instruction.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = (name: string) =>
      canvas.getByRole('button', { name }).querySelector('svg') as SVGElement;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await expect(getComputedStyle(icon('Open menu')).rotate).toBe('180deg');
    await expect(getComputedStyle(icon('Open step')).rotate).toBe('none');
  },
};

export const JustifiedBetween: Story = {
  render: () => (
    <div className="w-72">
      <Button variant="ghost" fullWidth justify="between" trailingIcon={<ChevronDownIcon />}>
        How it got there
      </Button>
    </div>
  ),
  /** The chevron goes to the far end, where a disclosure's chevron belongs. */
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'How it got there' });
    await expect(getComputedStyle(button).justifyContent).toBe('space-between');
  },
};
