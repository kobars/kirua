import { Fragment, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
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
} from '@kobars/kirua';
import { contacts, formatMoney, type Contact } from './data';

export interface SendProps {
  balance: number;
  /** The person picked, from the route; none while choosing. */
  to: Contact | undefined;
  onSent: (to: Contact, amount: number, note: string) => void;
}

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
export function Send({ balance, to, onSent }: SendProps) {
  const [query, setQuery] = useState('');
  const [typed, setTyped] = useState('');
  const [note, setNote] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const amount = Number(typed || '0');
  const tooMuch = amount > balance;
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
        <Text size="sm" tone={tooMuch ? 'danger' : 'secondary'} aria-live="polite">
          {tooMuch
            ? `More than your balance of ${formatMoney(balance)}`
            : `Balance ${formatMoney(balance)}`}
        </Text>
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

      <Button
        variant="primary"
        fullWidth
        disabled={amount <= 0 || tooMuch}
        onClick={() => setReviewing(true)}
      >
        Review
      </Button>

      <Sheet open={reviewing} onOpenChange={setReviewing}>
        <SheetContent side="bottom" gap={4}>
          <Stack gap={0}>
            <SheetTitle>
              Send {formatMoney(amount)} to {firstName}?
            </SheetTitle>
            <SheetDescription>
              It arrives straight away and cannot be called back.
            </SheetDescription>
          </Stack>
          <Card padding="sm">
            <DescriptionList layout="split" gap="sm">
              <DescriptionTerm>To</DescriptionTerm>
              <DescriptionDetails>{to.name}</DescriptionDetails>
              <DescriptionTerm>From</DescriptionTerm>
              <DescriptionDetails>Pouch balance</DescriptionDetails>
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
              onClick={() => {
                setReviewing(false);
                onSent(to, amount, note.trim());
              }}
            >
              Send {formatMoney(amount)}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Stack>
  );
}
