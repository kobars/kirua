import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * The boxed one-time-code field.
 *
 * The boxes are **not** inputs. Six separate inputs is the obvious build and it
 * is the wrong one: a paste of "483920" fills only the first box, autofill from
 * an SMS never fires, and a screen reader announces six unlabelled fields. So
 * there is exactly one real `<input>` — `InputOTPInput`, stretched invisibly
 * over the row — and the boxes are painted underneath it.
 *
 * The value is the consumer's, as everywhere else in this system. That is what
 * makes the split honest: this component owns the appearance of a string, and
 * the application owns the string.
 *
 * @example
 * const [code, setCode] = useState('');
 * <InputOTP>
 *   <InputOTPInput
 *     value={code}
 *     onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
 *     maxLength={6}
 *     aria-label="One-time code"
 *   />
 *   <InputOTPGroup>
 *     {Array.from({ length: 6 }, (_, index) => (
 *       <InputOTPSlot key={index} char={code[index]} isActive={code.length === index} />
 *     ))}
 *   </InputOTPGroup>
 * </InputOTP>
 */
export function InputOTP({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp"
      className={cn('group/otp relative inline-flex w-fit items-center', className)}
      {...props}
    />
  );
}

/**
 * The one real field, laid over the boxes.
 *
 * It is transparent rather than hidden. `display: none`, `visibility: hidden`
 * and `opacity: 0` each stop a browser offering autofill, and a field the
 * password manager cannot see is the failure this whole component exists to
 * avoid. So it keeps its size and its place in the layout and only its ink
 * disappears — the caret included, because the active box draws its own.
 *
 * Give it an `aria-label`, and set `autoComplete="one-time-code"` to let a
 * phone offer the code from the message.
 */
export function InputOTPInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-otp-input"
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      className={cn(
        'absolute inset-0 z-raised size-full',
        'bg-transparent text-transparent caret-transparent outline-none',
        'selection:bg-transparent',
        'disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The row of boxes. `aria-hidden`, because everything in it repeats what the
 * input beside it already holds — announcing both reads the code twice.
 */
export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      aria-hidden="true"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends ComponentProps<'div'> {
  /**
   * The character in this position. `undefined` is written into the type
   * because indexing past the end of the code is the normal case, not a
   * mistake — `code[4]` on a two-digit entry is how an empty box is asked for.
   */
  char?: string | undefined;
  /** Whether the caret is here. Exactly one slot should have this. */
  isActive?: boolean;
}

export function InputOTPSlot({ className, char, isActive, ...props }: InputOTPSlotProps) {
  return (
    <div
      data-slot="input-otp-slot"
      data-filled={char ? '' : undefined}
      className={cn(
        'relative flex h-12 w-10 items-center justify-center rounded-md',
        'border border-field-line bg-field shadow-resting',
        'font-text text-heading-sm text-on-field tabular-nums',
        'transition-[border-color] duration-fast ease-out',
        'group-has-[input:focus-visible]/otp:border-field-line-hover',
        isActive && 'border-ring',
        'group-has-[input[aria-invalid="true"]]/otp:border-field-line-invalid',
        'group-has-[input:disabled]/otp:border-field-line-disabled',
        'group-has-[input:disabled]/otp:bg-field-disabled',
        className,
      )}
      {...props}
    >
      {char}
      {isActive && (
        <span
          className="absolute h-6 w-px animate-pulse-soft bg-fg"
          data-slot="input-otp-caret"
        />
      )}
    </div>
  );
}

/** A dash between two blocks of boxes, as on a printed voucher. */
export function InputOTPSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      role="presentation"
      className={cn('h-px w-2 shrink-0 bg-line', className)}
      {...props}
    />
  );
}
