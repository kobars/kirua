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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  CalendarIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  StethoscopeIcon,
  UserIcon,
} from 'kirua';
import { Appointments } from './Appointments';
import { NewVisit } from './NewVisit';
import { PatientList } from './PatientList';
import { PatientRecord } from './PatientRecord';
import { patients } from './data';
import { useHashRoute } from './useHashRoute';

const nav = [
  { route: '', label: 'Pasien', icon: UserIcon },
  { route: 'jadwal', label: 'Jadwal', icon: CalendarIcon },
  { route: 'kunjungan-baru', label: 'Kunjungan baru', icon: PlusIcon },
] as const;

export function App() {
  const [route, navigate] = useHashRoute('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      ...nav.map((item) => ({ id: item.route || 'pasien', label: item.label, go: item.route })),
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

  const menu = (
    <nav aria-label="Bagian" className="grid gap-1">
      {nav.map(({ route: target, label, icon: Icon }) => (
        <a
          key={label}
          href={`#/${target}`}
          aria-current={route === target ? 'page' : undefined}
          onClick={() => setDrawerOpen(false)}
          className={[
            'flex items-center gap-2 rounded-md px-3 py-2 text-body-sm',
            'transition-colors duration-fast ease-out [--icon-size:var(--icon-md)]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            route === target
              ? 'bg-selected font-medium text-on-selected'
              : 'text-fg-secondary hover:bg-ghost-hover hover:text-fg',
          ].join(' ')}
        >
          <Icon aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
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
            <SheetContent side="start">
              <SheetTitle>SIMRS Sehat Bersama</SheetTitle>
              <div className="mt-4">{menu}</div>
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
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[13rem_1fr] md:px-8">
        <aside className="hidden md:block print:hidden">{menu}</aside>

        <main className="min-w-0">
          {record ? (
            <PatientRecord patient={record} />
          ) : route === 'jadwal' ? (
            <Appointments />
          ) : route === 'kunjungan-baru' ? (
            <NewVisit />
          ) : (
            <PatientList
              onOpen={(rm) => navigate(`pasien/${rm}`)}
              onNewVisit={() => navigate('kunjungan-baru')}
            />
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
