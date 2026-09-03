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
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  CardBody,
  CartIcon,
  ChevronEndIcon,
  Container,
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
import { orderTone, orders, products, idr, type Order } from './data';

type Filter = 'all' | 'open' | 'closed';

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
  const [filter, setFilter] = useState<Filter>('all');
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [cancelled, setCancelled] = useState<string[]>([]);

  const statusOf = (order: Order) =>
    cancelled.includes(order.id) ? 'cancelled' : order.status;

  const shown = orders.filter((order) => {
    const status = statusOf(order);
    if (filter === 'open') return status === 'processing' || status === 'shipped';
    if (filter === 'closed') return status === 'delivered' || status === 'cancelled';
    return true;
  });

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading as="h1" size="heading-md">
          My orders
        </Heading>
        <ButtonGroup aria-label="Filter orders">
          {/* A static label sharing the group's shape. Hidden below `sm`,
              where three buttons already fill the row. */}
          <ButtonGroupText className="hidden sm:inline-flex">Show</ButtonGroupText>
          <ButtonGroupSeparator className="hidden sm:block" />
          {(['all', 'open', 'closed'] as const).map((value) => (
            <Button
              key={value}
              variant="secondary"
              size="sm"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={filter === value ? 'bg-selected text-on-selected' : undefined}
            >
              {value === 'all' ? 'All' : value === 'open' ? 'Open' : 'Closed'}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<CartIcon size="2xl" />}
          title="No orders here yet"
          description="Orders you have paid for show up on this page."
          action={
            <Button variant="secondary" onClick={() => setFilter('all')}>
              Show all
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
                          Ordered {order.placed} · {idr(total(order))}
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
                                  {line.quantity} × {idr(line.price)}
                                </ItemDescription>
                              </ItemContent>
                              <ItemActions className="tabular-nums">
                                {idr(line.price * line.quantity)}
                              </ItemActions>
                            </Item>
                          </div>
                        );
                      })}
                    </ItemGroup>

                    <div className="flex flex-wrap justify-end gap-3">
                      {(status === 'processing' || status === 'shipped') && (
                        <Button variant="ghost" onClick={() => setCancelling(order)}>
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        trailingIcon={<ChevronEndIcon />}
                        onClick={() => onOpen(order.id)}
                      >
                        View details
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
          <AlertDialogTitle>Cancel order {cancelling?.id}?</AlertDialogTitle>
          <AlertDialogDescription>
            The items go back into stock and the money is returned within three working days. A
            cancelled order cannot be resumed.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep the order</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={() => {
                  if (cancelling) setCancelled((all) => [...all, cancelling.id]);
                  setCancelling(null);
                }}
              >
                Cancel the order
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
