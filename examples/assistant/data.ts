/** Fixed sample content. No network, no clock — the same page every time. */

export interface Turn {
  id: string;
  from: 'you' | 'assistant';
  text: string;
  code?: { language: string; source: string };
  /**
   * What the assistant worked through before answering. Shown in a collapsed
   * panel, because it is the thing a reader wants available and not in the way.
   */
  reasoning?: string;
}

/** How many conversations to draw in the usage chart, by month. */
export const usageByMonth = [
  { label: 'Oct', value: 34 },
  { label: 'Nov', value: 51 },
  { label: 'Dec', value: 28 },
  { label: 'Jan', value: 66 },
  { label: 'Feb', value: 72 },
  { label: 'Mar', value: 95 },
];

/** Where those conversations went. */
export const usageByTopic = [
  { label: 'Tokens', value: 42 },
  { label: 'A11y', value: 31 },
  { label: 'Layout', value: 24 },
  { label: 'Testing', value: 18 },
  { label: 'Build', value: 11 },
];

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

/**
 * Six more conversations, so the sidebar has something to group, search and
 * scroll. Same shape as the four above, written out rather than generated so
 * every line is readable in a diff.
 */
export const moreConversations: Conversation[] = [
  {
    id: 'forced-colors',
    title: 'Why high contrast mode erases my cards',
    when: 'Yesterday',
    turns: [
      {
        id: 'f1',
        from: 'you',
        text: 'On Windows high contrast every card in our app loses its edge and the whole page turns into one flat sheet. Nothing in our CSS changed.',
      },
      {
        id: 'f2',
        from: 'assistant',
        reasoning:
          'Two mechanisms are at play. Forced colors replaces every author colour with a user-chosen palette, and separately it drops box-shadow entirely. If a design separates surfaces by fill and elevation, both go at once.',
        text: "Nothing in your CSS changed — the browser changed it for you.\n\nForced colors mode replaces every colour you declared with one from the user's palette, and it also drops `box-shadow` completely. If your cards are separated from the page by a fill and a shadow, both of those disappear in the same instant, and a page of cards becomes a page.\n\nThe fix is to give the boundary a `border`, which forced colors keeps and recolours. Put the rule outside `@layer` so it beats the utility layer.",
        code: {
          language: 'css',
          source:
            "@media (forced-colors: active) {\n  [data-slot='card'],\n  [data-slot='dialog-content'] {\n    border: 1px solid CanvasText;\n  }\n}",
        },
      },
      {
        id: 'f3',
        from: 'you',
        text: 'How do I keep it working? I cannot check it by hand every release.',
      },
      {
        id: 'f4',
        from: 'assistant',
        text: 'Make it a test project rather than a checklist item. A Playwright context takes `forcedColors: "active"`, so the mode is a property of the browser the tests run in — which means no test can accidentally turn it off, and a component that loses its edge fails the run.',
      },
    ],
  },
  {
    id: 'dead-classes',
    title: 'A misspelt Tailwind class is completely silent',
    when: 'Yesterday',
    turns: [
      {
        id: 'd1',
        from: 'you',
        text: 'We shipped a panel that never appeared. Turned out the class was `inset-block-0`, which is not a Tailwind utility. No tool said a word.',
      },
      {
        id: 'd2',
        from: 'assistant',
        reasoning:
          'A class that generates no rule leaves the markup unchanged and the declaration absent. Type checking cannot see it, the linter has no list of real utilities, and a visual test only fails if a baseline happens to cover it.',
        text: 'That failure mode is the worst kind: the component renders, and renders wrong.\n\nThere is no list of valid utilities to lint against, because the valid set depends on your theme, your plugins and your own `@utility` rules. So the only authority is Tailwind itself.\n\nCollect every class token your source names, write them into a probe stylesheet, compile it against your real entry point, and report the ones that produced no rule.',
        code: {
          language: 'bash',
          source:
            'node tools/dead-classes.mjs\n# dead-classes: checked 473 class tokens.\n# dead-classes: every class generates a rule.',
        },
      },
    ],
  },
  {
    id: 'stateless',
    title: 'Can a component library ship zero JavaScript?',
    when: 'This week',
    turns: [
      {
        id: 's1',
        from: 'you',
        text: 'We want our Card to cost nothing in a React Server Component. Is that realistic when the library uses Radix?',
      },
      {
        id: 's2',
        from: 'assistant',
        reasoning:
          'The question is really about where the client boundary sits. Radix packages carry their own "use client". A wrapper that adds none stays a Server Component, and a Card that wraps nothing interactive never reaches the client bundle at all.',
        text: 'Yes, and the rule that makes it true is narrower than it sounds: no component of yours reads `window` or `document` during render, none holds state, and none writes `"use client"`.\n\nRadix ships its own client boundaries, so an interactive component still works. What changes is that a Card — which wraps nothing interactive — stays on the server and costs nothing.\n\nAssert it rather than remember it. Render the barrel with no browser present, and reject a `"use client"` directive in a static scan.',
      },
    ],
  },
  {
    id: 'logical-props',
    title: 'Logical properties, and the one thing they cannot do',
    when: 'This week',
    turns: [
      {
        id: 'l1',
        from: 'you',
        text: 'We switched every `pl-` to `ps-`. Is that all of it?',
      },
      {
        id: 'l2',
        from: 'assistant',
        text: 'Almost. `transform` has no logical form, so a horizontal flip stays horizontal in a right-to-left page — a switch thumb slides out of its track, and a mirrored corner ornament points the wrong way.\n\nKeep the sign in CSS, keyed on a data attribute, so it can re-invert under `:dir(rtl)`. And check it rather than trust it: render each component both ways and compare the computed values.',
        code: {
          language: 'css',
          source:
            "[data-slot='switch-thumb'] {\n  --switch-dir: 1;\n}\n\n:dir(rtl) [data-slot='switch-thumb'] {\n  --switch-dir: -1;\n}",
        },
      },
    ],
  },
  {
    id: 'overlays',
    title: 'Which overlay goes on top of which',
    when: 'This week',
    turns: [
      {
        id: 'o1',
        from: 'you',
        text: 'Our z-index numbers are 9999, 10000 and 100000. I would like to stop.',
      },
      {
        id: 'o2',
        from: 'assistant',
        reasoning:
          'With z-index the name is the meaning, so the values belong in the semantic layer rather than the primitive one. Nine named layers cover every case that has come up.',
        text: 'Name the layers and forbid the numbers. Nine is enough: base, raised, ornament, sticky, scrim, modal, popover, tooltip, toast.\n\nTwo orderings are worth arguing about once and then never again. A tooltip sits above a popover, because a tooltip can label a menu item. And an ornament sits above raised content, because a corner flourish has to stay over artwork that overhangs the panel edge.\n\nThen make `grep -rn "z-[0-9]" src/` returning nothing a rule you actually run.',
      },
    ],
  },
  {
    id: 'axe-open',
    title: 'A closed menu passes every accessibility check',
    when: 'Earlier',
    turns: [
      {
        id: 'a1',
        from: 'you',
        text: 'Our axe run has been green for a year. I do not entirely trust it.',
      },
      {
        id: 'a2',
        from: 'assistant',
        reasoning:
          'axe only inspects what is in the DOM. Overlay components render nothing until opened, so a suite whose stories never open one has been checking an empty document.',
        text: "You are right not to. axe reads the DOM, and a closed dialog, menu or tooltip is not in it — so a story that never opens one has been asserting nothing for a year.\n\nOpen them in the story. The first time we did, a menu reported `aria-hidden-focus`: Radix defaults a dropdown to modal, which marks the page — including the menu's own trigger — `aria-hidden` while the trigger stays focusable. That was real, and a year of green runs had never touched it.",
      },
    ],
  },
];

/** Everything the sidebar lists, in the order it lists them. */
export const allConversations: Conversation[] = [...conversations, ...moreConversations];
