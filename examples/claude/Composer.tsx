import { useRef } from 'react';
import {
  Button,
  IconButton,
  Kbd,
  Label,
  SendIcon,
  SparkleIcon,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'kirua';

export interface ComposerProps {
  onSend: (text: string) => void;
  busy: boolean;
}

/**
 * The sticky bottom region. The textarea grows with its content up to a cap by
 * writing to `style.height` — application behaviour, so it lives here rather
 * than in `Textarea`.
 */
export function Composer({ onSend, busy }: ComposerProps) {
  const box = useRef<HTMLTextAreaElement>(null);

  const grow = () => {
    const el = box.current;
    if (!el) return;
    // Reset first, or the box can only get taller: scrollHeight is measured
    // against the height already set.
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const send = () => {
    const el = box.current;
    if (!el || busy || el.value.trim() === '') return;
    onSend(el.value.trim());
    el.value = '';
    grow();
  };

  return (
    <div className="border-t border-line-subtle bg-page p-4 md:px-8">
      <form
        className="mx-auto grid w-full max-w-3xl gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        {/* `sr-only` rather than `hidden`, so the name stays in the
            accessibility tree while the placeholder carries the meaning on the
            screen. */}
        <Label htmlFor="composer" className="sr-only">
          Message the assistant
        </Label>
        <Textarea
          id="composer"
          ref={box}
          rows={1}
          placeholder="Ask about tokens, contrast, or right-to-left…"
          className="max-h-60 min-h-11 resize-none"
          onInput={grow}
          onKeyDown={(event) => {
            // Enter sends, Shift+Enter makes a new line.
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send();
            }
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-caption text-fg-muted">
            <Kbd>⇧</Kbd>
            <Kbd>⏎</Kbd>
            <span>for a new line</span>
          </p>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  type="button"
                  aria-label="Suggest a prompt"
                  variant="ghost"
                  onClick={() => {
                    if (!box.current) return;
                    box.current.value = 'How do surface contexts keep buttons readable?';
                    grow();
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
          </div>
        </div>
      </form>
    </div>
  );
}
