import { useState } from 'react';
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
import { rupiah } from './data';
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

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 25000;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const found: Record<string, string> = {};

    const name = String(form.get('name') ?? '').trim();
    if (name === '') found['name'] = 'Nama penerima wajib diisi.';

    const phone = String(form.get('phone') ?? '').trim();
    if (!/^0\d{8,12}$/.test(phone)) found['phone'] = 'Nomor telepon diawali 0 dan 9–13 angka.';

    const address = String(form.get('address') ?? '').trim();
    if (address.length < 10) found['address'] = 'Alamat terlalu pendek untuk dikirimi paket.';

    if (form.get('terms') !== 'on') found['terms'] = 'Setujui syarat pengiriman untuk lanjut.';

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
        <output className="block">
          <Alert status="success" icon={<CheckIcon />}>
            <AlertTitle>Pesanan diterima</AlertTitle>
            <AlertDescription>
              Ini layar contoh — tidak ada yang benar-benar dikirim.
            </AlertDescription>
          </Alert>
        </output>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert status="danger" role="alert">
          <AlertTitle>Ada {Object.keys(errors).length} isian yang perlu diperbaiki</AlertTitle>
          <AlertDescription>Lihat pesan di bawah setiap isian.</AlertDescription>
        </Alert>
      )}

      <form noValidate onSubmit={submit} className="grid gap-6 md:grid-cols-[1fr_20rem]">
        <div className="grid content-start gap-5">
          <Field controlId="name" label="Nama penerima" error={errors['name']}>
            <Input id="name" name="name" autoComplete="name" />
          </Field>

          <Field
            controlId="phone"
            label="Telepon"
            description="Dipakai kurir saat tiba."
            error={errors['phone']}
          >
            <Input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" />
          </Field>

          <Field controlId="address" label="Alamat" error={errors['address']}>
            <Input id="address" name="address" autoComplete="street-address" />
          </Field>

          <Field controlId="city" label="Kota">
            <Select defaultValue="bandung" name="city">
              <SelectTrigger id="city">
                <SelectValue />
              </SelectTrigger>
              <SelectContent aria-label="Kota">
                <SelectItem value="bandung">Bandung</SelectItem>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
                <SelectItem value="makassar">Makassar</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <fieldset className="grid gap-3">
            <legend className="mb-1 text-body-sm font-medium text-fg">Pengiriman</legend>
            <RadioGroup defaultValue="reguler" name="shipping" aria-label="Pengiriman">
              {(
                [
                  ['reguler', 'Reguler — 3 sampai 5 hari'],
                  ['kilat', 'Kilat — besok tiba'],
                  ['ambil', 'Ambil di toko'],
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
              <Checkbox id="terms" name="terms" aria-invalid={errors['terms'] !== undefined} />
              <Label htmlFor="terms">Saya setuju dengan syarat pengiriman</Label>
            </div>
            {errors['terms'] && <p className="text-body-sm text-invalid">{errors['terms']}</p>}
          </div>
        </div>

        <Card className="grid h-max gap-3 p-5">
          <Heading as="h2" size="body-md">
            Ringkasan
          </Heading>
          <Separator />
          <DescriptionList>
            <DescriptionTerm>Subtotal</DescriptionTerm>
            <DescriptionDetails numeric>{rupiah(subtotal)}</DescriptionDetails>
            <DescriptionTerm>Ongkir</DescriptionTerm>
            <DescriptionDetails numeric>
              {shipping === 0 ? 'Gratis' : rupiah(shipping)}
            </DescriptionDetails>
          </DescriptionList>
          <Separator />
          {/* The total is part of the same list semantically, but a Separator
              between two rows would break the grid — so it is its own list of
              one pair, which is also what the markup said before. */}
          <DescriptionList>
            <DescriptionTerm emphasis>Total</DescriptionTerm>
            <DescriptionDetails emphasis numeric>
              {rupiah(subtotal + shipping)}
            </DescriptionDetails>
          </DescriptionList>
          <Button type="submit" fullWidth size="lg">
            Bayar
          </Button>
        </Card>
      </form>
    </Container>
  );
}
