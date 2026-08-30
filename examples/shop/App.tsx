import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  IconButton,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  CartIcon,
  CheckIcon,
  FilterIcon,
  SearchIcon,
} from 'kirua';
import { CartSheet, type CartLine } from './CartSheet';
import { CheckoutPage } from './CheckoutPage';
import { Filters } from './Filters';
import { emptyFilters, type FilterState } from './filterState';
import { ProductCard } from './ProductCard';
import { ProductPage } from './ProductPage';
import { products, type Product } from './data';
import { useHashRoute } from './useHashRoute';

const PER_PAGE = 6;

export function App() {
  const [route, navigate] = useHashRoute('');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState('populer');
  const [page, setPage] = useState(1);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const matches = useMemo(() => {
    const kept = products.filter((p) => {
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.colours.length > 0 && !filters.colours.includes(p.colour)) return false;
      if (filters.sizes.length > 0 && !p.size.some((s) => filters.sizes.includes(s)))
        return false;
      if (filters.condition !== 'any' && p.condition !== filters.condition) return false;
      return p.price >= filters.price[0] && p.price <= filters.price[1];
    });
    const sorted = [...kept];
    if (sort === 'murah') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'mahal') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'nilai') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [filters, sort]);

  const pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = matches.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const add = (product: Product, quantity = 1) => {
    setLines((all) => {
      const existing = all.find((l) => l.product.id === product.id);
      return existing
        ? all.map((l) =>
            l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l,
          )
        : [...all, { product, quantity }];
    });
    setToast(product.name);
  };

  const changeQuantity = (id: string, delta: number) =>
    setLines((all) =>
      all
        .map((l) => (l.product.id === id ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0),
    );

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const detail = route.startsWith('produk/')
    ? products.find((p) => p.id === route.slice('produk/'.length))
    : undefined;

  const filterPanel = (
    <Filters
      value={filters}
      onChange={(next) => {
        setFilters(next);
        setPage(1);
      }}
    />
  );

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-page/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-8">
          <a
            href="#/"
            className="rounded-xs text-body-lg font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Senja
          </a>

          <span className="min-w-0 flex-1" />

          <IconButton aria-label="Cari" variant="ghost" className="sm:hidden">
            <SearchIcon />
          </IconButton>

          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<FilterIcon />}
                className="md:hidden"
              >
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="start" className="overflow-y-auto">
              <SheetTitle className="sr-only">Filter</SheetTitle>
              {filterPanel}
            </SheetContent>
          </Sheet>

          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<CartIcon />}
            onClick={() => setCartOpen(true)}
          >
            Keranjang
            {count > 0 && (
              <Badge status="info" className="ms-1">
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main>
        {detail ? (
          <ProductPage product={detail} onAdd={add} />
        ) : route === 'checkout' ? (
          <CheckoutPage lines={lines} onPlaced={() => setLines([])} />
        ) : (
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:grid-cols-[16rem_1fr] md:px-8">
            <aside className="hidden md:block">{filterPanel}</aside>

            <div className="grid content-start gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-heading-md font-semibold text-fg">
                  Katalog{' '}
                  <span className="text-body-md font-normal text-fg-muted tabular-nums">
                    ({matches.length})
                  </span>
                </h1>
                <div className="w-48">
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger aria-label="Urutkan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent aria-label="Urutkan">
                      <SelectItem value="populer">Paling populer</SelectItem>
                      <SelectItem value="murah">Harga terendah</SelectItem>
                      <SelectItem value="mahal">Harga tertinggi</SelectItem>
                      <SelectItem value="nilai">Nilai tertinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {shown.length === 0 ? (
                <EmptyState
                  icon={<SearchIcon size="2xl" />}
                  title="Tidak ada barang yang cocok"
                  description="Coba longgarkan harga, atau hapus salah satu filter."
                  action={
                    <Button variant="secondary" onClick={() => setFilters(emptyFilters)}>
                      Reset filter
                    </Button>
                  }
                />
              ) : (
                <>
                  {/* One column on a phone, two from `sm`, three from `lg`. The
                      hardest reflow in the set, and the reason the card has no
                      fixed width of its own. */}
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((product) => (
                      <li key={product.id}>
                        <ProductCard product={product} onAdd={add} />
                      </li>
                    ))}
                  </ul>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#/"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        />
                      </PaginationItem>
                      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                        <PaginationItem key={n}>
                          <PaginationLink
                            href="#/"
                            isCurrent={n === current}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#/"
                          onClick={() => setPage((p) => Math.min(pages, p + 1))}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        lines={lines}
        onQuantity={changeQuantity}
        onCheckout={() => {
          setCartOpen(false);
          navigate('checkout');
        }}
      />

      <ToastViewport>
        {toast !== null && (
          <Toast status="success" icon={<CheckIcon />}>
            <ToastTitle>Masuk keranjang</ToastTitle>
            <ToastDescription>{toast}</ToastDescription>
          </Toast>
        )}
        {toast !== null && <ToastClose onClick={() => setToast(null)} />}
      </ToastViewport>
    </div>
  );
}
