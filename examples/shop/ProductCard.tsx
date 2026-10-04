import {
  AspectRatio,
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  CartIcon,
  Eyebrow,
  Inline,
  Link,
  Placeholder,
  Price,
  Rating,
  Stack,
} from 'kirua';
import { idr, type Product } from './data';

export interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card padding="sm" gap={3} fill>
      {/* The box is reserved before anything fills it, so a grid of nine
          products cannot reflow as they arrive. */}
      <AspectRatio ratio={1} radius="md">
        <Placeholder>{product.name.charAt(0)}</Placeholder>
      </AspectRatio>

      {/* Takes any height the card is given beyond its content, which keeps
          the price and the button at the card's bottom edge. */}
      <CardContent grow>
        <Inline justify="between" align="start" gap={2}>
          <Stack gap={0}>
            <Eyebrow>{product.brand}</Eyebrow>
            {/* `h2`: the only place this card is used is the grid directly
                under the catalogue's `h1`. */}
            <CardTitle as="h2" size="body-md">
              <Link href={`#/shop/products/${product.id}`} variant="block">
                {product.name}
              </Link>
            </CardTitle>
          </Stack>
          {product.condition === 'used' && <Badge status="warning">Used</Badge>}
        </Inline>

        <Rating value={product.rating}>({product.reviews})</Rating>
      </CardContent>

      <Price
        amount={idr(product.price)}
        was={product.was === undefined ? undefined : idr(product.was)}
      />

      <Button
        fullWidth
        size="sm"
        leadingIcon={<CartIcon />}
        onClick={() => onAdd(product)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Sold out' : 'Add'}
      </Button>
    </Card>
  );
}
