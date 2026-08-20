import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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

/**
 * **Arrow keys move between tabs, and the panel follows.**
 *
 * This is the keyboard model most hand-rolled tab sets get wrong: arrows move
 * between the triggers, and `Tab` leaves the list for the panel rather than
 * walking through every trigger in turn. Radix supplies it; nothing here
 * checked that the wrapper had not broken it.
 *
 * Asserting the *panel* as well as the trigger is the point. A roving tabindex
 * that moved focus without changing `aria-selected` — or a panel that stayed on
 * the old value — would leave a sighted mouse user perfectly happy and a screen
 * reader user reading content that does not match the tab they are on.
 */
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
