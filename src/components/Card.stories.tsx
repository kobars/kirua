import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Card, CardBody, CardEyebrow, CardFooter, CardTitle } from './Card';
import { Stat, StatRow } from './Stat';
import { ArrowRightIcon, BookmarkIcon, HeartIcon, SendIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { height: '440px' },
      description: {
        component:
          'Group related content and actions. Brand and dark variants establish local surface contexts for their children. Use glint sparingly for expressive panels.',
      },
    },
  },
  title: 'Components/Card',
  component: Card,
  args: { variant: 'light', padding: 'lg', radius: 'xl' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['light', 'dark', 'brand', 'ghost'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardEyebrow>Join our anime class</CardEyebrow>
      <CardTitle className="text-display-md">50% Off</CardTitle>
      <CardBody className="mt-2">
        Create, showcase, and sell your digital art and cartoon creations with ease.
      </CardBody>
      <CardFooter>
        <Button variant="primary" trailingIcon={<ArrowRightIcon />}>
          Claim
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const SurfaceContexts: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {(['light', 'dark', 'brand', 'ghost'] as const).map((variant) => (
        <Card key={variant} variant={variant} padding="lg">
          <CardEyebrow>variant=&quot;{variant}&quot;</CardEyebrow>
          <CardTitle className="mt-1 text-heading-lg">Same button</CardTitle>
          <CardBody className="mt-2">No prop changes. No override classes.</CardBody>
          <CardFooter>
            <Button variant="primary">Start now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const Paddings: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-4">
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} padding={padding}>
          <CardEyebrow>padding=&quot;{padding}&quot;</CardEyebrow>
          <CardBody className="mt-1">The eyebrow sits flush when there is none.</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      {(['md', 'lg', 'xl'] as const).map((radius) => (
        <Card key={radius} radius={radius} padding="md">
          <CardEyebrow>radius=&quot;{radius}&quot;</CardEyebrow>
          <CardBody className="mt-1">Glints, when enabled, follow the corner.</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const WithStats: Story = {
  render: () => (
    <Card variant="dark" padding="lg" className="max-w-lg">
      <CardBody className="text-body-lg">
        We&apos;re a platform built for digital artists and cartoon creators who want to share
        their anime-inspired art with the world.
      </CardBody>
      <CardFooter>
        <StatRow>
          <Stat icon={<HeartIcon />} value="100k" label="Likes" />
          <Stat icon={<BookmarkIcon />} value="10k" label="Saves" />
          <Stat icon={<SendIcon />} value="20k" label="Shares" />
        </StatRow>
      </CardFooter>
    </Card>
  ),
};
