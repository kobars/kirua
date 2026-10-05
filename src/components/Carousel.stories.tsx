/* oxlint-disable import/default, import/no-duplicates -- Vite ?raw imports load source text separately from the executable module. */
import { ProductCarousel } from '../patterns/examples/ProductCarousel';
import ProductCarouselSource from '../patterns/examples/ProductCarousel.tsx?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AspectRatio } from './AspectRatio';
import { Carousel, CarouselItem } from './Carousel';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Carousel',
  component: Carousel,
  args: { label: 'Product photos' },
  parameters: {
    docs: {
      story: { height: '480px' },
      description: {
        component:
          'A horizontally scrollable track with CSS snapping. Provide a descriptive label and named slides. Scrolling works natively; the With controls example adds application-owned previous/next actions.',
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

export const ItSnapsScrollsItselfAndTakesFocus: Story = {
  name: 'Scrolling and keyboard focus',
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

export const WithControls: Story = {
  name: 'With controls',
  parameters: {
    docs: {
      source: {
        code: ProductCarouselSource.replace("from '@/components'", "from '@kobars/kirua'"),
        language: 'tsx',
      },
      description: {
        story:
          'Previous and next buttons scroll to a named slide. The application tracks native scrolling too, so the counter stays in sync after a swipe. Reduced-motion preferences disable animated scrolling.',
      },
    },
  },
  render: (args) => <ProductCarousel {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(async () => {
      await expect(canvas.getByRole('status')).toHaveTextContent('2 of 5');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    await waitFor(async () => {
      await expect(canvas.getByRole('status')).toHaveTextContent('1 of 5');
    });
  },
};
