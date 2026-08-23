import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BoardApp } from './BoardApp';
import { sample } from './sources';

const meta = {
  title: 'Board/App',
  component: BoardApp,
  args: { source: sample },
  argTypes: { source: { control: false } },
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

/** One card title, read from markdown, rendered by a real `Card`. */
export const Sample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Lantern board');
    await expect(canvas.getByRole('heading', { name: 'Write the home page' })).toBeVisible();
    await expect(canvas.queryByText('Could not read')).toBeNull();
    // `ready` is never written on a card; seeing it at all proves the graph was walked.
    await expect(canvas.getAllByText('ready')).toHaveLength(2);
  },
};
