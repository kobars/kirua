import {
  AppMain,
  AppShell,
  Button,
  Container,
  DotGrid,
  IconButton,
  Inline,
  NavBar,
  NavBarLink,
  SearchIcon,
  Separator,
  SparkleIcon,
  Split,
  Stack,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Visible,
  Wordmark,
} from 'kirua';
import { ContactPage } from './ContactPage';
import { GuidePage } from './GuidePage';
import { HomePage } from './HomePage';
import { PricingPage } from './PricingPage';
import { StoryPage } from './StoryPage';
import { ThemeMenu } from '../shared/ThemeMenu';
import { useHashRoute } from '../shared/useHashRoute';

/** The one route table. Each `NavBarLink` takes `href`, so these are written as hashes. */
const ROUTES = [
  { route: '', label: 'Home' },
  { route: 'pricing', label: 'Pricing' },
  { route: 'story', label: 'Story' },
  { route: 'guide', label: 'Guide' },
  { route: 'contact', label: 'Contact' },
];

/**
 * A marketing site, which is the archetype the other four sections are not:
 * anonymous, persuasive and typographic rather than signed in and task-oriented.
 *
 * That is why the black pill `NavBar` and the `SpotlightPanel` family live here.
 * They are the components the design system was reverse-engineered from, and
 * this is the section whose pages want them.
 */
export function App() {
  const [route] = useHashRoute('marketing', '');

  return (
    <AppShell>
      <Stack as="header" gap={0}>
        <Container width="7xl" pad="xs">
          <Split layout="fit-end" from="base" align="center" gap={4}>
            {/* The site's controls sit inside the pill, which sets `ctx-inverse`
              for them, so the primary button renders as the white pill. */}
            <NavBar
              aria-label="Main"
              actions={
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconButton aria-label="Search the site" variant="ghost" size="md">
                        <SearchIcon />
                      </IconButton>
                    </TooltipTrigger>
                    <TooltipContent>Search the site</TooltipContent>
                  </Tooltip>

                  <ThemeMenu />

                  <Visible from="sm">
                    <Button variant="primary" size="md" asChild>
                      <a href="#/marketing/pricing">Start free</a>
                    </Button>
                  </Visible>
                </>
              }
            >
              {ROUTES.map((item) => (
                <NavBarLink
                  key={item.route}
                  href={`#/marketing/${item.route}`}
                  current={item.route === route}
                >
                  {item.label}
                </NavBarLink>
              ))}
            </NavBar>
            <Visible from="xl">
              <DotGrid rows={5} cols={5} tone="brand" />
            </Visible>
          </Split>
        </Container>
      </Stack>

      <AppMain>
        {route === 'pricing' ? (
          <PricingPage />
        ) : route === 'story' ? (
          <StoryPage />
        ) : route === 'guide' ? (
          <GuidePage />
        ) : route === 'contact' ? (
          <ContactPage />
        ) : (
          <HomePage />
        )}
      </AppMain>

      <Stack as="footer" gap={0}>
        <Container width="7xl" gap="md" pad="lg">
          <Separator />
          <Inline wrap justify="between" gap={2}>
            <Wordmark icon={<SparkleIcon />}>Aozora</Wordmark>
            <Text size="sm">
              An example application. Every pixel comes from the kirua design system.
            </Text>
          </Inline>
        </Container>
      </Stack>
    </AppShell>
  );
}
