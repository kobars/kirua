import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardBody,
  CardTitle,
  Code,
  CodeBlock,
  Container,
  CopyIcon,
  Eyebrow,
  Heading,
  IconButton,
  Kbd,
  Section,
  Separator,
  Text,
} from 'kirua';
import { PUBLISH_STEPS } from './data';

const MANIFEST = `{
  "gallery": "mei-tsukino",
  "title": "Evening studies",
  "pieces": [
    { "file": "pieces/0001.png", "title": "Rooftop, 6pm", "sold": true },
    { "file": "pieces/0002.png", "title": "Bus window", "sold": false }
  ]
}`;

/**
 * Prose about code: the one kind of page this repository writes most and had no
 * screen for. It is where an inline `Code` earns its place — a file name or a
 * key in a sentence has nowhere else to go, because `CodeBlock` always draws a
 * bordered container and cannot sit on a line of text.
 */
export function GuidePage() {
  return (
    <Container width="3xl" pad="md">
      <Section>
        <Eyebrow>Guide</Eyebrow>
        <Heading as="h1" size="heading-lg">
          Publishing your first gallery
        </Heading>
        <Text size="lg">
          Four steps, and none of them needs a developer. The last section is for the people who
          want their files back out again, which is everyone eventually.
        </Text>
      </Section>

      <Separator />

      <div className="grid gap-4">
        <Heading as="h2" size="heading-md">
          The four steps
        </Heading>
        <ol className="grid gap-3">
          {PUBLISH_STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span className="flex size-7 items-center justify-center rounded-pill bg-brand-subtle text-body-sm font-semibold text-fg-accent tabular-nums">
                {index + 1}
              </span>
              <span className="grid gap-1">
                <span className="text-body-md font-medium text-fg">{step.title}</span>
                <span className="text-body-md text-fg-secondary">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>

        <Alert status="info">
          <AlertTitle>Nothing is published until you say so</AlertTitle>
          <AlertDescription>
            A gallery stays private while you build it. Press
            <span className="mx-1 inline-flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>Enter</Kbd>
            </span>
            in the editor to publish, and the same chord again to take it back down.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      <div className="grid gap-4">
        <Heading as="h2" size="heading-md">
          Getting your files back out
        </Heading>
        <Text>
          Every gallery exports as a folder. Inside it is one file per piece at the resolution
          you uploaded, and a <Code>manifest.json</Code> listing them. Each entry carries a{' '}
          <Code>file</Code>, a <Code>title</Code> and whether the piece is <Code>sold</Code>.
          The manifest is documented, not reverse-engineered, and it is the same shape whether
          you have four pieces or four hundred.
        </Text>

        <CodeBlock
          language="json"
          action={
            <IconButton aria-label="Copy the manifest" variant="ghost" size="sm">
              <CopyIcon />
            </IconButton>
          }
        >
          {MANIFEST}
        </CodeBlock>

        <Text>
          Anything that can read a folder can read the export — including{' '}
          <Code>python -m http.server</Code> in the folder itself. Opening it needs no Aozora
          account, and it keeps working after the account is closed.
        </Text>
      </div>

      <Card variant="dark" padding="lg" glint="top-end">
        <CardTitle as="h2" className="text-heading-lg">
          Still stuck?
        </CardTitle>
        <CardBody>
          Write to us with the gallery handle and what you expected to happen. A person reads
          every message, and the reply time is one working day.
        </CardBody>
      </Card>
    </Container>
  );
}
