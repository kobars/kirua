import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
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
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from './Sidebar';
import {
  CalendarIcon,
  GridIcon,
  MenuIcon,
  MoreIcon,
  PillIcon,
  StethoscopeIcon,
  UserIcon,
} from './icons';
import { Text } from './Text';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Sidebar',
  component: Sidebar,
  args: { collapsible: 'icon', open: true },
  argTypes: {
    collapsible: { control: 'inline-radio', options: ['icon', 'offcanvas', 'none'] },
    open: { control: 'boolean' },
  },
  parameters: {
    docs: {
      story: { height: '540px' },
      description: {
        component:
          'An application navigation rail. The application owns open state, its toggle and any persistence. Include an accessible navigation label.',
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
          <SidebarLabel className="font-semibold text-fg">Dusk Clinic</SidebarLabel>
        </SidebarHeader>
        <SidebarContent aria-label="Sections">
          <Destinations />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <SidebarLabel className="text-body-sm text-fg-secondary">Dr. Rahmi</SidebarLabel>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Toggle the sidebar' }).focus();
    await userEvent.tab();

    // `outline-none` beside a `focus-visible:outline-2` cancels the ring: the
    // first sets the outline-style variable the second reads to `none`.
    const row = canvas.getAllByRole('button').find((el) => el === document.activeElement);
    await expect(row).toHaveAttribute('data-slot', 'sidebar-menu-button');
    const style = getComputedStyle(row as HTMLElement);
    await expect(style.outlineStyle).toBe('solid');
    await expect(style.outlineWidth).toBe('2px');
  },
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

export const APlainRailWithActionsAndCounts: Story = {
  render: () => (
    <div className="h-96">
      <Sidebar collapsible="none" variant="plain" width="sm" data-testid="rail">
        <SidebarHeader size="sm">
          <UserIcon aria-hidden="true" />
          <SidebarLabel>
            <Text inline size="sm" weight="medium" tone="primary">
              Outpatients · morning
            </Text>
          </SidebarLabel>
        </SidebarHeader>
        <SidebarContent aria-label="Conversations">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <a href="#/c/12">
                  <SidebarLabel>Trip plan</SidebarLabel>
                </a>
              </SidebarMenuButton>
              <SidebarMenuAction>
                <IconButton aria-label="More for Trip plan" size="sm" variant="ghost">
                  <MoreIcon />
                </IconButton>
              </SidebarMenuAction>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#/notifications">
                  <GridIcon />
                  <SidebarLabel>Notifications</SidebarLabel>
                  <SidebarMenuBadge>
                    <Badge status="info">3</Badge>
                  </SidebarMenuBadge>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter divider={false} data-testid="footer">
          <SidebarMenuButton>
            <MenuIcon aria-hidden="true" />
            <SidebarLabel>Collapse menu</SidebarLabel>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
  /**
   * The action is a sibling of the link, never inside it, and the link leaves
   * room for it. The count is inside the link, so it is part of its name.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvas.getByTestId('rail');
    const link = canvas.getByRole('link', { name: 'Trip plan' });
    const action = canvas.getByRole('button', { name: 'More for Trip plan' });

    await expect(link.contains(action)).toBe(false);
    await expect(action.getBoundingClientRect().left).toBeGreaterThan(
      link.getBoundingClientRect().left,
    );
    await expect(getComputedStyle(link).paddingInlineEnd).toBe('44px');
    await expect(canvas.getByRole('link', { name: 'Notifications 3' })).toBeVisible();
    await expect(Math.round(rail.getBoundingClientRect().width)).toBe(208);
    await expect(getComputedStyle(rail).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(canvas.getByTestId('footer')).borderTopWidth).toBe('0px');
  },
};

export const AWideRailWithAColumnOfControls: Story = {
  render: () => (
    <div className="h-80">
      <Sidebar collapsible="none" width="lg" data-testid="rail">
        <SidebarHeader size="auto" data-testid="header">
          <Button fullWidth>New chat</Button>
          <Button variant="ghost" fullWidth>
            Search everything
          </Button>
        </SidebarHeader>
        <SidebarContent aria-label="Conversations" data-testid="list">
          <SidebarMenu>
            {Array.from({ length: 12 }, (_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <a href={`#/c/${index}`}>
                    <SidebarLabel>Conversation {index + 1}</SidebarLabel>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
  /** The header grows to hold its controls, and only the list below it scrolls. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByTestId('header');
    const [first, second] = Array.from(header.children) as HTMLElement[];
    await expect(second!.getBoundingClientRect().top).toBeGreaterThan(
      first!.getBoundingClientRect().bottom,
    );
    await expect(first!.getBoundingClientRect().width).toBe(
      header.clientWidth -
        parseFloat(getComputedStyle(header).paddingInlineStart) -
        parseFloat(getComputedStyle(header).paddingInlineEnd),
    );
    const list = canvas.getByTestId('list');
    await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    await expect(Math.round(canvas.getByTestId('rail').getBoundingClientRect().width)).toBe(
      288,
    );
  },
};
