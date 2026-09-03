import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  CartIcon,
  CheckIcon,
  CloseIcon,
  Container,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FilterIcon,
  Heading,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Link,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchIcon,
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
  UserIcon,
} from 'kirua';
import { CartSheet, type CartLine } from './CartSheet';
import { CheckoutPage } from './CheckoutPage';
import { OrderPage } from './OrderPage';
import { OrdersPage } from './OrdersPage';
import { SignInPage } from './SignInPage';
import { Filters } from './Filters';
import { ThemeMenu } from '../shared/ThemeMenu';
import { emptyFilters, type FilterState } from './filterState';
import { ProductCard } from './ProductCard';
import { ProductPage } from './ProductPage';
import { categories, orders, products, type Category, type Product } from './data';
import { useHashRoute } from '../shared/useHashRoute';

const PER_PAGE = 6;

export function App() {
  const [route, navigate] = useHashRoute('');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [signedIn, setSignedIn] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kept = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (q !== '' && !`${p.name} ${p.brand} ${p.colour}`.toLowerCase().includes(q))
        return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.colours.length > 0 && !filters.colours.includes(p.colour)) return false;
      if (filters.sizes.length > 0 && !p.size.some((s) => filters.sizes.includes(s)))
        return false;
      if (filters.condition !== 'any' && p.condition !== filters.condition) return false;
      return p.price >= filters.price[0] && p.price <= filters.price[1];
    });
    const sorted = [...kept];
    if (sort === 'cheapest') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'dearest') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [filters, sort, query, category]);

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
  const detail = route.startsWith('products/')
    ? products.find((p) => p.id === route.slice('products/'.length))
    : undefined;
  const order = route.startsWith('orders/')
    ? orders.find((o) => o.id === route.slice('orders/'.length))
    : undefined;

  const filterPanel = (
    <Filters
      value={filters}
      onChange={(next) => {
        setFilters(next);
        setPage(1);
      }}
      query={query}
      onQueryChange={(next) => {
        setQuery(next);
        setPage(1);
      }}
      category={category}
      onCategoryChange={(next) => {
        setCategory(next);
        setPage(1);
      }}
    />
  );

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-page/95 backdrop-blur-sm">
        {/* `gap-2` below `sm`. Six items sit in this row and five gaps at 12px
            spend 60 of the 288 pixels a 320-wide phone leaves after the page
            padding — more than any single control here costs. */}
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 md:px-8">
          <Link href="#/" variant="block" className="text-body-lg font-semibold text-fg">
            Dusk
          </Link>

          {/* A `<nav>` of links, not a menu of commands: these go somewhere.
              Hidden below `md`, where the same categories are reachable from the
              filter sheet. */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-md grid-cols-2 gap-1">
                    <NavigationMenuLink
                      href="#/"
                      onClick={() => {
                        setCategory('all');
                        setPage(1);
                      }}
                    >
                      <span className="font-medium">Everything</span>
                      <span className="text-caption text-fg-muted">
                        {products.length} items in the catalogue
                      </span>
                    </NavigationMenuLink>
                    {categories.map((item) => (
                      <NavigationMenuLink
                        key={item.id}
                        href="#/"
                        onClick={() => {
                          setCategory(item.id);
                          setPage(1);
                        }}
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="text-caption text-fg-muted">{item.blurb}</span>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#/orders" className="px-4">
                  Orders
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <span className="min-w-0 flex-1" />

          <div className="hidden w-56 lg:block">
            <InputGroup className="h-9">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                aria-label="Search products"
                placeholder="Search products"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label="Account" variant="ghost">
                <UserIcon />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {signedIn ? 'Signed in as 0812…' : 'Not signed in'}
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <a href="#/orders">My orders</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {signedIn ? (
                <DropdownMenuItem onSelect={() => setSignedIn(false)}>
                  Sign out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <a href="#/sign-in">Sign in</a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeMenu />

          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              {/* The label goes below `sm` for the same reason the cart's does,
                  and it is the wider of the two. `aria-label` carries the name
                  once the word is gone. */}
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<FilterIcon />}
                aria-label="Filter"
                className="md:hidden"
              >
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </SheetTrigger>
            {/* `pt-14` clears the sheet's own close control, which is
                absolutely positioned in the top-end corner and would otherwise
                sit on top of the panel's Reset button. */}
            <SheetContent side="start" className="overflow-y-auto pt-14">
              <SheetTitle className="sr-only">Filter</SheetTitle>
              {filterPanel}
            </SheetContent>
          </Sheet>

          {/* The label is dropped below `sm`. At 375 the row is a logo, the
              account and theme menus, Filter and this; keeping every word left
              six pixels of clearance, which reads as a clipped edge. */}
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<CartIcon />}
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
          >
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <Badge status="info" className="sm:ms-1">
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main>
        {detail ? (
          <ProductPage product={detail} onAdd={add} />
        ) : order ? (
          <OrderPage order={order} />
        ) : route === 'orders' ? (
          <OrdersPage onOpen={(id) => navigate(`orders/${id}`)} />
        ) : route === 'sign-in' ? (
          <SignInPage
            onSignedIn={() => {
              setSignedIn(true);
              navigate('orders');
            }}
          />
        ) : route === 'checkout' ? (
          <CheckoutPage lines={lines} onPlaced={() => setLines([])} />
        ) : (
          <Container width="6xl" className="md:grid-cols-[16rem_1fr]">
            <aside className="hidden md:block">{filterPanel}</aside>

            <div className="grid content-start gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Heading as="h1" size="heading-md">
                    {categories.find((c) => c.id === category)?.label ?? 'Catalogue'}{' '}
                    <span className="text-body-md font-normal text-fg-muted tabular-nums">
                      ({matches.length})
                    </span>
                  </Heading>
                  {(category !== 'all' || query !== '') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCategory('all');
                        setQuery('');
                        setPage(1);
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
                <div className="w-48">
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger aria-label="Sort by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent aria-label="Sort by">
                      <SelectItem value="popular">Most popular</SelectItem>
                      <SelectItem value="cheapest">Lowest price</SelectItem>
                      <SelectItem value="dearest">Highest price</SelectItem>
                      <SelectItem value="rating">Highest rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {shown.length === 0 ? (
                <EmptyState
                  icon={<SearchIcon size="2xl" />}
                  title="Nothing matches"
                  description="Try widening the price range, or clearing one of the filters."
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
          </Container>
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
          <Toast
            status="success"
            icon={<CheckIcon />}
            close={<ToastClose label="Close" onClick={() => setToast(null)} />}
          >
            <ToastTitle>Added to cart</ToastTitle>
            <ToastDescription>{toast}</ToastDescription>
          </Toast>
        )}
      </ToastViewport>
    </div>
  );
}
