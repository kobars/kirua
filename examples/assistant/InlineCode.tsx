import { Code } from '@kobars/kirua';

/**
 * A paragraph of a reply with its backtick spans as `Code`, the way a chat
 * renders Markdown's inline code. Only a closed pair counts, so a lone
 * backtick stays as typed.
 */
export function InlineCode({ text }: { text: string }) {
  // With a capturing group, `split` puts every code span at an odd index.
  return text
    .split(/`([^`\n]+)`/)
    .map((part, index) => (index % 2 === 1 ? <Code key={index}>{part}</Code> : part));
}
