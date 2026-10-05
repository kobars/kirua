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
  FieldLegend,
  FieldSet,
  EmptyState,
  Heading,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Split,
  Stack,
} from 'kirua';
import { ErrorLinks } from '../shared/ErrorLinks';
import { idr } from './data';
import type { CartLine } from './CartSheet';

export interface CheckoutPageProps {
  lines: CartLine[];
  onPlaced: () => void;
}

interface Answers {
  name: string;
  phone: string;
  address: string;
  terms: boolean;
}

function validate({ name, phone, address, terms }: Answers): Record<string, string> {
  const found: Record<string, string> = {};
  if (name.trim() === '') found['name'] = 'A recipient name is required.';
  if (!/^0\d{8,12}$/.test(phone.trim()))
    found['phone'] = 'A phone number starts with 0 and has 9 to 13 digits.';
  if (address.trim().length < 10)
    found['address'] = 'That address is too short to deliver a parcel to.';
  if (!terms) found['terms'] = 'Accept the delivery terms to continue.';
  return found;
}

const text = (form: FormData, key: string) => String(form.get(key) ?? '');

/**
 * Validation on submit, reported twice: a summary Alert at the top of the form
 * and a message on each field, because a long form scrolled past its first
 * error explains nothing. Once the form has been sent back, each message clears
 * as soon as its field is valid, and every summary entry links to its field.
 */
export function CheckoutPage({ lines, onPlaced }: CheckoutPageProps) {
  const [answers, setAnswers] = useState<Answers>({
    name: '',
    phone: '',
    address: '',
    terms: false,
  });
  const [attempts, setAttempts] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [delivery, setDelivery] = useState('standard');
  const errors = attempts > 0 ? validate(answers) : {};

  // Focus moves on a submit, not on every change to the messages.
  const result = useRef<HTMLElement>(null);
  useEffect(() => {
    result.current?.focus();
  }, [attempts, placed]);

  // The text fields are read from the form; the checkbox reports through its
  // own handler, so it is kept from the previous answers.
  const read = (form: HTMLFormElement, previous: Answers): Answers => {
    const data = new FormData(form);
    return {
      ...previous,
      name: text(data, 'name'),
      phone: text(data, 'phone'),
      address: text(data, 'address'),
    };
  };

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
    const current = read(event.currentTarget, answers);
    setAnswers(current);
    setAttempts((n) => n + 1);
    if (Object.keys(validate(current)).length === 0) {
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
        <Stack
          as="output"
          ref={(node) => {
            result.current = node;
          }}
          tabIndex={-1}
        >
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Order received</AlertTitle>
            <AlertDescription>
              This is an example screen — nothing is really shipped.
            </AlertDescription>
          </Alert>
        </Stack>
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
          <AlertDescription>
            <ErrorLinks errors={errors} />
          </AlertDescription>
        </Alert>
      )}

      {!placed && lines.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add an item before checking out."
          action={
            <Button asChild>
              <a href="#/shop/">Browse products</a>
            </Button>
          }
        />
      ) : (
        !placed && (
          <form
            noValidate
            onSubmit={submit}
            onChange={(event) => {
              const form = event.currentTarget;
              setAnswers((previous) => read(form, previous));
            }}
          >
            <Split layout="aside-end" asideWidth="lg" from="md" align="start">
              <Stack gap={5}>
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

                <Select defaultValue="bandung" name="city">
                  <Field controlId="city" label="City">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </Field>
                  <SelectContent aria-label="City">
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                    <SelectItem value="makassar">Makassar</SelectItem>
                  </SelectContent>
                </Select>

                <FieldSet>
                  <FieldLegend>Delivery</FieldLegend>
                  <RadioGroup value={delivery} onValueChange={setDelivery} name="shipping">
                    {(
                      [
                        ['standard', 'Standard — 3 to 5 days'],
                        ['express', 'Express — arrives tomorrow'],
                        ['collect', 'Collect in store'],
                      ] as const
                    ).map(([id, label]) => (
                      <Field
                        key={id}
                        orientation="horizontal"
                        controlId={`ship-${id}`}
                        label={label}
                      >
                        <RadioGroupItem value={id} />
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>

                <Field
                  orientation="horizontal"
                  controlId="terms"
                  label="I accept the delivery terms"
                  error={errors['terms']}
                >
                  <Checkbox
                    name="terms"
                    checked={answers.terms}
                    onCheckedChange={(checked) =>
                      setAnswers((previous) => ({ ...previous, terms: checked === true }))
                    }
                  />
                </Field>
              </Stack>

              <Card gap={3}>
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
              one pair. */}
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
            </Split>
          </form>
        )
      )}
    </Container>
  );
}
