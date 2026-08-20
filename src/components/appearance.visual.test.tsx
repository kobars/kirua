import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardBody, CardFooter, CardTitle } from './Card';
import { Chip } from './Chip';
import { NavBar } from './NavBar';
import { SpotlightContent, SpotlightPanel } from './SpotlightPanel';
import { Stat, StatRow } from './Stat';
import { HeartIcon, SparkleIcon } from './icons';

afterEach(cleanup);

/**
 * Fidelity to a reference design is this repository's whole premise — `[FIGMA]`
 * marks measured values precisely so they do not drift — and until now nothing
 * checked appearance at all. Behaviour and accessibility were asserted; a
 * padding that shifted by one step, a colour that resolved differently under a
 * surface context, an ornament drawn for the wrong radius: all invisible.
 *
 * **Local baselines, not a hosted service.** Reasoning in
 * `board/tasks/visual-regression.md`. The short version: continuous integration
 * is already deferred on cost, so a subscription would be paying for a gate
 * nothing runs automatically, and a PNG in the repository is reviewed in the
 * same diff as the change that moved it.
 *
 * One fixed width, and every surface context. Context is the axis worth
 * spending baselines on, because it is the axis where this system is unusual:
 * one `<Button variant="primary">` is meant to render as a blue pill on a page
 * and a white pill on the brand panel with no prop and no override, and nothing
 * else here can see that stop being true.
 */
const CONTEXTS = [
  ['page', 'bg-page'],
  ['brand', 'ctx-brand bg-brand'],
  ['inverse', 'ctx-inverse bg-page'],
  ['dark', 'dark bg-page'],
] as const;

function surface(contextClass: string, children: React.ReactNode) {
  return render(
    <div className={`${contextClass} inline-flex w-fit flex-col gap-4 p-8 text-fg`}>
      {children}
    </div>,
  ).firstElementChild as HTMLElement;
}

describe('controls, in every surface context', () => {
  it.each(CONTEXTS)('buttons on %s', async (name, contextClass) => {
    const element = surface(
      contextClass,
      <div className="flex items-center gap-3">
        <Button variant="primary">Enroll</Button>
        <Button variant="secondary" leadingIcon={<SparkleIcon />}>
          Explore
        </Button>
        <Button variant="ghost">Later</Button>
      </div>,
    );

    await expect(element).toMatchScreenshot(`buttons-${name}`);
  });

  it.each(CONTEXTS)('badges and chips on %s', async (name, contextClass) => {
    const element = surface(
      contextClass,
      <div className="flex items-center gap-3">
        <Badge status="success">Published</Badge>
        <Badge status="danger">Failed</Badge>
        <Chip variant="brand">+1M Likes</Chip>
        <StatRow>
          <Stat icon={<HeartIcon />} value="100k" label="Likes" />
        </StatRow>
      </div>,
    );

    await expect(element).toMatchScreenshot(`badges-${name}`);
  });
});

describe('surfaces', () => {
  it('a card carries its corner ornament at the measured radius', async () => {
    const element = surface(
      'bg-page',
      <Card variant="dark" padding="lg" radius="lg" glint="top-end" className="w-96">
        <CardTitle>Join our anime class</CardTitle>
        <CardBody>Two live sessions a week.</CardBody>
        <CardFooter>
          <Button variant="primary">Enroll</Button>
        </CardFooter>
      </Card>,
    );

    await expect(element).toMatchScreenshot('card-dark-glint');
  });

  it('the spotlight panel keeps its 32px corner and its blade', async () => {
    const element = surface(
      'bg-page',
      <SpotlightPanel className="w-160">
        <SpotlightContent className="gap-4">
          <h2 className="font-display text-display-md text-fg">Bring worlds to life</h2>
          <Button variant="primary">Start now</Button>
        </SpotlightContent>
      </SpotlightPanel>,
    );

    await expect(element).toMatchScreenshot('spotlight-panel');
  });

  it('the nav pill is 70px tall with a 22px corner', async () => {
    const element = surface(
      'bg-page',
      <NavBar
        className="w-160"
        items={[
          { label: 'Home', href: '#home', current: true },
          { label: 'Portfolio', href: '#portfolio' },
          { label: 'About', href: '#about' },
        ]}
      />,
    );

    await expect(element).toMatchScreenshot('nav-bar');
  });
});
