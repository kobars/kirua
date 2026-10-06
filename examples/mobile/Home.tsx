import { Fragment } from 'react';
import {
  BarChart,
  Button,
  Card,
  CardTitle,
  Chart,
  ChartCaption,
  Grid,
  Heading,
  Inline,
  ItemGroup,
  ItemSeparator,
  Link,
  PlusIcon,
  Price,
  SendIcon,
  ShareIcon,
  Stack,
  Text,
} from '@kobars/kirua';
import { formatMoney, week, type Transaction } from './data';
import { TransactionRow } from './TransactionRow';

export interface HomeProps {
  balance: number;
  recent: Transaction[];
  onSend: () => void;
  onNotice: (title: string, description: string) => void;
}

const DAY_NAMES: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const spent = week.reduce((total, day) => total + day.value, 0);
const busiest = week.reduce((most, day) => (day.value > most.value ? day : most));

/** The first screen: what is in the pouch, what to do with it, and what just happened. */
export function Home({ balance, recent, onSend, onNotice }: HomeProps) {
  return (
    <Stack gap={6}>
      <Stack gap={0}>
        <Text size="sm">Good morning</Text>
        <Heading as="h1" size="heading-lg">
          Rin
        </Heading>
      </Stack>

      <Card variant="brand" padding="md" gap={4}>
        <Stack gap={1}>
          <Text size="sm">Pouch balance</Text>
          <Price amount={formatMoney(balance)} size="lg" />
        </Stack>
        {/* Three equal buttons with their words under a thumb, rather than
            three icons and a guess. */}
        <Grid columns={3} gap={2}>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            leadingIcon={<SendIcon />}
            onClick={onSend}
          >
            Send
          </Button>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            leadingIcon={<ShareIcon />}
            onClick={() =>
              onNotice(
                'Request link copied',
                'Anyone with the link can pay you. It expires in 7 days.',
              )
            }
          >
            Request
          </Button>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            leadingIcon={<PlusIcon />}
            onClick={() =>
              onNotice(
                'Top up started',
                'Your bank asks you to confirm. This is a demo, so nothing moves.',
              )
            }
          >
            Top up
          </Button>
        </Grid>
      </Card>

      <Card padding="md" gap={3}>
        <Inline justify="between" align="baseline" gap={2}>
          <CardTitle as="h2" size="heading-sm">
            This week
          </CardTitle>
          <Text inline size="sm" tone="primary" weight="semibold" numeric>
            {formatMoney(spent)}
          </Text>
        </Inline>
        <Chart label="Money spent on each of the last seven days, in dollars">
          <BarChart data={week} />
          <ChartCaption>
            {DAY_NAMES[busiest.label] ?? busiest.label} was your biggest day.
          </ChartCaption>
        </Chart>
      </Card>

      <Stack gap={3}>
        <Inline justify="between" align="baseline" gap={2}>
          <Heading as="h2" size="heading-sm">
            Recent activity
          </Heading>
          <Link href="#/mobile/activity">See all</Link>
        </Inline>
        <ItemGroup variant="outlined">
          {recent.map((transaction, index) => (
            <Fragment key={transaction.id}>
              {index > 0 && <ItemSeparator />}
              <TransactionRow transaction={transaction} />
            </Fragment>
          ))}
        </ItemGroup>
      </Stack>
    </Stack>
  );
}
