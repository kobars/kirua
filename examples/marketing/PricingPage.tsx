import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ArrowRightIcon,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  CheckIcon,
  Chip,
  Container,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Section,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'kirua';
import { COMPARISON, FAQ, PLANS } from './data';

/**
 * Three plans, one comparison, and the questions people actually send.
 *
 * The `Popover` here is the reason this screen is where it went. The
 * example-app audit removed the system's only popover usage because it was a
 * menu wearing a popover; this one is the real shape — a small piece of extra
 * reading, anchored to the term it explains, that a `Tooltip` cannot hold
 * because it contains a link.
 */
export function PricingPage() {
  return (
    <Container width="6xl">
      <Section>
        <Heading as="h1" size="heading-lg">
          Three plans, and the free one is not a trial
        </Heading>
        <Text size="lg" className="max-w-176">
          Every plan carries the same gallery. What changes is how many you get, whether the
          address is yours, and whether Aozora handles the money.
        </Text>
      </Section>

      <Section gap="lg" className="md:grid-cols-3">
        <Heading as="h2" className="sr-only">
          The plans
        </Heading>
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.featured ? 'brand' : 'light'}
            padding="lg"
            glint={plan.featured ? ['top-end', 'bottom-start'] : false}
            className="gap-4"
          >
            <div className="flex items-center justify-between gap-2">
              <CardEyebrow>{plan.name}</CardEyebrow>
              {plan.featured && <Chip size="sm">Most chosen</Chip>}
            </div>

            <CardTitle as="h3" className="flex items-baseline gap-2 text-display-md">
              <span className="tabular-nums">{plan.price}</span>
              <span className="text-body-md font-normal text-fg-secondary">{plan.cadence}</span>
            </CardTitle>

            <CardBody>{plan.blurb}</CardBody>

            <ul className="grid gap-2">
              {plan.includes.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-body-sm text-fg-secondary"
                >
                  <CheckIcon size="sm" aria-hidden="true" className="mt-0.5 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.featured ? 'primary' : 'secondary'}
              size="md"
              className="mt-auto"
              trailingIcon={<ArrowRightIcon />}
              asChild
            >
              <a href="#/contact">Choose {plan.name}</a>
            </Button>
          </Card>
        ))}
      </Section>

      <Section>
        <Heading as="h2" size="heading-md">
          What actually differs
        </Heading>
        <Card padding="md">
          <ScrollArea orientation="horizontal">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  {PLANS.map((plan) => (
                    <TableHead key={plan.id}>{plan.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="whitespace-nowrap">
                      {row.feature === 'Platform fee' ? (
                        <span className="inline-flex items-center gap-1">
                          Platform fee
                          <Popover>
                            <PopoverTrigger asChild>
                              <IconButton
                                aria-label="What the platform fee covers"
                                variant="ghost"
                                size="sm"
                              >
                                <span aria-hidden="true">?</span>
                              </IconButton>
                            </PopoverTrigger>
                            <PopoverContent aria-label="What the platform fee covers">
                              <Text size="sm">
                                Taken from a sale, never from a subscription. Payment processing
                                is charged separately by the processor and Aozora does not add
                                to it.
                              </Text>
                              <Text size="sm" className="mt-2">
                                <Link href="#/contact">Ask about a studio rate</Link>
                              </Text>
                            </PopoverContent>
                          </Popover>
                        </span>
                      ) : (
                        row.feature
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums">{row.sketch}</TableCell>
                    <TableCell className="tabular-nums">{row.studio}</TableCell>
                    <TableCell className="tabular-nums">{row.atelier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Billed</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>Monthly</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>
        </Card>
      </Section>

      <Section>
        <Heading as="h2" size="heading-md">
          Questions we are asked
        </Heading>
        <Card padding="md">
          <Accordion type="single" collapsible defaultValue={FAQ[0].question}>
            {FAQ.map((entry) => (
              <AccordionItem key={entry.question} value={entry.question}>
                <AccordionTrigger>{entry.question}</AccordionTrigger>
                <AccordionContent>{entry.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </Section>
    </Container>
  );
}
