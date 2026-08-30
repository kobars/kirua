import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Container } from './Container';
import { Heading } from './Heading';
import { Section } from './Section';
import { Text } from './Text';

const meta = {
  title: 'Components/Section',
  component: Section,
  args: { gap: 'md' },
  argTypes: { gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component:
          'One block of a page. The gap here is inside a block; the gap between blocks belongs to the Container — a distinction the hand-written shells did not draw.',
      },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Section {...args}>
      <Heading as="h2" size="heading-md">
        What actually differs
      </Heading>
      <Text>Every plan carries the same gallery. What changes is how many you get.</Text>
    </Section>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Section {...args} key={gap} gap={gap}>
          <Heading as="h2" size="body-md">
            gap {gap}
          </Heading>
          <Text size="sm">The line the heading names.</Text>
        </Section>
      ))}
    </div>
  ),
};

/**
 * A named section is announced as a region; an unnamed one is not a landmark at
 * all. Both are correct, and which one you get is decided by whether you gave
 * it a name — so it is asserted rather than assumed.
 */
export const NamedBecomesALandmark: Story = {
  render: (args) => (
    <Container width="3xl">
      <Section {...args} aria-labelledby="plans">
        <Heading as="h2" id="plans" size="heading-md">
          The plans
        </Heading>
        <Text size="sm">Three of them.</Text>
      </Section>
      <Section {...args} data-testid="unnamed">
        <Text size="sm">A block with no name of its own.</Text>
      </Section>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('region', { name: 'The plans' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('region')).toHaveLength(1);
    await expect(canvas.getByTestId('unnamed').tagName).toBe('SECTION');
  },
};
