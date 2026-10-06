import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CodeBlock } from './CodeBlock';
import { IconButton } from './IconButton';
import { CopyIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/CodeBlock',
  component: CodeBlock,
  args: { language: 'bash' },
  argTypes: { action: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "A labelled block of code with optional actions. Highlighting is `CodeToken` children, whose kinds a highlighter run by the application decides; clipboard behaviour is the application's too.",
      },
    },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <CodeBlock {...args}>{`pnpm add @kobars/kirua`}</CodeBlock>
    </div>
  ),
};

export const WithACopyControl: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <CodeBlock
        {...args}
        language="tsx"
        action={
          <IconButton aria-label="Copy code" size="sm" variant="ghost">
            <CopyIcon />
          </IconButton>
        }
      >
        {`export function Greeting({ name }: { name: string }) {
  return <p className="text-body-md text-fg">Hello, {name}</p>;
}`}
      </CodeBlock>
    </div>
  ),
};

export const ItScrollsItselfAndTakesFocus: Story = {
  render: (args) => (
    <div className="w-72" data-testid="frame">
      <CodeBlock {...args} language="bash">
        {`KIRUA_WEBKIT=1 pnpm vitest --run --project webkit --reporter verbose --coverage`}
      </CodeBlock>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame');
    const code = frame.querySelector('[data-slot="code-block-code"]')!;
    // ScrollArea's viewport is the scroller and the tab stop, not its root.
    const viewport = frame.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;

    await expect(code).toHaveClass('language-bash');
    await expect(viewport).toHaveAttribute('tabindex', '0');

    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    await expect(frame.scrollWidth).toBe(frame.clientWidth);
  },
};
