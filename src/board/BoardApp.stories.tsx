import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BoardApp } from './BoardApp';
import { sample } from './sources';
import { useBoardView } from './view';

const meta = {
  title: 'Board/App',
  component: BoardApp,
  args: { source: sample },
  argTypes: { source: { control: false } },
  // The store is a module singleton, so one story's typing would otherwise be
  // the next story's starting state — and the three width projects render the
  // same story in one iframe.
  beforeEach: () => {
    useBoardView.getState().clear();
  },
  parameters: {
    docs: {
      description: {
        component:
          'The board app is the second consumer of the design system, and the first one that is dense and data-driven. This story always renders the committed sample bundle, so it looks the same on every machine; `pnpm board` shows the real board where one exists.',
      },
    },
  },
} satisfies Meta<typeof BoardApp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six columns, every count derived from the graph rather than read off a card. */
export const Sample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Lantern board');
    await expect(canvas.queryByText('Could not read')).toBeNull();

    for (const name of ['Ready', 'Doing', 'Blocked', 'Backlog', 'Held', 'Done']) {
      await expect(canvas.getByRole('heading', { level: 2, name })).toBeVisible();
    }

    // `ready` is never written on a card. Two of the three stored `backlog`
    // tasks have every dependency done, so seeing those two here — and the
    // third still in Backlog — proves the graph was walked rather than read.
    const inColumn = (name: string) =>
      within(canvas.getByRole('region', { name }))
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent);

    await expect(inColumn('Ready')).toEqual(['Add a changelog page', 'Set up search']);
    await expect(inColumn('Backlog')).toEqual(['Write the prose style guide']);

    // Priority order is asserted in `view.test.ts` instead: no column of the
    // sample holds two cards whose priority order differs from their
    // alphabetical order, so this screen cannot tell the two apart.

    // The card that is not ready says what it is waiting for, by slug. The
    // anchor keeps the match on the line itself rather than an ancestor.
    const backlog = canvas.getByRole('region', { name: 'Backlog' });
    await expect(within(backlog).getByText(/^waits on/)).toHaveTextContent(
      'waits on write-getting-started',
    );
  },
};

/** Typing narrows every column at once, and the way back out is a control. */
export const Filtering: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Add a changelog page' })).toBeVisible();

    await userEvent.type(canvas.getByLabelText('Filter cards'), 'guide');

    await expect(canvas.getByText('2 of 7 cards')).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Write the prose style guide' }),
    ).toBeVisible();
    await expect(canvas.queryByRole('heading', { name: 'Add a changelog page' })).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByRole('heading', { name: 'Add a changelog page' })).toBeVisible();
  },
};

/** Zero matches is a screen with a way out of it, not a row of empty columns. */
export const NoMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Filter cards'), 'zzzz');

    await expect(canvas.getByRole('heading', { name: 'No card matches' })).toBeVisible();
    await expect(canvas.queryByRole('region', { name: 'Ready' })).toBeNull();
    // Exactly one way out, not two: the header's own control is hidden while
    // the empty state carries it.
    await expect(canvas.getAllByRole('button', { name: 'Clear filters' })).toHaveLength(1);
  },
};
