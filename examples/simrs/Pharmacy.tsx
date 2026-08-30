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
  MoreIcon,
  Progress,
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
import { medicines, rupiah, type Medicine } from './data';

type Shelf = 'semua' | 'habis' | 'menipis';

const level = (item: Medicine) =>
  item.stock === 0 ? 'habis' : item.stock < item.reorder ? 'menipis' : 'cukup';

const tone = { habis: 'danger', menipis: 'warning', cukup: 'success' } as const;

/**
 * Pharmacy stock. Three filters, a search box, and a per-row menu that opens on
 * a right-click *and* from the button at the end of the row — the right-click
 * is a shortcut, never the only way in.
 */
export function Pharmacy() {
  const [query, setQuery] = useState('');
  const [shelf, setShelf] = useState<Shelf>('semua');
  const [discarding, setDiscarding] = useState<Medicine | null>(null);
  const [discarded, setDiscarded] = useState<string[]>([]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicines.filter((item) => {
      if (discarded.includes(item.code)) return false;
      if (shelf === 'habis' && level(item) !== 'habis') return false;
      if (shelf === 'menipis' && level(item) !== 'menipis') return false;
      return (
        q === '' || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
      );
    });
  }, [query, shelf, discarded]);

  /**
   * One list of commands, rendered twice. The right-click menu is a shortcut
   * for people using a mouse; the button at the end of the row is how everybody
   * else reaches the same three commands, and a Tab key can find it.
   */
  const commands = (item: Medicine) => [
    { label: 'Tambah stok', shortcut: '⌘+', run: () => undefined },
    { label: 'Cetak label rak', run: () => window.print() },
    { label: 'Buang batch', destructive: true, run: () => setDiscarding(item) },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading as="h1" size="heading-md">
            Farmasi
          </Heading>
          <Text size="sm" className="mt-1">
            {rows.length} dari {medicines.length - discarded.length} item
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
                aria-label="Cari obat"
                placeholder="Cari nama atau kode"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query !== '' && (
                <InputGroupAddon>
                  <IconButton
                    aria-label="Hapus pencarian"
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

          <ButtonGroup aria-label="Saring stok">
            {(['semua', 'menipis', 'habis'] as const).map((value) => (
              <Button
                key={value}
                variant="secondary"
                size="sm"
                aria-pressed={shelf === value}
                onClick={() => setShelf(value)}
                className={shelf === value ? 'bg-selected text-on-selected' : undefined}
              >
                {value === 'semua' ? 'Semua' : value === 'menipis' ? 'Menipis' : 'Habis'}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size="2xl" />}
          title="Tidak ada obat yang cocok"
          description="Coba kata kunci lain, atau kembali ke semua item."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setShelf('semua');
              }}
            >
              Tampilkan semua
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              Klik kanan sebuah baris untuk pintasan. Semua perintahnya juga ada di menu baris.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Obat</TableHead>
                <TableHead>Rak</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Kedaluwarsa</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="relative">
                  <span className="sr-only">Tindakan</span>
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
                          <Progress
                            value={Math.min(
                              100,
                              Math.round((item.stock / (item.reorder * 3)) * 100),
                            )}
                            aria-label={`Stok ${item.name}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">{item.expires}</TableCell>
                      <TableCell className="tabular-nums">{rupiah(item.price)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              aria-label={`Tindakan untuk ${item.name}`}
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
          <AlertDialogTitle>Buang batch {discarding?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {discarding?.stock} unit di rak {discarding?.shelf} akan dicatat sebagai terbuang.
            Catatan ini tidak bisa dibatalkan dari layar ini.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Batal</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (discarding) setDiscarded((all) => [...all, discarding.code]);
                  setDiscarding(null);
                }}
              >
                Buang
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
