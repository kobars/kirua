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
  CardFooter,
  CardTitle,
  CheckIcon,
  Chip,
  Container,
  Grid,
  Heading,
  IconButton,
  Inline,
  Link,
  List,
  ListItem,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Section,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  VisuallyHidden,
} from '@kobars/kirua';
import { COMPARISON, FAQ, PLANS } from './data';

/**
 * Three plans, one comparison, and the questions people actually send.
 *
 * The `Popover` here is the real shape of one — a small piece of extra
 * reading, anchored to the term it explains, that a `Tooltip` cannot hold
 * because it contains a link. A popover full of commands would be a menu.
 */
export function PricingPage() {
  return (
    <Container width="6xl">
      <Section>
        <Heading as="h1" size="heading-lg">
          Three plans, and the free one is not a trial
        </Heading>
        <Text size="lg" measure="wide">
          Every plan carries the same gallery. What changes is how many you get, whether the
          address is yours, and whether Aozora handles the money.
        </Text>
      </Section>

      <Section>
        <VisuallyHidden asChild>
          <Heading as="h2">The plans</Heading>
        </VisuallyHidden>
        <Grid md={3} gap={4}>
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              variant={plan.featured ? 'brand' : 'light'}
              padding="lg"
              glint={plan.featured ? ['top-end', 'bottom-start'] : false}
              gap={4}
            >
              <Inline justify="between" gap={2}>
                <CardEyebrow>{plan.name}</CardEyebrow>
                {plan.featured && <Chip size="sm">Most chosen</Chip>}
              </Inline>

              <CardTitle as="h3" size="display-md" numeric>
                {plan.price}{' '}
                <Text inline size="md" weight="normal">
                  {plan.cadence}
                </Text>
              </CardTitle>

              <CardBody>{plan.blurb}</CardBody>

              {/* `plain`, because each item carries its own check. Still a
                list: a screen reader should say "list, 5 items", and dropping
                to a <div> to lose a bullet is how that gets thrown away. */}
              <List variant="plain" size="sm">
                {plan.includes.map((line) => (
                  <ListItem key={line} icon={<CheckIcon size="sm" />}>
                    {line}
                  </ListItem>
                ))}
              </List>

              <CardFooter>
                <Button
                  variant={plan.featured ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                  trailingIcon={<ArrowRightIcon />}
                  asChild
                >
                  <a href="#/marketing/contact">Choose {plan.name}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <Heading as="h2" size="heading-md">
          What actually differs
        </Heading>
        <Card padding="md">
          {/* No ScrollArea: `Table` wraps itself in its own focusable scroll
              box, and a second one around it never scrolls. */}
          <Table surface="raised">
            <TableHeader>
              <TableRow>
                <TableHead sticky="start">Feature</TableHead>
                {PLANS.map((plan) => (
                  <TableHead key={plan.id}>{plan.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell sticky="start" nowrap>
                    {row.feature === 'Platform fee' ? (
                      <Popover>
                        {/* Anchored to the whole cell rather than to the
                              small button that opens it, so the panel lines up
                              with the row it explains instead of with a 24px
                              target at the end of it. */}
                        <PopoverAnchor asChild>
                          <Inline as="span" gap={1}>
                            Platform fee
                            <PopoverTrigger asChild>
                              <IconButton
                                aria-label="What the platform fee covers"
                                variant="ghost"
                                size="sm"
                              >
                                <span aria-hidden="true">?</span>
                              </IconButton>
                            </PopoverTrigger>
                          </Inline>
                        </PopoverAnchor>
                        <PopoverContent align="start" aria-label="What the platform fee covers">
                          <Stack gap={3} align="start">
                            <Stack gap={2}>
                              <Text size="sm">
                                Taken from a sale, never from a subscription. Payment processing
                                is charged separately by the processor and Aozora does not add
                                to it.
                              </Text>
                              <Text size="sm">
                                <Link href="#/marketing/contact">Ask about a studio rate</Link>
                              </Text>
                            </Stack>
                            <PopoverClose asChild>
                              <Button variant="ghost" size="sm">
                                Got it
                              </Button>
                            </PopoverClose>
                          </Stack>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      row.feature
                    )}
                  </TableCell>
                  <TableCell numeric>{row.sketch}</TableCell>
                  <TableCell numeric>{row.studio}</TableCell>
                  <TableCell numeric>{row.atelier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell sticky="start">Billed</TableCell>
                <TableCell>—</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>Monthly</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
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
