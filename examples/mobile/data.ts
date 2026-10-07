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
  status: 'Completed' | 'Pending' | 'Scheduled';
  note?: string;
  /** The calendar day, for machines: what a `<time>` carries. */
  date: string;
}

export const transactions: Transaction[] = [
  {
    id: 'tx-1042',
    title: 'Corner Bakery',
    category: 'Food and drink',
    amount: 8.4,
    direction: 'out',
    day: 'Today',
    date: '2026-10-07',
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
    date: '2026-10-07',
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
    date: '2026-10-06',
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
    date: '2026-10-06',
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
    date: '2026-10-05',
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
    date: '2026-10-05',
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
    date: '2026-10-04',
    time: '20:22',
    method: 'Pouch balance',
    status: 'Completed',
    note: 'Pizza night',
  },
];

/** Older payments, which Activity loads only when asked. */
export const earlier: Transaction[] = [
  {
    id: 'tx-1035',
    title: 'Northside Gym',
    category: 'Health',
    amount: 39,
    direction: 'out',
    day: 'Thursday 1 October',
    date: '2026-10-01',
    time: '7:05',
    method: 'Everyday card •••• 4821',
    status: 'Completed',
  },
  {
    id: 'tx-1034',
    title: 'Sana Okafor',
    category: 'Transfer',
    amount: 18.5,
    direction: 'in',
    day: 'Thursday 1 October',
    date: '2026-10-01',
    time: '12:48',
    method: 'Pouch balance',
    status: 'Completed',
    note: 'Lunch',
  },
  {
    id: 'tx-1033',
    title: 'City Power',
    category: 'Bills',
    amount: 54.2,
    direction: 'out',
    day: 'Wednesday 30 September',
    date: '2026-09-30',
    time: '10:00',
    method: 'Pouch balance',
    status: 'Completed',
  },
  {
    id: 'tx-1032',
    title: 'Paper & Ink',
    category: 'Shopping',
    amount: 23.9,
    direction: 'out',
    day: 'Wednesday 30 September',
    date: '2026-09-30',
    time: '16:37',
    method: 'Online card •••• 0937',
    status: 'Completed',
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

/** The balance at the end of each of the last seven days, oldest first. */
export const balanceWeek = [
  { label: 'Thu', value: 512 },
  { label: 'Fri', value: 466 },
  { label: 'Sat', value: 394 },
  { label: 'Sun', value: 363 },
  { label: 'Mon', value: 2501 },
  { label: 'Tue', value: 2435 },
  { label: 'Wed', value: 2482 },
];

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  /** What was in the goal at the end of each of the last six months. */
  history: { label: string; value: number }[];
}

export const goals: Goal[] = [
  {
    id: 'lisbon',
    name: 'Trip to Lisbon',
    target: 1800,
    saved: 1170,
    history: [
      { label: 'May', value: 300 },
      { label: 'Jun', value: 480 },
      { label: 'Jul', value: 620 },
      { label: 'Aug', value: 810 },
      { label: 'Sep', value: 1020 },
      { label: 'Oct', value: 1170 },
    ],
  },
  {
    id: 'bike',
    name: 'New bike',
    target: 900,
    saved: 315,
    history: [
      { label: 'May', value: 0 },
      { label: 'Jun', value: 40 },
      { label: 'Jul', value: 90 },
      { label: 'Aug', value: 165 },
      { label: 'Sep', value: 240 },
      { label: 'Oct', value: 315 },
    ],
  },
  {
    id: 'rainy-day',
    name: 'Rainy day',
    target: 3000,
    saved: 2460,
    history: [
      { label: 'May', value: 1900 },
      { label: 'Jun', value: 2010 },
      { label: 'Jul', value: 2120 },
      { label: 'Aug', value: 2230 },
      { label: 'Sep', value: 2350 },
      { label: 'Oct', value: 2460 },
    ],
  },
];

/** People who often pay for things together, picked in one tap. */
export const flatmates = ['maya', 'eko', 'sana'];

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

/** The demo's today, so every date on every screen agrees: Wednesday 7 October 2026. */
export const TODAY = new Date(2026, 9, 7);

/** From this amount up, sending asks for a code from the phone. */
export const CODE_FROM = 500;

/** Until identity is verified, one payment can be at most this much. */
export const UNVERIFIED_LIMIT = 1000;

/** The code the demo accepts. Nothing is sent, so the screen says what it is. */
export const DEMO_CODE = '246810';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** An amount as the screens show it: `$1,234.50`. */
export const formatMoney = (value: number) => money.format(value);

/** A day as the screens write it: `Friday 9 October`. */
export const formatDay = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

/** A day for a `<time>`: `2026-10-09`. */
export const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** A signed amount for a list: `+$42.00` in, `−$8.40` out. */
export const formatSigned = (value: number, direction: Direction) =>
  `${direction === 'in' ? '+' : '−'}${money.format(value)}`;
