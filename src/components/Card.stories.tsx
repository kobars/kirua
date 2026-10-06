import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { Card, CardBody, CardContent, CardEyebrow, CardFooter, CardTitle } from './Card';
import { List, ListItem } from './List';
import { Stat, StatRow } from './Stat';
import { Text } from './Text';
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
  args: { variant: 'light', padding: 'lg', radius: 'card' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['light', 'dark', 'brand', 'ghost'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['md', 'lg', 'card', 'xl'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardEyebrow>Anime drawing class</CardEyebrow>
      <CardTitle className="text-display-md">50% off</CardTitle>
      <CardBody className="mt-2">
        Weekly lessons in character design, inking and colour, at half price for your first
        month.
      </CardBody>
      <CardFooter>
        <Button variant="primary" trailingIcon={<ArrowRightIcon />}>
          Claim offer
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {(['md', 'lg', 'card', 'xl'] as const).map((radius) => (
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
        A home for digital artists and comic creators: publish anime-inspired work, grow an
        audience and stay in touch with the people who follow you.
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

const INNER_GAPS = [2, 3, 4, 5, 6] as const;

export const Gaps: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      {INNER_GAPS.map((gap) => (
        <Card key={gap} gap={gap} padding="md" data-testid={`gap-${gap}`}>
          <CardTitle as="h2" size="heading-sm">
            gap={'{'}
            {gap}
            {'}'}
          </CardTitle>
          <CardBody>The card spaces its children; no margin on the paragraph.</CardBody>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const gap of INNER_GAPS) {
      await expect(getComputedStyle(canvas.getByTestId(`gap-${gap}`)).rowGap).toBe(
        `${gap * 4}px`,
      );
    }
  },
};

export const ABandWithClippedContent: Story = {
  render: () => (
    <div className="grid gap-6">
      <Card variant="brand" padding="xl" glint={['top-start', 'bottom-end']} data-testid="band">
        <CardBody size="lg">
          “I moved four years of commissions across in an afternoon, and the export convinced me
          before the import did.”
        </CardBody>
      </Card>
      <Card padding="none" clip data-testid="clipped">
        <div className="h-24 bg-sunken" />
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByTestId('clipped')).overflow).toBe('hidden');
  },
};

export const TitleAndBodySizes: Story = {
  render: () => (
    <Card padding="md" gap={4}>
      {(['display-md', 'heading-lg', 'heading-md', 'heading-sm', 'body-md'] as const).map(
        (size) => (
          <CardTitle key={size} as="h2" size={size} data-testid={size}>
            size=&quot;{size}&quot;
          </CardTitle>
        ),
      )}
      <CardTitle as="h2" size="display-md" numeric data-testid="numeric">
        $12{' '}
        <Text inline size="md" weight="normal">
          per month
        </Text>
      </CardTitle>
      <CardBody size="md">A body paragraph at the default size.</CardBody>
      <CardBody size="lg">A lead paragraph, one size up.</CardBody>
    </Card>
  ),
  /** Only the size moves: the weight stays the title's. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByTestId('body-md');
    await expect(getComputedStyle(title).fontWeight).toBe(
      getComputedStyle(canvas.getByTestId('heading-lg')).fontWeight,
    );
    await expect(parseFloat(getComputedStyle(title).fontSize)).toBeLessThan(
      parseFloat(getComputedStyle(canvas.getByTestId('heading-lg')).fontSize),
    );
    // A price as a title: tabular, in the title's face, not the display face.
    const price = getComputedStyle(canvas.getByTestId('numeric'));
    await expect(price.fontVariantNumeric).toBe('tabular-nums');
    await expect(price.fontFamily).toBe(getComputedStyle(title).fontFamily);
    await expect(getComputedStyle(title).getPropertyValue('text-wrap-style')).toBe('balance');
  },
};

export const FillsItsCell: Story = {
  render: () => (
    <ul className="grid grid-cols-2 gap-4" data-testid="row">
      {['Round glasses', 'A denim jacket with a name long enough to wrap twice'].map((name) => (
        <li key={name}>
          <Card padding="sm" gap={3} fill>
            <CardContent grow>
              <CardTitle size="body-md">{name}</CardTitle>
            </CardContent>
            <Button size="sm">Add to cart</Button>
          </Card>
        </li>
      ))}
    </ul>
  ),
  /** Both cards are as tall as the row, so their buttons sit on one line. */
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId('row');
    const [first, second] = Array.from(row.querySelectorAll('[data-slot="button"]'));
    await expect(Math.round(first!.getBoundingClientRect().bottom)).toBe(
      Math.round(second!.getBoundingClientRect().bottom),
    );
  },
};

export const BlockContent: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {INNER_GAPS.map((gap) => (
        <Card key={gap} padding="md" data-testid={`content-${gap}`}>
          <CardTitle as="h2" size="heading-sm">
            Visits this week
          </CardTitle>
          <CardContent gap={gap} grow={gap === 3}>
            <List size="sm">
              <ListItem>Monday — 42</ListItem>
              <ListItem>Tuesday — 38</ListItem>
            </List>
            <CardBody>Updated an hour ago.</CardBody>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary">
              Open report
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
  /**
   * Block content is a `div`: a list inside the `<p>` of `CardBody` is invalid
   * HTML that a server render's parser would close early.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas
      .getByTestId('content-3')
      .querySelector('[data-slot="card-content"]')!;

    await expect(content.tagName).toBe('DIV');
    await expect(content.querySelector('ul')).not.toBeNull();
    await expect(getComputedStyle(content).flexGrow).toBe('1');
  },
};
