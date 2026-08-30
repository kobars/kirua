/**
 * Everything the marketing site says, in one place.
 *
 * A marketing page is mostly copy, and copy inlined into JSX is copy nobody can
 * read end to end. Keeping it here means the prose can be edited as prose —
 * which matters more than usual, because this is the app the `List` and `Text`
 * components were designed against.
 *
 * Aozora is a fiction: a small studio selling tools to anime and cartoon
 * artists. It is the subject the reference hero was already selling, so the
 * marketing family of components has a home that wants them rather than a
 * gallery that merely displays them.
 */

export interface Plan {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  featured?: boolean;
  includes: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'sketch',
    name: 'Sketch',
    price: 'Free',
    cadence: 'forever',
    blurb: 'Everything you need to put a first gallery on the internet.',
    includes: ['One gallery', 'Up to 40 pieces', 'Aozora subdomain', 'Community support'],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$12',
    cadence: 'per month',
    blurb: 'For artists who sell. Your own domain, your own checkout, your own numbers.',
    featured: true,
    includes: [
      'Unlimited galleries',
      'Your own domain',
      'Commission requests',
      'Sales and payouts',
      'Priority support',
    ],
  },
  {
    id: 'atelier',
    name: 'Atelier',
    price: '$40',
    cadence: 'per month',
    blurb: 'For a studio of several artists sharing one storefront.',
    includes: [
      'Everything in Studio',
      'Up to 10 artists',
      'Shared commission queue',
      'Revenue split',
      'A named contact',
    ],
  },
];

/** What the three plans differ on, as a real comparison rather than three lists. */
export const COMPARISON = [
  { feature: 'Galleries', sketch: '1', studio: 'Unlimited', atelier: 'Unlimited' },
  { feature: 'Pieces per gallery', sketch: '40', studio: 'Unlimited', atelier: 'Unlimited' },
  { feature: 'Custom domain', sketch: '—', studio: 'Yes', atelier: 'Yes' },
  { feature: 'Commissions', sketch: '—', studio: 'Yes', atelier: 'Shared queue' },
  { feature: 'Artists', sketch: '1', studio: '1', atelier: '10' },
  { feature: 'Platform fee', sketch: '—', studio: '3%', atelier: '2%' },
];

export interface Milestone {
  /** Machine-readable, for the `<time datetime>` a timeline moment carries. */
  at: string;
  when: string;
  what: string;
  detail: string;
}

export const MILESTONES: Milestone[] = [
  {
    at: '2021-04',
    when: 'April 2021',
    what: 'Two artists and a spreadsheet',
    detail:
      'Mei and Rangga were tracking twenty commissions between them in one shared sheet, and losing about one in ten to a message nobody answered.',
  },
  {
    at: '2022-02',
    when: 'February 2022',
    what: 'The first gallery went up',
    detail:
      'A single page, a single artist, and a form that emailed a brief. It replaced the spreadsheet in a week.',
  },
  {
    at: '2023-09',
    when: 'September 2023',
    what: 'Payouts, in the currency the artist is paid in',
    detail:
      'Until then every sale ended in a manual transfer. This is the change artists still write to us about.',
  },
  {
    at: '2025-06',
    when: 'June 2025',
    what: 'Studios, not just artists',
    detail:
      'A shared commission queue and a revenue split, because the four-person studios were already faking both with duplicate accounts.',
  },
];

/** The principles page copy. Prose, and the reason `List` exists. */
export const PRINCIPLES = [
  {
    title: 'The artwork is the interface',
    body: 'A gallery page shows work at the size it was drawn at. Chrome that competes with the piece is chrome we delete.',
  },
  {
    title: 'A price is a sentence, not a table',
    body: 'Every plan says what it costs and what it does in words an artist can read once. Nothing is disclosed only in a footnote.',
  },
  {
    title: 'Leaving is as easy as arriving',
    body: 'Every gallery exports as a folder of full-resolution files and one JSON manifest. No account is needed to open it.',
  },
];

export interface Step {
  title: string;
  body: string;
}

/** The guide's numbered walkthrough. Ordered, because the order is the meaning. */
export const PUBLISH_STEPS: Step[] = [
  {
    title: 'Make a gallery',
    body: 'Give it a name and a handle. The handle becomes the last part of the address, so pick the one you already use elsewhere.',
  },
  {
    title: 'Add your pieces',
    body: 'Drag them in. Aozora keeps the file you uploaded and derives every smaller size it needs, so a print order later has something to print from.',
  },
  {
    title: 'Write one line under each',
    body: 'A title and a sentence. This is what a search engine reads, and what a screen reader announces.',
  },
  {
    title: 'Publish',
    body: 'The gallery goes live at your handle. Nothing else has to happen for it to be shareable.',
  },
];

/** A tuple, so the page can open the first entry without a null check. */
export const FAQ = [
  {
    question: 'Do I keep the rights to my work?',
    answer:
      'Yes, and nothing in the terms says otherwise. Aozora takes a licence to display and print what you upload, for as long as you keep it uploaded.',
  },
  {
    question: 'What happens when I stop paying?',
    answer:
      'A Studio gallery drops to the Sketch limits. Nothing is deleted, and the export stays available whether or not you have a plan.',
  },
  {
    question: 'Can I move a gallery to my own hosting?',
    answer:
      'Yes. The export is a folder of files and one manifest, and the manifest is documented rather than reverse-engineered.',
  },
] as const;

/** Studio details, as term-and-value pairs. */
export const STUDIO = [
  { term: 'Studio', value: 'Aozora Kreatif' },
  { term: 'Address', value: 'Jalan Cendana 14, Yogyakarta 55223' },
  { term: 'Hours', value: 'Monday to Friday, 09:00–17:00 WIB' },
  { term: 'Reply time', value: 'Within one working day' },
];

export const TOPICS = [
  { id: 'plan', label: 'Choosing a plan' },
  { id: 'commission', label: 'Commissions and payouts' },
  { id: 'export', label: 'Exporting a gallery' },
  { id: 'studio', label: 'Moving a studio across' },
  { id: 'press', label: 'Press and partnerships' },
];
