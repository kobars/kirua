import {
  Button,
  CartIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  EmptyState,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  PaneBody,
  Placeholder,
  QuantityStepper,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  Stack,
} from '@kobars/kirua';
import { idr, type Product } from './data';

export interface CartLine {
  product: Product;
  /** The size chosen on the product page. */
  size: string;
  quantity: number;
}

export interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  onQuantity: (id: string, size: string, delta: number) => void;
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
      <SheetContent side="end" gap={4}>
        <Stack gap={0}>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? 'Nothing in it yet.'
              : lines.length === 1
                ? '1 item in this demo cart.'
                : `${lines.length} items in this demo cart.`}
          </SheetDescription>
        </Stack>

        {/* Only the lines scroll: the total and the checkout button stay on
            the screen however long the cart gets. */}
        <PaneBody>
          {lines.length === 0 ? (
            <EmptyState
              headingLevel="h3"
              icon={<CartIcon size="2xl" />}
              title="Your cart is empty"
              description="Add an item to try checkout. This demo cart resets on reload."
            />
          ) : (
            <Stack as="ul" gap={0}>
              {lines.map(({ product, size, quantity }, index) => (
                <Stack as="li" gap={0} key={`${product.id}-${size}`}>
                  {index > 0 && <ItemSeparator />}
                  <Item inset="none" align="start">
                    <ItemMedia>
                      <Placeholder size="lg">{product.name.charAt(0)}</Placeholder>
                    </ItemMedia>
                    <ItemContent>
                      <Stack gap={2}>
                        <Stack gap={0.5}>
                          <ItemTitle>{product.name}</ItemTitle>
                          <ItemDescription>
                            Size {size} · {idr(product.price)}
                          </ItemDescription>
                        </Stack>
                        <Stack align="start">
                          <QuantityStepper
                            label={`Quantity, ${product.name}, size ${size}`}
                            decrementLabel={`One fewer ${product.name}, size ${size}`}
                            incrementLabel={`One more ${product.name}, size ${size}`}
                            value={quantity}
                            min={0}
                            max={product.stock}
                            onDecrement={() => onQuantity(product.id, size, -1)}
                            onIncrement={() => onQuantity(product.id, size, 1)}
                          />
                        </Stack>
                      </Stack>
                    </ItemContent>
                  </Item>
                </Stack>
              ))}
            </Stack>
          )}
        </PaneBody>

        <SheetFooter orientation="vertical">
          <Separator />
          <DescriptionList>
            <DescriptionTerm emphasis>Total</DescriptionTerm>
            <DescriptionDetails emphasis numeric>
              {idr(total)}
            </DescriptionDetails>
          </DescriptionList>
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
