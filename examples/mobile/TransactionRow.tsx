import {
  Avatar,
  AvatarFallback,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Text,
  VisuallyHidden,
} from '@kobars/kirua';
import { formatSigned, type Transaction } from './data';

const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

/**
 * One payment in a list, as a link to its detail. The amount is the last thing
 * on the row and the first thing the eye looks for, so it is never truncated;
 * the name gives way instead.
 */
export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { id, title, category, time, amount, direction, status } = transaction;
  return (
    <Item asChild interactive size="sm">
      {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the name is the row's title, deeper than the rule looks */}
      <a href={`#/mobile/activity/${id}`}>
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>{initials(title)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>
            {status === 'Pending' ? 'Pending' : category} · {time}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Text inline size="sm" weight="semibold" tone="primary" numeric>
            <VisuallyHidden>{direction === 'in' ? 'Received ' : 'Spent '}</VisuallyHidden>
            {formatSigned(amount, direction)}
          </Text>
        </ItemActions>
      </a>
    </Item>
  );
}
