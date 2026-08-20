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
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { ChevronDownIcon, GridIcon } from './icons';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component:
          'Built on Radix Primitives. Radix supplies typeahead, arrow-key roving focus, Home and End, the menu and menuitem roles, collision-aware positioning that flips the panel near a viewport edge, and focus return to the trigger on close. Open it and start typing a letter to see typeahead work.',
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

/** From an icon-only trigger, as the reference design's nav uses it. */
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

/**
 * Until this story existed, no story had ever *opened* a menu — so the axe run
 * only ever saw a closed one, and the open state of every menu in the system
 * was unchecked. Opening it immediately found a real violation: Radix's default
 * `modal` menu leaves its own trigger `aria-hidden` and focusable. `DropdownMenu`
 * now defaults `modal` to false; see the reasoning on the component.
 */
export const OpensAndPassesItsAccessibilityRun: Story = {
  ...Default,
  play: async () => {
    await userEvent.click(screen.getAllByRole('button')[0] as HTMLElement);
    const menu = await screen.findByRole('menu');

    await expect(menu).toBeInTheDocument();
    await expect(menu.closest('[aria-hidden="true"]')).toBeNull();
  },
};

/**
 * **The keyboard contract, driven rather than assumed.**
 *
 * Opening the menu was already covered by the story above, which is what found
 * the `aria-hidden` violation. This one drives what happens *after* it opens:
 * arrow keys rove, a disabled item is stepped over rather than focused, Escape
 * closes, and focus returns to the trigger.
 *
 * All four are Radix's, and all four break silently. A wrapper that dropped the
 * `Portal`, or rendered items outside the content, leaves a menu that opens,
 * looks right, and passes every accessibility rule while being unusable without
 * a mouse.
 */
export const KeyboardNavigation: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Browse/ });

    // Opened with the **keyboard**, and the distinction is real: a mouse click
    // opens the menu and deliberately leaves focus on the trigger, while Enter
    // opens it and moves focus to the first item. Driving this with `click`
    // silently tests the mouse path, and the first draft of this story did
    // exactly that and failed here.
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
