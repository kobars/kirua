import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Inline,
  Label,
  PlusIcon,
  Progress,
  SendIcon,
  Split,
  Stack,
  Text,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
  VisuallyHidden,
} from '@kobars/kirua';

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
    <Card padding="sm" gap={3}>
      <Split layout="fit-start" from="base" gap={3} align="start">
        <Avatar size="md">
          <AvatarFallback>RN</AvatarFallback>
        </Avatar>
        <Stack gap={0}>
          <VisuallyHidden asChild>
            <Label htmlFor="compose">Write a post</Label>
          </VisuallyHidden>
          <Textarea
            id="compose"
            variant="bare"
            rows={3}
            value={text}
            maxLength={LIMIT}
            placeholder="What are you working on?"
            onChange={(event) => setText(event.target.value)}
          />
        </Stack>
      </Split>

      {uploaded !== null && (
        <Stack gap={1.5}>
          <Inline justify="between" align="baseline">
            <Text size="sm">{uploaded < 100 ? 'Uploading the image…' : 'Image uploaded'}</Text>
            <Text size="sm" tone="muted" inline numeric>
              {uploaded}%
            </Text>
          </Inline>
          <Progress value={uploaded} aria-label="Image upload" />
        </Stack>
      )}

      <Inline wrap justify="between" gap={3}>
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

        <Inline gap={3}>
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
          <Text
            inline
            size="sm"
            numeric
            aria-live={left <= 20 ? 'polite' : 'off'}
            tone={left <= 20 ? 'danger' : 'muted'}
            weight={left <= 20 ? 'medium' : undefined}
          >
            {left}
          </Text>
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
        </Inline>
      </Inline>
    </Card>
  );
}
