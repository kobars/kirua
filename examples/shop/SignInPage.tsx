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
  Stepper,
  StepperItem,
  Text,
} from 'kirua';

/** The stepper announces its own state, and this app speaks Indonesian. */
const STEP_LABELS = { done: 'Done', current: 'Current step', upcoming: 'Not started' };

const LENGTH = 6;
/** The code the demo accepts. A real shop would never know it. */
const EXPECTED = '483920';

/**
 * The button that sent the code is replaced by the code field, so focus moves
 * there rather than falling to the page. Module-level, so the ref is stable and
 * runs once when the field mounts, not on every render.
 */
const focusOnMount = (input: HTMLInputElement | null) => input?.focus();

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
          Sign in
        </Heading>
        <Text size="sm" className="mt-1">
          We send a one-time code to your number.
        </Text>
      </div>

      {/* The page had always been two steps and had never said which one you
          were on. `aria-current="step"` is the half of that a drawing cannot
          carry. */}
      <Stepper aria-label="Sign-in steps">
        <StepperItem status={sent ? 'done' : 'current'} index={1} labels={STEP_LABELS}>
          Phone number
        </StepperItem>
        <StepperItem status={sent ? 'current' : 'upcoming'} index={2} labels={STEP_LABELS}>
          One-time code
        </StepperItem>
      </Stepper>

      <Card>
        <CardBody className="grid gap-5">
          {/* `Label` and not `Field`: a `Field` hands its id and aria wiring to
              exactly one control child, and the child here is a group that
              wraps the control. */}
          <form
            id="phone-step"
            className="grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (phoneValid && !sending && !sent) send();
            }}
          >
            <Label htmlFor="phone">Phone number</Label>
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
          </form>

          {!sent ? (
            <Button
              type="submit"
              form="phone-step"
              fullWidth
              disabled={!phoneValid}
              loading={sending}
              loadingLabel="Sending the code"
            >
              Send the code
            </Button>
          ) : (
            <div className="grid gap-4">
              <form
                className="grid gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit(code);
                }}
              >
                <Label htmlFor="otp">Six-digit code</Label>
                <InputOTP>
                  <InputOTPInput
                    id="otp"
                    ref={focusOnMount}
                    pattern="\d*"
                    value={code}
                    aria-label="One-time code"
                    aria-invalid={wrong || undefined}
                    maxLength={LENGTH}
                    onChange={(event) => {
                      const next = event.target.value.replace(/\D/g, '').slice(0, LENGTH);
                      setCode(next);
                      setWrong(false);
                      submit(next);
                    }}
                    // The caret is drawn by the boxes, so the real one is kept
                    // at the end, where Backspace removes the last digit.
                    onSelect={(event) => {
                      const { length } = event.currentTarget.value;
                      event.currentTarget.setSelectionRange(length, length);
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
                        isActive={index === Math.min(code.length, LENGTH - 1)}
                      />
                    ))}
                    <InputOTPSeparator />
                    {Array.from({ length: LENGTH / 2 }, (_, offset) => {
                      const index = offset + LENGTH / 2;
                      return (
                        <InputOTPSlot
                          key={index}
                          char={code[index]}
                          isActive={index === Math.min(code.length, LENGTH - 1)}
                        />
                      );
                    })}
                  </InputOTPGroup>
                </InputOTP>
              </form>

              {wrong && (
                <Alert status="danger" role="alert">
                  <AlertTitle>That code does not match</AlertTitle>
                  <AlertDescription>Type the six digits again.</AlertDescription>
                </Alert>
              )}

              <Alert status="info">
                <AlertTitle>This is an example, not a real shop</AlertTitle>
                <AlertDescription>
                  No message is sent. The code this page accepts is{' '}
                  <span className="font-medium tabular-nums">{EXPECTED}</span>.
                </AlertDescription>
              </Alert>

              <Button type="button" variant="ghost" onClick={() => setSent(false)}>
                Change number
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
