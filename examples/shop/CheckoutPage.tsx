import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  CheckIcon,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Field,
  EmptyState,
  Heading,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from 'kirua';
import { idr } from './data';
import type { CartLine } from './CartSheet';

export interface CheckoutPageProps {
  lines: CartLine[];
  onPlaced: () => void;
}

/**
 * Validation on submit, reported twice: a summary Alert at the top of the form
 * and a message on each field, because a long form scrolled past its first
 * error explains nothing.
 */
export function CheckoutPage({ lines, onPlaced }: CheckoutPageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);
  const [delivery, setDelivery] = useState('standard');

  const result = useRef<HTMLElement>(null);
  useEffect(() => {
    result.current?.focus();
  }, [errors, placed]);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shipping =
    delivery === 'collect' || subtotal === 0
      ? 0
      : delivery === 'express'
        ? 50000
        : subtotal > 500000
          ? 0
          : 25000;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lines.length === 0 || placed) return;
    const form = new FormData(event.currentTarget);
    const found: Record<string, string> = {};

    const name = String(form.get('name') ?? '').trim();
    if (name === '') found['name'] = 'A recipient name is required.';

    const phone = String(form.get('phone') ?? '').trim();
    if (!/^0\d{8,12}$/.test(phone))
      found['phone'] = 'A phone number starts with 0 and has 9 to 13 digits.';

    const address = String(form.get('address') ?? '').trim();
    if (address.length < 10)
      found['address'] = 'That address is too short to deliver a parcel to.';

    if (form.get('terms') !== 'on') found['terms'] = 'Accept the delivery terms to continue.';

    setErrors(found);
    if (Object.keys(found).length === 0) {
      setPlaced(true);
      onPlaced();
    }
  };

  return (
    <Container>
      <Heading as="h1" size="heading-lg">
        Checkout
      </Heading>

      {/* `Alert` supplies no live-region role: announcing is the consumer's
          choice. `<output>` is already a polite live region. */}
      {placed && (
        <output
          ref={(node) => {
            result.current = node;
          }}
          tabIndex={-1}
          className="block"
        >
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Order received</AlertTitle>
            <AlertDescription>
              This is an example screen — nothing is really shipped.
            </AlertDescription>
          </Alert>
        </output>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert
          ref={(node) => {
            result.current = node;
          }}
          tabIndex={-1}
          status="danger"
          role="alert"
        >
          <AlertTitle>{Object.keys(errors).length} fields need fixing</AlertTitle>
          <AlertDescription>Look at the message under each field.</AlertDescription>
        </Alert>
      )}

      {!placed && lines.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add an item before checking out."
          action={
            <Button asChild>
              <a href="#/">Browse products</a>
            </Button>
          }
        />
      ) : (
        !placed && (
          <form noValidate onSubmit={submit} className="grid gap-6 md:grid-cols-[1fr_20rem]">
            <div className="grid content-start gap-5">
              <Field controlId="name" label="Recipient name" error={errors['name']}>
                <Input id="name" name="name" autoComplete="name" />
              </Field>

              <Field
                controlId="phone"
                label="Phone"
                description="Used by the courier on arrival."
                error={errors['phone']}
              >
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </Field>

              <Field controlId="address" label="Address" error={errors['address']}>
                <Input id="address" name="address" autoComplete="street-address" />
              </Field>

              <Field controlId="city" label="City">
                <Select defaultValue="bandung" name="city">
                  <SelectTrigger id="city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent aria-label="City">
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                    <SelectItem value="makassar">Makassar</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <fieldset className="grid gap-3">
                <legend className="mb-1 text-body-sm font-medium text-fg">Delivery</legend>
                <RadioGroup
                  value={delivery}
                  onValueChange={setDelivery}
                  name="shipping"
                  aria-label="Delivery"
                >
                  {(
                    [
                      ['standard', 'Standard — 3 to 5 days'],
                      ['express', 'Express — arrives tomorrow'],
                      ['collect', 'Collect in store'],
                    ] as const
                  ).map(([id, label]) => (
                    <div key={id} className="flex items-center gap-2">
                      <RadioGroupItem value={id} id={`ship-${id}`} />
                      <Label htmlFor={`ship-${id}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="grid gap-1.5">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    name="terms"
                    aria-invalid={errors['terms'] !== undefined}
                    aria-describedby={errors['terms'] ? 'terms-error' : undefined}
                  />
                  <Label htmlFor="terms">I accept the delivery terms</Label>
                </div>
                {errors['terms'] && (
                  <p id="terms-error" className="text-body-sm text-invalid">
                    {errors['terms']}
                  </p>
                )}
              </div>
            </div>

            <Card className="grid h-max gap-3 p-5">
              <Heading as="h2" size="body-md">
                Summary
              </Heading>
              <Separator />
              <DescriptionList>
                <DescriptionTerm>Subtotal</DescriptionTerm>
                <DescriptionDetails numeric>{idr(subtotal)}</DescriptionDetails>
                <DescriptionTerm>Delivery</DescriptionTerm>
                <DescriptionDetails numeric>
                  {shipping === 0 ? 'Free' : idr(shipping)}
                </DescriptionDetails>
              </DescriptionList>
              <Separator />
              {/* The total is part of the same list semantically, but a Separator
              between two rows would break the grid — so it is its own list of
              one pair, which is also what the markup said before. */}
              <DescriptionList>
                <DescriptionTerm emphasis>Total</DescriptionTerm>
                <DescriptionDetails emphasis numeric>
                  {idr(subtotal + shipping)}
                </DescriptionDetails>
              </DescriptionList>
              <Button type="submit" fullWidth size="lg">
                Pay
              </Button>
            </Card>
          </form>
        )
      )}
    </Container>
  );
}
