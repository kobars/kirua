import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  Spinner,
  Stepper,
  StepperItem,
  Text,
} from 'kirua';

/** The stepper announces its own state, and this app speaks Indonesian. */
const STEP_LABELS = { done: 'Selesai', current: 'Langkah saat ini', upcoming: 'Belum mulai' };

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
    <Container width="md" pad="lg">
      <div>
        <Heading as="h1" size="heading-md">
          Masuk
        </Heading>
        <Text size="sm" className="mt-1">
          Kami kirim kode sekali pakai ke nomor kamu.
        </Text>
      </div>

      {/* The page had always been two steps and had never said which one you
          were on. `aria-current="step"` is the half of that a drawing cannot
          carry. */}
      <Stepper aria-label="Langkah masuk">
        <StepperItem status={sent ? 'done' : 'current'} index={1} labels={STEP_LABELS}>
          Nomor telepon
        </StepperItem>
        <StepperItem status={sent ? 'current' : 'upcoming'} index={2} labels={STEP_LABELS}>
          Kode sekali pakai
        </StepperItem>
      </Stepper>

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
                  {/* Two groups of three with a separator between them. A code
                      is read aloud in threes, and six unbroken boxes make the
                      reader count. */}
                  <InputOTPGroup>
                    {Array.from({ length: LENGTH / 2 }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        char={code[index]}
                        isActive={code.length === index}
                      />
                    ))}
                    <InputOTPSeparator />
                    {Array.from({ length: LENGTH / 2 }, (_, offset) => {
                      const index = offset + LENGTH / 2;
                      return (
                        <InputOTPSlot
                          key={index}
                          char={code[index]}
                          isActive={code.length === index}
                        />
                      );
                    })}
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
    </Container>
  );
}
