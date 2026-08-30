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
  title: 'Components/Menubar',
  component: Menubar,
  parameters: {
    docs: {
      description: {
        component:
          'The File / Edit / View strip. One tab stop for the whole bar, arrows between the menus, and the arrows keep working across the bar once a menu is open — which is the reason to use this instead of several dropdowns in a row.',
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

/**
 * The whole bar is one tab stop, and the arrows move between the top-level
 * menus. That is the ARIA menubar pattern and it is the entire reason this
 * component exists — three `DropdownMenu`s side by side would be three tab
 * stops.
 */
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
    await expect(canvas.getByRole('menuitem', { name: 'File' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus();
  },
};

/** Opened, so the panel's own roles and its axe run are exercised. */
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
