import {
  ArrowRightIcon,
  BookmarkIcon,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Chip,
  DotGrid,
  HeartIcon,
  SendIcon,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stat,
  StatRow,
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
    <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] content-start gap-6 px-4 py-6 md:px-8">
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

          <h1 className="font-display text-display-md text-fg md:text-display-lg xl:text-display-xl">
            Bring your anime worlds to life
          </h1>

          <p className="font-text text-body-lg text-fg-secondary">
            Aozora gives you one place to design a gallery, show it at the size you drew it, and
            sell prints and commissions from the same page. No storefront to wire up, and no
            theme to fight.
          </p>

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

      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
        <h2 className="sr-only">What Aozora stands for</h2>
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
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <h2 className="sr-only">Aozora in numbers</h2>
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
      </section>
    </div>
  );
}
