import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MD, atLeast } from '@/test/viewport';
import { AppBody, AppHeader, AppMain, AppRail, AppShell } from './AppShell';
import { BottomNav, BottomNavLink } from './BottomNav';
import { Container } from './Container';
import { IconButton } from './IconButton';
import { GridIcon, MenuIcon, SearchIcon, SendIcon, SparkleIcon, UserIcon } from './icons';
import { PageHeader } from './PageHeader';
import { Pane, PaneBody, PaneFooter, PaneHeader } from './Pane';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './Sidebar';
import { Text } from './Text';
import { Visible } from './Visible';
import { Wordmark } from './Wordmark';

const meta = {
  tags: ['autodocs'],
  title: 'Components/AppShell',
  component: AppShell,
  args: { scroll: 'page' },
  argTypes: { scroll: { control: 'inline-radio', options: ['page', 'panes'] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '640px' },
      description: {
        component:
          'The frame of an application: a sticky header, a rail that sticks under it, the main landmark, and a phone tab bar. The parts share the header height through one custom property.',
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const DESTINATIONS = [
  { label: 'Home', icon: <GridIcon />, href: '#/' },
  { label: 'Messages', icon: <SendIcon />, href: '#/messages' },
  { label: 'Profile', icon: <UserIcon />, href: '#/profile' },
];

const header = (
  <AppHeader
    actions={
      <IconButton aria-label="Search" variant="ghost">
        <SearchIcon />
      </IconButton>
    }
  >
    <Visible below="md">
      <IconButton aria-label="Menu" variant="ghost">
        <MenuIcon />
      </IconButton>
    </Visible>
    <Wordmark href="#/" icon={<SparkleIcon />}>
      Commons
    </Wordmark>
  </AppHeader>
);

export const APageBesideARail: Story = {
  render: (args) => (
    <AppShell {...args} data-testid="shell">
      {header}
      <AppBody>
        <AppRail aria-label="Sections" data-testid="rail">
          <Sidebar collapsible="none" variant="plain">
            <SidebarContent aria-label="Sections">
              <SidebarGroup>
                <SidebarMenu>
                  {DESTINATIONS.map(({ label, icon, href }, index) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild isActive={index === 0}>
                        <a href={href}>
                          {icon}
                          <SidebarLabel>{label}</SidebarLabel>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </AppRail>
        <AppMain>
          <Container width="full">
            <PageHeader title="Home" description="What happened while you were away" />
            {Array.from({ length: 12 }, (_, index) => (
              <Text key={index}>
                Paragraph {index + 1}. Enough content to scroll the page under the sticky
                header.
              </Text>
            ))}
          </Container>
        </AppMain>
      </AppBody>
      <BottomNav aria-label="Main" data-testid="bottom-nav">
        {DESTINATIONS.map(({ label, icon, href }, index) => (
          <BottomNavLink key={label} href={href} icon={icon} current={index === 0}>
            {label}
          </BottomNavLink>
        ))}
      </BottomNav>
    </AppShell>
  ),
  /**
   * The rail starts exactly where the header ends and fills the rest of the
   * viewport, because both read the shell's one header height. Below `md` the
   * rail is gone and the tab bar takes over, and the other way round above it.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector('[data-slot="app-header"]') as HTMLElement;
    const rail = canvas.getByTestId('rail');
    const bottomNav = canvas.getByTestId('bottom-nav');
    const headerBox = header.getBoundingClientRect();

    await expect(getComputedStyle(header).position).toBe('sticky');
    await expect(Math.round(headerBox.height)).toBe(68);
    await expect(canvas.getByRole('main')).toHaveAttribute('data-slot', 'app-main');

    if (atLeast(MD)) {
      const railBox = rail.getBoundingClientRect();
      await expect(Math.round(railBox.top)).toBe(Math.round(headerBox.bottom));
      await expect(Math.round(railBox.height)).toBe(
        Math.round(window.innerHeight - headerBox.height),
      );
      await expect(getComputedStyle(bottomNav).display).toBe('none');
    } else {
      await expect(getComputedStyle(rail).display).toBe('none');
      await expect(getComputedStyle(bottomNav).position).toBe('sticky');
      // Sticky, not fixed: the bar sits at the foot of the viewport.
      await expect(Math.round(bottomNav.getBoundingClientRect().bottom)).toBe(
        window.innerHeight,
      );
    }
  },
};

export const AnApplicationThatScrollsInPanes: Story = {
  args: { scroll: 'panes' },
  render: (args) => (
    <AppShell {...args} data-testid="shell">
      {header}
      <AppBody width="full">
        <AppMain>
          <Pane height="fill" data-testid="pane">
            <PaneHeader>
              <Text inline weight="medium" tone="primary" truncate>
                Planning a trip to Kyoto in the spring, with a long title that truncates
              </Text>
            </PaneHeader>
            <PaneBody padding="md" data-testid="body">
              {Array.from({ length: 30 }, (_, index) => (
                <Text key={index}>Turn {index + 1} of a long conversation.</Text>
              ))}
            </PaneBody>
            <PaneFooter>
              <Text size="sm">The composer stays on the screen.</Text>
            </PaneFooter>
          </Pane>
        </AppMain>
      </AppBody>
    </AppShell>
  ),
  /** The shell fits the viewport exactly; only the pane's body scrolls. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shell = canvas.getByTestId('shell');
    const viewport = canvas
      .getByTestId('body')
      .querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;

    await expect(Math.round(shell.getBoundingClientRect().height)).toBe(window.innerHeight);
    await expect(shell.scrollHeight).toBe(shell.clientHeight);
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
  },
};
