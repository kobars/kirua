import {
  Button,
  DotGrid,
  IconButton,
  NavBar,
  SearchIcon,
  SparkleIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'kirua';
import { ContactPage } from './ContactPage';
import { GuidePage } from './GuidePage';
import { HomePage } from './HomePage';
import { PricingPage } from './PricingPage';
import { StoryPage } from './StoryPage';
import { ThemeMenu } from '../shared/ThemeMenu';
import { EN } from '../shared/themeLabels';
import { useHashRoute } from '../shared/useHashRoute';

/** The one route table. `NavBar` takes `href`, so these are written as hashes. */
const ROUTES = [
  { route: '', label: 'Home' },
  { route: 'pricing', label: 'Pricing' },
  { route: 'story', label: 'Story' },
  { route: 'guide', label: 'Guide' },
  { route: 'contact', label: 'Contact' },
];

/**
 * A marketing site, which is the archetype the other four example apps are not:
 * anonymous, persuasive and typographic rather than signed in and task-oriented.
 *
 * That is why the black pill `NavBar` and the `SpotlightPanel` family live here.
 * They are the components the design system was reverse-engineered from, and
 * until this app existed the repository had no page that wanted them.
 */
export function App() {
  const [route] = useHashRoute('');

  const items = ROUTES.map((item) => ({
    label: item.label,
    href: `#/${item.route}`,
    current: item.route === route,
  }));

  return (
    <div className="min-h-dvh overflow-x-clip bg-page text-fg">
      <header className="mx-auto flex w-full max-w-7xl min-w-0 items-center gap-3 p-4 md:gap-4 md:px-8">
        <NavBar aria-label="Main" items={items} className="min-w-0 flex-1" />

        <DotGrid rows={5} cols={5} className="hidden text-brand-vivid xl:block" />

        {/* [FIGMA] 70px, matching NavBar's own height. Arbitrary so it cannot
            drift with --spacing. */}
        {/* oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes */}
        <div className="ctx-inverse flex h-[4.375rem] shrink-0 items-center gap-1 rounded-lg bg-page px-2 md:gap-2 md:px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Search the site" variant="ghost" size="md">
                <SearchIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Search the site</TooltipContent>
          </Tooltip>

          <ThemeMenu labels={EN} />

          <Button variant="primary" size="md" className="hidden sm:inline-flex" asChild>
            <a href="#/pricing">Start free</a>
          </Button>
        </div>
      </header>

      <main>
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
      </main>

      <footer className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] gap-4 px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-subtle pt-6">
          <span className="flex items-center gap-2 text-body-md font-semibold text-fg [--icon-size:var(--icon-lg)]">
            <SparkleIcon aria-hidden="true" className="text-fg-accent" />
            Aozora
          </span>
          <span className="flex-1" />
          <p className="text-body-sm text-fg-secondary">
            An example application. Every pixel comes from the kirua design system.
          </p>
        </div>
      </footer>
    </div>
  );
}
