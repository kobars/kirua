import {
  Button,
  EmptyState,
  QuantityStepper,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  CartIcon,
} from 'kirua';
import { rupiah, type Product } from './data';

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  onQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export function CartSheet({
  open,
  onOpenChange,
  lines,
  onQuantity,
  onCheckout,
}: CartSheetProps) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="end" className="gap-4">
        <div>
          <SheetTitle>Keranjang</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? 'Belum ada barang.'
              : `${lines.length} barang, disimpan tujuh hari.`}
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            headingLevel="h3"
            icon={<CartIcon size="2xl" />}
            title="Keranjang kosong"
            description="Barang yang ditambahkan akan disimpan di sini selama tujuh hari."
          />
        ) : (
          <ul className="min-h-0 flex-1 divide-y divide-line-subtle overflow-y-auto">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-start gap-3 py-4">
                <span
                  aria-hidden="true"
                  className="grid size-14 shrink-0 place-content-center rounded-md bg-sunken text-heading-sm text-fg-muted"
                >
                  {product.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-fg">{product.name}</p>
                  <p className="text-body-sm text-fg-secondary tabular-nums">
                    {rupiah(product.price)}
                  </p>
                  <div className="mt-2">
                    <QuantityStepper
                      label={`Jumlah, ${product.name}`}
                      decrementLabel={`Kurangi ${product.name}`}
                      incrementLabel={`Tambah ${product.name}`}
                      value={quantity}
                      min={0}
                      max={product.stock}
                      onDecrement={() => onQuantity(product.id, -1)}
                      onIncrement={() => onQuantity(product.id, 1)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <SheetFooter className="flex-col items-stretch gap-3">
          <Separator />
          <p className="flex items-center justify-between text-body-md font-semibold text-fg">
            <span>Total</span>
            <span className="tabular-nums">{rupiah(total)}</span>
          </p>
          <Button fullWidth disabled={lines.length === 0} onClick={onCheckout}>
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
