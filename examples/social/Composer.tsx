import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Label,
  SendIcon,
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
  const left = LIMIT - text.length;

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
