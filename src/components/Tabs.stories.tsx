import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardTitle } from './Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Built on Radix Primitives. Radix supplies the tablist, tab, and tabpanel relationships, arrow-key movement between tabs, and the rule that Tab moves OUT of the tab list into the active panel rather than through every tab in turn. That keyboard model is where most hand-rolled tabs fail. The active tab is marked by fill AND weight, never by colour alone.',
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
