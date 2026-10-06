import { useRef } from 'react';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  Button,
  CloseIcon,
  Container,
  FileIcon,
  IconButton,
  Inline,
  Kbd,
  Label,
  SendIcon,
  Separator,
  SparkleIcon,
  Stack,
  Text,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VisuallyHidden,
} from '@kobars/kirua';
import type { ContextFile } from './data';

export interface ComposerProps {
  onSend: (text: string) => void;
  busy: boolean;
  /** Files attached to the conversation, not to one message. */
  context: ContextFile[];
  onRemoveContext: (file: ContextFile) => void;
}

/**
 * The bottom of the conversation pane, which stays on the screen while the
 * transcript above it scrolls. The field grows with its text up to a cap and
 * then scrolls.
 */
export function Composer({ onSend, busy, context, onRemoveContext }: ComposerProps) {
  const box = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const el = box.current;
    if (!el || busy || el.value.trim() === '') return;
    onSend(el.value.trim());
    el.value = '';
  };

  return (
    <>
      <Separator />
      <Container width="3xl" pad="xs">
        <Stack
          as="form"
          gap={3}
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          {context.length > 0 && (
            <AttachmentGroup layout="wrap" aria-label="Context for this conversation">
              {context.map((file) => (
                <Attachment key={file.name} size="sm">
                  <AttachmentMedia>
                    <FileIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    <AttachmentDescription>{file.description}</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${file.name}`}
                      onClick={() => {
                        onRemoveContext(file);
                        // The button is gone; keep the focus in the composer.
                        box.current?.focus();
                      }}
                    >
                      <CloseIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </AttachmentGroup>
          )}
          {/* The placeholder carries the meaning on the screen; the name has to
              stay in the accessibility tree. */}
          <VisuallyHidden asChild>
            <Label htmlFor="composer">Message the assistant</Label>
          </VisuallyHidden>
          <Textarea
            id="composer"
            ref={box}
            rows={1}
            grow
            placeholder="Ask about tokens, contrast, or right-to-left…"
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter makes a new line.
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                send();
              }
            }}
          />
          <Inline wrap justify="between" gap={3}>
            <Inline as="p" gap={1.5}>
              <Kbd>⇧</Kbd>
              <Kbd>⏎</Kbd>
              <Text inline size="caption" tone="muted">
                for a new line
              </Text>
            </Inline>
            <Inline gap={2}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    type="button"
                    aria-label="Suggest a prompt"
                    variant="ghost"
                    onClick={() => {
                      if (!box.current) return;
                      box.current.value = 'How do surface contexts keep buttons readable?';
                      box.current.focus();
                    }}
                  >
                    <SparkleIcon />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>Suggest a prompt</TooltipContent>
              </Tooltip>
              <Button
                type="submit"
                trailingIcon={<SendIcon />}
                loading={busy}
                loadingLabel="Waiting for the reply"
              >
                Send
              </Button>
            </Inline>
          </Inline>
        </Stack>
      </Container>
    </>
  );
}
