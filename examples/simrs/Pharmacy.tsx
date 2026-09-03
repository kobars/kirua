import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Badge,
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Heading,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Meter,
  MoreIcon,
  SearchIcon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'kirua';
import { medicines, idr, type Medicine } from './data';

type Shelf = 'all' | 'out' | 'low';

const level = (item: Medicine) =>
  item.stock === 0 ? 'out' : item.stock < item.reorder ? 'low' : 'ok';

const tone = { out: 'danger', low: 'warning', ok: 'success' } as const;

/**
 * Pharmacy stock. Three filters, a search box, and a per-row menu that opens on
 * a right-click *and* from the button at the end of the row — the right-click
 * is a shortcut, never the only way in.
 */
/**
 * The three columns worth sorting, and how each one compares. Ascending always
 * means "the row a pharmacist should act on first": the soonest expiry, the
 * smallest stock, the cheapest item.
 */
const COMPARE = {
  stock: (a: Medicine, b: Medicine) => a.stock - b.stock,
  expires: (a: Medicine, b: Medicine) => a.expires.localeCompare(b.expires),
  price: (a: Medicine, b: Medicine) => a.price - b.price,
};

type SortKey = keyof typeof COMPARE;

const SORTABLE: { key: SortKey; label: string }[] = [
  { key: 'stock', label: 'Stock' },
  { key: 'expires', label: 'Expires' },
  { key: 'price', label: 'Price' },
];

export function Pharmacy() {
  const [query, setQuery] = useState('');
  const [shelf, setShelf] = useState<Shelf>('all');
  const [discarding, setDiscarding] = useState<Medicine | null>(null);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [sort, setSort] = useState<{ by: SortKey; up: boolean }>({
    by: 'expires',
    up: true,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kept = medicines.filter((item) => {
      if (discarded.includes(item.code)) return false;
      if (shelf === 'out' && level(item) !== 'out') return false;
      if (shelf === 'low' && level(item) !== 'low') return false;
      return (
        q === '' || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
      );
    });
    const direction = sort.up ? 1 : -1;
    return kept.sort((a, b) => direction * COMPARE[sort.by](a, b));
  }, [query, shelf, discarded, sort]);

  /**
   * One list of commands, rendered twice. The right-click menu is a shortcut
   * for people using a mouse; the button at the end of the row is how everybody
   * else reaches the same three commands, and a Tab key can find it.
   */
  const commands = (item: Medicine) => [
    { label: 'Add stock', shortcut: '⌘+', run: () => undefined },
    { label: 'Print a shelf label', run: () => window.print() },
    { label: 'Discard the batch', destructive: true, run: () => setDiscarding(item) },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading as="h1" size="heading-md">
            Pharmacy
          </Heading>
          <Text size="sm" className="mt-1">
            {rows.length} of {medicines.length - discarded.length} items
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                aria-label="Search medicines"
                placeholder="Search by name or code"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query !== '' && (
                <InputGroupAddon>
                  <IconButton
                    aria-label="Clear search"
                    size="sm"
                    variant="ghost"
                    className="-me-1.5"
                    onClick={() => setQuery('')}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>

          <ButtonGroup aria-label="Filter stock">
            {(['all', 'low', 'out'] as const).map((value) => (
              <Button
                key={value}
                variant="secondary"
                size="sm"
                aria-pressed={shelf === value}
                onClick={() => setShelf(value)}
                className={shelf === value ? 'bg-selected text-on-selected' : undefined}
              >
                {value === 'all' ? 'All' : value === 'low' ? 'Low' : 'Out'}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="No medicine matches"
          description="Try another keyword, or go back to every item."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setShelf('all');
              }}
            >
              Show all
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              Right-click a row for shortcuts. Every command is also in the row menu.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Shelf</TableHead>
                {SORTABLE.map(({ key, label }) => {
                  const active = sort.by === key;
                  return (
                    // `aria-sort` is what a screen reader reads out, and it
                    // belongs on the header cell rather than on the button
                    // inside it. The arrow is the same fact for everybody else.
                    <TableHead
                      key={key}
                      aria-sort={active ? (sort.up ? 'ascending' : 'descending') : 'none'}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-mx-2"
                        trailingIcon={
                          active ? sort.up ? <ChevronUpIcon /> : <ChevronDownIcon /> : undefined
                        }
                        onClick={() =>
                          setSort((current) =>
                            current.by === key
                              ? { by: key, up: !current.up }
                              : { by: key, up: true },
                          )
                        }
                      >
                        {label}
                      </Button>
                    </TableHead>
                  );
                })}
                <TableHead className="relative">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <ContextMenu key={item.code}>
                  <ContextMenuTrigger asChild>
                    <TableRow>
                      <TableCell>
                        <span className="font-medium text-fg">{item.name}</span>
                        <span className="block text-caption text-fg-muted">
                          {item.code} — {item.form}
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums">{item.shelf}</TableCell>
                      <TableCell>
                        <div className="grid min-w-32 gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="tabular-nums">{item.stock}</span>
                            <Badge status={tone[level(item)]}>{level(item)}</Badge>
                          </div>
                          {/* `sm`, because this sits in a table cell beside the
                              number it measures. No thresholds: a Meter's
                              thresholds are crossed upward, and here it is a
                              LOW stock that is the problem. The Badge above
                              already carries that meaning, and a second claim
                              in a second colour would only be able to disagree
                              with it. */}
                          <Meter
                            size="sm"
                            value={item.stock}
                            max={item.reorder * 3}
                            label={`Stock of ${item.name}`}
                            valueText={`${item.stock} of ${item.reorder * 3}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">{item.expires}</TableCell>
                      <TableCell className="tabular-nums">{idr(item.price)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              aria-label={`Actions for ${item.name}`}
                              size="sm"
                              variant="ghost"
                            >
                              <MoreIcon />
                            </IconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{item.code}</DropdownMenuLabel>
                            {commands(item).map((command, index) => (
                              <div key={command.label}>
                                {command.destructive && index > 0 && <DropdownMenuSeparator />}
                                <DropdownMenuItem onSelect={command.run}>
                                  {command.label}
                                </DropdownMenuItem>
                              </div>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuLabel>{item.code}</ContextMenuLabel>
                    {commands(item).map((command, index) => (
                      <div key={command.label}>
                        {command.destructive && index > 0 && <ContextMenuSeparator />}
                        <ContextMenuItem onSelect={command.run}>
                          {command.label}
                          {command.shortcut && (
                            <ContextMenuShortcut>{command.shortcut}</ContextMenuShortcut>
                          )}
                        </ContextMenuItem>
                      </div>
                    ))}
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={discarding !== null}
        onOpenChange={(open) => !open && setDiscarding(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Discard the {discarding?.name} batch?</AlertDialogTitle>
          <AlertDialogDescription>
            {discarding?.stock} units on shelf {discarding?.shelf} are recorded as wasted. The
            record cannot be undone from this screen.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (discarding) setDiscarded((all) => [...all, discarding.code]);
                  setDiscarding(null);
                }}
              >
                Discard
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
