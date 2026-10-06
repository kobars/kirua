import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { selectTriggerVariants } from './SelectTrigger.variants';
import { ChevronDownIcon } from './icons';

export interface NativeSelectProps
  extends
    Omit<ComponentProps<'select'>, 'multiple' | 'size'>,
    VariantProps<typeof selectTriggerVariants> {}

/**
 * The browser's own `<select>`, drawn as a field. The closed control matches
 * `Input` and `SelectTrigger`; the open list is the operating system's — a
 * wheel on a phone, a menu on a desktop — and cannot be styled.
 *
 * Choose it over `Select` when the list is long and a user types to jump in
 * it, on a screen used mostly on a phone, where nothing may depend on
 * JavaScript, or in a form that posts: the value is a real form field with no
 * hidden input beside it. Choose `Select` when the options need more than
 * plain text, or the open list has to match the page.
 *
 * `ref`, `className` and every other prop land on the `<select>`, which is
 * also the element carrying `data-slot="native-select"`. A wrapper element
 * holds the chevron, but the `<select>` is what a `Field` labels, what a form
 * library registers and what a consumer reads the value of, so it is the
 * root. Size the control with `width`, which goes to the wrapper and keeps the
 * chevron at the control's end; a width in `className` would narrow the
 * `<select>` and leave the chevron behind.
 *
 * One choice only. `multiple` and `size` turn a `<select>` into an open list
 * box, which this field styling does not draw, so the type leaves them out.
 *
 * @example
 * <Field controlId="language" label="Preferred language">
 *   <NativeSelect name="language" defaultValue="English">
 *     <NativeSelectOptGroup label="Most requested">
 *       <NativeSelectOption>English</NativeSelectOption>
 *       <NativeSelectOption>Spanish</NativeSelectOption>
 *     </NativeSelectOptGroup>
 *   </NativeSelect>
 * </Field>
 */
export function NativeSelect({ className, width, ...props }: NativeSelectProps) {
  return (
    <div
      data-slot="native-select-wrapper"
      // A `dir` on the select alone would mirror its text and gutter but leave
      // the chevron, a sibling, on the page's side.
      dir={props.dir}
      className={cn('relative w-full', selectTriggerVariants({ width }))}
    >
      <select
        data-slot="native-select"
        className={cn(
          // `pe-10` keeps a long option's text clear of the chevron.
          'peer block h-11 w-full min-w-0 appearance-none rounded-md border border-field-line bg-field ps-3 pe-10',
          'font-text text-body-md text-on-field shadow-resting',
          'transition-[border-color,box-shadow] duration-fast ease-out',
          'hover:border-field-line-hover',
          // One ring, drawn over the border rather than beside it.
          'focus-visible:-outline-offset-1',
          'aria-invalid:border-field-line-invalid aria-invalid:hover:border-field-line-invalid',
          'aria-invalid:focus-visible:outline-field-line-invalid',
          'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-disabled disabled:text-on-field-disabled',
          className,
        )}
        {...props}
      />
      {/* Ornament: the `<select>` already announces itself as a pop-up. A
          press passes through it to the control underneath. */}
      <ChevronDownIcon
        data-slot="native-select-icon"
        className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto text-on-field opacity-60 peer-disabled:text-on-field-disabled"
      />
    </div>
  );
}

/** One choice. A plain `<option>`: the operating system draws it. */
export function NativeSelectOption(props: ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props} />;
}

/**
 * A named group of choices. Its `label` is shown in the list and read as the
 * group's name; it cannot be chosen.
 */
export function NativeSelectOptGroup(props: ComponentProps<'optgroup'>) {
  return <optgroup data-slot="native-select-opt-group" {...props} />;
}
