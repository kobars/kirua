import { useState } from 'react';
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
  Card,
  CardBody,
  CartIcon,
  EmptyState,
  Heading,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Text,
} from 'kirua';
import { orderTone, orders, products, rupiah, type Order } from './data';

type Filter = 'semua' | 'berjalan' | 'selesai';

const total = (order: Order) =>
  order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

export interface OrdersPageProps {
  onOpen: (id: string) => void;
}

/**
 * Past orders. The cancel control is behind an `AlertDialog` because it is the
 * one action on this screen that cannot be undone from this screen.
 */
export function OrdersPage({ onOpen }: OrdersPageProps) {
  const [filter, setFilter] = useState<Filter>('semua');
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [cancelled, setCancelled] = useState<string[]>([]);

  const statusOf = (order: Order) => (cancelled.includes(order.id) ? 'batal' : order.status);

  const shown = orders.filter((order) => {
    const status = statusOf(order);
    if (filter === 'berjalan') return status === 'diproses' || status === 'dikirim';
    if (filter === 'selesai') return status === 'tiba' || status === 'batal';
    return true;
  });

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-[minmax(0,1fr)] content-start gap-5 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading as="h1" size="heading-md">
          Pesanan saya
        </Heading>
        <ButtonGroup aria-label="Saring pesanan">
          {(['semua', 'berjalan', 'selesai'] as const).map((value) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={filter === value ? 'bg-selected text-on-selected' : undefined}
            >
              {value === 'semua' ? 'Semua' : value === 'berjalan' ? 'Berjalan' : 'Selesai'}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<CartIcon size="2xl" />}
          title="Belum ada pesanan di sini"
          description="Pesanan yang sudah dibayar akan muncul di halaman ini."
          action={
            <Button variant="secondary" onClick={() => setFilter('semua')}>
              Tampilkan semua
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-4">
          {shown.map((order) => {
            const status = statusOf(order);
            return (
              <li key={order.id}>
                <Card>
                  {/* `minmax(0,1fr)`, because an `Item` row cannot shrink on
                      its own. `ItemContent` truncates, so its min-content is the
                      whole untruncated title, and a flex row's min-content is
                      the sum of its children's — 294 pixels against 246 of card.
                      `min-w-0` lets the title shrink once the row has a width;
                      it does not stop an `auto` grid column asking for the row's
                      min-content in the first place. */}
                  <CardBody className="grid grid-cols-[minmax(0,1fr)] gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Heading as="h2" size="body-md">
                          {order.id}
                        </Heading>
                        <Text size="sm" className="tabular-nums">
                          Dipesan {order.placed} · {rupiah(total(order))}
                        </Text>
                      </div>
                      <Badge status={orderTone[status]}>{status}</Badge>
                    </div>

                    <ItemGroup>
                      {order.lines.map((line, index) => {
                        const product = products.find((p) => p.id === line.productId);
                        return (
                          <div key={line.productId}>
                            {index > 0 && <ItemSeparator />}
                            <Item size="sm" className="px-0">
                              <ItemMedia
                                aria-hidden="true"
                                className="size-10 rounded-md bg-sunken text-body-sm font-semibold"
                              >
                                {product?.name.charAt(0)}
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle>{product?.name ?? line.productId}</ItemTitle>
                                <ItemDescription>
                                  {line.quantity} × {rupiah(line.price)}
                                </ItemDescription>
                              </ItemContent>
                              <ItemActions className="tabular-nums">
                                {rupiah(line.price * line.quantity)}
                              </ItemActions>
                            </Item>
                          </div>
                        );
                      })}
                    </ItemGroup>

                    <div className="flex flex-wrap justify-end gap-3">
                      {(status === 'diproses' || status === 'dikirim') && (
                        <Button variant="ghost" onClick={() => setCancelling(order)}>
                          Batalkan
                        </Button>
                      )}
                      <Button variant="secondary" onClick={() => onOpen(order.id)}>
                        Lihat rincian
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <AlertDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Batalkan pesanan {cancelling?.id}?</AlertDialogTitle>
          <AlertDialogDescription>
            Barang akan dikembalikan ke stok dan dananya dikirim balik dalam tiga hari kerja.
            Pesanan yang sudah dibatalkan tidak bisa dilanjutkan.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Lanjutkan pesanan</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (cancelling) setCancelled((all) => [...all, cancelling.id]);
                  setCancelling(null);
                }}
              >
                Batalkan pesanan
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
