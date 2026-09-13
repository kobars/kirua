import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from './ContextMenu';
import { Item, ItemContent, ItemTitle } from './Item';

const meta = {
  tags: ['autodocs'],
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    docs: {
      story: { height: '400px' },
      description: {
        component:
          'Actions opened from a contextual gesture such as right-click. Also provide a visible, keyboard-accessible route to essential actions for touch and keyboard users.',
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Item variant="outline" interactive className="w-80">
          <ItemContent>
            <ItemTitle>Right-click this row</ItemTitle>
          </ItemContent>
        </Item>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Open
          <ContextMenuShortcut>⏎</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Move to folder</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithChoices: Story = {
  render: function Render() {
    const [density, setDensity] = useState('comfortable');
    const [showArchived, setShowArchived] = useState(false);

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Item variant="outline" interactive className="w-80">
            <ItemContent>
              <ItemTitle>Right-click for view options</ItemTitle>
            </ItemContent>
          </Item>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Density</ContextMenuLabel>
          <ContextMenuRadioGroup value={density} onValueChange={setDensity}>
            <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showArchived}
            onCheckedChange={(next) => setShowArchived(next === true)}
          >
            Show archived
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const OpensAtThePointerAndPassesItsAccessibilityRun: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Item variant="outline" interactive className="w-80" data-testid="row">
          <ItemContent>
            <ItemTitle>Invoice 812</ItemTitle>
          </ItemContent>
        </Item>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-testid="row"]') as HTMLElement;
    row.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 40, clientY: 40 }),
    );

    const menu = await screen.findByRole('menu');
    await expect(menu).toBeInTheDocument();
    await expect(screen.getAllByRole('menuitem')).toHaveLength(2);

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  },
};
