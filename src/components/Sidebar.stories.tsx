import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './Avatar';
import { IconButton } from './IconButton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from './Sidebar';
import { CalendarIcon, GridIcon, MenuIcon, PillIcon, StethoscopeIcon, UserIcon } from './icons';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  args: { collapsible: 'icon', open: true },
  argTypes: {
    collapsible: { control: 'inline-radio', options: ['icon', 'offcanvas', 'none'] },
    open: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The application rail. It holds no state: `open` is a prop and the button that changes it belongs to the application, which is also where an open state that survives a reload has to live.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Destinations = () => (
  <>
    <SidebarGroup>
      <SidebarGroupLabel>Clinic</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive>
            <UserIcon />
            <SidebarLabel>Patients</SidebarLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <CalendarIcon />
            <SidebarLabel>Appointments</SidebarLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <StethoscopeIcon />
            <SidebarLabel>Visits</SidebarLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    <SidebarSeparator />
    <SidebarGroup>
      <SidebarGroupLabel>Pharmacy</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <PillIcon />
            <SidebarLabel>Stock</SidebarLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <GridIcon />
            <SidebarLabel>Reports</SidebarLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </>
);

export const Playground: Story = {
  render: (args) => (
    <div className="h-104 bg-page">
      <Sidebar {...args}>
        <SidebarHeader>
          <IconButton aria-label="Toggle the sidebar" variant="ghost">
            <MenuIcon />
          </IconButton>
          <SidebarLabel className="font-semibold text-fg">Klinik Senja</SidebarLabel>
        </SidebarHeader>
        <SidebarContent aria-label="Sections">
          <Destinations />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <SidebarLabel className="text-body-sm text-fg-secondary">dr. Rahmi</SidebarLabel>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const Collapsible: Story = {
  render: (args) => (
    <div className="flex h-104 gap-4 bg-page">
      <Sidebar {...args} collapsible="icon" open={false}>
        <SidebarContent aria-label="Icon rail">
          <Destinations />
        </SidebarContent>
      </Sidebar>
      <Sidebar {...args} collapsible="offcanvas" open>
        <SidebarContent aria-label="Off-canvas">
          <Destinations />
        </SidebarContent>
      </Sidebar>
      <Sidebar {...args} collapsible="none">
        <SidebarContent aria-label="Always open">
          <Destinations />
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};

/**
 * The application owns the state, and this is what that looks like. The rail
 * narrows and the labels go — the icons and their targets stay, which is the
 * whole difference between `icon` and `offcanvas`.
 */
export const TheApplicationOwnsTheOpenState: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);

    return (
      <div className="h-104 bg-page">
        <Sidebar {...args} open={open} collapsible="icon">
          <SidebarHeader>
            <IconButton
              aria-label={open ? 'Collapse the sidebar' : 'Expand the sidebar'}
              variant="ghost"
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
          </SidebarHeader>
          <SidebarContent aria-label="Sections">
            <Destinations />
          </SidebarContent>
        </Sidebar>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvasElement.querySelector('[data-slot="sidebar"]') as HTMLElement;
    const label = canvasElement.querySelector('[data-slot="sidebar-label"]') as HTMLElement;

    await expect(rail).toHaveAttribute('data-open');
    await expect(label.getBoundingClientRect().width).toBeGreaterThan(1);
    const wide = rail.getBoundingClientRect().width;

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse the sidebar' }));

    await expect(rail).toHaveAttribute('data-closed');
    await waitFor(async () => {
      await expect(rail.getBoundingClientRect().width).toBeLessThan(wide);
    });

    // Off the screen, still in the accessibility tree. `hidden` here would take
    // the name off every button on the rail.
    await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvas.getByRole('button', { name: 'Patients' })).toBeInTheDocument();
  },
};

/**
 * The active row is announced, not merely coloured. `aria-current="page"` is
 * what a screen reader reads; a background colour is silent.
 */
export const TheCurrentPageIsAnnounced: Story = {
  render: (args) => (
    <div className="h-64 bg-page">
      <Sidebar {...args}>
        <SidebarContent aria-label="Sections">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <UserIcon />
                <SidebarLabel>Patients</SidebarLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CalendarIcon />
                <SidebarLabel>Appointments</SidebarLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Patients' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('button', { name: 'Appointments' })).not.toHaveAttribute(
      'aria-current',
    );
  },
};

/** A row that navigates should be an anchor, which is what `asChild` is for. */
export const AsLink: Story = {
  render: (args) => (
    <div className="h-64 bg-page">
      <Sidebar {...args}>
        <SidebarContent aria-label="Sections">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <a href="#/patients">
                  <UserIcon />
                  <SidebarLabel>Patients</SidebarLabel>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Patients' });

    await expect(link).toHaveAttribute('href', '#/patients');
    await expect(link).toHaveAttribute('aria-current', 'page');
  },
};

export const AlwaysOpen: Story = {
  args: { collapsible: 'none' },
  render: (args) => (
    <div className="h-64 bg-page">
      <Sidebar {...args}>
        <SidebarContent aria-label="Sections">
          <Destinations />
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
