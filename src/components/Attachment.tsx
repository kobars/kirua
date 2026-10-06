/* oxlint-disable jsx-a11y/no-redundant-roles --
 * `AttachmentGroup`'s `role="list"` is not redundant in WebKit, which drops the
 * implicit role from a list styled `list-style: none`. File-level because
 * oxlint ignores a next-line disable for a `jsx-a11y` rule. */
import { Slot } from '@radix-ui/react-slot';
import { Children, isValidElement, type ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { attachmentVariants } from './Attachment.variants';
import { attachmentGroupVariants } from './AttachmentGroup.variants';
import { IconButton, type IconButtonProps } from './IconButton';
import { AlertIcon } from './icons';

export interface AttachmentProps
  extends ComponentProps<'div'>, VariantProps<typeof attachmentVariants> {
  /**
   * Where the file is in its upload. Unset is a file that is there.
   *
   * - `uploading` dashes the edge. The card cannot know how far the upload
   *   has got, so place a `Spinner` in `AttachmentMedia` or a `Progress` in
   *   `AttachmentContent` — those carry the announcement and the value.
   * - `error` draws the edge in the danger colour and replaces the media
   *   with an alert icon, so the failure is not told by colour alone. Say
   *   what went wrong in `AttachmentDescription` as well: the icon is
   *   decorative, and the words are what a screen reader reads.
   *
   * Written to `data-status`, not `data-state`: Radix writes `data-state` on
   * any element it is merged onto, and a card placed as a popover's trigger
   * would lose its status.
   */
  status?: 'uploading' | 'error';
}

/**
 * A file as a small card — in a composer before it is sent, under a message,
 * in a record's list of documents.
 *
 * Media at the start, the name and its size in the middle, actions at the end.
 * Add an `AttachmentTrigger` around the name and the whole card opens the
 * file, while the actions stay separately clickable above it.
 *
 * `data-size`, `data-orientation` and `data-status` mirror the props, and are
 * what the parts style themselves from.
 *
 * @example
 * <Attachment>
 *   <AttachmentMedia><FileIcon /></AttachmentMedia>
 *   <AttachmentContent>
 *     <AttachmentTitle>
 *       <AttachmentTrigger asChild><a href="/files/cbc.pdf">cbc-2026-03-12.pdf</a></AttachmentTrigger>
 *     </AttachmentTitle>
 *     <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
 *   </AttachmentContent>
 *   <AttachmentActions>
 *     <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf"><CloseIcon /></AttachmentAction>
 *   </AttachmentActions>
 * </Attachment>
 */
export function Attachment({
  className,
  size,
  orientation,
  status,
  ...props
}: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      data-size={size ?? 'md'}
      data-orientation={orientation ?? 'horizontal'}
      data-status={status}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  );
}

/**
 * The square at the start of the card: an icon, a `Spinner`, or a thumbnail.
 *
 * The icons are already hidden from assistive technology. A thumbnail
 * `<img>` repeats the name beside it, so give it `alt=""`.
 *
 * On a card with `status="error"` it shows an alert icon in place of what was
 * passed, which is why that icon is drawn here and not left to the caller.
 *
 * @example <AttachmentMedia><ImageIcon /></AttachmentMedia>
 */
export function AttachmentMedia({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-media"
      className={cn(
        // Square by its ratio, so each size and the tile name only a width.
        'flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm',
        'bg-sunken text-fg-muted',
        'group-data-[size=sm]/attachment:w-8',
        'group-data-[orientation=vertical]/attachment:w-full',
        'group-data-[orientation=vertical]/attachment:[--icon-size:var(--icon-2xl)]',
        '[&>img]:size-full [&>img]:object-cover',
        'group-data-[status=error]/attachment:bg-danger-bg',
        'group-data-[status=error]/attachment:text-danger-fg',
        'group-data-[status=error]/attachment:[&>:not([data-slot=attachment-error-icon])]:hidden',
        className,
      )}
      {...props}
    >
      {children}
      <AlertIcon
        data-slot="attachment-error-icon"
        className="hidden group-data-[status=error]/attachment:block"
      />
    </div>
  );
}

/** The name and the description. `min-w-0` is what lets a long name truncate. */
export function AttachmentContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

/**
 * The file's name, cut to one line with an ellipsis.
 *
 * Only the picture is cut: the whole name stays in the text, so a screen
 * reader reads all of it, and an `AttachmentTrigger` placed around it takes
 * the whole name as its accessible name. That is why the name, and not an
 * icon or a "View" label, is what the trigger wraps. A `title` attribute is
 * not the answer for the eye either — no touch screen and no keyboard shows
 * one — so the full name is one click away, in whatever the trigger opens.
 *
 * @example <AttachmentTitle>referral-cardiology-2026-02-04.pdf</AttachmentTitle>
 */
export function AttachmentTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-title"
      className={cn('truncate font-medium text-fg', className)}
      {...props}
    />
  );
}

/**
 * What the file is: its type and size, or what went wrong with it.
 *
 * @example <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
 */
export function AttachmentDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="attachment-description"
      className={cn(
        'truncate text-caption text-fg-secondary',
        'group-data-[status=error]/attachment:text-danger-fg',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The controls at the end of the card. `relative z-raised` lifts them over
 * the trigger's stretched hit area, which is `z-base`; both are inside the
 * card's own stacking context, so neither layer reaches past the card.
 *
 * On a vertical tile they sit over the media's end corner, on a raised fill
 * so they stay readable over a photograph.
 */
export function AttachmentActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        'relative z-raised flex shrink-0 items-center gap-1',
        'group-data-[orientation=vertical]/attachment:absolute',
        'group-data-[orientation=vertical]/attachment:inset-e-3',
        'group-data-[orientation=vertical]/attachment:top-3',
        'group-data-[orientation=vertical]/attachment:rounded-control',
        'group-data-[orientation=vertical]/attachment:bg-raised',
        className,
      )}
      {...props}
    />
  );
}

export type AttachmentActionProps = IconButtonProps;

/**
 * One action on the file — remove, download. An `IconButton` with the
 * defaults a card needs (`ghost`, `sm`, `type="button"`, so it never submits
 * the composer's form), rather than a second icon button with its own look.
 *
 * `aria-label` is required, as on `IconButton`. Name the file in it: a list of
 * five cards is otherwise five buttons all called "Remove".
 *
 * `asChild` is there for the same reason as on `IconButton`: a download is a
 * link, not a button.
 *
 * @example
 * <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf"><CloseIcon /></AttachmentAction>
 */
export function AttachmentAction({
  variant = 'ghost',
  size = 'sm',
  ...props
}: AttachmentActionProps) {
  return (
    <IconButton
      data-slot="attachment-action"
      variant={variant}
      size={size}
      type={props.asChild ? undefined : 'button'}
      {...props}
    />
  );
}

export interface AttachmentTriggerProps extends ComponentProps<'button'> {
  asChild?: boolean;
}

/**
 * Makes the whole card open the file: a "stretched link". Its `::after`
 * covers the card on the `z-base` layer, so a click anywhere on the card is a
 * click on the trigger, while `AttachmentActions` sits above it on
 * `z-raised` and keeps its own clicks.
 *
 * Wrap the file's name in it, inside `AttachmentTitle`, so the name is the
 * trigger's accessible name. A `<button>` by default, for a preview that
 * opens in place; pass `asChild` with an `<a>` when opening is navigating.
 *
 * It carries a `data-slot`, unlike the Radix triggers re-exported as they
 * are, because it styles the element it renders. Through `asChild`, wrap a
 * plain `<a>` or `<button>`: a `Link` or a `Button` would lose its own slot to
 * this one, and its own look would fight the card's.
 *
 * @example
 * <AttachmentTitle>
 *   <AttachmentTrigger onClick={() => setPreview(file)}>{file.name}</AttachmentTrigger>
 * </AttachmentTitle>
 */
export function AttachmentTrigger({
  className,
  asChild,
  type,
  ...props
}: AttachmentTriggerProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="attachment-trigger"
      type={asChild ? type : (type ?? 'button')}
      className={cn(
        'block max-w-full cursor-pointer truncate text-start outline-none',
        'after:absolute after:inset-0 after:z-base after:rounded-md',
        className,
      )}
      {...props}
    />
  );
}

export interface AttachmentGroupProps
  extends ComponentProps<'ul'>, VariantProps<typeof attachmentGroupVariants> {}

/**
 * A list of attachments, and a list by default: three files under a message
 * are three items, and a screen reader says how many before reading the
 * first. Each child is placed in its own `<li>`, so an `Attachment` stays a
 * `<div>` wherever it is used — alone in a header, or here.
 *
 * Pass the attachments directly. A fragment counts as one child, and one
 * item.
 *
 * `role="list"` is explicit because WebKit drops the list role from a list
 * styled `list-style: none`, as `List` records. Name the group with
 * `aria-label` or `aria-labelledby` when there is more than one on a page.
 *
 * @example
 * <AttachmentGroup layout="wrap" aria-label="Attached files">
 *   {files.map((file) => <Attachment key={file.id}>…</Attachment>)}
 * </AttachmentGroup>
 */
export function AttachmentGroup({
  className,
  layout,
  children,
  ...props
}: AttachmentGroupProps) {
  return (
    <ul
      data-slot="attachment-group"
      role="list"
      className={cn(attachmentGroupVariants({ layout }), className)}
      {...props}
    >
      {Children.toArray(children).map((child, index) => (
        <li key={isValidElement(child) && child.key !== null ? child.key : index}>{child}</li>
      ))}
    </ul>
  );
}
