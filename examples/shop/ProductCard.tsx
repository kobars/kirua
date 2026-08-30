import { AspectRatio, Badge, Button, Card, CartIcon, StarIcon } from 'kirua';
import { rupiah, type Product } from './data';

export interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      {/* The box is reserved before anything fills it, so a grid of nine
          products cannot reflow as they arrive. */}
      <AspectRatio ratio={1} className="rounded-md bg-sunken">
        <div
          aria-hidden="true"
          className="grid size-full place-content-center text-display-md text-fg-muted"
        >
          {product.name.charAt(0)}
        </div>
      </AspectRatio>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption text-fg-muted uppercase">{product.brand}</p>
          <h3 className="text-body-md font-semibold text-balance text-fg">
            <a
              href={`#/produk/${product.id}`}
              className="rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {product.name}
            </a>
          </h3>
        </div>
        {product.condition === 'used' && <Badge status="warning">Bekas</Badge>}
      </div>

      <p className="flex items-center gap-1 text-body-sm text-fg-secondary [--icon-size:var(--icon-sm)]">
        <StarIcon aria-hidden="true" className="text-warning-solid" />
        <span className="tabular-nums">{product.rating.toFixed(1)}</span>
        <span className="text-fg-muted">({product.reviews})</span>
      </p>

      <p className="mt-auto flex flex-wrap items-baseline gap-2">
        <span className="text-body-lg font-semibold text-fg tabular-nums">
          {rupiah(product.price)}
        </span>
        {product.was !== undefined && (
          <span className="text-body-sm text-fg-muted tabular-nums line-through">
            {rupiah(product.was)}
          </span>
        )}
      </p>

      <Button
        fullWidth
        size="sm"
        leadingIcon={<CartIcon />}
        onClick={() => onAdd(product)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Habis' : 'Tambah'}
      </Button>
    </Card>
  );
}
