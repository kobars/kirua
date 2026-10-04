import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Eyebrow,
  Heading,
  List,
  ListItem,
  Section,
  Separator,
  Text,
  Timeline,
  TimelineItem,
  TimelineTime,
} from 'kirua';
import { MILESTONES, PRINCIPLES } from './data';

/**
 * The long-form page: real body copy.
 *
 * Everything else here is an application: labels, rows and controls. A story
 * page is paragraphs, and paragraphs are what the content primitives have to be
 * designed against rather than guessed at.
 */
export function StoryPage() {
  return (
    <Container width="3xl" pad="md">
      <Section>
        <Eyebrow>Our story</Eyebrow>
        <Heading as="h1" size="heading-lg">
          We built the thing we kept failing to do by hand
        </Heading>
        <Text size="lg">
          Aozora started as a shared spreadsheet between two illustrators, and it exists because
          that spreadsheet lost work. Not files — commissions. About one in ten briefs ended in
          a message nobody answered.
        </Text>
      </Section>

      <Separator />

      <Section gap="lg">
        <Heading as="h2" size="heading-md">
          How it began
        </Heading>
        <Text>
          In 2021 Mei was drawing chibi commissions in the evenings and Rangga was inking short
          comics. They took briefs in four places at once: two social inboxes, an email address
          and, occasionally, a message written on a phone screen and photographed. The
          spreadsheet was the attempt to put those four in one column, and it worked exactly as
          well as a spreadsheet does.
        </Text>
        <Text>
          What it could not do was tell an artist what was owed and by whom. That is the
          question every artist we have spoken to since asks first, and it is the question the
          first version of Aozora answered before it could do anything else.
        </Text>

        <Heading as="h3" size="heading-sm">
          What we kept from that year
        </Heading>
        <List>
          {PRINCIPLES.map((principle) => (
            <ListItem key={principle.title}>
              <Text inline tone="primary" weight="medium">
                {principle.title}.
              </Text>{' '}
              {principle.body}
            </ListItem>
          ))}
        </List>
      </Section>

      <Separator />

      <Section gap="lg">
        <Heading as="h2" size="heading-md">
          Four years, four changes
        </Heading>
        <Text>
          The list below is deliberately short. Most of what happened in between was
          maintenance, and a company history that reads like a changelog is a company history
          nobody finishes.
        </Text>

        <Timeline>
          {MILESTONES.map((milestone) => (
            <TimelineItem key={milestone.at}>
              <TimelineTime dateTime={milestone.at}>{milestone.when}</TimelineTime>
              <Text size="md" tone="primary" weight="medium">
                {milestone.what}
              </Text>
              <Text size="sm">{milestone.detail}</Text>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <Card variant="brand" padding="lg" glint={['top-start', 'bottom-end']}>
        <CardTitle as="h2">The part we will not change</CardTitle>
        <CardBody>
          An artist who leaves takes everything with them: full-resolution files, a documented
          manifest, and no account required to open either. We would rather be left easily than
          kept by friction.
        </CardBody>
      </Card>
    </Container>
  );
}
