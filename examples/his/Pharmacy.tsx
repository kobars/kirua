import { Fragment, useMemo, useState } from 'react';
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
  IconButton,
  Inline,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Meter,
  MoreIcon,
  PageHeader,
  SearchIcon,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  VisuallyHidden,
} from 'kirua';
import { formatDate, medications, usd, type Medication } from './data';

type StockFilter = 'all' | 'out' | 'low';

const level = (item: Medication) =>
  item.stock === 0 ? 'out' : item.stock < item.par ? 'low' : 'ok';

const tone = { out: 'danger', low: 'warning', ok: 'success' } as const;
const levelLabel = { out: 'Out', low: 'Below par', ok: 'OK' } as const;

/**
 * The three columns worth sorting, and how each one compares. Ascending always
 * means "the row a pharmacist should act on first": the soonest expiry, the
 * smallest stock, the cheapest item.
 */
const COMPARE = {
  stock: (a: Medication, b: Medication) => a.stock - b.stock,
  expires: (a: Medication, b: Medication) => a.expires.localeCompare(b.expires),
  cost: (a: Medication, b: Medication) => a.cost - b.cost,
};

type SortKey = keyof typeof COMPARE;

const SORTABLE: { key: SortKey; label: string }[] = [
  { key: 'stock', label: 'On hand' },
  { key: 'expires', label: 'Expires' },
  { key: 'cost', label: 'Unit cost' },
];

/**
 * Pharmacy inventory. Three filters, a search box, and a per-row menu that
 * opens on a right-click *and* from the button at the end of the row — the
 * right-click is a shortcut, never the only way in.
 */
export function Pharmacy() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');
  const [discarding, setDiscarding] = useState<Medication | null>(null);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [sort, setSort] = useState<{ by: SortKey; up: boolean }>({
    by: 'expires',
    up: true,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kept = medications.filter((item) => {
      if (discarded.includes(item.code)) return false;
      if (filter === 'out' && level(item) !== 'out') return false;
      if (filter === 'low' && level(item) !== 'low') return false;
      return (
        q === '' || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
      );
    });
    const direction = sort.up ? 1 : -1;
    return kept.sort((a, b) => direction * COMPARE[sort.by](a, b));
  }, [query, filter, discarded, sort]);

  /**
   * One list of commands, rendered twice. The right-click menu is a shortcut
   * for people using a mouse; the button at the end of the row is how everybody
   * else reaches the same three commands, and a Tab key can find it.
   */
  const commands = (item: Medication) => [
    { label: 'Receive stock', shortcut: '⌘+', run: () => undefined },
    { label: 'Print a bin label', run: () => window.print() },
    { label: 'Waste the lot', destructive: true, run: () => setDiscarding(item) },
  ];

  return (
    <Stack gap={5}>
      <PageHeader
        title="Pharmacy inventory"
        description={`${rows.length} of ${medications.length - discarded.length} items`}
        actions={
          <>
            <InputGroup width="sm">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                aria-label="Search medications"
                placeholder="Drug name or item code"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query !== '' && (
                <InputGroupAddon>
                  <IconButton
                    aria-label="Clear search"
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuery('')}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputGroupAddon>
              )}
            </InputGroup>

            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(next) => {
                if (next) setFilter(next as StockFilter);
              }}
              aria-label="Filter stock"
            >
              {(['all', 'low', 'out'] as const).map((value) => (
                <ToggleGroupItem key={value} value={value} size="sm" variant="outline">
                  {value === 'all' ? 'All' : value === 'low' ? 'Below par' : 'Out'}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="No medication matches"
          description="Try another keyword, or go back to every item."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
            >
              Show all
            </Button>
          }
        />
      ) : (
        <Table>
          <TableCaption>
            Right-click a row for shortcuts. Every command is also in the row menu.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Bin</TableHead>
              {SORTABLE.map(({ key, label }) => {
                const active = sort.by === key;
                return (
                  <TableHead
                    key={key}
                    sort={active ? (sort.up ? 'ascending' : 'descending') : 'none'}
                    onSort={() =>
                      setSort((current) =>
                        current.by === key
                          ? { by: key, up: !current.up }
                          : { by: key, up: true },
                      )
                    }
                  >
                    {label}
                  </TableHead>
                );
              })}
              <TableHead>
                <VisuallyHidden>Actions</VisuallyHidden>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <ContextMenu key={item.code}>
                <ContextMenuTrigger asChild>
                  <TableRow>
                    {/* Block text, not a Stack: a Stack's column may shrink to
                        nothing, which would let the table squeeze this column
                        instead of scrolling. */}
                    <TableCell>
                      <Text size="inherit" weight="medium" tone="primary">
                        {item.name}
                      </Text>
                      <Text size="caption" tone="muted">
                        {item.code} — {item.form}
                      </Text>
                    </TableCell>
                    <TableCell numeric>{item.bin}</TableCell>
                    <TableCell>
                      {/* A wrapping row whose second item is the full-width
                          bar: unlike a Stack, it keeps the bar's minimum
                          width as the column's, so the table scrolls rather
                          than squeezing the bar under the next column. */}
                      <Inline wrap gap={1.5}>
                        <Inline gap={2}>
                          <Text inline size="sm" tone="primary" numeric>
                            {item.stock}
                          </Text>
                          <Badge status={tone[level(item)]}>{levelLabel[level(item)]}</Badge>
                        </Inline>
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
                          max={item.par * 3}
                          label={`Stock on hand of ${item.name}`}
                          valueText={`${item.stock} of ${item.par * 3}`}
                        />
                      </Inline>
                    </TableCell>
                    <TableCell numeric>{formatDate(item.expires)}</TableCell>
                    <TableCell numeric>{usd(item.cost)}</TableCell>
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
                            <Fragment key={command.label}>
                              {command.destructive && index > 0 && <DropdownMenuSeparator />}
                              <DropdownMenuItem onSelect={command.run}>
                                {command.label}
                              </DropdownMenuItem>
                            </Fragment>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>{item.code}</ContextMenuLabel>
                  {commands(item).map((command, index) => (
                    <Fragment key={command.label}>
                      {command.destructive && index > 0 && <ContextMenuSeparator />}
                      <ContextMenuItem onSelect={command.run}>
                        {command.label}
                        {command.shortcut && (
                          <ContextMenuShortcut>{command.shortcut}</ContextMenuShortcut>
                        )}
                      </ContextMenuItem>
                    </Fragment>
                  ))}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={discarding !== null}
        onOpenChange={(open) => !open && setDiscarding(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Waste the {discarding?.name} lot?</AlertDialogTitle>
          <AlertDialogDescription>
            {discarding?.stock} units in bin {discarding?.bin} are recorded as waste and leave
            inventory. The entry cannot be undone from this screen.
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
                Waste
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
