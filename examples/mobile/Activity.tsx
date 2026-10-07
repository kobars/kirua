import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  EmptyState,
  FileIcon,
  Heading,
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  Skeleton,
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

export interface ActivityProps {
  transactions: Transaction[];
  /** Whether older payments can still be loaded. */
  more: boolean;
  onLoadMore: () => void;
}

/** A payment waiting for its day is listed apart from the ones that happened. */
const groupOf = (transaction: Transaction) =>
  transaction.status === 'Scheduled' ? 'Scheduled' : transaction.day;

/** One grey row in the shape of a payment, while the real one is on its way. */
function RowSkeleton() {
  return (
    <Item size="sm">
      <ItemMedia>
        <Skeleton shape="circle" />
      </ItemMedia>
      <ItemContent>
        <Skeleton shape="text" width="2/3" />
        <Skeleton shape="caption" width="1/2" />
      </ItemContent>
    </Item>
  );
}

/** Every payment, newest first, under the day it happened. */
export function Activity({ transactions, more, onLoadMore }: ActivityProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(false);
  const shown = transactions.filter(
    (transaction) => filter === 'all' || transaction.direction === filter,
  );
  const days = [...new Set(shown.map(groupOf))];

  // Older payments take a moment to arrive, as they would from a server. The
  // grey rows hold their place so the list does not jump when they land.
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setLoading(false);
      onLoadMore();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [loading, onLoadMore]);

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
          const ofDay = shown.filter((transaction) => groupOf(transaction) === day);
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

      {loading ? (
        <Stack as="output" aria-busy="true" aria-label="Loading earlier payments">
          <ItemGroup variant="outlined">
            <RowSkeleton />
            <ItemSeparator />
            <RowSkeleton />
            <ItemSeparator />
            <RowSkeleton />
          </ItemGroup>
        </Stack>
      ) : (
        more && (
          <Button variant="secondary" fullWidth onClick={() => setLoading(true)}>
            Load earlier
          </Button>
        )
      )}
    </Stack>
  );
}
