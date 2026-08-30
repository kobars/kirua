import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSlot,
  Label,
  Spinner,
} from 'kirua';

const LENGTH = 6;
/** The code the demo accepts. A real shop would never know it. */
const EXPECTED = '483920';

export interface SignInPageProps {
  onSignedIn: () => void;
}

/**
 * Two steps: a phone number, then the code sent to it. Nothing leaves the
 * browser — the "code" is fixed, and the page says so rather than pretending.
 */
export function SignInPage({ onSignedIn }: SignInPageProps) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);

  const phoneValid = phone.replace(/\D/g, '').length >= 9;

  const send = () => {
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 600);
  };

  const submit = (value: string) => {
    if (value.length < LENGTH) return;
    if (value === EXPECTED) onSignedIn();
    else setWrong(true);
  };

  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-[minmax(0,1fr)] content-start gap-5 px-4 py-10 md:px-8">
      <div>
        <h1 className="text-heading-md font-semibold text-fg">Masuk</h1>
        <p className="mt-1 text-body-sm text-fg-secondary">
          Kami kirim kode sekali pakai ke nomor kamu.
        </p>
      </div>

      <Card>
        <CardBody className="grid gap-5">
          {/* `Label` and not `Field`: a `Field` hands its id and aria wiring to
              exactly one control child, and the child here is a group that
              wraps the control. */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor telepon</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>+62</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="phone"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="812 3456 7890"
                value={phone}
                disabled={sent}
                onChange={(event) => setPhone(event.target.value)}
              />
            </InputGroup>
          </div>

          {!sent ? (
            <Button fullWidth disabled={!phoneValid || sending} onClick={send}>
              {sending ? <Spinner label="Mengirim kode" /> : 'Kirim kode'}
            </Button>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">Kode enam digit</Label>
                <InputOTP>
                  <InputOTPInput
                    id="otp"
                    value={code}
                    aria-label="Kode sekali pakai"
                    aria-invalid={wrong || undefined}
                    maxLength={LENGTH}
                    onChange={(event) => {
                      const next = event.target.value.replace(/\D/g, '').slice(0, LENGTH);
                      setCode(next);
                      setWrong(false);
                      submit(next);
                    }}
                  />
                  <InputOTPGroup>
                    {Array.from({ length: LENGTH }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        char={code[index]}
                        isActive={code.length === index}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {wrong && (
                <Alert status="danger">
                  <AlertTitle>Kode tidak cocok</AlertTitle>
                  <AlertDescription>Coba ketik ulang enam digitnya.</AlertDescription>
                </Alert>
              )}

              <Alert status="info">
                <AlertTitle>Ini contoh, bukan toko sungguhan</AlertTitle>
                <AlertDescription>
                  Tidak ada SMS yang dikirim. Kode yang diterima halaman ini adalah{' '}
                  <span className="font-medium tabular-nums">{EXPECTED}</span>.
                </AlertDescription>
              </Alert>

              <Button variant="ghost" onClick={() => setSent(false)}>
                Ganti nomor
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
