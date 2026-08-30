/** Fixed sample content. No network, no clock — the same page every time. */

export interface Turn {
  id: string;
  from: 'you' | 'assistant';
  text: string;
  code?: { language: string; source: string };
}

export interface Conversation {
  id: string;
  title: string;
  when: string;
  turns: Turn[];
}

export const conversations: Conversation[] = [
  {
    id: 'tokens',
    title: 'Why a token layer has three levels',
    when: 'Today',
    turns: [
      {
        id: 't1',
        from: 'you',
        text: 'Our buttons look different on the dark panel and we keep adding props to fix it. Is there a better shape?',
      },
      {
        id: 't2',
        from: 'assistant',
        text: 'There is, and the prop is the symptom rather than the cause. A component that takes an `inverted` prop is being asked to know where it is — and every new surface adds another prop, to every component, forever.\n\nThe alternative is to let the surface say what it is, once, and have the colours follow. Three layers: raw values with no meaning, then what a value MEANS, then the utilities your components actually write.',
      },
      {
        id: 't3',
        from: 'you',
        text: 'Show me the middle layer.',
      },
      {
        id: 't4',
        from: 'assistant',
        text: 'The middle layer names roles, and a surface re-points them for everything inside it:',
        code: {
          language: 'css',
          source: `:root {
  --color-action-primary-bg: var(--color-blue-600);
  --color-action-primary-fg: var(--color-neutral-0);
}

/* One class on the panel, and every button inside inverts. */
.ctx-brand {
  --color-action-primary-bg: var(--color-neutral-0);
  --color-action-primary-fg: var(--color-neutral-1000);
}`,
        },
      },
      {
        id: 't5',
        from: 'assistant',
        text: 'The button never learns about the panel. It writes `bg-primary` and the panel decides what that means — so the same one component renders as a blue pill on a page and a white pill on the blue panel, with no prop and no override.',
      },
      {
        id: 't6',
        from: 'you',
        text: 'What breaks this?',
      },
      {
        id: 't7',
        from: 'assistant',
        text: 'One thing, and it is silent. The utility layer has to compile to a live `var()` reference rather than to the value it had at build time. In Tailwind that is the `inline` keyword on `@theme` — drop it and every utility freezes, the class names stay identical, and context switching stops working with no error anywhere.',
      },
    ],
  },
  {
    id: 'contrast',
    title: 'Choosing a brand blue that passes AA',
    when: 'Today',
    turns: [
      {
        id: 'c1',
        from: 'you',
        text: 'The brand blue in our mock is #0A84FF. White text on it measures 3.65 to 1. Do we change the text or the blue?',
      },
      {
        id: 'c2',
        from: 'assistant',
        text: 'Change the blue, and keep the original for one job.\n\nWhite on #0A84FF is fine at display sizes, where AA Large applies and the threshold is 3:1. It fails for body copy, where the threshold is 4.5:1. So the honest answer is two tokens, not one: a surface blue one step darker for anything with text on it, and the measured blue kept under a different name for display type only.\n\nWrite the reason beside the token. The next person to open the file will otherwise see a colour that does not match the design and "fix" it.',
      },
    ],
  },
  {
    id: 'rtl',
    title: 'What logical properties cannot do',
    when: 'Yesterday',
    turns: [
      {
        id: 'r1',
        from: 'you',
        text: 'We swept the codebase for `pl-` and `left-`. Are we right-to-left ready now?',
      },
      {
        id: 'r2',
        from: 'assistant',
        text: 'Nearly. There is exactly one thing a logical property cannot express, and it is `transform`.\n\nA horizontal flip is physical: `translateX(20px)` moves right in Arabic too. So anything that MOVES — a switch thumb crossing its track, a drawer sliding in from the edge, an arrow icon — needs its sign inverted under `:dir(rtl)`, in CSS, keyed on something stable like a data attribute.\n\nThe rest of the sweep was worth doing. This is the part that survives it.',
      },
    ],
  },
];

export const shortcuts = [
  { keys: ['⌘', 'K'], what: 'Search conversations' },
  { keys: ['⌘', 'B'], what: 'Show or hide the sidebar' },
  { keys: ['⌘', '⏎'], what: 'Send the message' },
  { keys: ['⇧', 'Esc'], what: 'Start a new conversation' },
];
