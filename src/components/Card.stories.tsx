import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Card, CardBody, CardEyebrow, CardFooter, CardTitle } from './Card';
import { Stat, StatRow } from './Stat';
import { ArrowRightIcon, BookmarkIcon, HeartIcon, SendIcon } from './icons';

const meta = {
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

/**
 * `dark` and `brand` do more than change a fill — they declare a surface
 * context. The Button inside each card is identical in every one of these three
 * cases. It re-colours itself because the card re-points the action tokens.
 */
export const SurfaceContexts: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      {(['light', 'dark', 'brand'] as const).map((variant) => (
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

/** The engagement card from the bottom row of the reference design. */
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
