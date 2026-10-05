import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LG, MD, SM, atLeast } from '@/test/viewport';
import { Button } from './Button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup';
import { Visible } from './Visible';

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;
const XL = 80;
const REM = { sm: SM, md: MD, lg: LG, xl: XL } as const;

const meta = {
  tags: ['autodocs'],
  title: 'Components/Visible',
  component: Visible,
  parameters: {
    docs: {
      description: {
        component:
          'Shows its one child only at some widths, or not on paper. It renders no element of its own: the classes land on the child, so ButtonGroup and Breadcrumb keep their direct children.',
      },
    },
  },
} satisfies Meta<typeof Visible>;

export default meta;
type Story = StoryObj<typeof meta>;

const shown = (element: Element) => getComputedStyle(element).display !== 'none';

export const FromAndBelow: Story = {
  render: () => (
    <div className="grid gap-2">
      {BREAKPOINTS.map((bp) => (
        <Visible key={`from-${bp}`} from={bp} data-testid={`from-${bp}`}>
          {`Shown from ${bp}`}
        </Visible>
      ))}
      {BREAKPOINTS.map((bp) => (
        <Visible key={`below-${bp}`} below={bp} data-testid={`below-${bp}`}>
          {`Shown below ${bp}`}
        </Visible>
      ))}
      <Visible print={false} data-testid="screen-only">
        Not printed
      </Visible>
    </div>
  ),
  /** The same question the CSS asks: the viewport against each breakpoint. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const bp of BREAKPOINTS) {
      await expect(shown(canvas.getByTestId(`from-${bp}`))).toBe(atLeast(REM[bp]));
      await expect(shown(canvas.getByTestId(`below-${bp}`))).toBe(!atLeast(REM[bp]));
    }
    await expect(canvas.getByTestId('screen-only')).toHaveAttribute('data-slot', 'visible');
    await expect(canvas.getByTestId('screen-only')).toHaveClass('print:hidden');
  },
};

/** `Show {count}` is two children, a string and a number, not one element. */
export const TextWithAValueInIt: Story = {
  render: function Render() {
    const count = 3;
    return (
      <Visible from="sm" data-testid="interpolated">
        Show {count}
      </Visible>
    );
  },
  play: async ({ canvasElement }) => {
    const span = within(canvasElement).getByTestId('interpolated');
    await expect(span).toHaveAttribute('data-slot', 'visible');
    await expect(span).toHaveTextContent('Show 3');
    await expect(shown(span)).toBe(atLeast(SM));
  },
};

export const OnAComponentItKeepsTheComponentsSlot: Story = {
  render: () => (
    <Visible from="sm">
      <Button variant="secondary">Export</Button>
    </Visible>
  ),
  /**
   * No wrapper, and the child's own `data-slot` survives: a consumer selecting
   * `[data-slot="button"]` still finds it.
   */
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Export' });
    await expect(button).toHaveAttribute('data-slot', 'button');
    await expect(button).toHaveClass('max-sm:hidden');
    await expect(button.closest('[data-slot="visible"]')).toBeNull();
    await expect(shown(button)).toBe(atLeast(SM));
  },
};

export const InsideAButtonGroup: Story = {
  render: () => (
    <ButtonGroup aria-label="Filter orders" data-testid="group">
      <Visible from="md">
        <ButtonGroupText>Show</ButtonGroupText>
      </Visible>
      <Visible from="md">
        <ButtonGroupSeparator />
      </Visible>
      <Button variant="secondary">All</Button>
      <Button variant="secondary">Open</Button>
    </ButtonGroup>
  ),
  /** The group's `[&>*]` rules need the parts as direct children, and they still are. */
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByTestId('group');
    const slots = Array.from(group.children).map((child) => child.getAttribute('data-slot'));

    await expect(slots).toEqual([
      'button-group-text',
      'button-group-separator',
      'button',
      'button',
    ]);
    await expect(shown(group.children[0]!)).toBe(atLeast(MD));
  },
};
