import { Fragment, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Button,
  Card,
  DatePicker,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  EmptyState,
  Field,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Label,
  Link,
  Price,
  SearchIcon,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  Stack,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from '@kobars/kirua';
import {
  CODE_FROM,
  contacts,
  DEMO_CODE,
  formatDay,
  formatMoney,
  TODAY,
  UNVERIFIED_LIMIT,
  type Contact,
} from './data';

export interface SendProps {
  balance: number;
  /** The person picked, from the route; none while choosing. */
  to: Contact | undefined;
  /** Whether identity is verified, which lifts the limit on one payment. */
  verified: boolean;
  /** `on` is set for a payment scheduled for a later day. */
  onSent: (to: Contact, amount: number, note: string, on?: Date) => void;
}

const CODE_LENGTH = DEMO_CODE.length;

const focusOnMount = (input: HTMLInputElement | null) => input?.focus();

/** Today and the days before it in this month, which a later payment cannot use. */
const notLater = Array.from(
  { length: TODAY.getDate() },
  (_, index) => new Date(TODAY.getFullYear(), TODAY.getMonth(), index + 1),
);

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'] as const;

/**
 * What a key does to the amount typed so far. Two decimals at most, one
 * point, no leading zero and no more than a million: the keypad refuses a
 * number rather than letting it through to be corrected later.
 */
function press(typed: string, key: (typeof KEYS)[number]) {
  if (key === 'delete') return typed.slice(0, -1);
  if (key === '.') return typed.includes('.') ? typed : `${typed || '0'}.`;
  const [whole = '', cents] = typed.split('.');
  if (cents !== undefined) return cents.length >= 2 ? typed : typed + key;
  if (whole === '0') return key;
  return whole.length >= 6 ? typed : typed + key;
}

/** The amount as typed, grouped like money but keeping a trailing point. */
function shown(typed: string) {
  const [whole = '', cents] = typed.split('.');
  const grouped = Number(whole || '0').toLocaleString('en-US');
  return `$${grouped}${cents === undefined ? '' : `.${cents}`}`;
}

/**
 * Sending money: pick a person, type an amount on the keypad, confirm.
 *
 * Picking a person opens their own screen, `send/<id>`, as a phone app pushes
 * one, so the back gesture returns to the list.
 */
export function Send({ balance, to, verified, onSent }: SendProps) {
  const [query, setQuery] = useState('');
  const [typed, setTyped] = useState('');
  const [note, setNote] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [when, setWhen] = useState<'now' | 'later'>('now');
  const [on, setOn] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState(TODAY);
  const [picking, setPicking] = useState(false);
  // The sheet's second step, for a large amount: the code from the phone.
  const [asking, setAsking] = useState(false);
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);

  const amount = Number(typed || '0');
  const tooMuch = amount > balance;
  const overLimit = !verified && amount > UNVERIFIED_LIMIT;
  const later = when === 'later' ? on : undefined;
  const needsCode = amount >= CODE_FROM;
  const found = contacts.filter((contact) =>
    `${contact.name} ${contact.handle}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (to === undefined)
    return (
      <Stack gap={6}>
        <Heading as="h1" size="heading-lg">
          Send money
        </Heading>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            aria-label="Search people"
            placeholder="Name, @handle or phone"
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        {found.length === 0 ? (
          <EmptyState
            headingLevel="h2"
            icon={<SearchIcon size="2xl" />}
            title="Nobody by that name"
            description="Check the spelling, or search by their @handle or phone number."
          />
        ) : (
          <ItemGroup variant="outlined" aria-label="People">
            {found.map((contact, index) => (
              <Fragment key={contact.id}>
                {index > 0 && <ItemSeparator />}
                <Item asChild interactive size="sm">
                  {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the name is the row's title, deeper than the rule looks */}
                  <a href={`#/mobile/send/${contact.id}`}>
                    <ItemMedia>
                      <Avatar size="sm">
                        <AvatarFallback>{contact.initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{contact.name}</ItemTitle>
                      <ItemDescription>{contact.handle}</ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        )}
      </Stack>
    );

  const firstName = to.name.split(' ')[0] ?? to.name;
  const send = () => {
    setReviewing(false);
    onSent(to, amount, note.trim(), later);
  };
  const closeSheet = (open: boolean) => {
    setReviewing(open);
    if (!open) {
      setAsking(false);
      setCode('');
      setWrong(false);
    }
  };

  return (
    <Stack gap={5}>
      <Heading as="h1" size="heading-lg">
        Send to {firstName}
      </Heading>

      <Item variant="outline" size="sm">
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>{to.initials}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{to.name}</ItemTitle>
          <ItemDescription>{to.handle}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button asChild variant="ghost" size="sm">
            <a href="#/mobile/send">Change</a>
          </Button>
        </ItemActions>
      </Item>

      <Stack gap={1} align="center">
        <Stack as="output" align="center" aria-live="polite" aria-label="Amount">
          <Price amount={shown(typed)} size="lg" />
        </Stack>
        <Text size="sm" tone={tooMuch || overLimit ? 'danger' : 'secondary'} aria-live="polite">
          {tooMuch
            ? `More than your balance of ${formatMoney(balance)}`
            : overLimit
              ? `Up to ${formatMoney(UNVERIFIED_LIMIT)} until you verify your identity`
              : `Balance ${formatMoney(balance)}`}
        </Text>
        {overLimit && !tooMuch && <Link href="#/mobile/profile/verify">Verify now</Link>}
      </Stack>

      {/* A phone's number pad: three columns of keys big enough for a thumb. */}
      <Grid columns={3} gap={2}>
        {KEYS.map((key) => (
          <Button
            key={key}
            variant="ghost"
            size="lg"
            fullWidth
            aria-label={
              key === 'delete' ? 'Delete last digit' : key === '.' ? 'Decimal point' : undefined
            }
            onClick={() => setTyped((current) => press(current, key))}
          >
            {key === 'delete' ? '⌫' : key}
          </Button>
        ))}
      </Grid>

      <Field
        controlId="send-note"
        label="Note"
        description="Optional. Only you and the receiver see it."
      >
        <Input
          id="send-note"
          value={note}
          maxLength={60}
          onChange={(event) => setNote(event.target.value)}
        />
      </Field>

      <Stack gap={2}>
        <Text size="sm" weight="medium" tone="primary" id="send-when">
          When
        </Text>
        <ToggleGroup
          type="single"
          value={when}
          onValueChange={(next) => {
            if (next) setWhen(next as typeof when);
          }}
          aria-labelledby="send-when"
        >
          <ToggleGroupItem value="now" variant="outline" size="sm">
            Now
          </ToggleGroupItem>
          <ToggleGroupItem value="later" variant="outline" size="sm">
            On a later day
          </ToggleGroupItem>
        </ToggleGroup>
        {when === 'later' && (
          <Field controlId="send-on" label="Send on">
            <DatePicker
              id="send-on"
              locale="en-GB"
              placeholder="Choose a day"
              panelLabel="Choose the day to send"
              month={month}
              onMonthChange={setMonth}
              value={on}
              open={picking}
              onOpenChange={setPicking}
              today={TODAY}
              disabledDates={notLater}
              onSelect={(picked) => {
                if (picked > TODAY) setOn(picked);
                setPicking(false);
              }}
            />
          </Field>
        )}
      </Stack>

      <Button
        variant="primary"
        fullWidth
        disabled={amount <= 0 || tooMuch || overLimit || (when === 'later' && !on)}
        onClick={() => setReviewing(true)}
      >
        Review
      </Button>

      <Sheet open={reviewing} onOpenChange={closeSheet}>
        <SheetContent side="bottom" gap={4}>
          {asking ? (
            <>
              <Stack gap={0}>
                <SheetTitle>Enter the code we sent</SheetTitle>
                <SheetDescription>
                  {formatMoney(amount)} is a large amount, so Pouch checks it is you. The code
                  went to your phone ending 0142.
                </SheetDescription>
              </Stack>
              <Stack gap={2}>
                <Label htmlFor="send-code">Six-digit code</Label>
                <InputOTP>
                  <InputOTPInput
                    id="send-code"
                    ref={focusOnMount}
                    pattern="\d*"
                    value={code}
                    aria-invalid={wrong || undefined}
                    maxLength={CODE_LENGTH}
                    onChange={(event) => {
                      const next = event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
                      setCode(next);
                      setWrong(false);
                      if (next.length === CODE_LENGTH) {
                        if (next === DEMO_CODE) send();
                        else setWrong(true);
                      }
                    }}
                    // The caret is drawn by the boxes, so the real one stays at
                    // the end, where Backspace removes the last digit.
                    onSelect={(event) => {
                      const { length } = event.currentTarget.value;
                      event.currentTarget.setSelectionRange(length, length);
                    }}
                  />
                  {/* Two groups of three: a code is read in threes. */}
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }, (_, index) => (
                      <Fragment key={index}>
                        {index === CODE_LENGTH / 2 && <InputOTPSeparator />}
                        <InputOTPSlot
                          char={code[index]}
                          isActive={index === Math.min(code.length, CODE_LENGTH - 1)}
                        />
                      </Fragment>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </Stack>
              {wrong && (
                <Alert status="danger" role="alert">
                  <AlertTitle>That code does not match</AlertTitle>
                  <AlertDescription>Type the six digits again.</AlertDescription>
                </Alert>
              )}
              <Alert status="info">
                <AlertTitle>This is a demo</AlertTitle>
                <AlertDescription>
                  No message is sent. The code Pouch accepts is {DEMO_CODE}.
                </AlertDescription>
              </Alert>
              <SheetFooter>
                <Button variant="secondary" onClick={() => setAsking(false)}>
                  Back
                </Button>
              </SheetFooter>
            </>
          ) : (
            <>
              <Stack gap={0}>
                <SheetTitle>
                  {later ? 'Schedule' : 'Send'} {formatMoney(amount)} to {firstName}?
                </SheetTitle>
                <SheetDescription>
                  {later
                    ? `It leaves your balance on ${formatDay(later)}. You can cancel it until then.`
                    : 'It arrives straight away and cannot be called back.'}
                </SheetDescription>
              </Stack>
              <Card padding="sm">
                <DescriptionList layout="split" gap="sm">
                  <DescriptionTerm>To</DescriptionTerm>
                  <DescriptionDetails>{to.name}</DescriptionDetails>
                  <DescriptionTerm>From</DescriptionTerm>
                  <DescriptionDetails>Pouch balance</DescriptionDetails>
                  <DescriptionTerm>When</DescriptionTerm>
                  <DescriptionDetails>{later ? formatDay(later) : 'Now'}</DescriptionDetails>
                  <DescriptionTerm>Fee</DescriptionTerm>
                  <DescriptionDetails>None</DescriptionDetails>
                  {note.trim() !== '' && (
                    <>
                      <DescriptionTerm>Note</DescriptionTerm>
                      <DescriptionDetails>{note.trim()}</DescriptionDetails>
                    </>
                  )}
                </DescriptionList>
              </Card>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </SheetClose>
                <Button
                  variant="primary"
                  onClick={() => (needsCode ? setAsking(true) : send())}
                >
                  {later ? 'Schedule' : 'Send'} {formatMoney(amount)}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Stack>
  );
}
