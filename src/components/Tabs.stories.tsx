import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Card, CardBody, CardTitle } from './Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Switch between related panels within a page. Radix supplies tab/panel relationships and arrow-key navigation. Use links for navigation to separate pages.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANELS = [
  {
    value: 'chibi',
    label: 'Chibi',
    title: 'Chibi characters',
    body: 'Short, rounded character studies. Good for stickers, avatars, and merch.',
  },
  {
    value: 'comics',
    label: 'Comics',
    title: 'Digital comics',
    body: 'Multi-panel stories with lettering, published straight to your portfolio page.',
  },
  {
    value: 'motion',
    label: 'Motion',
    title: 'Cartoon animations',
    body: 'Short looping animations, exported for social or sold as licensed clips.',
  },
];

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="chibi">
      <TabsList>
        {PANELS.map((panel) => (
          <TabsTrigger key={panel.value} value={panel.value}>
            {panel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          <Card variant="light" padding="lg" className="max-w-lg">
            <CardTitle>{panel.title}</CardTitle>
            <CardBody className="mt-2">{panel.body}</CardBody>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

export const ArrowKeysMoveBetweenTabs: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chibi = canvas.getByRole('tab', { name: 'Chibi' });

    await userEvent.click(chibi);
    await expect(chibi).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowRight}');
    const comics = canvas.getByRole('tab', { name: 'Comics' });
    await expect(comics).toHaveFocus();
    await expect(comics).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Digital comics');

    // Wrapping is behaviour, not an edge case: three tabs, three rights, back
    // to the first. A list that stopped at the end would strand the last tab.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(chibi).toHaveFocus();
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Chibi characters');
  },
};
