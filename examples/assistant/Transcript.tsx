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
  MessageBubble,
  PaneBody,
  Placeholder,
  Skeleton,
  SparkleIcon,
  Stack,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VisuallyHidden,
} from '@kobars/kirua';
import { HighlightedCode } from '../shared/HighlightedCode';
import type { Conversation } from './data';
import { InlineCode } from './InlineCode';

export interface TranscriptProps {
  conversation: Conversation;
  pending: boolean;
}

/** The part of the conversation pane that scrolls. */
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
    <PaneBody>
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
                <Collapsible variant="rail" gap={2}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      justify="between"
                      trailingIcon={<ChevronDownIcon />}
                    >
                      How it got there
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>{turn.reasoning}</CollapsibleContent>
                </Collapsible>
              )}

              {turn.text.split('\n\n').map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} tone="primary" wrap="anywhere">
                  <InlineCode text={paragraph} />
                </Text>
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
                              await navigator.clipboard.writeText(turn.code!.snippet.source);
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
                  <HighlightedCode lines={turn.code.snippet.lines} />
                </CodeBlock>
              )}
            </>
          );

          return (
            <Stack as="article" key={turn.id} gap={3}>
              {/* The two shapes tell a sighted reader who is speaking; a screen
                  reader has only these two words, and they are also what gives
                  the transcript an outline to jump through. */}
              <VisuallyHidden asChild>
                <Heading as="h2" size="body-sm">
                  {you ? 'You' : 'Assistant'}
                </Heading>
              </VisuallyHidden>

              {you ? (
                <MessageBubble from="self">{body}</MessageBubble>
              ) : (
                /* A reply is plain full-width text under a badge; a question is
                   a box at the end. The asymmetry is the marker. */
                <Stack gap={4}>
                  <Placeholder size="xs" shape="circle" tone="brand">
                    <SparkleIcon />
                  </Placeholder>
                  {body}
                </Stack>
              )}
            </Stack>
          );
        })}

        {pending && (
          <Stack as="output" gap={3} aria-busy="true" aria-label="Assistant is replying">
            <Skeleton shape="text" width="full" />
            <Skeleton shape="text" width="11/12" />
            <Skeleton shape="text" width="2/3" />
          </Stack>
        )}
        <VisuallyHidden asChild>
          <output>{copyStatus}</output>
        </VisuallyHidden>
        <div ref={end} />
      </Container>
    </PaneBody>
  );
}
