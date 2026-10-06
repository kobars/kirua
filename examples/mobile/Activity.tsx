import { Fragment, useState } from 'react';
import {
  EmptyState,
  FileIcon,
  Heading,
  ItemGroup,
  ItemSeparator,
  Stack,
  ToggleGroup,
  ToggleGroupItem,
} from '@kobars/kirua';
import type { Direction, Transaction } from './data';
import { TransactionRow } from './TransactionRow';

type Filter = 'all' | Direction;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
];

/** Every payment, newest first, under the day it happened. */
export function Activity({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = transactions.filter(
    (transaction) => filter === 'all' || transaction.direction === filter,
  );
  const days = [...new Set(shown.map((transaction) => transaction.day))];

  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Heading as="h1" size="heading-lg">
          Activity
        </Heading>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(next) => {
            if (next) setFilter(next as Filter);
          }}
          aria-label="Show"
        >
          {FILTERS.map(({ value, label }) => (
            <ToggleGroupItem key={value} value={value} variant="outline" size="sm">
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Stack>

      {days.length === 0 ? (
        <EmptyState
          headingLevel="h2"
          icon={<FileIcon size="2xl" />}
          title="Nothing here yet"
          description="Payments you receive show up here as soon as they arrive."
        />
      ) : (
        days.map((day) => {
          const ofDay = shown.filter((transaction) => transaction.day === day);
          return (
            <Stack as="section" key={day} gap={2} aria-label={day}>
              <Heading as="h2" size="body-sm">
                {day}
              </Heading>
              <ItemGroup variant="outlined">
                {ofDay.map((transaction, index) => (
                  <Fragment key={transaction.id}>
                    {index > 0 && <ItemSeparator />}
                    <TransactionRow transaction={transaction} />
                  </Fragment>
                ))}
              </ItemGroup>
            </Stack>
          );
        })
      )}
    </Stack>
  );
}
