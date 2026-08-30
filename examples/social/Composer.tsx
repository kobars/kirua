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
export function Composer() {
  const [text, setText] = useState('');
  const [audience, setAudience] = useState('semua');
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

  return (
    <Card className="grid gap-3 p-4">
      <div className="flex gap-3">
        <Avatar size="md">
          <AvatarFallback>KS</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Label htmlFor="compose" className="sr-only">
            Tulis kiriman
          </Label>
          <Textarea
            id="compose"
            rows={3}
            value={text}
            maxLength={LIMIT}
            placeholder="Apa yang sedang kamu kerjakan?"
            className="resize-none border-0 bg-transparent px-0 shadow-none"
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      </div>

      {uploaded !== null && (
        <div className="grid gap-1.5">
          <div className="flex items-baseline justify-between">
            <Text size="sm">{uploaded < 100 ? 'Mengunggah gambar…' : 'Gambar terunggah'}</Text>
            <Text size="sm" tone="muted" inline className="tabular-nums">
              {uploaded}%
            </Text>
          </div>
          <Progress value={uploaded} aria-label="Unggahan gambar" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          value={audience}
          onValueChange={(next) => next && setAudience(next)}
          aria-label="Siapa yang bisa melihat"
        >
          {(
            [
              ['semua', 'Semua'],
              ['pengikut', 'Pengikut'],
              ['saya', 'Hanya saya'],
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
            disabled={uploaded !== null}
            onClick={() => setUploaded(0)}
          >
            Gambar
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
          <Button size="sm" trailingIcon={<SendIcon />} disabled={text.trim() === ''}>
            Kirim
          </Button>
        </div>
      </div>
    </Card>
  );
}
