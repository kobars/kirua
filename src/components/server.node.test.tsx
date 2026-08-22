import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as kirua from './index';

/**
 * The server-rendering guarantee, turned from a sentence into a check.
 *
 * `CLAUDE.md` claims this system prerenders static, server-renders dynamic, and
 * hydrates with a clean console — verified against one real Next.js 16 build,
 * on one day, by hand. It then names the three properties that keep the claim
 * true. Nothing checked any of them, and all three fail *silently* and land in
 * a consumer's build rather than in this one.
 *
 * This file runs in the `node` project, which is the only one with no browser.
 * That is not a limitation to work around — it is the assertion. `window` and
 * `document` genuinely do not exist here, so a component that reaches for one
 * during render throws rather than quietly working.
 */

const COMPONENTS_DIR = path.join(import.meta.dirname);
const SRC_DIR = path.join(COMPONENTS_DIR, '..');

describe('the barrel renders on a server', () => {
  /**
   * One composition rather than one test per component: the thing being
   * asserted is that *importing and rendering the public entry point* touches
   * no browser API, and a single tree exercises that as well as twenty would.
   *
   * The overlays are included closed. That is their server state — Radix
   * renders the trigger and nothing else until the client takes over — and it
   * is the state a prerender actually produces.
   */
  const tree = (
    <kirua.SpotlightPanel>
      <kirua.SpotlightContent>
        <kirua.NavBar
          items={[
            { label: 'Home', href: '#home', current: true },
            { label: 'About', href: '#about' },
          ]}
        />
        <kirua.Card variant="dark" glint="top-end">
          <kirua.CardEyebrow>Course</kirua.CardEyebrow>
          <kirua.CardTitle>Join our anime class</kirua.CardTitle>
          <kirua.CardBody>Two live sessions a week.</kirua.CardBody>
          <kirua.CardFooter>
            <kirua.Button variant="primary">Enroll</kirua.Button>
            <kirua.IconButton aria-label="Like">
              <kirua.HeartIcon />
            </kirua.IconButton>
          </kirua.CardFooter>
        </kirua.Card>
        <kirua.Badge status="success">Published</kirua.Badge>
        <kirua.Field controlId="server-email" label="Email">
          <kirua.Input type="email" />
        </kirua.Field>
        <kirua.Label htmlFor="server-name">Name</kirua.Label>
        <kirua.Input id="server-name" />
        <kirua.Label htmlFor="server-biography">Biography</kirua.Label>
        <kirua.Textarea id="server-biography" />
        <kirua.Chip variant="brand">+1M Likes</kirua.Chip>
        <kirua.StatRow>
          <kirua.Stat icon={<kirua.HeartIcon />} value="100k" label="Likes" />
        </kirua.StatRow>
        <kirua.AvatarStack
          items={[
            { name: 'Ana', src: '/a.png' },
            { name: 'Bo', src: '/b.png' },
          ]}
        />
        <kirua.DotGrid />
        <kirua.Tabs defaultValue="one">
          <kirua.TabsList>
            <kirua.TabsTrigger value="one">One</kirua.TabsTrigger>
            <kirua.TabsTrigger value="two">Two</kirua.TabsTrigger>
          </kirua.TabsList>
          <kirua.TabsContent value="one">First</kirua.TabsContent>
        </kirua.Tabs>
        <kirua.Dialog>
          <kirua.DialogTrigger>
            <kirua.Button>Open</kirua.Button>
          </kirua.DialogTrigger>
        </kirua.Dialog>
        <kirua.DropdownMenu>
          <kirua.DropdownMenuTrigger>
            <kirua.Button>Menu</kirua.Button>
          </kirua.DropdownMenuTrigger>
        </kirua.DropdownMenu>
      </kirua.SpotlightContent>
    </kirua.SpotlightPanel>
  );

  it('produces markup without touching a browser API', () => {
    expect(typeof globalThis.window).toBe('undefined');
    expect(typeof globalThis.document).toBe('undefined');

    const html = renderToStaticMarkup(tree);

    expect(html).toContain('Join our anime class');
    expect(html).toContain('data-slot="spotlight-panel"');
    expect(html).toContain('data-slot="button"');
  });

  /**
   * The `data-slot` contract is public API, so a server render that dropped it
   * would be a breaking change a consumer's selector notices before we do.
   */
  it('carries the data-slot hooks into the server markup', () => {
    const html = renderToStaticMarkup(tree);
    for (const slot of [
      'card',
      'badge',
      'field',
      'label',
      'input',
      'textarea',
      'chip',
      'nav-bar',
      'stat',
      'dot-grid',
    ]) {
      expect(html, `data-slot="${slot}" is missing from the server markup`).toContain(
        `data-slot="${slot}"`,
      );
    }
  });
});

/** Every `.ts`/`.tsx` file under a directory, recursively, excluding tests. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.tsx?$/.test(entry.name)) return [];
    if (/\.(test|stories)\.tsx?$/.test(entry.name)) return [];
    return [full];
  });
}

describe('no file declares a client boundary', () => {
  /**
   * `"use client"` must appear nowhere, and none is needed: the Radix packages
   * ship their own, so a wrapper file stays a Server Component and a `Card` in
   * an RSC costs a consumer zero JavaScript.
   *
   * A *directive*, not a mention. `grep` finds one hit today and it is a
   * sentence inside a JSDoc comment, so the naive check reports a failure that
   * is not one. A directive is only a directive at the top of the file, before
   * any statement — so that is where this looks.
   */
  it.each(sourceFiles(COMPONENTS_DIR).map((f) => [path.relative(SRC_DIR, f), f]))(
    '%s',
    (_label, file) => {
      const source = readFileSync(file, 'utf8');
      const withoutComments = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      const firstStatement = withoutComments.trim().split('\n')[0] ?? '';
      expect(firstStatement).not.toMatch(/^['"]use client['"]/);
    },
  );
});

describe('component source has no hydration escape hatch', () => {
  /**
   * The documented host theme script needs this prop on `<html>` because it
   * changes the class before React starts. A component using it would instead
   * hide exactly the mismatch this suite exists to expose.
   */
  it.each(sourceFiles(COMPONENTS_DIR).map((f) => [path.relative(SRC_DIR, f), f]))(
    '%s',
    (_label, file) => {
      expect(readFileSync(file, 'utf8')).not.toContain('suppressHydrationWarning');
    },
  );
});

/**
 * Follow every static import out of a file, and report the set reachable from a
 * root. Only static `import`/`export … from` edges — which is the right scope,
 * because those are exactly the edges a bundler follows into a consumer's
 * server build.
 */
function reachableFrom(entry: string): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];

  const resolve = (specifier: string, from: string): string | null => {
    let base: string;
    if (specifier.startsWith('@/')) base = path.join(SRC_DIR, specifier.slice(2));
    else if (specifier.startsWith('.')) base = path.resolve(path.dirname(from), specifier);
    else return null; // a package, not our source

    for (const candidate of [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      path.join(base, 'index.ts'),
      path.join(base, 'index.tsx'),
    ]) {
      try {
        if (readFileSync(candidate, 'utf8')) return candidate;
      } catch {
        continue;
      }
    }
    return null;
  };

  while (queue.length > 0) {
    const file = queue.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);

    const source = readFileSync(file, 'utf8');
    for (const [, specifier] of source.matchAll(
      /(?:^|\n)\s*(?:import|export)\s[\s\S]*?from\s+['"]([^'"]+)['"]/g,
    )) {
      const resolved = resolve(specifier as string, file);
      if (resolved) queue.push(resolved);
    }
  }

  return seen;
}

describe('the barrel does not reach a browser-only module', () => {
  const reachable = reachableFrom(path.join(COMPONENTS_DIR, 'index.ts'));

  /**
   * `src/lib/contrast.ts` reads computed styles out of the shipped CSS, so it
   * only works where a cascade exists. `CLAUDE.md` says it "must stay out of
   * `src/components/index.ts`" — and until now a written rule was the entire
   * mechanism. A rule guarded by memory is the same shape as the claim this
   * whole file exists to replace.
   */
  it('contrast.ts is not reachable from the public entry point', () => {
    const contrast = path.join(SRC_DIR, 'lib/contrast.ts');
    expect(reachable.has(contrast)).toBe(false);
  });

  /** The walker only proves an absence if it can also prove a presence. */
  it('the walker really follows edges, including the @/ alias', () => {
    expect(reachable.has(path.join(COMPONENTS_DIR, 'Button.tsx'))).toBe(true);
    expect(reachable.has(path.join(SRC_DIR, 'lib/cn.ts'))).toBe(true);
    expect(reachable.has(path.join(SRC_DIR, 'lib/glint.ts'))).toBe(true);
  });
});
