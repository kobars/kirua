import { useState } from 'react';
import {
  AspectRatio,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Carousel,
  CarouselItem,
  CartIcon,
  Eyebrow,
  Heading,
  QuantityStepper,
  Separator,
  StarIcon,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from 'kirua';
import { rupiah, type Product } from './data';

export interface ProductPageProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

export function ProductPage({ product, onAdd }: ProductPageProps) {
  const [size, setSize] = useState(product.size[0] ?? 'M');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 md:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Katalog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">{product.brand}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 md:grid-cols-2">
        <Carousel label={`Foto ${product.name}`} className="scroll-p-1 p-1">
          {['Depan', 'Samping', 'Detail', 'Kotak'].map((view) => (
            <CarouselItem key={view} className="w-[min(20rem,80vw)]">
              <AspectRatio ratio={1} className="rounded-lg bg-sunken">
                <div className="grid size-full place-content-center text-body-sm text-fg-muted">
                  {view}
                </div>
              </AspectRatio>
            </CarouselItem>
          ))}
        </Carousel>

        <div className="grid content-start gap-5">
          <div className="grid gap-1">
            <Eyebrow>{product.brand}</Eyebrow>
            <Heading as="h1" size="heading-lg">
              {product.name}
            </Heading>
            <p className="flex items-center gap-1.5 text-body-sm text-fg-secondary [--icon-size:var(--icon-sm)]">
              <StarIcon aria-hidden="true" className="text-warning-solid" />
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-fg-muted">· {product.reviews} ulasan</span>
            </p>
          </div>

          <p className="flex flex-wrap items-baseline gap-3">
            <span className="text-heading-lg font-semibold text-fg tabular-nums">
              {rupiah(product.price)}
            </span>
            {product.was !== undefined && (
              <span className="text-body-md text-fg-muted tabular-nums line-through">
                {rupiah(product.was)}
              </span>
            )}
            <Badge status={product.stock > 5 ? 'success' : 'warning'}>
              {product.stock > 5 ? 'Tersedia' : `Sisa ${product.stock}`}
            </Badge>
          </p>

          <Text className="text-pretty">{product.blurb}</Text>

          <Separator />

          <div className="grid gap-2">
            {/* Not a `Label`: kirua types `htmlFor` as required, and there is
                no single control to point at — a ToggleGroup is several. A
                plain element referenced by `aria-labelledby` names the group,
                which is what a group needs. */}
            <span id="size-label" className="text-body-sm font-medium text-fg">
              Ukuran
            </span>
            <ToggleGroup
              type="single"
              value={size}
              onValueChange={(next) => next && setSize(next)}
              aria-labelledby="size-label"
            >
              {product.size.map((option) => (
                <ToggleGroupItem key={option} value={option} variant="outline">
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper
              label={`Jumlah, ${product.name}`}
              value={quantity}
              min={1}
              max={product.stock}
              onDecrement={() => setQuantity((n) => n - 1)}
              onIncrement={() => setQuantity((n) => n + 1)}
            />
            <Button
              size="lg"
              leadingIcon={<CartIcon />}
              className="grow"
              onClick={() => onAdd(product, quantity)}
            >
              Tambah ke keranjang
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="pengiriman">Pengiriman</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan</TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="max-w-prose text-body-md text-fg-secondary">
          <p>
            {product.blurb} Warna {product.colour.toLowerCase()}, tersedia dalam ukuran{' '}
            {product.size.join(', ')}.
          </p>
        </TabsContent>
        <TabsContent value="pengiriman" className="max-w-prose text-body-md text-fg-secondary">
          <p>Dikirim dari Bandung dalam satu hari kerja. Gratis ongkir di atas Rp 500.000.</p>
        </TabsContent>
        <TabsContent value="ulasan" className="max-w-prose text-body-md text-fg-secondary">
          <p>
            {product.reviews} ulasan, rata-rata {product.rating.toFixed(1)} dari 5.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
