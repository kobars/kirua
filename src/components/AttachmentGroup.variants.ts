import { cva } from '@/lib/cva';

/**
 * The list attachments sit in. The group renders each child inside its own
 * `<li>`, and styles those items from here, so no part of the layout lives on
 * an element the consumer never wrote.
 *
 * `stack` is a column of full-width rows — a record's documents. `wrap` lays
 * attachments side by side and wraps them — files under a message, a
 * composer's attachments — giving a row a fixed width so a long name
 * truncates instead of pushing the next file to its own line, while a
 * vertical tile keeps its own width.
 */
export const attachmentGroupVariants = cva('flex min-w-0 gap-2', {
  variants: {
    layout: {
      stack: 'flex-col',
      wrap: 'flex-wrap *:w-72 *:max-w-full *:has-[>[data-orientation=vertical]]:w-auto',
    },
  },
  defaultVariants: { layout: 'stack' },
});
