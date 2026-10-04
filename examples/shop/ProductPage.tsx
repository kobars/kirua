import { useState } from 'react';
import {
  AspectRatio,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Carousel,
  CarouselItem,
  CartIcon,
  Container,
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
import { idr, type Product } from './data';

export interface ProductPageProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

export function ProductPage({ product, onAdd }: ProductPageProps) {
  const [size, setSize] = useState(product.size[0] ?? 'M');
  const [quantity, setQuantity] = useState(1);

  return (
    <Container width="6xl" gap="lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Catalogue</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* Three crumbs do not fit beside a product name at 320px, so the
              middle one collapses to an ellipsis there. It is `aria-hidden`,
              and the brand is a link on the page below, so nothing is lost to
              a screen reader — the crumb it replaces was a duplicate. */}
          <BreadcrumbItem className="sm:hidden">
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbItem className="hidden sm:flex">
            <BreadcrumbLink href="#/">{product.brand}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 md:grid-cols-2">
        <Carousel label={`Photos of ${product.name}`} className="scroll-p-1 p-1">
          {['Front', 'Side', 'Detail', 'Boxed'].map((view) => (
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
              <span className="text-fg-muted">· {product.reviews} reviews</span>
            </p>
          </div>

          <p className="flex flex-wrap items-baseline gap-3">
            <span className="text-heading-lg font-semibold text-fg tabular-nums">
              {idr(product.price)}
            </span>
            {product.was !== undefined && (
              <span className="text-body-md text-fg-muted tabular-nums line-through">
                {idr(product.was)}
              </span>
            )}
            <Badge status={product.stock > 5 ? 'success' : 'warning'}>
              {product.stock > 5 ? 'In stock' : `${product.stock} left`}
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
              Size
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

          <form
            className="flex flex-wrap items-center gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              onAdd(product, quantity);
            }}
          >
            <QuantityStepper
              label={`Quantity, ${product.name}`}
              value={quantity}
              min={1}
              max={product.stock}
              onDecrement={() => setQuantity((n) => n - 1)}
              onIncrement={() => setQuantity((n) => n + 1)}
            />
            <Button size="lg" leadingIcon={<CartIcon />} className="grow" type="submit">
              Add to cart
            </Button>
          </form>
        </div>
      </div>

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="max-w-prose text-body-md text-fg-secondary">
          <p>
            {product.blurb} In {product.colour.toLowerCase()}, available in{' '}
            {product.size.join(', ')}.
          </p>
        </TabsContent>
        <TabsContent value="delivery" className="max-w-prose text-body-md text-fg-secondary">
          <p>Shipped from Bandung within one working day. Free delivery over Rp 500,000.</p>
        </TabsContent>
        <TabsContent value="reviews" className="max-w-prose text-body-md text-fg-secondary">
          <p>
            {product.reviews} reviews, averaging {product.rating.toFixed(1)} out of 5.
          </p>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
