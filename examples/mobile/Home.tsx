import { Fragment, useState } from 'react';
import {
  BarChart,
  Button,
  Card,
  CardTitle,
  Carousel,
  CarouselItem,
  Chart,
  ChartCaption,
  Grid,
  Heading,
  Inline,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  LineChart,
  Link,
  PlusIcon,
  Price,
  Progress,
  SendIcon,
  ShareIcon,
  Stack,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from '@kobars/kirua';
import { balanceWeek, formatMoney, week, type Goal, type Transaction } from './data';
import { TransactionRow } from './TransactionRow';

export interface HomeProps {
  balance: number;
  recent: Transaction[];
  goals: Goal[];
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
export function Home({ balance, recent, goals, onSend, onNotice }: HomeProps) {
  const [shows, setShows] = useState<'spending' | 'balance'>('spending');
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

      <Stack gap={3}>
        <Heading as="h2" size="heading-sm">
          Savings goals
        </Heading>
        {/* Swiped sideways, as a phone does with a row of cards; the next card
            shows at the edge to say there is more. */}
        <Carousel label="Savings goals">
          {goals.map((goal) => (
            <CarouselItem key={goal.id} size="sm">
              <Item asChild interactive variant="outline">
                {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the name is the goal's title, deeper than the rule looks */}
                <a href={`#/mobile/goals/${goal.id}`}>
                  <ItemContent>
                    <ItemTitle>{goal.name}</ItemTitle>
                    <Progress
                      value={Math.min(goal.saved, goal.target)}
                      max={goal.target}
                      aria-label={`${goal.name}, saved so far`}
                      getValueLabel={(value, max) => `${Math.round((value / max) * 100)}%`}
                    />
                    <ItemDescription>
                      {formatMoney(goal.saved)} of {formatMoney(goal.target)}
                    </ItemDescription>
                  </ItemContent>
                </a>
              </Item>
            </CarouselItem>
          ))}
        </Carousel>
      </Stack>

      <Card padding="md" gap={3}>
        <Inline justify="between" align="baseline" gap={2}>
          <CardTitle as="h2" size="heading-sm">
            This week
          </CardTitle>
          <Text inline size="sm" tone="primary" weight="semibold" numeric>
            {shows === 'spending' ? `${formatMoney(spent)} spent` : formatMoney(balance)}
          </Text>
        </Inline>
        {/* A segmented control: two views of the same week, one tap apart. */}
        <ToggleGroup
          type="single"
          value={shows}
          onValueChange={(next) => {
            if (next) setShows(next as typeof shows);
          }}
          aria-label="Show"
        >
          <ToggleGroupItem value="spending" variant="outline" size="sm">
            Spending
          </ToggleGroupItem>
          <ToggleGroupItem value="balance" variant="outline" size="sm">
            Balance
          </ToggleGroupItem>
        </ToggleGroup>
        {shows === 'spending' ? (
          <Chart label="Money spent on each of the last seven days, in dollars">
            <BarChart data={week} />
            <ChartCaption>
              {DAY_NAMES[busiest.label] ?? busiest.label} was your biggest day.
            </ChartCaption>
          </Chart>
        ) : (
          <Chart label="Your balance at the end of each of the last seven days, in dollars">
            <LineChart data={balanceWeek} filled />
            <ChartCaption>Your salary arrived on Monday.</ChartCaption>
          </Chart>
        )}
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
