import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Calendar } from './Calendar';
import { QuantityStepper } from './QuantityStepper';
import { ToastClose } from './Toast';
import { Slider } from './Slider';
import { Carousel } from './Carousel';

afterEach(cleanup);

describe('built-in actions inside a consumer form', () => {
  it.each([
    {
      name: 'calendar navigation',
      control: (action: () => void) => (
        <Calendar month={new Date(2026, 2, 1)} onMonthChange={action} />
      ),
      buttons: ['Previous month', 'Next month'],
    },
    {
      name: 'quantity adjustment',
      control: (action: () => void) => (
        <QuantityStepper label="Quantity" value={2} onDecrement={action} onIncrement={action} />
      ),
      buttons: ['Decrease quantity', 'Increase quantity'],
    },
    {
      name: 'toast dismissal',
      control: (action: () => void) => <ToastClose onClick={action} />,
      buttons: ['Dismiss'],
    },
  ])('$name does not submit the form', ({ control, buttons }) => {
    const submit = vi.fn();
    const action = vi.fn();
    const container = render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {control(action)}
        <button type="submit">Save</button>
      </form>,
    );
    for (const name of buttons) {
      const button = container.querySelector<HTMLButtonElement>(
        `button[aria-label="${name}"]`,
      )!;
      act(() => button.click());
    }
    expect(action).toHaveBeenCalledTimes(buttons.length);
    expect(submit).not.toHaveBeenCalled();
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(submit).toHaveBeenCalledOnce();
  });
});

describe('slider geometry agrees with its public orientation', () => {
  it.each(['horizontal', 'vertical'] as const)(
    '%s range fills half the track',
    (orientation) => {
      const container = render(
        <Slider
          orientation={orientation}
          defaultValue={[25, 75]}
          thumbLabels={['Minimum', 'Maximum']}
          style={
            orientation === 'vertical' ? { height: 200, width: 24 } : { width: 200, height: 24 }
          }
        />,
      );
      const track = container
        .querySelector('[data-slot="slider-track"]')!
        .getBoundingClientRect();
      const range = container
        .querySelector('[data-slot="slider-range"]')!
        .getBoundingClientRect();
      const vertical = orientation === 'vertical';
      expect(vertical ? track.height : track.width).toBeCloseTo(200, 0);
      expect(vertical ? range.height / track.height : range.width / track.width).toBeCloseTo(
        0.5,
        2,
      );
      expect(vertical ? range.width : range.height).toBeGreaterThan(0);
    },
  );
});

it('the carousel retains smooth scrolling without a reduced-motion preference', () => {
  expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
  const element = render(<Carousel label="Artwork" />).querySelector('[data-slot="carousel"]')!;
  expect(getComputedStyle(element).scrollBehavior).toBe('smooth');
});
