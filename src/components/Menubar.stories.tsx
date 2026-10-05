import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './Menubar';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Menubar',
  component: Menubar,
  parameters: {
    docs: {
      description: {
        component:
          'A desktop-style strip of command menus, such as File, Edit and View. Arrow keys move between menus and items. Use NavigationMenu for links to site sections.',
      },
    },
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [wrap, setWrap] = useState(true);
    const [zoom, setZoom] = useState('100');

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New visit
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Open patient
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>Print — no printer</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={wrap}
              onCheckedChange={(next) => setWrap(next === true)}
            >
              Wrap long notes
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Zoom</MenubarLabel>
            <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
              <MenubarRadioItem value="90">90%</MenubarRadioItem>
              <MenubarRadioItem value="100">100%</MenubarRadioItem>
              <MenubarRadioItem value="125">125%</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

export const TheWholeBarIsOneTabStop: Story = {
  render: () => (
    <div>
      <button type="button">Before</button>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New visit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <button type="button">After</button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Before' }).focus();

    await userEvent.tab();
    const file = canvas.getByRole('menuitem', { name: 'File' });
    await expect(file).toHaveFocus();
    await expect(getComputedStyle(file).outlineStyle).toBe('solid');
    await expect(getComputedStyle(file).outlineWidth).toBe('2px');

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus();
  },
};

export const OpensAndPassesItsAccessibilityRun: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New visit</MenubarItem>
          <MenubarItem>Open patient</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }));

    await waitFor(async () => {
      await expect(screen.getByRole('menuitem', { name: 'New visit' })).toBeInTheDocument();
    });
  },
};

/**
 * A destructive command takes the same `variant` as the dropdown and context
 * menus, so it reads the shared danger colour instead of a hand-set one.
 */
export const ADestructiveCommandIsMarked: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Visit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Print summary<MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="danger">Cancel visit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('menuitem', { name: 'Visit' }));
    const danger = await screen.findByRole('menuitem', { name: 'Cancel visit' });
    const plain = screen.getByRole('menuitem', { name: /Print summary/ });

    await expect(danger).toHaveAttribute('data-variant', 'danger');
    await expect(plain).toHaveAttribute('data-variant', 'default');
    await expect(getComputedStyle(danger).color).not.toBe(getComputedStyle(plain).color);
  },
};
