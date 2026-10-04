import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Label,
  PlusIcon,
  Progress,
  SendIcon,
  Text,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from 'kirua';

const LIMIT = 280;

/**
 * The composer. The character counter is a live region only when it matters —
 * announcing "271 characters left" on every keystroke is noise, so the count
 * is silent until the last 20.
 */
export function Composer({
  onPublish,
}: {
  onPublish: (text: string, audience: string, image: boolean) => void;
}) {
  const [text, setText] = useState('');
  const [audience, setAudience] = useState('everyone');
  const [uploaded, setUploaded] = useState<number | null>(null);
  const left = LIMIT - text.length;

  // The one thing on this screen that is a task rather than a measurement, and
  // therefore the one `Progress` in the example applications. Everything else
  // that looked like a bar — bed occupancy, record completeness, a stock level
  // — is a `Meter`.
  useEffect(() => {
    if (uploaded === null || uploaded >= 100) return;
    const timer = window.setTimeout(
      () => setUploaded((n) => Math.min(100, (n ?? 0) + 20)),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [uploaded]);

  const cannotSend = text.trim() === '' || (uploaded !== null && uploaded < 100);

  return (
    <Card className="grid gap-3 p-4">
      <div className="flex gap-3">
        <Avatar size="md">
          <AvatarFallback>RN</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Label htmlFor="compose" className="sr-only">
            Write a post
          </Label>
          <Textarea
            id="compose"
            rows={3}
            value={text}
            maxLength={LIMIT}
            placeholder="What are you working on?"
            className="resize-none border-0 bg-transparent px-0 shadow-none"
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      </div>

      {uploaded !== null && (
        <div className="grid gap-1.5">
          <div className="flex items-baseline justify-between">
            <Text size="sm">{uploaded < 100 ? 'Uploading the image…' : 'Image uploaded'}</Text>
            <Text size="sm" tone="muted" inline className="tabular-nums">
              {uploaded}%
            </Text>
          </div>
          <Progress value={uploaded} aria-label="Image upload" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          value={audience}
          onValueChange={(next) => next && setAudience(next)}
          aria-label="Who can see this"
        >
          {(
            [
              ['everyone', 'Everyone'],
              ['followers', 'Followers'],
              ['me', 'Only me'],
            ] as const
          ).map(([value, label]) => (
            <ToggleGroupItem key={value} value={value} size="sm" variant="outline">
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            leadingIcon={<PlusIcon />}
            // Unavailable but still focusable, so the press that starts the
            // upload does not drop focus onto the page.
            aria-disabled={uploaded !== null || undefined}
            onClick={uploaded !== null ? undefined : () => setUploaded(0)}
          >
            Image
          </Button>
          <span
            aria-live={left <= 20 ? 'polite' : 'off'}
            className={[
              'text-body-sm tabular-nums',
              left <= 20 ? 'font-medium text-invalid' : 'text-fg-muted',
            ].join(' ')}
          >
            {left}
          </span>
          <Button
            size="sm"
            trailingIcon={<SendIcon />}
            aria-disabled={cannotSend || undefined}
            onClick={
              cannotSend
                ? undefined
                : () => {
                    onPublish(text.trim(), audience, uploaded === 100);
                    setText('');
                    setUploaded(null);
                  }
            }
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
