import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  AppBody,
  AppHeader,
  AppMain,
  AppRail,
  AppShell,
  CalendarIcon,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  GridIcon,
  Container,
  IconButton,
  Inline,
  Kbd,
  MenuIcon,
  PillIcon,
  PlusIcon,
  SearchIcon,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
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
  Stack,
  StethoscopeIcon,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UserIcon,
  Visible,
  Wordmark,
} from 'kirua';
import { Appointments } from './Appointments';
import { Lab } from './Lab';
import { NewVisit } from './NewVisit';
import { PatientList } from './PatientList';
import { PatientRecord } from './PatientRecord';
import { Pharmacy } from './Pharmacy';
import { Summary } from './Summary';
import { ThemeMenu } from '../shared/ThemeMenu';
import { APPEARANCE } from '../shared/themeLabels';
import { HOSPITAL, patients } from './data';
import { useHashRoute } from '../shared/useHashRoute';

/** The destinations, grouped the way the hospital is. */
const sections = [
  {
    label: 'Clinical',
    items: [
      { route: '', label: 'Summary', icon: GridIcon },
      { route: 'patients', label: 'Patients', icon: UserIcon },
      { route: 'schedule', label: 'Schedule', icon: CalendarIcon },
      { route: 'new-visit', label: 'New visit', icon: PlusIcon },
    ],
  },
  {
    label: 'Ancillary services',
    items: [
      { route: 'lab', label: 'Laboratory', icon: StethoscopeIcon },
      { route: 'pharmacy', label: 'Pharmacy', icon: PillIcon },
    ],
  },
] as const;

const nav = sections.flatMap((section) => [...section.items]);

export function App() {
  const [route, navigate] = useHashRoute('his', '');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const actions = useMemo(() => {
    const all = [
      ...nav.map((item) => ({
        id: item.route || 'summary',
        label: item.label,
        go: item.route,
      })),
      ...patients.map((p) => ({
        id: p.mrn,
        label: `${p.name} — MRN ${p.mrn}`,
        go: `patients/${p.mrn}`,
      })),
    ];
    const q = query.trim().toLowerCase();
    return q === '' ? all : all.filter((a) => a.label.toLowerCase().includes(q));
  }, [query]);

  const run = (index: number) => {
    const action = actions[index];
    if (!action) return;
    navigate(action.go);
    setPaletteOpen(false);
    setQuery('');
    setActive(0);
  };

  const record = route.startsWith('patients/')
    ? patients.find((p) => p.mrn === route.slice('patients/'.length))
    : undefined;

  /**
   * One list of destinations, rendered twice: as the rail on a wide screen and
   * inside a `Sheet` on a phone. A 64px icon rail is still 64px a phone does
   * not have, so the small screen gets the drawer instead of the rail.
   */
  const destinations = (onNavigate?: () => void) => (
    <>
      {sections.map((section, index) => (
        <Fragment key={section.label}>
          {index > 0 && <SidebarSeparator />}
          <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(({ route: target, label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild isActive={route === target}>
                    <a href={`#/his/${target}`} onClick={onNavigate}>
                      <Icon aria-hidden="true" />
                      <SidebarLabel>{label}</SidebarLabel>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </Fragment>
      ))}
    </>
  );

  return (
    <AppShell>
      <AppHeader
        width="7xl"
        actions={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  aria-label="Quick search"
                  variant="ghost"
                  onClick={() => setPaletteOpen(true)}
                >
                  <SearchIcon />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>
                <Inline as="span" gap={1.5}>
                  Quick search <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </Inline>
              </TooltipContent>
            </Tooltip>
            <ThemeMenu labels={APPEARANCE} />
          </>
        }
      >
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Visible below="md">
            <SheetTrigger asChild>
              <IconButton aria-label="Menu" variant="ghost">
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
          </Visible>
          <SheetContent side="start" scroll gap={4}>
            <SheetTitle>Larkspur · {HOSPITAL}</SheetTitle>
            <Stack as="nav" aria-label="Sections" gap={4}>
              {destinations(() => setDrawerOpen(false))}
            </Stack>
          </SheetContent>
        </Sheet>

        <Wordmark href="#/his/" icon={<StethoscopeIcon />} shortName="Larkspur">
          Larkspur · Juniper Valley
        </Wordmark>
      </AppHeader>

      <AppBody width="7xl">
        <AppRail aria-label="Units and sections">
          <Sidebar open={railOpen} collapsible="icon" variant="plain">
            {/* Which unit and shift this rail belongs to. The icon carries it
                when the rail collapses; the words are a `SidebarLabel`, which
                goes off the screen rather than out of the accessibility tree. */}
            <SidebarHeader size="sm">
              <UserIcon aria-hidden="true" tone="accent" />
              <SidebarLabel>
                <Text inline size="sm" weight="medium" tone="primary">
                  Outpatient clinics · day shift
                </Text>
              </SidebarLabel>
            </SidebarHeader>
            <SidebarContent aria-label="Sections">{destinations()}</SidebarContent>
            <SidebarFooter divider={false}>
              <SidebarMenuButton onClick={() => setRailOpen(!railOpen)}>
                <MenuIcon aria-hidden="true" />
                <SidebarLabel>{railOpen ? 'Collapse menu' : 'Expand menu'}</SidebarLabel>
              </SidebarMenuButton>
            </SidebarFooter>
          </Sidebar>
        </AppRail>

        <AppMain>
          <Container width="full" pad="sm">
            {record ? (
              <PatientRecord patient={record} />
            ) : route === 'schedule' ? (
              <Appointments />
            ) : route === 'new-visit' ? (
              <NewVisit />
            ) : route === 'pharmacy' ? (
              <Pharmacy />
            ) : route === 'lab' ? (
              <Lab />
            ) : route === 'patients' ? (
              <PatientList
                onOpen={(mrn) => navigate(`patients/${mrn}`)}
                onNewVisit={() => navigate('new-visit')}
              />
            ) : (
              <Summary />
            )}
          </Container>
        </AppMain>
      </AppBody>

      <Command open={paletteOpen} onOpenChange={setPaletteOpen} label="Quick commands">
        <CommandInput
          value={query}
          placeholder="Search patients, MRNs or sections…"
          aria-label="Search patients, MRNs or sections"
          aria-controls="his-results"
          aria-activedescendant={actions[active] ? `action-${actions[active].id}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActive((i) => Math.min(i + 1, actions.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              run(active);
            }
          }}
        />
        {actions.length > 0 ? (
          <CommandList id="his-results" aria-label="Results">
            <CommandGroup heading="Commands">
              {actions.map((action, index) => (
                <CommandItem
                  key={action.id}
                  id={`action-${action.id}`}
                  isActive={index === active}
                  shortcut={index === active ? <Kbd>⏎</Kbd> : undefined}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => run(index)}
                >
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        ) : (
          <CommandEmpty>Nothing matches “{query}”.</CommandEmpty>
        )}
      </Command>
    </AppShell>
  );
}
