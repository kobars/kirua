import { Fragment, useState } from 'react';
import {
  AvatarStack,
  Badge,
  Button,
  Card,
  CardTitle,
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
  Timeline,
  TimelineItem,
  TimelineTime,
} from '@kobars/kirua';
import {
  contacts,
  flatmates,
  formatMoney,
  formatSigned,
  isoDay,
  TODAY,
  type Transaction,
} from './data';

interface Step {
  what: string;
  /** When it happened; a step still to come has no time yet. */
  when?: string;
}

/** What has happened to a payment so far, and what is still to come. */
function stepsOf({ title, direction, status, category, day, time }: Transaction): Step[] {
  const at = `${day}, ${time}`;
  if (status === 'Scheduled')
    return [{ what: 'Scheduled', when: 'Today' }, { what: `Sends to ${title} on ${day}` }];
  if (direction === 'in')
    return [
      { what: `Sent by ${title}`, when: at },
      { what: 'Arrived in your Pouch balance', when: at },
    ];
  if (category === 'Transfer')
    return [
      { what: 'Sent from your Pouch balance', when: at },
      { what: `Arrived with ${title}`, when: at },
    ];
  if (status === 'Pending')
    return [
      { what: `Paid at ${title}`, when: at },
      { what: 'The shop collects it, usually within two days' },
    ];
  return [
    { what: `Paid at ${title}`, when: at },
    { what: 'Collected by the shop', when: day },
  ];
}

/** `8:12` as a `<time>` wants it: `08:12`. */
const isoTime = (time: string) => (/^\d{1,2}:\d{2}$/.test(time) ? time.padStart(5, '0') : '');

const crew = contacts.filter((contact) => flatmates.includes(contact.id));

export interface TransactionDetailProps {
  transaction: Transaction;
  onNotice: (title: string, description: string) => void;
}

/** One payment, everything known about it, and splitting it with friends. */
export function TransactionDetail({ transaction, onNotice }: TransactionDetailProps) {
  const { id, title, category, amount, direction, day, date, time, method, status, note } =
    transaction;
  const steps = stepsOf(transaction);
  const stamp = isoTime(time);
  const [splitWith, setSplitWith] = useState<string[]>([]);
  const [splitOpen, setSplitOpen] = useState(false);
  const share = amount / (splitWith.length + 1);

  const details: [string, string][] = [
    [
      status === 'Scheduled' ? 'Sends on' : 'When',
      status === 'Scheduled' ? day : `${day}, ${time}`,
    ],
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
        <Badge
          status={
            status === 'Pending' ? 'warning' : status === 'Scheduled' ? 'info' : 'success'
          }
        >
          {status}
        </Badge>
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

      <Card padding="md" gap={3}>
        <CardTitle as="h2" size="heading-sm">
          Status
        </CardTitle>
        <Timeline>
          {steps.map((step) => (
            <TimelineItem key={step.what} state={step.when ? 'past' : 'pending'}>
              {step.when && (
                <TimelineTime
                  dateTime={
                    step.when === 'Today'
                      ? isoDay(TODAY)
                      : step.when.includes(',') && stamp
                        ? `${date}T${stamp}`
                        : date
                  }
                >
                  {step.when}
                </TimelineTime>
              )}
              <Text size="sm" tone="primary">
                {step.what}
              </Text>
            </TimelineItem>
          ))}
        </Timeline>
      </Card>

      <Stack gap={3}>
        {direction === 'out' && status !== 'Scheduled' && (
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
              {/* A group picks everyone in it at once; the faces say who
                  that is before the tap. */}
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={
                  <AvatarStack
                    items={crew.map((contact) => ({ name: contact.name }))}
                    size="sm"
                    aria-hidden="true"
                  />
                }
                onClick={() => setSplitWith(crew.map((contact) => contact.id))}
              >
                Pick the flatmates
              </Button>
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
