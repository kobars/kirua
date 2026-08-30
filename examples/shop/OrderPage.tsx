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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'kirua';
import { orderTone, products, rupiah, type Order } from './data';

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
            <BreadcrumbLink href="#/pesanan">Pesanan saya</BreadcrumbLink>
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
            Dipesan {order.placed} · {order.courier} {order.tracking}
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
            Barang
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
                      <a href={`#/produk/${product.id}`}>
                        <ItemMedia
                          aria-hidden="true"
                          className="size-12 rounded-md bg-sunken text-body-md font-semibold"
                        >
                          {product.name.charAt(0)}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{product.name}</ItemTitle>
                          <ItemDescription>
                            {line.quantity} × {rupiah(line.price)}
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
            <DescriptionDetails numeric>{rupiah(subtotal)}</DescriptionDetails>
            <DescriptionTerm>Ongkos kirim</DescriptionTerm>
            <DescriptionDetails numeric>{rupiah(DELIVERY)}</DescriptionDetails>
            <DescriptionTerm emphasis>Total</DescriptionTerm>
            <DescriptionDetails emphasis numeric>
              {rupiah(subtotal + DELIVERY)}
            </DescriptionDetails>
          </DescriptionList>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="grid gap-3">
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between gap-3">
              <Heading as="h2" size="body-md">
                Riwayat pengiriman
              </Heading>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" trailingIcon={<ChevronDownIcon />}>
                  Rincian
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Kejadian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.events.map((event) => (
                    <TableRow key={event.at}>
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {event.at}
                      </TableCell>
                      <TableCell>{event.what}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <div>
            <Heading as="h3" size="body-sm">
              Dikirim ke
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
