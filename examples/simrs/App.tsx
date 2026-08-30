import { useEffect, useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  IconButton,
  Kbd,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  CalendarIcon,
  GridIcon,
  MenuIcon,
  PillIcon,
  PlusIcon,
  SearchIcon,
  StethoscopeIcon,
  UserIcon,
} from 'kirua';
import { Appointments } from './Appointments';
import { Lab } from './Lab';
import { NewVisit } from './NewVisit';
import { PatientList } from './PatientList';
import { PatientRecord } from './PatientRecord';
import { Pharmacy } from './Pharmacy';
import { Summary } from './Summary';
import { ThemeMenu } from './ThemeMenu';
import { patients } from './data';
import { useHashRoute } from './useHashRoute';

/** The destinations, grouped the way the building is. */
const sections = [
  {
    label: 'Klinik',
    items: [
      { route: '', label: 'Ringkasan', icon: GridIcon },
      { route: 'pasien', label: 'Pasien', icon: UserIcon },
      { route: 'jadwal', label: 'Jadwal', icon: CalendarIcon },
      { route: 'kunjungan-baru', label: 'Kunjungan baru', icon: PlusIcon },
    ],
  },
  {
    label: 'Penunjang',
    items: [
      { route: 'lab', label: 'Laboratorium', icon: StethoscopeIcon },
      { route: 'farmasi', label: 'Farmasi', icon: PillIcon },
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
        id: item.route || 'ringkasan',
        label: item.label,
        go: item.route,
      })),
      ...patients.map((p) => ({
        id: p.rm,
        label: `${p.name} — ${p.rm}`,
        go: `pasien/${p.rm}`,
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

  const record = route.startsWith('pasien/')
    ? patients.find((p) => p.rm === route.slice('pasien/'.length))
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
              <SheetTitle>SIMRS Sehat Bersama</SheetTitle>
              <nav aria-label="Bagian" className="mt-4 grid gap-4">
                {destinations(() => setDrawerOpen(false))}
              </nav>
            </SheetContent>
          </Sheet>

          <a
            href="#/"
            className="flex items-center gap-2 rounded-xs text-body-md font-semibold [--icon-size:var(--icon-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <StethoscopeIcon aria-hidden="true" className="text-fg-accent" />
            <span className="hidden sm:inline">SIMRS Sehat Bersama</span>
            <span className="sm:hidden">SIMRS</span>
          </a>

          <span className="flex-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label="Cari cepat"
                variant="ghost"
                onClick={() => setPaletteOpen(true)}
              >
                <SearchIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>
              <span className="flex items-center gap-1.5">
                Cari cepat <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>

          <ThemeMenu />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <div className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] md:block print:hidden">
          <Sidebar open={railOpen} collapsible="icon" className="border-e-0 bg-transparent">
            <SidebarContent aria-label="Bagian">{destinations()}</SidebarContent>
            <SidebarFooter className="border-t-0">
              <SidebarMenuButton onClick={() => setRailOpen(!railOpen)}>
                <MenuIcon aria-hidden="true" />
                <SidebarLabel>{railOpen ? 'Perkecil menu' : 'Perbesar menu'}</SidebarLabel>
              </SidebarMenuButton>
            </SidebarFooter>
          </Sidebar>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
          {record ? (
            <PatientRecord patient={record} />
          ) : route === 'jadwal' ? (
            <Appointments />
          ) : route === 'kunjungan-baru' ? (
            <NewVisit />
          ) : route === 'farmasi' ? (
            <Pharmacy />
          ) : route === 'lab' ? (
            <Lab />
          ) : route === 'pasien' ? (
            <PatientList
              onOpen={(rm) => navigate(`pasien/${rm}`)}
              onNewVisit={() => navigate('kunjungan-baru')}
            />
          ) : (
            <Summary />
          )}
        </main>
      </div>

      <Command open={paletteOpen} onOpenChange={setPaletteOpen} label="Perintah cepat">
        <CommandInput
          value={query}
          placeholder="Cari pasien atau bagian…"
          aria-label="Cari pasien atau bagian"
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
          <CommandList id="simrs-results" aria-label="Hasil">
            <CommandGroup heading="Perintah">
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
          <CommandEmpty>Tidak ada yang cocok dengan “{query}”.</CommandEmpty>
        )}
      </Command>
    </div>
  );
}
