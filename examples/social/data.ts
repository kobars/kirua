/** A fixed feed. Invented people, fixed counts, no clock. */

export interface Person {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  joined: string;
}

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
    joined: 'Maret 2024',
  },
  agus: {
    handle: 'agus',
    name: 'Agus Pratama',
    bio: 'Type nerd in Bandung. Currently drawing a Javanese script revival.',
    followers: 3820,
    following: 512,
    joined: 'Januari 2023',
  },
  maya: {
    handle: 'maya',
    name: 'Maya Kusuma',
    bio: 'Front end. Accessibility first, colour second.',
    followers: 8901,
    following: 204,
    joined: 'Juli 2022',
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
    joined: 'Februari 2021',
  },
  dimas: {
    handle: 'dimas',
    name: 'Dimas Anggara',
    bio: 'Builds keyboards. Writes about switches nobody asked about.',
    followers: 1470,
    following: 803,
    joined: 'Mei 2024',
  },
  lia: {
    handle: 'lia',
    name: 'Lia Permata',
    bio: 'Research. I will ask you five questions and one of them will hurt.',
    followers: 6720,
    following: 411,
    joined: 'Oktober 2022',
  },
  eko: {
    handle: 'eko',
    name: 'Eko Saputra',
    bio: 'Photographs empty buildings at dawn.',
    followers: 9840,
    following: 122,
    joined: 'Juni 2021',
  },
};

export const posts: Post[] = [
  {
    id: 'p1',
    handle: 'rin',
    when: '2 jam',
    text: 'Spent the morning redrawing the same hand nine times. The ninth one is the first that looks like it could hold something.',
    media: { ratio: 4 / 5, caption: 'Nine studies of a hand, arranged in a grid' },
    likes: 1284,
    comments: 63,
    liked: true,
  },
  {
    id: 'p2',
    handle: 'maya',
    when: '4 jam',
    text: 'A reminder that a closed menu passes every accessibility check in the world. If your test never opens it, it never tested it.',
    likes: 2140,
    comments: 187,
  },
  {
    id: 'p3',
    handle: 'agus',
    when: '6 jam',
    text: 'Aksara Jawa has a vowel-killer mark called pangkon, and it is the single most elegant piece of typographic engineering I have met this year.',
    media: { ratio: 16 / 9, caption: 'Three lines of Javanese script drawn in ink' },
    likes: 903,
    comments: 44,
  },
  {
    id: 'p4',
    handle: 'rin',
    when: '9 jam',
    text: 'Unpopular: a design system without a real application built on it is a mood board with tests.',
    likes: 4501,
    comments: 402,
  },
  {
    id: 'p5',
    handle: 'maya',
    when: '1 hari',
    text: 'Reserved the image box before the picture loads and the feed stopped jumping. One component, one class of bug gone.',
    media: { ratio: 1, caption: 'A square placeholder with its dimensions labelled' },
    likes: 611,
    comments: 29,
  },

  {
    id: 'p6',
    handle: 'sari',
    when: '1 hari',
    text: 'Finished a page of thumbnails so bad that the tenth one finally worked. That is the whole method.',
    media: { ratio: 0.8, caption: 'A page of rough thumbnail sketches' },
    likes: 3120,
    comments: 148,
  },
  {
    id: 'p7',
    handle: 'budi',
    when: '1 hari',
    text: 'Easing is not decoration. A linear fade reads as a bug and nobody can tell you why.',
    likes: 1780,
    comments: 92,
  },
  {
    id: 'p8',
    handle: 'dimas',
    when: '2 hari',
    text: 'Lubricated a board last night and now the space bar sounds like a full stop. Worth every minute.',
    media: { ratio: 1.7777777777777777, caption: 'A keyboard half disassembled on a desk' },
    likes: 640,
    comments: 71,
  },
  {
    id: 'p9',
    handle: 'lia',
    when: '2 hari',
    text: 'Five people, one prototype, and every single one of them tapped the wrong thing in the same place. That is not a sample size problem.',
    likes: 2890,
    comments: 213,
    liked: true,
  },
  {
    id: 'p10',
    handle: 'eko',
    when: '3 hari',
    text: 'Six in the morning, no people, and the lift lobby lit like a stage. Sometimes the building does the work.',
    media: { ratio: 1.5, caption: 'An empty lift lobby at dawn' },
    likes: 4310,
    comments: 166,
  },
  {
    id: 'p11',
    handle: 'rin',
    when: '3 hari',
    text: 'A tip nobody wants: draw the thing you are avoiding first. The rest of the page gets easier.',
    likes: 2210,
    comments: 97,
  },
  {
    id: 'p12',
    handle: 'maya',
    when: '4 hari',
    text: 'A skeleton that does not match the shape of the content it replaces is a second layout shift wearing a costume.',
    likes: 1960,
    comments: 118,
  },
  {
    id: 'p13',
    handle: 'agus',
    when: '5 hari',
    text: 'Spent two days on a comma. It is a small comma. It is the right comma now.',
    media: { ratio: 1, caption: 'A single comma drawn very large' },
    likes: 1180,
    comments: 64,
  },
  {
    id: 'p14',
    handle: 'sari',
    when: '6 hari',
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
  kind: 'suka' | 'komentar' | 'ikuti' | 'sebut';
  handle: string;
  when: string;
  postId?: string;
  body?: string;
  unread?: boolean;
}

export const notices: Notice[] = [
  { id: 'n1', kind: 'suka', handle: 'sari', when: '12 mnt', postId: 'p1', unread: true },
  {
    id: 'n2',
    kind: 'komentar',
    handle: 'maya',
    when: '38 mnt',
    postId: 'p1',
    body: 'The ninth one is the good one. Obviously.',
    unread: true,
  },
  { id: 'n3', kind: 'ikuti', handle: 'dimas', when: '1 jam', unread: true },
  {
    id: 'n4',
    kind: 'sebut',
    handle: 'lia',
    when: '2 jam',
    postId: 'p4',
    body: 'Saying this to my team on Monday, sorry in advance.',
  },
  { id: 'n5', kind: 'suka', handle: 'eko', when: '3 jam', postId: 'p4' },
  {
    id: 'n6',
    kind: 'komentar',
    handle: 'budi',
    when: '5 jam',
    postId: 'p3',
    body: 'Pangkon deserves its own conference talk.',
  },
  { id: 'n7', kind: 'ikuti', handle: 'sari', when: '1 hari' },
  { id: 'n8', kind: 'suka', handle: 'agus', when: '1 hari', postId: 'p5' },
];

/** One conversation in the messages screen. Newest message last. */
export interface Thread {
  id: string;
  handle: string;
  unread: number;
  messages: { from: 'me' | 'them'; at: string; text: string }[];
}

export const threads: Thread[] = [
  {
    id: 't1',
    handle: 'maya',
    unread: 2,
    messages: [
      {
        from: 'them',
        at: '09:12',
        text: 'Did the contrast page ever get the field family graded live?',
      },
      {
        from: 'me',
        at: '09:14',
        text: 'It did. Four surfaces, three thresholds, all recomputed in the browser.',
      },
      { from: 'them', at: '09:15', text: 'So the docs cannot drift from the CSS.' },
      { from: 'them', at: '09:15', text: 'That is the bit I keep failing to sell to people.' },
    ],
  },
  {
    id: 't2',
    handle: 'sari',
    unread: 0,
    messages: [
      { from: 'them', at: 'Kemarin', text: 'Sending the inks tonight. Colour on Thursday?' },
      { from: 'me', at: 'Kemarin', text: 'Thursday works. No rush on the flats.' },
    ],
  },
  {
    id: 't3',
    handle: 'dimas',
    unread: 1,
    messages: [
      { from: 'them', at: 'Senin', text: 'Which switches did you end up with?' },
      {
        from: 'me',
        at: 'Senin',
        text: 'Tactile, 67 gram. Loud enough to annoy exactly one person.',
      },
      { from: 'them', at: 'Senin', text: 'That is the correct number of people.' },
    ],
  },
  {
    id: 't4',
    handle: 'eko',
    unread: 0,
    messages: [
      { from: 'them', at: 'Minggu lalu', text: 'The lobby shot is up. Thanks for the lens.' },
    ],
  },
];

/** Posts published per month, for the profile page. Twelve months to March. */
export const postsPerMonth = [
  { label: 'Apr', value: 12 },
  { label: 'Mei', value: 18 },
  { label: 'Jun', value: 9 },
  { label: 'Jul', value: 21 },
  { label: 'Agu', value: 15 },
  { label: 'Sep', value: 24 },
  { label: 'Okt', value: 19 },
  { label: 'Nov', value: 28 },
  { label: 'Des', value: 11 },
  { label: 'Jan', value: 26 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 31 },
];

/** What the explore screen groups by. */
export const topics = [
  { id: 'ilustrasi', label: 'Ilustrasi', handles: ['rin', 'sari', 'agus'] },
  { id: 'antarmuka', label: 'Antarmuka', handles: ['maya', 'lia'] },
  { id: 'gerak', label: 'Gerak', handles: ['budi'] },
  { id: 'perkakas', label: 'Perkakas', handles: ['dimas', 'eko'] },
];
