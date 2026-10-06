import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { DeviceFrame } from './DeviceFrame';

/** A page that prints the window size it was given, which is all a frame promises. */
const page = (label: string) => `<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; display: grid; place-content: center; min-height: 100vh;
         font: 600 18px/1.4 system-ui, sans-serif; text-align: center; }
</style>
<p>${label}<br /><output id="size"></output></p>
<script>
  const show = () => (document.getElementById('size').textContent = innerWidth + ' × ' + innerHeight);
  show();
  addEventListener('resize', show);
</script>`;

const meta = {
  tags: ['autodocs'],
  title: 'Components/DeviceFrame',
  component: DeviceFrame,
  args: { title: 'A page at the size of a phone', device: 'md', srcDoc: page('A phone') },
  argTypes: {
    device: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    src: { control: 'text' },
    srcDoc: { control: false },
  },
  parameters: {
    docs: {
      story: { height: '960px' },
      description: {
        component:
          'Preview a phone layout on a wide screen. The page inside gets its own window at the phone’s width, so its breakpoints, sticky bars and overlays behave exactly as they do on the phone. Give every frame a title that names what it shows.',
      },
    },
  },
} satisfies Meta<typeof DeviceFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Devices: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {(['sm', 'md', 'lg'] as const).map((device) => (
        <DeviceFrame
          {...args}
          key={device}
          device={device}
          title={`A page on a ${device} phone`}
          srcDoc={page(device)}
        />
      ))}
    </div>
  ),
};

/**
 * The size is the page's window, not the outline around it: a page in the
 * 390px frame has an `innerWidth` of 390, which is the number its media
 * queries compare against.
 */
export const ThePageGetsThePhonesWidth: Story = {
  args: { device: 'md' },
  play: async ({ canvasElement }) => {
    const frame = within(canvasElement).getByTitle('A page at the size of a phone');
    await expect(frame.tagName).toBe('IFRAME');
    await expect(frame).toHaveAttribute('data-slot', 'device-frame');
    await waitFor(() =>
      expect((frame as HTMLIFrameElement).contentWindow?.innerWidth).toBe(390),
    );
    // The edge is drawn outside the screen, so the outline is wider than 390.
    await expect(frame.getBoundingClientRect().width).toBeGreaterThan(390);
  },
};
