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
  Grid,
  Heading,
  Inline,
  Placeholder,
  Price,
  QuantityStepper,
  Rating,
  Separator,
  Split,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  Visible,
} from 'kirua';
import { idr, type Product } from './data';

export interface ProductPageProps {
  product: Product;
  onAdd: (product: Product, size: string, quantity: number) => void;
}

export function ProductPage({ product, onAdd }: ProductPageProps) {
  const [size, setSize] = useState(product.size[0] ?? 'M');
  const [quantity, setQuantity] = useState(1);

  return (
    <Container width="6xl" gap="lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/shop/">Catalogue</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* Three crumbs do not fit beside a product name at 320px, so the
              middle one collapses to an ellipsis there. It is `aria-hidden`,
              and the brand is a link on the page below, so nothing is lost to
              a screen reader — the crumb it replaces was a duplicate. */}
          <Visible below="sm">
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </Visible>
          <Visible from="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="#/shop/">{product.brand}</BreadcrumbLink>
            </BreadcrumbItem>
          </Visible>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Grid md={2} gap={8}>
        <Carousel label={`Photos of ${product.name}`} inset>
          {['Front', 'Side', 'Detail', 'Boxed'].map((view) => (
            <CarouselItem key={view} size="md">
              <AspectRatio ratio={1} radius="lg">
                <Placeholder>
                  <Text inline size="sm" tone="muted">
                    {view}
                  </Text>
                </Placeholder>
              </AspectRatio>
            </CarouselItem>
          ))}
        </Carousel>

        <Stack gap={5}>
          <Stack gap={1}>
            <Eyebrow>{product.brand}</Eyebrow>
            <Heading as="h1" size="heading-lg">
              {product.name}
            </Heading>
            <Rating value={product.rating}>· {product.reviews} reviews</Rating>
          </Stack>

          <Inline wrap align="baseline" gap={3}>
            <Price
              size="lg"
              amount={idr(product.price)}
              was={product.was === undefined ? undefined : idr(product.was)}
            />
            <Badge status={product.stock > 5 ? 'success' : 'warning'}>
              {product.stock > 5 ? 'In stock' : `${product.stock} left`}
            </Badge>
          </Inline>

          <Text wrap="pretty">{product.blurb}</Text>

          <Separator />

          <Stack gap={2} align="start">
            {/* Not a `Label`: kirua types `htmlFor` as required, and there is
                no single control to point at — a ToggleGroup is several. A
                plain element referenced by `aria-labelledby` names the group,
                which is what a group needs. */}
            <Text inline id="size-label" size="sm" weight="medium" tone="primary">
              Size
            </Text>
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
          </Stack>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onAdd(product, size, quantity);
            }}
          >
            <Split layout="fit-start" from="base" align="center" gap={3}>
              <QuantityStepper
                label={`Quantity, ${product.name}`}
                value={quantity}
                min={1}
                max={product.stock}
                onDecrement={() => setQuantity((n) => n - 1)}
                onIncrement={() => setQuantity((n) => n + 1)}
              />
              <Button size="lg" leadingIcon={<CartIcon />} fullWidth type="submit">
                Add to cart
              </Button>
            </Split>
          </form>
        </Stack>
      </Grid>

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <Text measure="prose">
            {product.blurb} In {product.colour.toLowerCase()}, available in{' '}
            {product.size.join(', ')}.
          </Text>
        </TabsContent>
        <TabsContent value="delivery">
          <Text measure="prose">
            Shipped from Bandung within one working day. Free delivery over Rp 500,000.
          </Text>
        </TabsContent>
        <TabsContent value="reviews">
          <Text measure="prose">
            {product.reviews} reviews, averaging {product.rating.toFixed(1)} out of 5.
          </Text>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
