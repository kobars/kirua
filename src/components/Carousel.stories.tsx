import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AspectRatio } from './AspectRatio';
import { Carousel, CarouselItem } from './Carousel';

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  args: { label: 'Product photos' },
  parameters: {
    docs: {
      description: {
        component:
          "CSS scroll snap, not a carousel library. The browser already owns momentum, snapping, touch, the wheel and keyboard scrolling — a library replaces all five with JavaScript and needs a ref, a hook and a client boundary. The previous and next buttons are the one part that genuinely needs a ref, and they are four lines in a consumer's own client file.",
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = ['Front', 'Side', 'Back', 'Folded', 'Boxed'] as const;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Carousel {...args} className="scroll-p-1 p-1">
        {slides.map((label, index) => (
          <CarouselItem key={label} className="w-64">
            <AspectRatio ratio={4 / 3} className="rounded-md bg-sunken">
              <div className="grid size-full place-content-center text-body-sm text-fg-secondary">
                {index + 1}. {label}
              </div>
            </AspectRatio>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  ),
};

/**
 * The claims that make the library unnecessary: the track really does snap,
 * it really does scroll inside itself rather than scrolling the page, and it
 * is reachable by keyboard so the last slide is not pointer-only.
 */
export const ItSnapsScrollsItselfAndTakesFocus: Story = {
  render: (args) => (
    <div className="max-w-md" data-testid="frame">
      <Carousel {...args}>
        {slides.map((label) => (
          <CarouselItem key={label} className="w-64">
            <AspectRatio ratio={4 / 3} className="rounded-md bg-sunken" />
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId('frame');
    const track = canvas.getByRole('group', { name: 'Product photos' });

    await expect(getComputedStyle(track).scrollSnapType).toContain('x');
    await expect(getComputedStyle(canvas.getAllByRole('group')[1]!).scrollSnapAlign).toBe(
      'start',
    );

    await expect(track).toHaveAttribute('tabindex', '0');
    await expect(track.scrollWidth).toBeGreaterThan(track.clientWidth);
    await expect(frame.scrollWidth).toBe(frame.clientWidth);
  },
};
