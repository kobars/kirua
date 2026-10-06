import { Fragment, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Heading,
  Inline,
  Label,
  Price,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
  Stack,
  Text,
} from '@kobars/kirua';
import { contacts, formatMoney, formatSigned, type Transaction } from './data';

export interface TransactionDetailProps {
  transaction: Transaction;
  onNotice: (title: string, description: string) => void;
}

/** One payment, everything known about it, and splitting it with friends. */
export function TransactionDetail({ transaction, onNotice }: TransactionDetailProps) {
  const { id, title, category, amount, direction, day, time, method, status, note } =
    transaction;
  const [splitWith, setSplitWith] = useState<string[]>([]);
  const [splitOpen, setSplitOpen] = useState(false);
  const share = amount / (splitWith.length + 1);

  const details: [string, string][] = [
    ['When', `${day}, ${time}`],
    ['Category', category],
    [direction === 'in' ? 'Paid into' : 'Paid with', method],
    ...(note ? ([['Note', note]] as [string, string][]) : []),
    ['Reference', id.toUpperCase()],
  ];

  return (
    <Stack gap={6}>
      <Stack gap={2} align="start">
        <Heading as="h1" size="heading-md">
          {title}
        </Heading>
        <Price amount={formatSigned(amount, direction)} size="lg" />
        <Badge status={status === 'Pending' ? 'warning' : 'success'}>{status}</Badge>
      </Stack>

      <Card padding="md">
        <DescriptionList layout="split">
          {details.map(([term, value]) => (
            <Fragment key={term}>
              <DescriptionTerm>{term}</DescriptionTerm>
              <DescriptionDetails>{value}</DescriptionDetails>
            </Fragment>
          ))}
        </DescriptionList>
      </Card>

      <Stack gap={3}>
        {direction === 'out' && (
          <Sheet open={splitOpen} onOpenChange={setSplitOpen}>
            <SheetTrigger asChild>
              <Button variant="primary" fullWidth>
                Split this payment
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" gap={4}>
              <Stack gap={0}>
                <SheetTitle>Split {formatMoney(amount)}</SheetTitle>
                <SheetDescription>
                  Pick who shared it. Each person gets a request for an equal part.
                </SheetDescription>
              </Stack>
              <Stack as="ul" gap={3} aria-label="Friends">
                {contacts.map((contact) => (
                  <Inline as="li" key={contact.id} gap={3}>
                    <Checkbox
                      id={`split-${contact.id}`}
                      checked={splitWith.includes(contact.id)}
                      onCheckedChange={(checked) =>
                        setSplitWith((all) =>
                          checked === true
                            ? [...all, contact.id]
                            : all.filter((other) => other !== contact.id),
                        )
                      }
                    />
                    <Label htmlFor={`split-${contact.id}`}>{contact.name}</Label>
                  </Inline>
                ))}
              </Stack>
              <Text size="sm" aria-live="polite">
                {splitWith.length === 0
                  ? 'Nobody picked yet.'
                  : `${formatMoney(share)} each, for you and ${splitWith.length} ${splitWith.length === 1 ? 'friend' : 'friends'}.`}
              </Text>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </SheetClose>
                <Button
                  variant="primary"
                  disabled={splitWith.length === 0}
                  onClick={() => {
                    onNotice(
                      'Requests sent',
                      `${splitWith.length} ${splitWith.length === 1 ? 'friend owes' : 'friends each owe'} you ${formatMoney(share)}.`,
                    );
                    setSplitWith([]);
                    setSplitOpen(false);
                  }}
                >
                  Send requests
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
        <Button
          variant="ghost"
          fullWidth
          onClick={() =>
            onNotice('Report started', 'Pouch support will reply in the app within a day.')
          }
        >
          Report a problem
        </Button>
      </Stack>
    </Stack>
  );
}
