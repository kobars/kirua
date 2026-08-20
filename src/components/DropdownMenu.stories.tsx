import type { Meta, StoryObj } from '@storybook/react-vite';
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
