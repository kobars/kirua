/** A fixed feed. Invented people, fixed counts, no clock. */

export interface Person {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  joined: string;
  /**
   * A portrait, if this person has uploaded one. Optional on purpose: half the
   * people here have one and half do not, which is the only way to see that
   * `AvatarImage` and `AvatarFallback` are both doing their job. A real feed
   * always contains both.
   *
   * Drawn rather than photographed — a data URI, so the example ships no
   * binary and needs no `publicDir`.
   */
  photo?: string;
}

/** A flat two-tone portrait, as a data URI. Enough to be an image. */
const portrait = (bg: string, ink: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><circle cx="32" cy="25" r="12" fill="${ink}"/><path d="M8 64c0-13 11-21 24-21s24 8 24 21z" fill="${ink}"/></svg>`,
  )}`;

export interface Post {
  id: string;
  handle: string;
  when: string;
  text: string;
  media?: { ratio: number; caption: string };
  likes: number;
  comments: number;
  liked?: boolean;
}

export const people: Record<string, Person> = {
  rin: {
    handle: 'rin',
    name: 'Rin Nakamura',
    bio: 'Draws chibi. Teaches on Tuesdays. Opinions about line weight.',
    followers: 12400,
    following: 318,
    joined: 'March 2024',
    photo: portrait('#d6ebff', '#0b5eb1'),
  },
  agus: {
    handle: 'agus',
    name: 'Agus Pratama',
    bio: 'Type nerd in Bandung. Currently drawing a Javanese script revival.',
    followers: 3820,
    following: 512,
    joined: 'January 2023',
  },
  maya: {
    handle: 'maya',
    name: 'Maya Kusuma',
    bio: 'Front end. Accessibility first, colour second.',
    followers: 8901,
    following: 204,
    joined: 'July 2022',
    photo: portrait('#ece9fe', '#4a1fb8'),
  },
  budi: {
    handle: 'budi',
    name: 'Budi Hartono',
    bio: 'Motion. Thirty frames a second, and twenty-eight of them are wrong.',
    followers: 5410,
    following: 189,
    joined: 'September 2023',
  },
  sari: {
    handle: 'sari',
    name: 'Sari Melati',
    bio: 'Illustrator. Ink first, colour much later.',
    followers: 21300,
    following: 96,
    joined: 'February 2021',
  },
  dimas: {
    handle: 'dimas',
    name: 'Dimas Anggara',
    bio: 'Builds keyboards. Writes about switches nobody asked about.',
    followers: 1470,
    following: 803,
    joined: 'May 2024',
  },
  lia: {
    handle: 'lia',
    name: 'Lia Permata',
    bio: 'Research. I will ask you five questions and one of them will hurt.',
    followers: 6720,
    following: 411,
    joined: 'October 2022',
  },
  eko: {
    handle: 'eko',
    name: 'Eko Saputra',
    bio: 'Photographs empty buildings at dawn.',
    followers: 9840,
    following: 122,
    joined: 'June 2021',
  },
};

export const posts: Post[] = [
  {
    id: 'p1',
    handle: 'rin',
    when: '2h',
    text: 'Spent the morning redrawing the same hand nine times. The ninth one is the first that looks like it could hold something.',
    media: { ratio: 4 / 5, caption: 'Nine studies of a hand, arranged in a grid' },
    likes: 1284,
    comments: 63,
    liked: true,
  },
  {
    id: 'p2',
    handle: 'maya',
    when: '4h',
    text: 'A reminder that a closed menu passes every accessibility check in the world. If your test never opens it, it never tested it.',
    likes: 2140,
    comments: 187,
  },
  {
    id: 'p3',
    handle: 'agus',
    when: '6h',
    text: 'Aksara Jawa has a vowel-killer mark called pangkon, and it is the single most elegant piece of typographic engineering I have met this year.',
    media: { ratio: 16 / 9, caption: 'Three lines of Javanese script drawn in ink' },
    likes: 903,
    comments: 44,
  },
  {
    id: 'p4',
    handle: 'rin',
    when: '9h',
    text: 'Unpopular: a design system without a real application built on it is a mood board with tests.',
    likes: 4501,
    comments: 402,
  },
  {
    id: 'p5',
    handle: 'maya',
    when: '1d',
    text: 'Reserved the image box before the picture loads and the feed stopped jumping. One component, one class of bug gone.',
    media: { ratio: 1, caption: 'A square placeholder with its dimensions labelled' },
    likes: 611,
    comments: 29,
  },

  {
    id: 'p6',
    handle: 'sari',
    when: '1d',
    text: 'Finished a page of thumbnails so bad that the tenth one finally worked. That is the whole method.',
    media: { ratio: 0.8, caption: 'A page of rough thumbnail sketches' },
    likes: 3120,
    comments: 148,
  },
  {
    id: 'p7',
    handle: 'budi',
    when: '1d',
    text: 'Easing is not decoration. A linear fade reads as a bug and nobody can tell you why.',
    likes: 1780,
    comments: 92,
  },
  {
    id: 'p8',
    handle: 'dimas',
    when: '2d',
    text: 'Lubricated a board last night and now the space bar sounds like a full stop. Worth every minute.',
    media: { ratio: 1.7777777777777777, caption: 'A keyboard half disassembled on a desk' },
    likes: 640,
    comments: 71,
  },
  {
    id: 'p9',
    handle: 'lia',
    when: '2d',
    text: 'Five people, one prototype, and every single one of them tapped the wrong thing in the same place. That is not a sample size problem.',
    likes: 2890,
    comments: 213,
    liked: true,
  },
  {
    id: 'p10',
    handle: 'eko',
    when: '3d',
    text: 'Six in the morning, no people, and the lift lobby lit like a stage. Sometimes the building does the work.',
    media: { ratio: 1.5, caption: 'An empty lift lobby at dawn' },
    likes: 4310,
    comments: 166,
  },
  {
    id: 'p11',
    handle: 'rin',
    when: '3d',
    text: 'A tip nobody wants: draw the thing you are avoiding first. The rest of the page gets easier.',
    likes: 2210,
    comments: 97,
  },
  {
    id: 'p12',
    handle: 'maya',
    when: '4d',
    text: 'A skeleton that does not match the shape of the content it replaces is a second layout shift wearing a costume.',
    likes: 1960,
    comments: 118,
  },
  {
    id: 'p13',
    handle: 'agus',
    when: '5d',
    text: 'Spent two days on a comma. It is a small comma. It is the right comma now.',
    media: { ratio: 1, caption: 'A single comma drawn very large' },
    likes: 1180,
    comments: 64,
  },
  {
    id: 'p14',
    handle: 'sari',
    when: '6d',
    text: 'Someone asked what brush I use. It is the one that came with the app. It has always been the one that came with the app.',
    likes: 5620,
    comments: 331,
    liked: true,
  },
];

export const compactCount = (value: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2);

/** What lands in the notifications tab. `postId` is set when it points at one. */
export interface Notice {
  id: string;
  kind: 'like' | 'comment' | 'follow' | 'mention';
  handle: string;
  when: string;
  postId?: string;
  body?: string;
  unread?: boolean;
}

export const notices: Notice[] = [
  { id: 'n1', kind: 'like', handle: 'sari', when: '12m', postId: 'p1', unread: true },
  {
    id: 'n2',
    kind: 'comment',
    handle: 'maya',
    when: '38m',
    postId: 'p1',
    body: 'The ninth one is the good one. Obviously.',
    unread: true,
  },
  { id: 'n3', kind: 'follow', handle: 'dimas', when: '1h', unread: true },
  {
    id: 'n4',
    kind: 'mention',
    handle: 'lia',
    when: '2h',
    postId: 'p4',
    body: 'Saying this to my team on Monday, sorry in advance.',
  },
  { id: 'n5', kind: 'like', handle: 'eko', when: '3h', postId: 'p4' },
  {
    id: 'n6',
    kind: 'comment',
    handle: 'budi',
    when: '5h',
    postId: 'p3',
    body: 'Pangkon deserves its own conference talk.',
  },
  { id: 'n7', kind: 'follow', handle: 'sari', when: '1d' },
  { id: 'n8', kind: 'like', handle: 'agus', when: '1d', postId: 'p5' },
];

/** A reaction under a message, with the sentence a screen reader hears for it. */
export interface Reaction {
  emoji: string;
  count: number;
  label: string;
}

/**
 * One message. `day` is the label of the day break it falls under, written as
 * the screen shows it, and `at` a time of day a `<time>` can carry — fixed
 * strings, so the thread reads the same on every visit.
 */
export interface ThreadMessage {
  from: 'me' | 'them';
  day: string;
  at: string;
  text: string;
  reactions?: Reaction[];
}

/** One conversation in the messages screen. Newest message last. */
export interface Thread {
  id: string;
  handle: string;
  unread: number;
  messages: ThreadMessage[];
  /** What the other person has done with your last message, when it is the newest. */
  status?: string;
}

export const threads: Thread[] = [
  {
    id: 't1',
    handle: 'maya',
    unread: 2,
    messages: [
      {
        from: 'them',
        day: 'Yesterday',
        at: '18:40',
        text: 'Did the contrast page ever get the field family graded live?',
      },
      {
        from: 'me',
        day: 'Today',
        at: '09:14',
        text: 'It did. Four surfaces, three thresholds, all recomputed in the browser.',
        reactions: [{ emoji: '👍', count: 1, label: 'Maya Kusuma reacted with a thumbs up' }],
      },
      {
        from: 'them',
        day: 'Today',
        at: '09:15',
        text: 'So the docs cannot drift from the CSS.',
      },
      {
        from: 'them',
        day: 'Today',
        at: '09:15',
        text: 'That is the bit I keep failing to sell to people.',
      },
    ],
  },
  {
    id: 't2',
    handle: 'sari',
    unread: 0,
    status: 'Seen',
    messages: [
      {
        from: 'them',
        day: 'Yesterday',
        at: '21:02',
        text: 'Sending the inks tonight. Colour on Thursday?',
      },
      {
        from: 'me',
        day: 'Yesterday',
        at: '21:10',
        text: 'Thursday works. No rush on the flats.',
      },
    ],
  },
  {
    id: 't3',
    handle: 'dimas',
    unread: 1,
    messages: [
      { from: 'them', day: 'Monday', at: '13:20', text: 'Which switches did you end up with?' },
      {
        from: 'me',
        day: 'Monday',
        at: '13:26',
        text: 'Tactile, 67 gram. Loud enough to annoy exactly one person.',
        reactions: [{ emoji: '😂', count: 1, label: 'Dimas Anggara reacted with a laugh' }],
      },
      {
        from: 'them',
        day: 'Monday',
        at: '13:27',
        text: 'That is the correct number of people.',
      },
    ],
  },
  {
    id: 't4',
    handle: 'eko',
    unread: 0,
    messages: [
      {
        from: 'them',
        day: '5 March',
        at: '17:30',
        text: 'The lobby shot is up. Thanks for the lens.',
      },
    ],
  },
];

/** Posts published per month, for the profile page. Twelve months to March. */
export const postsPerMonth = [
  { label: 'Apr', value: 12 },
  { label: 'May', value: 18 },
  { label: 'Jun', value: 9 },
  { label: 'Jul', value: 21 },
  { label: 'Aug', value: 15 },
  { label: 'Sep', value: 24 },
  { label: 'Oct', value: 19 },
  { label: 'Nov', value: 28 },
  { label: 'Dec', value: 11 },
  { label: 'Jan', value: 26 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 31 },
];

/** What the explore screen groups by. */
export const topics = [
  { id: 'illustration', label: 'Illustration', handles: ['rin', 'sari', 'agus'] },
  { id: 'interface', label: 'Interface', handles: ['maya', 'lia'] },
  { id: 'motion', label: 'Motion', handles: ['budi'] },
  { id: 'tools', label: 'Tools', handles: ['dimas', 'eko'] },
];
