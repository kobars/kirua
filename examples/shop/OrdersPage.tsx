import { Fragment, useState } from 'react';
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
  Card,
  CartIcon,
  ChevronEndIcon,
  Container,
  EmptyState,
  Heading,
  Inline,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  PageHeader,
  Placeholder,
  Stack,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  Visible,
} from '@kobars/kirua';
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
      <PageHeader
        title="My orders"
        actions={
          <>
            {/* A static word before the filter. Hidden below `sm`, where three
                options already fill the row. */}
            <Visible from="sm">
              <Text inline size="sm">
                Show
              </Text>
            </Visible>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(next) => next !== '' && setFilter(next as Filter)}
              aria-label="Filter orders"
            >
              {(['all', 'open', 'closed'] as const).map((value) => (
                <ToggleGroupItem key={value} value={value} variant="outline" size="sm">
                  {value === 'all' ? 'All' : value === 'open' ? 'Open' : 'Closed'}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </>
        }
      />

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
        <Stack as="ul" gap={4}>
          {shown.map((order) => {
            const status = statusOf(order);
            return (
              <li key={order.id}>
                <Card gap={4}>
                  <Inline wrap justify="between" align="start" gap={3}>
                    <div>
                      <Heading as="h2" size="body-md">
                        {order.id}
                      </Heading>
                      <Text size="sm" numeric>
                        Ordered {order.placed} · {idr(total(order))}
                      </Text>
                    </div>
                    <Badge status={orderTone[status]}>{status}</Badge>
                  </Inline>

                  <ItemGroup>
                    {order.lines.map((line, index) => {
                      const product = products.find((p) => p.id === line.productId);
                      return (
                        <Fragment key={line.productId}>
                          {index > 0 && <ItemSeparator />}
                          <Item size="sm" inset="none">
                            <ItemMedia>
                              <Placeholder size="sm">{product?.name.charAt(0)}</Placeholder>
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>{product?.name ?? line.productId}</ItemTitle>
                              <ItemDescription>
                                {line.quantity} × {idr(line.price)}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <Text inline size="sm" tone="primary" numeric>
                                {idr(line.price * line.quantity)}
                              </Text>
                            </ItemActions>
                          </Item>
                        </Fragment>
                      );
                    })}
                  </ItemGroup>

                  <Inline wrap justify="end" gap={3}>
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
                  </Inline>
                </Card>
              </li>
            );
          })}
        </Stack>
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
