import { useEffect, useMemo, useState } from 'react';
import {
  CalendarIcon,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  GridIcon,
  IconButton,
  Kbd,
  Link,
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
  StethoscopeIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UserIcon,
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
import { patients } from './data';
import { useHashRoute } from '../shared/useHashRoute';

/** The destinations, grouped the way the building is. */
const sections = [
  {
    label: 'Clinic',
    items: [
      { route: '', label: 'Summary', icon: GridIcon },
      { route: 'patients', label: 'Patients', icon: UserIcon },
      { route: 'schedule', label: 'Schedule', icon: CalendarIcon },
      { route: 'new-visit', label: 'New visit', icon: PlusIcon },
    ],
  },
  {
    label: 'Diagnostics',
    items: [
      { route: 'lab', label: 'Laboratory', icon: StethoscopeIcon },
      { route: 'pharmacy', label: 'Pharmacy', icon: PillIcon },
    ],
  },
] as const;

const nav = sections.flatMap((section) => [...section.items]);

export function App() {
  const [route, navigate] = useHashRoute('');
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
        id: p.rm,
        label: `${p.name} — ${p.rm}`,
        go: `patients/${p.rm}`,
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
    ? patients.find((p) => p.rm === route.slice('patients/'.length))
    : undefined;

  /**
   * One list of destinations, rendered twice: as the rail on a wide screen and
   * inside a `Sheet` on a phone. A 64px icon rail is still 64px a phone does
   * not have, so the small screen gets the drawer instead of the rail.
   */
  const destinations = (onNavigate?: () => void) => (
    <>
      {sections.map((section, index) => (
        <div key={section.label} className="contents">
          {index > 0 && <SidebarSeparator />}
          <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(({ route: target, label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild isActive={route === target}>
                    <a href={`#/${target}`} onClick={onNavigate}>
                      <Icon aria-hidden="true" />
                      <SidebarLabel>{label}</SidebarLabel>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-page/95 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <IconButton aria-label="Menu" variant="ghost" className="md:hidden">
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetContent side="start" className="overflow-y-auto pt-14">
              <SheetTitle>SIMRS Healthy Together</SheetTitle>
              <nav aria-label="Sections" className="mt-4 grid gap-4">
                {destinations(() => setDrawerOpen(false))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="#/"
            variant="block"
            className="flex items-center gap-2 text-body-md font-semibold [--icon-size:var(--icon-lg)]"
          >
            <StethoscopeIcon aria-hidden="true" className="text-fg-accent" />
            <span className="hidden sm:inline">SIMRS Healthy Together</span>
            <span className="sm:hidden">SIMRS</span>
          </Link>

          <span className="flex-1" />

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
              <span className="flex items-center gap-1.5">
                Quick search <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>

          <ThemeMenu labels={APPEARANCE} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        {/* An `aside`, not a `div`. `SidebarContent` is the `nav` landmark, so
            the unit line above it would otherwise be page content belonging to
            no landmark at all — which is what axe reports as `region`, once per
            route. The rail really is complementary context: which unit and
            shift you are working in, beside the navigation that serves it. */}
        <aside
          aria-label="Units and sections"
          className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] md:block print:hidden"
        >
          <Sidebar open={railOpen} collapsible="icon" className="border-e-0 bg-transparent">
            {/* Which unit and shift this rail belongs to. The icon carries it
                when the rail collapses; the words are a `SidebarLabel`, which
                goes off the screen rather than out of the accessibility tree. */}
            <SidebarHeader className="h-12">
              <UserIcon aria-hidden="true" className="text-fg-accent" />
              <SidebarLabel className="text-body-sm font-medium">
                Outpatients · morning
              </SidebarLabel>
            </SidebarHeader>
            <SidebarContent aria-label="Sections">{destinations()}</SidebarContent>
            <SidebarFooter className="border-t-0">
              <SidebarMenuButton onClick={() => setRailOpen(!railOpen)}>
                <MenuIcon aria-hidden="true" />
                <SidebarLabel>{railOpen ? 'Collapse menu' : 'Expand menu'}</SidebarLabel>
              </SidebarMenuButton>
            </SidebarFooter>
          </Sidebar>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
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
              onOpen={(rm) => navigate(`patients/${rm}`)}
              onNewVisit={() => navigate('new-visit')}
            />
          ) : (
            <Summary />
          )}
        </main>
      </div>

      <Command open={paletteOpen} onOpenChange={setPaletteOpen} label="Quick commands">
        <CommandInput
          value={query}
          placeholder="Search patients or sections…"
          aria-label="Search patients or sections"
          aria-controls="simrs-results"
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
          <CommandList id="simrs-results" aria-label="Results">
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
    </div>
  );
}
