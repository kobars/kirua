import {
  ArrowRightIcon,
  BookmarkIcon,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Chip,
  Container,
  CornerGlint,
  DotGrid,
  Heading,
  HeartIcon,
  Section,
  SendIcon,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stat,
  StatRow,
  Text,
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
      <SpotlightPanel padding="lg" mediaWidth="30%" className="md:min-h-[480px]">
        <SpotlightMedia side="end" overhang="both" width="42%" className="inset-e-[-6%]">
          <img
            src={CHARACTERS.yoyo.src}
            width={CHARACTERS.yoyo.width}
            height={CHARACTERS.yoyo.height}
            alt=""
            className="size-full object-contain object-bottom"
          />
        </SpotlightMedia>

        <SpotlightContent className="max-w-176 gap-6">
          <Chip size="sm">For anime and cartoon artists</Chip>

          <Heading as="h1" size="display-md" className="md:text-display-lg xl:text-display-xl">
            Bring your anime worlds to life
          </Heading>

          <Text size="lg">
            Aozora gives you one place to design a gallery, show it at the size you drew it, and
            sell prints and commissions from the same page. No storefront to wire up, and no
            theme to fight.
          </Text>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <a href="#/pricing">Start free</a>
            </Button>
            <Button variant="secondary" size="lg" trailingIcon={<ArrowRightIcon />} asChild>
              <a href="#/guide">See how it works</a>
            </Button>
          </div>
        </SpotlightContent>

        <DotGrid
          rows={4}
          cols={4}
          className="absolute inset-s-8 bottom-8 z-raised hidden text-fg-muted md:block"
        />
      </SpotlightPanel>

      <Section gap="lg" className="md:grid-cols-3">
        <Heading as="h2" className="sr-only">
          What Aozora stands for
        </Heading>
        {PRINCIPLES.map((principle, index) => (
          <Card
            key={principle.title}
            variant="dark"
            padding="lg"
            radius="lg"
            glint={index === 0 ? 'top-start' : index === 2 ? 'top-end' : false}
          >
            <CardEyebrow>0{index + 1}</CardEyebrow>
            <CardTitle as="h3" className="text-heading-lg">
              {principle.title}
            </CardTitle>
            <CardBody>{principle.body}</CardBody>
          </Card>
        ))}
      </Section>

      {/* A band rather than a Card, which is why the glints are placed by
          hand: `Card` and `SpotlightPanel` take a `glint` prop and draw their
          own, and `CornerGlint` is exported for the surface that is neither. */}
      <div className="ctx-brand relative overflow-hidden rounded-xl bg-brand p-8 md:p-12">
        <CornerGlint corner="top-start" radius={32} inset={14} />
        <CornerGlint corner="bottom-end" radius={32} inset={14} />
        <blockquote className="mx-auto max-w-176 text-center">
          <Text size="lg" tone="primary" className="text-balance">
            “I moved four years of commissions across in an afternoon, and the export convinced
            me before the import did.”
          </Text>
          <Text size="sm" tone="secondary" className="mt-3">
            — Mei Tsukino, illustrator
          </Text>
        </blockquote>
      </div>

      <Section gap="lg" className="lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Heading as="h2" className="sr-only">
          Aozora in numbers
        </Heading>
        <Card padding="lg" className="justify-between gap-6">
          <CardBody className="text-body-lg">
            Eleven thousand artists publish on Aozora, and last year they were paid for a little
            over four hundred thousand pieces. Those are the only two numbers we think are worth
            putting on a home page.
          </CardBody>
          <StatRow>
            <Stat icon={<HeartIcon />} value="11k" label="artists" />
            <Stat icon={<BookmarkIcon />} value="420k" label="pieces sold" />
            <Stat icon={<SendIcon />} value="38" label="countries paid into" />
          </StatRow>
        </Card>

        <Card variant="brand" padding="lg" glint={['top-end', 'bottom-start']}>
          <CardTitle as="h3" className="text-heading-lg">
            Try it on one gallery
          </CardTitle>
          <CardBody>
            The free plan is not a trial. Keep a gallery on it for as long as you like, and move
            up only when you start selling.
          </CardBody>
          <Button variant="primary" size="md" trailingIcon={<ArrowRightIcon />} asChild>
            <a href="#/pricing">Compare the plans</a>
          </Button>
        </Card>
      </Section>
    </Container>
  );
}
