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
  List,
  ListItem,
  Section,
  Separator,
  Text,
} from '@kobars/kirua';
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
 * Prose about code. It is where an inline `Code` earns its place — a file name or a
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

      <Section gap="lg">
        <Heading as="h2" size="heading-md">
          The four steps
        </Heading>
        {/* The step numbers are the list's own markers, which is what `List`
            is for: no hand-kept index to fall out of step. */}
        <List variant="number">
          {PUBLISH_STEPS.map((step) => (
            <ListItem key={step.title}>
              <Text inline tone="primary" weight="medium">
                {step.title}.
              </Text>{' '}
              {step.body}
            </ListItem>
          ))}
        </List>

        <Alert status="info">
          <AlertTitle>Nothing is published until you say so</AlertTitle>
          <AlertDescription>
            A gallery stays private while you build it. Press <Kbd>⌘</Kbd> <Kbd>Enter</Kbd> in
            the editor to publish, and the same chord again to take it back down.
          </AlertDescription>
        </Alert>
      </Section>

      <Separator />

      <Section gap="lg">
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
      </Section>

      <Card variant="dark" padding="lg" glint="top-end">
        <CardTitle as="h2">Still stuck?</CardTitle>
        <CardBody>
          Write to us with the gallery handle and what you expected to happen. A person reads
          every message, and the reply time is one working day.
        </CardBody>
      </Card>
    </Container>
  );
}
