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
];

export const compactCount = (value: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2);
