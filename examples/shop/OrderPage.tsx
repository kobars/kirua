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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ChevronDownIcon,
  PrintIcon,
} from 'kirua';
import { orderTone, products, rupiah, type Order } from './data';

export interface OrderPageProps {
  order: Order;
}

const DELIVERY = 22000;

export function OrderPage({ order }: OrderPageProps) {
  const subtotal = order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-[minmax(0,1fr)] content-start gap-5 px-4 py-6 md:px-8">
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
          <h1 className="text-heading-md font-semibold text-fg">{order.id}</h1>
          <p className="mt-1 text-body-sm text-fg-secondary tabular-nums">
            Dipesan {order.placed} · {order.courier} {order.tracking}
          </p>
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
          <h2 className="text-body-md font-semibold text-fg">Barang</h2>
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

          <dl className="grid gap-2 text-body-sm">
            <div className="flex justify-between">
              <dt className="text-fg-secondary">Subtotal</dt>
              <dd className="text-fg tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-secondary">Ongkos kirim</dt>
              <dd className="text-fg tabular-nums">{rupiah(DELIVERY)}</dd>
            </div>
            <div className="flex justify-between text-body-md font-semibold">
              <dt className="text-fg">Total</dt>
              <dd className="text-fg tabular-nums">{rupiah(subtotal + DELIVERY)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="grid gap-3">
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-body-md font-semibold text-fg">Riwayat pengiriman</h2>
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
            <h3 className="text-body-sm font-medium text-fg">Dikirim ke</h3>
            <p className="mt-1 text-body-sm text-fg-secondary">{order.address}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
