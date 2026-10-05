import { useMemo, useState } from 'react';
import {
  AppBody,
  AppHeader,
  AppMain,
  AppShell,
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
  Grid,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  PageHeader,
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
  Split,
  Stack,
  Text,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  UserIcon,
  Visible,
  Wordmark,
} from 'kirua';
import { CartSheet, type CartLine } from './CartSheet';
import { CheckoutPage } from './CheckoutPage';
import { OrderPage } from './OrderPage';
import { OrdersPage } from './OrdersPage';
import { SignInPage } from './SignInPage';
import { Filters } from './Filters';
import { ThemeMenu } from '../shared/ThemeMenu';
import { emptyFilters, isEmptyFilters, type FilterState } from './filterState';
import { ProductCard } from './ProductCard';
import { ProductPage } from './ProductPage';
import { categories, orders, products, type Category, type Product } from './data';
import { useHashRoute } from '../shared/useHashRoute';

const PER_PAGE = 6;

export function App() {
  const [route, navigate] = useHashRoute('shop', '');
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

  // One line per product and size: an M and an XL of the same jacket are two
  // things to pack. Adding from a card takes the first size the product has.
  const add = (product: Product, size = product.size[0] ?? 'M', quantity = 1) => {
    const same = (l: CartLine) => l.product.id === product.id && l.size === size;
    setLines((all) =>
      all.some(same)
        ? all.map((l) =>
            same(l) ? { ...l, quantity: Math.min(product.stock, l.quantity + quantity) } : l,
          )
        : [...all, { product, size, quantity: Math.min(product.stock, quantity) }],
    );
    setToast(`${product.name}, size ${size}`);
  };

  const changeQuantity = (id: string, size: string, delta: number) =>
    setLines((all) =>
      all
        .map((l) =>
          l.product.id === id && l.size === size ? { ...l, quantity: l.quantity + delta } : l,
        )
        .filter((l) => l.quantity > 0),
    );

  // Both ways out of an empty result clear everything that narrows it: the
  // sidebar's filters, the search and the category alike.
  const filtered = !isEmptyFilters(filters) || category !== 'all' || query !== '';
  const resetAll = () => {
    setFilters(emptyFilters);
    setCategory('all');
    setQuery('');
    setPage(1);
  };

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const detail = route.startsWith('products/')
    ? products.find((p) => p.id === route.slice('products/'.length))
    : undefined;
  const order = route.startsWith('orders/')
    ? orders.find((o) => o.id === route.slice('orders/'.length))
    : undefined;

  const filterPanel = (heading: boolean) => (
    <Filters
      heading={heading}
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
    <AppShell>
      <AppHeader
        width="6xl"
        actions={
          <>
            <Visible from="lg">
              <InputGroup size="sm" width="xs">
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
                      onClick={() => setQuery('')}
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </Visible>

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
                  <a href="#/shop/orders">My orders</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {signedIn ? (
                  <DropdownMenuItem onSelect={() => setSignedIn(false)}>
                    Sign out
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <a href="#/shop/sign-in">Sign in</a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeMenu />

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <Visible below="md">
                <SheetTrigger asChild>
                  {/* The label goes below `sm` for the same reason the cart's
                      does, and it is the wider of the two. `aria-label`
                      carries the name once the word is gone. */}
                  <Button
                    variant="secondary"
                    size="sm"
                    leadingIcon={<FilterIcon />}
                    aria-label="Filter"
                  >
                    <Visible from="sm">Filter</Visible>
                  </Button>
                </SheetTrigger>
              </Visible>
              <SheetContent side="start" gap={4} scroll>
                <SheetTitle>Filter</SheetTitle>
                {filterPanel(false)}
              </SheetContent>
            </Sheet>

            {/* The label is dropped below `sm`. At 375 the row is a logo, the
                account and theme menus, Filter and this; keeping every word
                left six pixels of clearance, which reads as a clipped edge. */}
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<CartIcon />}
              onClick={() => {
                setToast(null);
                setCartOpen(true);
              }}
              aria-label="Cart"
            >
              <Visible from="sm">Cart</Visible>
              {count > 0 && <Badge status="info">{count}</Badge>}
            </Button>
          </>
        }
      >
        <Wordmark href="#/shop/" icon={<CartIcon />}>
          Dusk
        </Wordmark>

        {/* A `<nav>` of links, not a menu of commands: these go somewhere.
            Hidden below `md`, where the same categories are reachable from the
            filter sheet. */}
        <Visible from="md">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
                <NavigationMenuContent width="md">
                  <Grid columns={2} gap={1}>
                    <NavigationMenuLink
                      href="#/shop/"
                      onClick={() => {
                        setCategory('all');
                        setPage(1);
                      }}
                    >
                      <Text inline size="sm" weight="medium" tone="primary">
                        Everything
                      </Text>
                      <Text inline size="caption" tone="muted">
                        {products.length} items in the catalogue
                      </Text>
                    </NavigationMenuLink>
                    {categories.map((item) => (
                      <NavigationMenuLink
                        key={item.id}
                        href="#/shop/"
                        onClick={() => {
                          setCategory(item.id);
                          setPage(1);
                        }}
                      >
                        <Text inline size="sm" weight="medium" tone="primary">
                          {item.label}
                        </Text>
                        <Text inline size="caption" tone="muted">
                          {item.blurb}
                        </Text>
                      </NavigationMenuLink>
                    ))}
                  </Grid>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink variant="top" href="#/shop/orders">
                  Orders
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Visible>
      </AppHeader>

      <AppBody width="full">
        <AppMain>
          {detail ? (
            <ProductPage key={detail.id} product={detail} onAdd={add} />
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
            <Container width="6xl">
              <Split layout="aside-start" asideWidth="md" from="md">
                <Visible from="md">
                  <Stack as="aside">{filterPanel(true)}</Stack>
                </Visible>

                <Stack gap={5}>
                  <PageHeader
                    title={
                      <>
                        {categories.find((c) => c.id === category)?.label ?? 'Catalogue'}{' '}
                        <Text inline weight="normal" tone="muted" numeric>
                          ({matches.length})
                        </Text>
                      </>
                    }
                    align="center"
                    actions={
                      <>
                        {filtered && (
                          <Button variant="ghost" size="sm" onClick={resetAll}>
                            Clear filters
                          </Button>
                        )}
                        <Select value={sort} onValueChange={setSort}>
                          <SelectTrigger aria-label="Sort by" width="xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent aria-label="Sort by">
                            <SelectItem value="popular">Most popular</SelectItem>
                            <SelectItem value="cheapest">Lowest price</SelectItem>
                            <SelectItem value="dearest">Highest price</SelectItem>
                            <SelectItem value="rating">Highest rated</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    }
                  />

                  {shown.length === 0 ? (
                    <EmptyState
                      icon={<SearchIcon size="2xl" />}
                      title="Nothing matches"
                      description="Try widening the price range, or clearing one of the filters."
                      action={
                        <Button variant="secondary" onClick={resetAll}>
                          Reset filters
                        </Button>
                      }
                    />
                  ) : (
                    <>
                      {/* One column on a phone, two from `sm`, three from `lg`.
                          The hardest reflow in the set, and the reason the card
                          has no fixed width of its own. */}
                      <Grid as="ul" columns={1} sm={2} lg={3} gap={4}>
                        {shown.map((product) => (
                          <li key={product.id}>
                            <ProductCard product={product} onAdd={add} />
                          </li>
                        ))}
                      </Grid>

                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#/shop/"
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                            />
                          </PaginationItem>
                          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                            <PaginationItem key={n}>
                              <PaginationLink
                                href="#/shop/"
                                isCurrent={n === current}
                                onClick={() => setPage(n)}
                              >
                                {n}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#/shop/"
                              onClick={() => setPage((p) => Math.min(pages, p + 1))}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </>
                  )}
                </Stack>
              </Split>
            </Container>
          )}
        </AppMain>
      </AppBody>

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
    </AppShell>
  );
}
