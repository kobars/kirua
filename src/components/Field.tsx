import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { fieldVariants } from './Field.variants';

interface FieldControlProps {
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-required'?: ComponentProps<'input'>['aria-required'];
  'aria-describedby'?: string;
  'aria-invalid'?: ComponentProps<'input'>['aria-invalid'];
}

export interface FieldProps
  extends Omit<ComponentProps<'div'>, 'children'>, VariantProps<typeof fieldVariants> {
  /** Stable ID assigned to the control and referenced by its visible label. */
  controlId: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /**
   * Exactly one element that renders the focusable control and forwards
   * native control props to it: an `Input`, a `SelectTrigger`, a `Checkbox`.
   * Not a Radix root such as `Select`, which renders no element of its own.
   */
  children: ReactElement<FieldControlProps>;
}

/** `false` and `''` are what `touched && message` and an empty validator
 *  result produce; neither is something to show or announce. */
function isPresent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== '';
}

/** Text beside a control dims with it. `data-disabled` on the root is read
 *  rather than `:disabled`, because the label may come before the control. */
const dimmed = 'group-data-disabled/field:text-on-field-disabled';

/**
 * Connects one control to its visible label and optional supporting text. An
 * error automatically joins `aria-describedby` and sets `aria-invalid`, so the
 * accessible state cannot drift from the message on screen.
 *
 * Required is announced through `aria-required` as well as `required`: the
 * asterisk is `aria-hidden`, and `required` means nothing on a `<button>`, which
 * is what `SelectTrigger` and `DatePicker` render. A `Slider` under a required
 * Field is not a supported pairing, because a slider cannot be required.
 *
 * A disabled control dims its label, description and error.
 *
 * The child receives the id, `aria-describedby` and `aria-invalid` by
 * `cloneElement`, so it must be the element that renders the focusable
 * control. A Radix root renders nothing to receive them: put the Field
 * **inside** `Select`, around `SelectTrigger`, never around `Select`. A
 * `Slider` would give them to its track rather than its thumb, so it is
 * labelled by `aria-label` instead.
 *
 * `orientation="horizontal"` renders the control **before** the label, in a
 * first column: the row a checkbox or switch belongs in. The label is not
 * focusable, so the tab order is the same either way.
 *
 * `controlId` is explicit rather than generated with a hook, keeping the
 * component usable across a React Server Components boundary.
 *
 * Errors carry no live region on purpose. Validate on submit, re-validate on
 * change once submitted, and move focus to the first invalid control or to an
 * error summary: an announcement on every keystroke is noise.
 *
 * @example
 * <Field controlId="email" label="Email" description="We will only use this for receipts.">
 *   <Input type="email" />
 * </Field>
 *
 * @example
 * <Field orientation="horizontal" controlId="terms" label="I accept the terms" error={error}>
 *   <Checkbox />
 * </Field>
 *
 * @example
 * <Select defaultValue="balanced">
 *   <Field controlId="model" label="Model" description="Longer answers cost more.">
 *     <SelectTrigger><SelectValue /></SelectTrigger>
 *   </Field>
 *   <SelectContent>…</SelectContent>
 * </Select>
 */
export function Field({
  controlId,
  label,
  description,
  error,
  required = false,
  orientation,
  className,
  children,
  ...props
}: FieldProps) {
  const hasDescription = isPresent(description);
  const hasError = isPresent(error);
  const horizontal = orientation === 'horizontal';
  const childInvalid = children.props['aria-invalid'];
  const invalid =
    hasError ||
    (childInvalid !== undefined && childInvalid !== false && childInvalid !== 'false');
  const isRequired = required || Boolean(children.props.required);
  const disabled = Boolean(children.props.disabled);
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;
  const describedBy = [children.props['aria-describedby'], descriptionId, errorId]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  const controlProps: FieldControlProps = { id: controlId };
  if (isRequired) {
    controlProps.required = true;
    controlProps['aria-required'] = true;
  }
  if (describedBy) controlProps['aria-describedby'] = describedBy;
  if (invalid) controlProps['aria-invalid'] = true;
  else if (childInvalid !== undefined) controlProps['aria-invalid'] = childInvalid;

  const control = cloneElement(children, controlProps);
  const column = horizontal && 'col-start-2';

  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-orientation={orientation ?? 'vertical'}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    >
      {horizontal && control}
      <label
        data-slot="field-label"
        htmlFor={controlId}
        className={cn(
          'font-text text-body-sm font-medium text-fg',
          'group-data-disabled/field:cursor-not-allowed',
          dimmed,
          column,
        )}
      >
        {label}
        {isRequired && (
          <span
            data-slot="field-required-mark"
            aria-hidden="true"
            className="ms-1 text-invalid"
          >
            *
          </span>
        )}
      </label>
      {!horizontal && control}
      {hasDescription && (
        <p
          id={descriptionId}
          data-slot="field-description"
          className={cn('font-text text-body-sm text-fg-secondary', dimmed, column)}
        >
          {description}
        </p>
      )}
      {hasError && (
        <p
          id={errorId}
          data-slot="field-error"
          className={cn('font-text text-body-sm font-medium text-invalid', dimmed, column)}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A group of controls answering one question, such as a delivery method chosen
 * from a `RadioGroup`. The legend names the group, so the radio group inside
 * needs no `aria-label` of its own: two names would be read twice. Setting
 * `disabled` here disables every control inside, natively.
 *
 * `min-w-0` because a fieldset keeps `min-inline-size: min-content`, and one
 * long option would otherwise push it past a narrow screen.
 *
 * @example
 * <FieldSet>
 *   <FieldLegend>Delivery</FieldLegend>
 *   <RadioGroup defaultValue="standard">…</RadioGroup>
 * </FieldSet>
 */
export function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn('m-0 grid min-w-0 gap-3 border-0 p-0', className)}
      {...props}
    />
  );
}

/** The name of a `FieldSet`, in the label typography. */
export function FieldLegend({ className, ...props }: ComponentProps<'legend'>) {
  return (
    <legend
      data-slot="field-legend"
      className={cn('mb-1 p-0 font-text text-body-sm font-medium text-fg', className)}
      {...props}
    />
  );
}
