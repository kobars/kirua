import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { ChevronDownIcon, GridIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      story: { height: '400px' },
      description: {
        component:
          'A menu of actions attached to a trigger. Radix supplies keyboard navigation, typeahead and focus return. Use NavigationMenu for site navigation.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" trailingIcon={<ChevronDownIcon />}>
          Browse
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Categories</DropdownMenuLabel>
        <DropdownMenuItem>Chibi characters</DropdownMenuItem>
        <DropdownMenuItem>Digital comics</DropdownMenuItem>
        <DropdownMenuItem>Cartoon animations</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Marketplace</DropdownMenuItem>
        <DropdownMenuItem disabled>Commissions — closed</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const FromIconButton: Story = {
  render: function Render() {
    const [sort, setSort] = useState('newest');
    const [showDrafts, setShowDrafts] = useState(true);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Gallery options" variant="primary">
            <GridIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">Most liked</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showDrafts} onCheckedChange={setShowDrafts}>
            Show drafts
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const OpensAndPassesItsAccessibilityRun: Story = {
  ...Default,
  play: async () => {
    await userEvent.click(screen.getAllByRole('button')[0] as HTMLElement);
    const menu = await screen.findByRole('menu');

    await expect(menu).toBeInTheDocument();
    await expect(menu.closest('[aria-hidden="true"]')).toBeNull();
  },
};

export const KeyboardNavigation: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Browse/ });

    // Opened with the **keyboard**, and the distinction is real: a mouse click
    // opens the menu and deliberately leaves focus on the trigger, while Enter
    // opens it and moves focus to the first item. Driving this with `click`
    // would silently test the mouse path and fail here.
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await expect(screen.getByRole('menuitem', { name: 'Chibi characters' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Digital comics' })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    await expect(screen.getByRole('menuitem', { name: 'Chibi characters' })).toHaveFocus();

    // End goes to the last *enabled* item. "Commissions — closed" is disabled
    // and must be skipped: focusing a control that cannot be actioned is a dead
    // end a mouse user never encounters.
    await userEvent.keyboard('{End}');
    await expect(screen.getByRole('menuitem', { name: 'Marketplace' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  },
};

/**
 * A shortcut sits at the end of its row in the same muted caption the context
 * menu and the menubar use, so one command shows one hint wherever it opens.
 */
export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" trailingIcon={<ChevronDownIcon />}>
          Conversation
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          Rename<DropdownMenuShortcut>F2</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Duplicate<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Conversation/ }));
    const row = await screen.findByRole('menuitem', { name: /Rename/ });
    const hint = within(row).getByText('F2');

    await expect(hint).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
    // Pushed to the end of the row, past the label.
    await expect(hint.getBoundingClientRect().left).toBeGreaterThan(
      row.getBoundingClientRect().left + row.getBoundingClientRect().width / 2,
    );
  },
};
