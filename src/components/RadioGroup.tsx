import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { radioGroupVariants } from './RadioGroup.variants';

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>;
export type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item>;

/**
 * One choice from a small set. The group is a single tab stop: Tab enters and
 * leaves it, and the arrow keys move between options, selecting as they go.
 *
 * @example
 * <RadioGroup defaultValue="standard" gap={2}>
 *   <Field orientation="horizontal" controlId="ship-standard" label="Standard">
 *     <RadioGroupItem value="standard" />
 *   </Field>
 * </RadioGroup>
 */
export function RadioGroup({ className, gap, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(radioGroupVariants({ gap }), className)}
      {...props}
    />
  );
}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'peer inline-flex size-5 shrink-0 items-center justify-center rounded-pill',
        'border border-field-line bg-field',
        'transition-[border-color] duration-fast ease-out',
        'hover:border-field-line-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-checked:border-primary',
        'aria-invalid:border-field-line-invalid',
        'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled',
        className,
      )}
      {...props}
    >
      {/* A filled dot, not a ring: the selected state has to survive forced
          colours, where a background fill on the OUTER box would be dropped.
          A child element painted in `currentColor` is kept. */}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-2.5 rounded-pill bg-primary"
      />
    </RadioGroupPrimitive.Item>
  );
}
