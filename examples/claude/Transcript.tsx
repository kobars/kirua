import {
  Avatar,
  AvatarFallback,
  CodeBlock,
  IconButton,
  ScrollArea,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  CopyIcon,
  SparkleIcon,
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
      <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-8 md:px-8">
        <h1 className="text-heading-lg font-semibold text-balance text-fg">
          {conversation.title}
        </h1>

        {conversation.turns.map((turn) => (
          <article key={turn.id} className="grid gap-3">
            <div className="flex items-center gap-2">
              {turn.from === 'you' ? (
                <Avatar size="xs">
                  <AvatarFallback>KS</AvatarFallback>
                </Avatar>
              ) : (
                <span className="flex size-6 items-center justify-center rounded-pill bg-brand-subtle text-fg-accent [--icon-size:var(--icon-sm)]">
                  <SparkleIcon />
                </span>
              )}
              <h2 className="text-body-sm font-semibold text-fg">
                {turn.from === 'you' ? 'You' : 'Assistant'}
              </h2>
            </div>

            <div className="grid gap-4 ps-8">
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
            </div>
          </article>
        ))}

        {pending && (
          <output
            aria-busy="true"
            aria-label="Assistant is replying"
            className="grid gap-3 ps-8"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </output>
        )}
      </div>
    </ScrollArea>
  );
}
