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
                <Collapsible className="rounded-md border border-line-subtle bg-sunken">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      trailingIcon={<ChevronDownIcon />}
                    >
                      How it got there
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-3">
                    {turn.reasoning}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {turn.text.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-body-md text-pretty text-fg">
                  {paragraph}
                </p>
              ))}

              {turn.code && (
                <CodeBlock
                  language={turn.code.language}
                  action={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton aria-label="Copy code" size="sm" variant="ghost">
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

                   `bg-sunken` is the only quiet surface that reads on this page
                   in both themes — `surface-raised` is the same neutral-0 as
                   the page itself in light mode, and would be invisible. */
                <div className="ms-auto grid max-w-[85%] gap-4 rounded-lg border border-line-subtle bg-sunken px-4 py-3">
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
      </Container>
    </ScrollArea>
  );
}
