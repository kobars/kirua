import * as SliderPrimitive from '@radix-ui/react-slider';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * `getValueText` reads the value this component is given, so it needs a
 * controlled `value`: from `defaultValue` it would announce the starting value
 * for ever while the thumb moved.
 */
type ValueText =
  | {
      value: number[];
      /**
       * What a screen reader announces for a thumb, when the bare number is
       * not what the screen shows — a price with its currency, a time of day.
       */
      getValueText?: (value: number, index: number) => string;
    }
  | { value?: undefined; getValueText?: never };

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> &
  ValueText & {
    /**
     * One accessible name per thumb, in order — each thumb is its own control.
     * With a single thumb, leave this out and use `aria-label`.
     */
    thumbLabels?: string[];
  };

/**
 * A value chosen by position. One thumb per entry in the value array, so
 * `[20]` is a single value and `[20, 80]` is a range.
 *
 * `role="slider"` is on the thumb, not the root, so this component moves the
 * accessible name there — a name left on the root would name nothing.
 *
 * Set a height when using the vertical orientation, for example className="h-48".
 *
 * @example <Slider defaultValue={[20]} max={200} aria-label="Volume" />
 * @example
 * <Slider
 *   defaultValue={[20, 80]}
 *   max={200}
 *   thumbLabels={['Minimum price', 'Maximum price']}
 * />
 * @example
 * <Slider
 *   value={price}
 *   onValueChange={setPrice}
 *   max={800000}
 *   thumbLabels={['Lowest price', 'Highest price']}
 *   getValueText={(value) => idr(value)}
 * />
 */
export function Slider({
  className,
  thumbLabels,
  getValueText,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SliderProps) {
  // Read rather than destructured: pulling `value` out and passing it back
  // widens it to `number[] | undefined`, which Radix does not accept.
  const thumbs = props.value ?? props.defaultValue ?? [0];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      orientation={orientation}
      className={cn(
        'relative flex touch-none items-center select-none',
        // As tall as the thumb, so the row reserves the 20px circle rather
        // than the 6px track and the thumb cannot overlap what sits above.
        orientation === 'vertical' ? 'h-full w-5 flex-col' : 'h-5 w-full',
        'data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-pill bg-sunken',
          orientation === 'vertical' ? 'h-full w-1.5' : 'h-1.5 w-full',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute bg-primary',
            orientation === 'vertical' ? 'w-full' : 'h-full',
          )}
        />
      </SliderPrimitive.Track>
      {thumbs.map((thumb, index) => (
        <SliderPrimitive.Thumb
          // Thumbs have no identity beyond their position.
          // oxlint-disable-next-line no-array-index-key
          key={index}
          data-slot="slider-thumb"
          aria-label={thumbLabels?.[index] ?? ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={getValueText?.(thumb, index)}
          className={cn(
            'relative block size-5 rounded-pill border-2 border-primary bg-field shadow-resting',
            // The circle is 20px; the touch target must be 44.
            "before:absolute before:-inset-3 before:content-['']",
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'disabled:pointer-events-none',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
