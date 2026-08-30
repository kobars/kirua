import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { ResizableGroup, ResizableHandle, ResizablePanel } from './Resizable';

const meta = {
  title: 'Components/Resizable',
  component: ResizableGroup,
  parameters: {
    docs: {
      description: {
        component:
          '`orientation` names the axis the panels sit on, so a horizontal group has a vertical bar. Sizes are per panel, and the unit follows the type: a number is pixels, a bare numeric string is a percentage.',
      },
    },
  },
} satisfies Meta<typeof ResizableGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Pane = ({ children }: { children: string }) => (
  <div className="flex h-full items-center justify-center p-6 font-text text-body-sm text-fg-secondary">
    {children}
  </div>
);

export const Horizontal: Story = {
  render: () => (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-line-subtle bg-raised">
      <ResizableGroup orientation="horizontal">
        <ResizablePanel defaultSize="32" minSize="20">
          <Pane>Patients</Pane>
        </ResizablePanel>
        <ResizableHandle withGrip />
        <ResizablePanel>
          <Pane>Record</Pane>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-line-subtle bg-raised">
      <ResizableGroup orientation="vertical">
        <ResizablePanel defaultSize="60" minSize="20">
          <Pane>Chart</Pane>
        </ResizablePanel>
        <ResizableHandle withGrip />
        <ResizablePanel>
          <Pane>Console</Pane>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-line-subtle bg-raised">
      <ResizableGroup orientation="horizontal">
        <ResizablePanel defaultSize="25" minSize="15">
          <Pane>Queue</Pane>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50" minSize="30">
          <Pane>Detail</Pane>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="25" minSize="15">
          <Pane>Notes</Pane>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

/**
 * The bar is a real `separator` with a value, it takes focus, and its own axis
 * is the opposite of the group's. That last part is the thing this wrapper
 * relies on to be one component instead of two, so it is measured rather than
 * assumed.
 */
export const TheBarIsAFocusableSeparator: Story = {
  render: () => (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-line-subtle bg-raised">
      <ResizableGroup orientation="horizontal">
        <ResizablePanel defaultSize="40" minSize="20">
          <Pane>Start</Pane>
        </ResizablePanel>
        <ResizableHandle withGrip />
        <ResizablePanel>
          <Pane>End</Pane>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('separator');

    await expect(bar).toHaveAttribute('aria-orientation', 'vertical');
    await expect(bar).toHaveAttribute('aria-valuenow');

    // A one-pixel hairline is a target nobody hits: the bar must be wider.
    await waitFor(async () => {
      await expect(bar.getBoundingClientRect().width).toBeGreaterThan(8);
    });

    bar.focus();
    await expect(bar).toHaveFocus();
  },
};
