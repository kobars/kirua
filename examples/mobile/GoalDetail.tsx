import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Chart,
  ChartCaption,
  Heading,
  LineChart,
  Price,
  Progress,
  Stack,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from '@kobars/kirua';
import { formatMoney, type Goal } from './data';

const AMOUNTS = [10, 25, 50, 100] as const;

export interface GoalDetailProps {
  goal: Goal;
  balance: number;
  onAdd: (goal: Goal, amount: number) => void;
}

/** One savings goal: how far it has come, how it got there, and a quick way to add to it. */
export function GoalDetail({ goal, balance, onAdd }: GoalDetailProps) {
  const [amount, setAmount] = useState<number>(25);
  const reached = goal.saved >= goal.target;
  const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const left = Math.max(0, goal.target - goal.saved);
  // This month's point is what is in the goal now, so adding money moves it.
  const history = goal.history.map((point, index, all) =>
    index === all.length - 1 ? { ...point, value: goal.saved } : point,
  );
  const since = goal.saved - (history[0]?.value ?? 0);

  return (
    <Stack gap={6}>
      <Stack gap={2} align="start">
        <Heading as="h1" size="heading-md">
          {goal.name}
        </Heading>
        <Price amount={formatMoney(goal.saved)} size="lg" />
        <Text size="sm">
          {reached
            ? `You reached your ${formatMoney(goal.target)} goal.`
            : `${percent}% of ${formatMoney(goal.target)}, ${formatMoney(left)} to go`}
        </Text>
        <Progress
          value={Math.min(goal.saved, goal.target)}
          max={goal.target}
          aria-label="Saved so far"
          getValueLabel={() => `${percent}%`}
        />
        {reached && <Badge status="success">Goal reached</Badge>}
      </Stack>

      <Card padding="md" gap={3}>
        <CardTitle as="h2" size="heading-sm">
          Add money
        </CardTitle>
        {/* Four amounts a thumb can hit, instead of a keyboard for a number
            that is nearly always one of them. */}
        <ToggleGroup
          type="single"
          value={String(amount)}
          onValueChange={(next) => {
            if (next) setAmount(Number(next));
          }}
          aria-label="Amount to add"
          wrap
        >
          {AMOUNTS.map((value) => (
            <ToggleGroupItem key={value} value={String(value)} variant="outline" size="sm">
              {formatMoney(value).replace('.00', '')}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Text size="sm" tone={amount > balance ? 'danger' : 'secondary'} aria-live="polite">
          {amount > balance
            ? `More than your balance of ${formatMoney(balance)}`
            : `From your balance of ${formatMoney(balance)}`}
        </Text>
        <Button
          variant="primary"
          fullWidth
          disabled={amount > balance}
          onClick={() => onAdd(goal, amount)}
        >
          Add {formatMoney(amount)}
        </Button>
      </Card>

      <Card padding="md" gap={3}>
        <CardTitle as="h2" size="heading-sm">
          Last six months
        </CardTitle>
        <Chart
          label={`Money in ${goal.name} at the end of each of the last six months, in dollars`}
        >
          <LineChart data={history} filled />
          <ChartCaption>Up {formatMoney(since)} since May.</ChartCaption>
        </Chart>
      </Card>
    </Stack>
  );
}
