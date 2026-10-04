import {
  ArrowRightIcon,
  BookmarkIcon,
  Button,
  Card,
  CardBody,
  CardContent,
  CardEyebrow,
  CardTitle,
  Chip,
  Container,
  DotGrid,
  Grid,
  Heading,
  HeartIcon,
  Inline,
  Section,
  SendIcon,
  Split,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stack,
  Stat,
  StatRow,
  Text,
  Visible,
  VisuallyHidden,
} from 'kirua';
import { CHARACTERS } from './characters';
import { PRINCIPLES } from './data';

/**
 * The hero, and three claims under it.
 *
 * `SpotlightPanel` is doing the thing it was built for rather than being
 * demonstrated: the artwork breaks past the panel's own edges, which is the
 * reference design's signature move and the reason the component reserves
 * matching space on the content side.
 */
export function HomePage() {
  return (
    <Container width="7xl">
      <SpotlightPanel padding="lg" mediaWidth="30%" minHeight="md">
        <SpotlightMedia side="end" overhang="both" width="42%" bleed fit>
          <img
            src={CHARACTERS.yoyo.src}
            width={CHARACTERS.yoyo.width}
            height={CHARACTERS.yoyo.height}
            alt=""
          />
        </SpotlightMedia>

        <SpotlightContent measure gap={6}>
          <Chip size="sm">For anime and cartoon artists</Chip>

          <Heading as="h1" size="display-hero">
            Bring your anime worlds to life
          </Heading>

          <Text size="lg">
            Aozora gives you one place to design a gallery, show it at the size you drew it, and
            sell prints and commissions from the same page. No storefront to wire up, and no
            theme to fight.
          </Text>

          <Inline wrap gap={3}>
            <Button variant="primary" size="lg" asChild>
              <a href="#/marketing/pricing">Start free</a>
            </Button>
            <Button variant="secondary" size="lg" trailingIcon={<ArrowRightIcon />} asChild>
              <a href="#/marketing/guide">See how it works</a>
            </Button>
          </Inline>
        </SpotlightContent>

        <Visible from="md">
          <DotGrid rows={4} cols={4} placement="bottom-start" tone="muted" />
        </Visible>
      </SpotlightPanel>

      <Section>
        <VisuallyHidden asChild>
          <Heading as="h2">What Aozora stands for</Heading>
        </VisuallyHidden>
        <Grid md={3} gap={4}>
          {PRINCIPLES.map((principle, index) => (
            <Card
              key={principle.title}
              variant="dark"
              padding="lg"
              radius="lg"
              glint={index === 0 ? 'top-start' : index === 2 ? 'top-end' : false}
            >
              <CardEyebrow>0{index + 1}</CardEyebrow>
              <CardTitle as="h3">{principle.title}</CardTitle>
              <CardBody>{principle.body}</CardBody>
            </Card>
          ))}
        </Grid>
      </Section>

      <Card variant="brand" padding="xl" radius="xl" glint={['top-start', 'bottom-end']}>
        <Stack as="blockquote" align="center" gap={3}>
          <Text size="lg" tone="primary" align="center" wrap="balance" measure="wide">
            “I moved four years of commissions across in an afternoon, and the export convinced
            me before the import did.”
          </Text>
          <Text size="sm" tone="secondary" align="center">
            — Mei Tsukino, illustrator
          </Text>
        </Stack>
      </Card>

      <Section>
        <VisuallyHidden asChild>
          <Heading as="h2">Aozora in numbers</Heading>
        </VisuallyHidden>
        <Split layout="wide-narrow" from="lg" gap={4}>
          <Card padding="lg" gap={6}>
            {/* Grows, so the figures sit at the foot of the card when the card
                beside it is the taller one. */}
            <CardContent grow>
              <CardBody size="lg">
                Eleven thousand artists publish on Aozora, and last year they were paid for a
                little over four hundred thousand pieces. Those are the only two numbers we
                think are worth putting on a home page.
              </CardBody>
            </CardContent>
            <StatRow>
              <Stat icon={<HeartIcon />} value="11k" label="artists" />
              <Stat icon={<BookmarkIcon />} value="420k" label="pieces sold" />
              <Stat icon={<SendIcon />} value="38" label="countries paid into" />
            </StatRow>
          </Card>

          <Card variant="brand" padding="lg" glint={['top-end', 'bottom-start']}>
            <CardTitle as="h3">Try it on one gallery</CardTitle>
            <CardBody>
              The free plan is not a trial. Keep a gallery on it for as long as you like, and
              move up only when you start selling.
            </CardBody>
            <Button variant="primary" size="md" trailingIcon={<ArrowRightIcon />} asChild>
              <a href="#/marketing/pricing">Compare the plans</a>
            </Button>
          </Card>
        </Split>
      </Section>
    </Container>
  );
}
