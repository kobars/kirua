import {
  AvatarStack,
  ArrowRightIcon,
  BookmarkIcon,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Chip,
  DotGrid,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  GridIcon,
  HeartIcon,
  IconButton,
  NavBar,
  SearchIcon,
  SendIcon,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stat,
  StatRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { CHARACTERS } from './characters';

const NAV_ITEMS = [
  { label: 'Home', href: '#home', current: true },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

const LIKERS = [{ name: 'Rin' }, { name: 'Kai' }, { name: 'Mio' }, { name: 'Sora' }];

/**
 * The reference hero, rebuilt from the design system as proof: no hard-coded hex
 * values anywhere in this file.
 *
 * Deliberate deviations from the Figma:
 *   1. The panel uses blue-600, not the measured blue-500 — white body copy on
 *      blue-500 is 3.65:1 and fails AA.
 *   2. Body line height 1.44, not the reference's 1.11.
 *   3. Killua artwork instead of the reference's AI art; see `characters.ts`.
 */
export function AnimeHero() {
  return (
    // `overflow-x-clip` (not `hidden`) contains the artwork that breaks past the
    // panel's right edge, without creating a scroll container that would clip
    // the vertical overhang too.
    <div className="min-h-screen overflow-x-clip bg-page p-4 md:p-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="flex min-w-0 items-center gap-3 md:gap-4">
          <NavBar aria-label="Main" items={NAV_ITEMS} className="min-w-0 flex-1" />

          <DotGrid rows={5} cols={5} className="hidden text-brand-vivid lg:block" />

          {/* [FIGMA] 70px, matching NavBar. Arbitrary so it cannot drift with --spacing. */}
          {/* oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes */}
          <div className="ctx-inverse flex h-[4.375rem] shrink-0 items-center gap-1 rounded-lg bg-page px-2 md:gap-2 md:px-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton aria-label="Search the gallery" variant="primary" size="md">
                  <SearchIcon />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Search the gallery</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton aria-label="Open menu" variant="ghost" size="md">
                  <GridIcon />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Browse</DropdownMenuLabel>
                <DropdownMenuItem>Chibi characters</DropdownMenuItem>
                <DropdownMenuItem>Digital comics</DropdownMenuItem>
                <DropdownMenuItem>Cartoon animations</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Marketplace</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* `z-raised` lifts this row above the cards below, so artwork that
            overhangs the panel's bottom edge is not painted over by them. */}
        <div className="relative z-raised grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)]">
          <div className="relative hidden min-h-[480px] lg:block">
            <img
              src={CHARACTERS.splatter.src}
              width={CHARACTERS.splatter.width}
              height={CHARACTERS.splatter.height}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-contain object-bottom"
            />
            <Chip
              className="absolute inset-e-0 top-[38%] shadow-raised"
              leading={<AvatarStack items={LIKERS} max={3} />}
            >
              +1M Like&apos;s
            </Chip>
            <Chip
              size="sm"
              className="absolute inset-s-0 bottom-[18%] shadow-raised"
              leading={<span className="size-5 rounded-pill bg-amber-500" aria-hidden="true" />}
            >
              @Dsingr
            </Chip>
          </div>

          {/* The artwork is set wider than the reserved 30% and pushed past the
              panel's right edge: the reference pose is a wide diagonal, so
              fitting it inside the reserved column would leave it small. */}
          <SpotlightPanel padding="lg" mediaWidth="30%" className="md:min-h-[480px]">
            <SpotlightMedia side="end" overhang="both" width="42%" className="inset-e-[-7%]">
              <img
                src={CHARACTERS.yoyo.src}
                width={CHARACTERS.yoyo.width}
                height={CHARACTERS.yoyo.height}
                alt=""
                className="size-full object-contain object-bottom"
              />
            </SpotlightMedia>

            <SpotlightContent className="max-w-176 gap-6">
              <h1 className="font-display text-display-md text-fg md:text-display-lg xl:text-display-xl">
                Bring your anime worlds to life
              </h1>

              <p className="font-text text-body-lg text-fg-secondary">
                Whether you create chibi characters, digital comics, or lively cartoon
                animations, we give you the tools to design, display, and sell your work
                beautifully.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="lg">
                  Start now
                </Button>
                <Button variant="secondary" size="lg" trailingIcon={<ArrowRightIcon />}>
                  Enroll Now
                </Button>
              </div>
            </SpotlightContent>

            {/* Hidden on phones, where the panel is short enough that it would
                collide with the buttons. */}
            <DotGrid
              rows={4}
              cols={4}
              className="absolute inset-s-8 bottom-8 z-raised hidden text-fg-muted md:block"
            />
          </SpotlightPanel>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* radius="lg" is the 22px corner measured on the reference's 380x280
              dark cards. Each card's glint faces the blue panel. */}
          <Card
            variant="dark"
            padding="lg"
            radius="lg"
            glint="top-end"
            className="justify-between"
          >
            <div className="flex flex-col gap-2">
              <CardEyebrow>Join our anime class</CardEyebrow>
              {/* h2 — the hero headline is the h1 and levels must not skip. */}
              <CardTitle as="h2" className="text-display-md">
                50% Off
              </CardTitle>
              <CardBody>
                Create, showcase, and sell your digital art and cartoon creations with ease.
              </CardBody>
            </div>
            <CardFooter className="justify-between">
              <Button
                variant="secondary"
                size="md"
                trailingIcon={<ArrowRightIcon />}
                className="min-w-40 justify-between"
              >
                Claim
              </Button>
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-6 w-9 rounded-xs bg-fg-muted" />
                <span className="size-6 rounded-pill bg-amber-500" />
                <span className="size-6 rounded-pill bg-blue-400" />
              </div>
            </CardFooter>
          </Card>

          <Card
            variant="dark"
            padding="lg"
            radius="lg"
            glint="top-start"
            className="justify-between"
          >
            <CardBody className="text-body-lg">
              We&apos;re a platform built for digital artists and cartoon creators who want to
              share their anime-inspired art with the world.
            </CardBody>
            <CardFooter>
              <StatRow>
                <Stat icon={<HeartIcon />} value="100k" label="Likes" />
                <Stat icon={<BookmarkIcon />} value="10k" label="Saves" />
                <Stat icon={<SendIcon />} value="20k" label="Shares" />
              </StatRow>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
