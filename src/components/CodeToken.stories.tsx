import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Card } from './Card';
import { CodeBlock } from './CodeBlock';
import { CodeToken } from './CodeToken';

const meta = {
  tags: ['autodocs'],
  title: 'Components/CodeToken',
  component: CodeToken,
  args: { kind: 'keyword', children: 'export' },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'keyword',
        'string',
        'constant',
        'function',
        'parameter',
        'comment',
        'punctuation',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'One highlighted token inside a `CodeBlock`. The system colours code but does not parse it: a highlighter, ideally run at build time, maps its token types to `kind`.',
      },
    },
  },
} satisfies Meta<typeof CodeToken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <CodeBlock language="tsx">
        <CodeToken {...args} /> <CodeToken kind="keyword">function</CodeToken>{' '}
        <CodeToken kind="function">Greeting</CodeToken>
        <CodeToken kind="punctuation">()</CodeToken>{' '}
        <CodeToken kind="punctuation">{'{}'}</CodeToken>
      </CodeBlock>
    </div>
  ),
};

/** What a build-time highlighter hands over: tokens, with plain text between them. */
function Snippet() {
  return (
    <CodeBlock language="tsx">
      <CodeToken kind="comment">{'// Greets one person.'}</CodeToken>
      {'\n'}
      <CodeToken kind="keyword">export function</CodeToken>{' '}
      <CodeToken kind="function">Greeting</CodeToken>
      <CodeToken kind="punctuation">{'({ '}</CodeToken>
      <CodeToken kind="parameter">name</CodeToken>
      <CodeToken kind="punctuation">{' })'}</CodeToken>{' '}
      <CodeToken kind="punctuation">{'{'}</CodeToken>
      {'\n  '}
      <CodeToken kind="keyword">return</CodeToken>{' '}
      <CodeToken kind="string">{"'Hello, '"}</CodeToken>{' '}
      <CodeToken kind="punctuation">+</CodeToken> name{' '}
      <CodeToken kind="punctuation">+</CodeToken> <CodeToken kind="constant">1</CodeToken>
      <CodeToken kind="punctuation">;</CodeToken>
      {'\n'}
      <CodeToken kind="punctuation">{'}'}</CodeToken>
    </CodeBlock>
  );
}

const colourOf = (root: HTMLElement, kind: string) => {
  const token = [...root.querySelectorAll<HTMLElement>('[data-slot="code-token"]')].find(
    (element) => element.className.includes(`text-code-${kind}`),
  )!;
  return getComputedStyle(token).color;
};

const KINDS = ['keyword', 'string', 'constant', 'function', 'parameter', 'comment'];

export const EveryKindReadsApart: Story = {
  render: () => (
    <div className="max-w-xl" data-testid="frame">
      <Snippet />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-testid="frame"]')!;
    const colours = KINDS.map((kind) => colourOf(frame, kind));

    // A missing alias resolves to nothing and the token inherits the block's
    // text colour, which looks like a token that is merely plain.
    await expect(new Set(colours).size).toBe(KINDS.length);
    await expect(colours).not.toContain(getComputedStyle(frame.querySelector('code')!).color);

    const comment = frame.querySelector<HTMLElement>('.text-code-comment')!;
    await expect(getComputedStyle(comment).fontStyle).toBe('italic');
  },
};

export const OnADarkCard: Story = {
  render: () => (
    <Card variant="dark" className="max-w-xl">
      <Snippet />
    </Card>
  ),
};

export const OnABrandCardItIsNotHighlighted: Story = {
  render: () => (
    <Card variant="brand" className="max-w-xl" data-testid="card">
      <Snippet />
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-testid="card"]')!;
    const colours = KINDS.map((kind) => colourOf(card, kind));

    // Nothing but white clears 4.5:1 on the brand well, so every kind is white.
    await expect(new Set(colours)).toEqual(new Set(['rgb(255, 255, 255)']));
  },
};
