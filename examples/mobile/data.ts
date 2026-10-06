/**
 * Pouch's records. Every name, amount and card number is invented, and the
 * card numbers are not valid ones.
 */

export interface Contact {
  id: string;
  name: string;
  initials: string;
  /** How they are found: a handle or a masked phone number. */
  handle: string;
}

export const contacts: Contact[] = [
  { id: 'maya', name: 'Maya Lindqvist', initials: 'ML', handle: '@maya' },
  { id: 'eko', name: 'Eko Prasetyo', initials: 'EP', handle: '@eko' },
  { id: 'sana', name: 'Sana Okafor', initials: 'SO', handle: '•••• 0142' },
  { id: 'theo', name: 'Theo Marchetti', initials: 'TM', handle: '@theo' },
  { id: 'ines', name: 'Inès Duarte', initials: 'ID', handle: '•••• 7781' },
];

export type Direction = 'in' | 'out';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  /** Always positive; `direction` says which way it went. */
  amount: number;
  direction: Direction;
  /** The day heading it is listed under. */
  day: string;
  time: string;
  method: string;
  status: 'Completed' | 'Pending';
  note?: string;
}

export const transactions: Transaction[] = [
  {
    id: 'tx-1042',
    title: 'Corner Bakery',
    category: 'Food and drink',
    amount: 8.4,
    direction: 'out',
    day: 'Today',
    time: '8:12',
    method: 'Everyday card •••• 4821',
    status: 'Pending',
  },
  {
    id: 'tx-1041',
    title: 'Maya Lindqvist',
    category: 'Transfer',
    amount: 42,
    direction: 'in',
    day: 'Today',
    time: '7:30',
    method: 'Pouch balance',
    status: 'Completed',
    note: 'Concert tickets',
  },
  {
    id: 'tx-1040',
    title: 'Metro Transit',
    category: 'Transport',
    amount: 2.75,
    direction: 'out',
    day: 'Yesterday',
    time: '18:04',
    method: 'Everyday card •••• 4821',
    status: 'Completed',
  },
  {
    id: 'tx-1039',
    title: 'Greenleaf Market',
    category: 'Groceries',
    amount: 63.18,
    direction: 'out',
    day: 'Yesterday',
    time: '17:41',
    method: 'Everyday card •••• 4821',
    status: 'Completed',
  },
  {
    id: 'tx-1038',
    title: 'Salary',
    category: 'Income',
    amount: 2150,
    direction: 'in',
    day: 'Monday 5 October',
    time: '9:00',
    method: 'Pouch balance',
    status: 'Completed',
  },
  {
    id: 'tx-1037',
    title: 'Streamly',
    category: 'Subscriptions',
    amount: 11.99,
    direction: 'out',
    day: 'Monday 5 October',
    time: '6:15',
    method: 'Online card •••• 0937',
    status: 'Completed',
  },
  {
    id: 'tx-1036',
    title: 'Eko Prasetyo',
    category: 'Transfer',
    amount: 25,
    direction: 'out',
    day: 'Sunday 4 October',
    time: '20:22',
    method: 'Pouch balance',
    status: 'Completed',
    note: 'Pizza night',
  },
];

/** What went out on each of the last seven days, oldest first. */
export const week = [
  { label: 'Thu', value: 18 },
  { label: 'Fri', value: 46 },
  { label: 'Sat', value: 72 },
  { label: 'Sun', value: 31 },
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 66 },
  { label: 'Wed', value: 8 },
];

export interface PaymentCard {
  id: string;
  name: string;
  last4: string;
  kind: 'Physical' | 'Virtual';
  expires: string;
  /** The monthly limit the holder set, and what this month has used of it. */
  limit: number;
  spent: number;
}

export const cards: PaymentCard[] = [
  {
    id: 'everyday',
    name: 'Everyday',
    last4: '4821',
    kind: 'Physical',
    expires: '09/29',
    limit: 1500,
    spent: 642.3,
  },
  {
    id: 'online',
    name: 'Online',
    last4: '0937',
    kind: 'Virtual',
    expires: '03/28',
    limit: 300,
    spent: 11.99,
  },
];

export const OPENING_BALANCE = 2481.6;

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** An amount as the screens show it: `$1,234.50`. */
export const formatMoney = (value: number) => money.format(value);

/** A signed amount for a list: `+$42.00` in, `−$8.40` out. */
export const formatSigned = (value: number, direction: Direction) =>
  `${direction === 'in' ? '+' : '−'}${money.format(value)}`;
