import { Fragment } from 'react';
import { CodeToken } from '@kobars/kirua';
import type { Snippet } from './snippet';

/**
 * A snippet's lines as `CodeBlock` children: a token where the highlighter
 * named a kind, plain text where it did not.
 */
export function HighlightedCode({ lines }: Pick<Snippet, 'lines'>) {
  return lines.map((line, index) => (
    // The lines of a snippet never reorder, so the index is a stable key.
    <Fragment key={index}>
      {index > 0 && '\n'}
      {line.map((part, at) =>
        part.kind ? (
          <CodeToken key={at} kind={part.kind}>
            {part.text}
          </CodeToken>
        ) : (
          part.text
        ),
      )}
    </Fragment>
  ));
}
