import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardBody,
  ChevronDownIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Heading,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  PrintIcon,
  Separator,
  Text,
  Timeline,
  TimelineItem,
  TimelineTime,
} from 'kirua';
import { orderTone, products, idr, type Order } from './data';

export interface OrderPageProps {
  order: Order;
}

const DELIVERY = 22000;

export function OrderPage({ order }: OrderPageProps) {
  const subtotal = order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/orders">My orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{order.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading as="h1" size="heading-md">
            {order.id}
          </Heading>
          <Text size="sm" className="mt-1 tabular-nums">
            Ordered {order.placed} · {order.courier} {order.tracking}
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={orderTone[order.status]}>{order.status}</Badge>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Cetak
          </Button>
        </div>
      </div>

      <Card>
        {/* Same reason as the order list: an `Item` row's min-content is the
            sum of its children's, so an `auto` grid column sizes itself to the
            untruncated title rather than to the card. */}
        <CardBody className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <Heading as="h2" size="body-md">
            Items
          </Heading>
          <ItemGroup>
            {order.lines.map((line, index) => {
              const product = products.find((p) => p.id === line.productId);
              return (
                <div key={line.productId}>
                  {index > 0 && <ItemSeparator />}
                  <Item
                    asChild={Boolean(product)}
                    interactive={Boolean(product)}
                    className="px-0"
                  >
                    {product ? (
                      <a href={`#/products/${product.id}`}>
                        <ItemMedia
                          aria-hidden="true"
                          className="size-12 rounded-md bg-sunken text-body-md font-semibold"
                        >
                          {product.name.charAt(0)}
                        </ItemMedia>
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
                </div>
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
        </CardBody>
      </Card>

      <Card>
        <CardBody className="grid gap-3">
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between gap-3">
              <Heading as="h2" size="body-md">
                Delivery history
              </Heading>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" trailingIcon={<ChevronDownIcon />}>
                  Details
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-3">
              {/* A Timeline and not a Table. Two columns of time and event is a
                  sequence, and a table invites you to compare across rows. The
                  simrs visit history stays a table for the opposite reason: six
                  columns you genuinely do compare. */}
              <Timeline>
                {order.events.map((event) => (
                  <TimelineItem key={event.at}>
                    <TimelineTime dateTime={event.at.replace(' ', 'T')}>
                      {event.at}
                    </TimelineTime>
                    <Text size="sm" tone="primary">
                      {event.what}
                    </Text>
                  </TimelineItem>
                ))}
              </Timeline>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <div>
            <Heading as="h3" size="body-sm">
              Shipped to
            </Heading>
            <Text size="sm" className="mt-1">
              {order.address}
            </Text>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
