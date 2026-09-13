import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Container } from './Container';
import { Heading } from './Heading';
import { Section } from './Section';
import { Text } from './Text';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Section',
  component: Section,
  args: { gap: 'md' },
  argTypes: { gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A content block with shared internal spacing. Place its heading inside the section and use Container for the spacing between page sections.',
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
