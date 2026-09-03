import {
  Button,
  CartIcon,
  EmptyState,
  QuantityStepper,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  Text,
} from 'kirua';
import { idr, type Product } from './data';

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
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? 'Nothing in it yet.'
              : `${lines.length} items, kept for seven days.`}
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            headingLevel="h3"
            icon={<CartIcon size="2xl" />}
            title="Your cart is empty"
            description="Anything you add is kept here for seven days."
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
                  <Text size="sm" className="tabular-nums">
                    {idr(product.price)}
                  </Text>
                  <div className="mt-2">
                    <QuantityStepper
                      label={`Quantity, ${product.name}`}
                      decrementLabel={`One fewer ${product.name}`}
                      incrementLabel={`One more ${product.name}`}
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
            <span className="tabular-nums">{idr(total)}</span>
          </p>
          <Button fullWidth disabled={lines.length === 0} onClick={onCheckout}>
            Checkout
          </Button>
          {/* `SheetClose` and not an `onOpenChange(false)`: Radix closes the
              sheet and puts focus back on the control that opened it, which a
              state setter does not do. */}
          <SheetClose asChild>
            <Button variant="ghost" fullWidth>
              Keep shopping
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
