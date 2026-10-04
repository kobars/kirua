import { Fragment } from 'react';
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  ButtonGroupText,
  Card,
  ChevronDownIcon,
  ChevronEndIcon,
  ChevronStartIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Heading,
  IconButton,
  Inline,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  PageHeader,
  Placeholder,
  PrintIcon,
  Separator,
  Stack,
  Text,
  Timeline,
  TimelineItem,
  TimelineTime,
} from 'kirua';
import { orderTone, orders, products, idr, type Order } from './data';

export interface OrderPageProps {
  order: Order;
}

const DELIVERY = 22000;

export function OrderPage({ order }: OrderPageProps) {
  const subtotal = order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const position = orders.findIndex((candidate) => candidate.id === order.id);
  const newer = orders[position - 1];
  const older = orders[position + 1];

  return (
    <Container>
      <Inline wrap justify="between" gap={3}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#/shop/orders">My orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{order.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Steps through the order history in the order the list shows it,
            newest first. At either end the step is there but unavailable, so
            the group keeps its shape. */}
        <ButtonGroup aria-label="Order history">
          {newer ? (
            <IconButton
              asChild
              aria-label={`Newer order, ${newer.id}`}
              variant="secondary"
              size="sm"
            >
              <a href={`#/shop/orders/${newer.id}`}>
                <ChevronStartIcon />
              </a>
            </IconButton>
          ) : (
            <IconButton aria-label="Newer order" variant="secondary" size="sm" disabled>
              <ChevronStartIcon />
            </IconButton>
          )}
          <ButtonGroupText size="sm">
            <Text inline size="inherit" tone="inherit" numeric>
              {position + 1} of {orders.length}
            </Text>
          </ButtonGroupText>
          {older ? (
            <IconButton
              asChild
              aria-label={`Older order, ${older.id}`}
              variant="secondary"
              size="sm"
            >
              <a href={`#/shop/orders/${older.id}`}>
                <ChevronEndIcon />
              </a>
            </IconButton>
          ) : (
            <IconButton aria-label="Older order" variant="secondary" size="sm" disabled>
              <ChevronEndIcon />
            </IconButton>
          )}
        </ButtonGroup>
      </Inline>

      <PageHeader
        title={order.id}
        description={
          <Text inline size="sm" numeric>
            Ordered {order.placed} · {order.courier} {order.tracking}
          </Text>
        }
        actions={
          <>
            <Badge status={orderTone[order.status]}>{order.status}</Badge>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Print
            </Button>
          </>
        }
      />

      <Card gap={4}>
        <Heading as="h2" size="body-md">
          Items
        </Heading>
        <ItemGroup>
          {order.lines.map((line, index) => {
            const product = products.find((p) => p.id === line.productId);
            return (
              <Fragment key={line.productId}>
                {index > 0 && <ItemSeparator />}
                <Item asChild={Boolean(product)} interactive={Boolean(product)} inset="none">
                  {product ? (
                    <a href={`#/shop/products/${product.id}`}>
                      <Placeholder size="md">{product.name.charAt(0)}</Placeholder>
                      <ItemContent>
                        <ItemTitle>{product.name}</ItemTitle>
                        <ItemDescription>
                          {line.quantity} × {idr(line.price)}
                        </ItemDescription>
                      </ItemContent>
                    </a>
                  ) : (
                    <ItemContent>
                      <ItemTitle>{line.productId}</ItemTitle>
                    </ItemContent>
                  )}
                </Item>
              </Fragment>
            );
          })}
        </ItemGroup>

        <Separator />

        <DescriptionList>
          <DescriptionTerm>Subtotal</DescriptionTerm>
          <DescriptionDetails numeric>{idr(subtotal)}</DescriptionDetails>
          <DescriptionTerm>Delivery</DescriptionTerm>
          <DescriptionDetails numeric>{idr(DELIVERY)}</DescriptionDetails>
          <DescriptionTerm emphasis>Total</DescriptionTerm>
          <DescriptionDetails emphasis numeric>
            {idr(subtotal + DELIVERY)}
          </DescriptionDetails>
        </DescriptionList>
      </Card>

      <Card gap={3}>
        <Collapsible defaultOpen gap={3}>
          <Inline justify="between" gap={3}>
            <Heading as="h2" size="body-md">
              Delivery history
            </Heading>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" trailingIcon={<ChevronDownIcon />}>
                Details
              </Button>
            </CollapsibleTrigger>
          </Inline>
          <CollapsibleContent>
            {/* A Timeline and not a Table. Two columns of time and event is a
                sequence, and a table invites you to compare across rows. The
                hospital encounter history stays a table for the opposite
                reason: columns you genuinely do compare. */}
            <Timeline>
              {order.events.map((event) => (
                <TimelineItem key={event.at}>
                  <TimelineTime dateTime={event.at.replace(' ', 'T')}>{event.at}</TimelineTime>
                  <Text size="sm" tone="primary">
                    {event.what}
                  </Text>
                </TimelineItem>
              ))}
            </Timeline>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Stack gap={1}>
          <Heading as="h3" size="body-sm">
            Shipped to
          </Heading>
          <Text size="sm">{order.address}</Text>
        </Stack>
      </Card>
    </Container>
  );
}
