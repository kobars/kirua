import { useEffect, useRef, useState } from 'react';
import {
  Button,
  ChevronDownIcon,
  CodeBlock,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Container,
  CopyIcon,
  Heading,
  IconButton,
  ScrollArea,
  Skeleton,
  SparkleIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'kirua';
import type { Conversation } from './data';

export interface TranscriptProps {
  conversation: Conversation;
  pending: boolean;
}

/**
 * The scrolling half of the shell, and the only region with `overflow`. Needs
 * `min-h-0` on itself and every flex ancestor, or the page scrolls instead.
 */
export function Transcript({ conversation, pending }: TranscriptProps) {
  const end = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const previous = useRef({ id: conversation.id, count: conversation.turns.length });
  useEffect(() => {
    if (
      previous.current.id === conversation.id &&
      conversation.turns.length > previous.current.count
    ) {
      end.current?.scrollIntoView({ block: 'nearest' });
    }
    previous.current = { id: conversation.id, count: conversation.turns.length };
  }, [conversation.id, conversation.turns.length, pending]);
  return (
    <ScrollArea className="min-h-0 flex-1">
      <Container width="3xl" gap="lg" pad="md">
        <Heading as="h1" size="heading-lg">
          {conversation.title}
        </Heading>

        {conversation.turns.map((turn) => {
          const you = turn.from === 'you';

          /* One body, placed in two shells. The turns differ in where they sit
             and what surrounds them, never in what they can contain. */
          const body = (
            <>
              {turn.reasoning && (
                /* A single disclosure, not an accordion: there is one panel, and
                   an accordion here would put a heading in the page outline
                   that means nothing. */
                /* A rule down the leading edge, and no fill. It is an aside,
                   not a container, and while it was a filled box it looked
                   exactly like the CodeBlock below it and the question above
                   it — three meanings wearing one appearance. */
                <Collapsible className="border-s-2 border-line-subtle ps-3">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between px-3"
                      trailingIcon={<ChevronDownIcon />}
                    >
                      How it got there
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-2 text-body-sm text-fg-secondary">
                    {turn.reasoning}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {turn.text.split('\n\n').map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-body-md text-pretty wrap-anywhere text-fg"
                >
                  {paragraph}
                </p>
              ))}

              {turn.code && (
                <CodeBlock
                  language={turn.code.language}
                  action={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          aria-label="Copy code"
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(turn.code!.source);
                              setCopyStatus('Code copied');
                            } catch {
                              setCopyStatus(
                                'Could not copy. Select the code and copy it manually.',
                              );
                            }
                          }}
                        >
                          <CopyIcon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipContent>Copy</TooltipContent>
                    </Tooltip>
                  }
                >
                  {turn.code.source}
                </CodeBlock>
              )}
            </>
          );

          return (
            <article key={turn.id} className="grid grid-cols-[minmax(0,1fr)] gap-3">
              {/* Off the screen, not out of the page. The two shapes tell a
                  sighted reader who is speaking; a screen reader has only these
                  two words, and they are also what gives the transcript an
                  outline to jump through. */}
              <Heading as="h2" size="body-sm" className="sr-only">
                {you ? 'You' : 'Assistant'}
              </Heading>

              {you ? (
                /* `ms-auto`, never `ml-auto`: the box belongs at the *end* of
                   the reading direction, so it moves to the left edge in a
                   right-to-left language rather than staying put.

                   The fill and the edge are the brand family, not the neutral
                   one: `bg-sunken` is what a CodeBlock and a Sidebar are made
                   of, so a question wearing it was claiming to be furniture.

                   `rounded-ee-xs` squares the end-bottom corner, and it is the
                   only cue here that survives Windows high contrast — that mode
                   replaces every fill and drops every shadow, but keeps borders
                   and geometry. A difference made only of colour disappears in
                   the one mode this very conversation is about. */
                <div className="ms-auto grid max-w-[85%] gap-4 rounded-lg rounded-ee-xs border border-line-accent bg-brand-subtle px-4 py-3">
                  {body}
                </div>
              ) : (
                <div className="grid gap-4">
                  {/* The badge is the only visible marker left on this side,
                      which is the asymmetry doing the work: a reply is the
                      plain full-width text, a question is a box at the end. */}
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-pill bg-brand-subtle text-fg-accent [--icon-size:var(--icon-sm)]"
                  >
                    <SparkleIcon />
                  </span>
                  {body}
                </div>
              )}
            </article>
          );
        })}

        {pending && (
          <output aria-busy="true" aria-label="Assistant is replying" className="grid gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </output>
        )}
        <output className="sr-only">{copyStatus}</output>
        <div ref={end} />
      </Container>
    </ScrollArea>
  );
}
