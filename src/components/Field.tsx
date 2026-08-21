import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldControlProps {
  id?: string;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: ComponentProps<'input'>['aria-invalid'];
}

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Stable ID assigned to the control and referenced by its visible label. */
  controlId: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Exactly one native control or component that forwards native control props. */
  children: ReactElement<FieldControlProps>;
}

/**
 * Connects one control to its visible label and optional supporting text. An
 * error automatically joins `aria-describedby` and sets `aria-invalid`, so the
 * accessible state cannot drift from the message on screen.
 *
 * `controlId` is explicit rather than generated with a hook, keeping the
 * component usable across a React Server Components boundary.
 *
 * @example
 * <Field controlId="email" label="Email" description="We will only use this for receipts.">
 *   <Input type="email" />
 * </Field>
 */
export function Field({
  controlId,
  label,
  description,
  error,
  required = false,
  className,
  children,
  ...props
}: FieldProps) {
  const hasDescription = description !== undefined && description !== null;
  const hasError = error !== undefined && error !== null;
  const childInvalid = children.props['aria-invalid'];
  const invalid =
    hasError ||
    (childInvalid !== undefined && childInvalid !== false && childInvalid !== 'false');
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;
  const describedBy = [children.props['aria-describedby'], descriptionId, errorId]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  const controlProps: FieldControlProps = { id: controlId };
  if (required || children.props.required) controlProps.required = true;
  if (describedBy) controlProps['aria-describedby'] = describedBy;
  if (invalid) controlProps['aria-invalid'] = true;
  else if (childInvalid !== undefined) controlProps['aria-invalid'] = childInvalid;

  const control = cloneElement(children, controlProps);

  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    >
      <label
        data-slot="field-label"
        htmlFor={controlId}
        className="font-text text-body-sm font-medium text-fg"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ms-1 text-invalid">
            *
          </span>
        )}
      </label>
      {control}
      {hasDescription && (
        <p
          id={descriptionId}
          data-slot="field-description"
          className="font-text text-body-sm text-fg-secondary"
        >
          {description}
        </p>
      )}
      {hasError && (
        <p
          id={errorId}
          data-slot="field-error"
          className="font-text text-body-sm font-medium text-invalid"
        >
          {error}
        </p>
      )}
    </div>
  );
}
