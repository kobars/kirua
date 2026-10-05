import {
  AppBody,
  AppHeader,
  AppMain,
  AppShell,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Container,
  Grid,
  PageHeader,
  SparkleIcon,
  Wordmark,
} from '@kobars/kirua';
import { ThemeMenu } from './shared/ThemeMenu';
import { SECTIONS } from './sections';

/** The page at `#/`: what kirua is, and a way into each of the five sections. */
export function Hub() {
  return (
    <AppShell>
      <AppHeader width="6xl" actions={<ThemeMenu />}>
        <Wordmark href="#/" icon={<SparkleIcon />}>
          Kirua
        </Wordmark>
      </AppHeader>
      <AppBody width="6xl">
        <AppMain data-route="">
          <Container width="6xl" gap="lg" pad="lg">
            <PageHeader
              eyebrow="Examples"
              title="Five applications, one design system"
              description="Each section is a small application built only from kirua's components and their props. Pick one, then switch the theme and the night palette from the menu in its header."
              size="heading-lg"
            />
            <Grid md={2} lg={3} gap={4}>
              {SECTIONS.map((section) => (
                <Card key={section.id} padding="md">
                  <CardEyebrow>{section.kind}</CardEyebrow>
                  <CardTitle as="h2">{section.name}</CardTitle>
                  <CardBody>{section.summary}</CardBody>
                  <CardFooter>
                    <Button asChild variant="secondary">
                      <a href={`#/${section.id}/`}>Open {section.name}</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </Container>
        </AppMain>
      </AppBody>
    </AppShell>
  );
}
