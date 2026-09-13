import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './Button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from './Dialog';
import { IconButton } from './IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { GridIcon, SearchIcon } from './icons';

/**
 * What happens when two overlays meet. Each of these renders in a portal at the
 * end of `<body>`, so nothing about their order in the JSX decides which one is
 * on top — the named stacking layers do.
 */
const meta = {
  tags: ['autodocs'],
  title: 'Foundations/Stacking',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Explore overlays that appear together: a dialog with a menu, a dialog with a tooltip, and a custom portal container. Named stacking layers determine which panel appears above another. Open each example and use the keyboard to check focus and dismissal.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reads the painted stacking order rather than the class list: `z-index` is
 *  what the browser actually resolved, class names are only what we asked for. */
const layerOf = (element: Element) => Number(getComputedStyle(element).zIndex);

/**
 * `pop-in` starts at `opacity: 0`, so an overlay asserted on the frame it opens
 * is correctly reported as not visible. That is the animation working, not the
 * stacking failing — wait for it to finish arriving before judging it.
 */
const seen = (element: Element) => waitFor(() => expect(element).toBeVisible());

export const TooltipInsideADialog: Story = {
  render: () => (
    <div className="p-8">
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Search the gallery</DialogTitle>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton aria-label="Search the gallery" variant="primary">
                  <SearchIcon />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Search every episode</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await userEvent.hover(screen.getByRole('button', { name: 'Search the gallery' }));

    const tooltip = await waitFor(() => screen.getByRole('tooltip'));

    // Visible, and above the dialog it was opened from.
    await seen(tooltip);
    await expect(layerOf(tooltip)).toBeGreaterThan(layerOf(dialog));
  },
};

export const MenuInsideADialog: Story = {
  render: () => (
    <div className="p-8">
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Sort the gallery</DialogTitle>
          <DialogFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton aria-label="Sort by">
                  <GridIcon />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Newest</DropdownMenuItem>
                <DropdownMenuItem>Most liked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Sort by' }));

    const menu = await screen.findByRole('menu');

    await seen(menu);
    await expect(layerOf(menu)).toBeGreaterThan(layerOf(dialog));

    // And reachable — a menu painted above but left inert is the failure this
    // pairing actually produces, and it looks identical in a screenshot.
    const item = screen.getByRole('menuitem', { name: 'Newest' });
    await seen(item);
    await expect(item.closest('[inert]')).toBeNull();
  },
};

export const ADialogIsAboveItsOwnScrim: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join the class</DialogTitle>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const dialog = await screen.findByRole('dialog');
    const scrim = dialog.parentElement?.querySelector('[data-state="open"].fixed.inset-0');

    await expect(scrim).not.toBeNull();
    await seen(dialog);
    await expect(layerOf(dialog)).toBeGreaterThan(layerOf(scrim as Element));
    await expect(canvasElement).toBeTruthy();
  },
};

/**
 * An overlay is portalled to the end of `<body>` so no ancestor's
 * `overflow: hidden` can clip it. `container` sends it somewhere else — into a
 * shadow root, into a container query, or into somebody else's modal.
 *
 * It is a prop on each content component rather than a provider, because a
 * React context needs a client component and this system ships no
 * `"use client"` of its own.
 */
/**
 * The host has to exist before it can be pointed at, which is the one awkward
 * part of a container prop: a callback ref, and a first render that portals to
 * `<body>` before the second moves it.
 *
 * The host wraps the trigger rather than sitting beside it: Radix marks
 * everything outside an open modal overlay as `aria-hidden`, working outwards
 * from the portal container, and a container that is not an ancestor of the
 * trigger leaves the trigger hidden.
 */
function MenuInAChosenContainer() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  return (
    <div ref={setHost} data-testid="overlay-host" className="p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Sort by">
            <GridIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent container={host}>
          <DropdownMenuItem>Newest</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const AConsumerCanChooseTheContainer: Story = {
  render: () => <MenuInAChosenContainer />,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid="overlay-host"]');
    // Opened by clicking, not by `defaultOpen`. A modal menu that is open
    // before focus has ever moved into it leaves its own trigger `aria-hidden`
    // *and* focusable, which axe reports as `aria-hidden-focus` — a state no
    // user can reach, and a failure that has nothing to do with the container.
    await userEvent.click(screen.getByRole('button', { name: 'Sort by' }));
    const menu = await screen.findByRole('menu');

    // Inside the chosen host, not at the end of <body> where it would default.
    await expect(host?.contains(menu)).toBe(true);
    await expect(document.body.contains(host as Node)).toBe(true);
  },
};
