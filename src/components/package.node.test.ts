import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import * as barrel from './index';

/**
 * The published package, built and read back.
 *
 * The build writes inside `node_modules` so that importing the emitted
 * JavaScript resolves React and Radix exactly as a consumer's install would,
 * with no bundler in between. Its `package.json` carries the real name and
 * exports map, so the package can resolve itself by name as a consumer would.
 */

const REPO = path.join(import.meta.dirname, '../..');
const ROOT = path.join(REPO, 'node_modules/.tmp/kirua-package');
const DIST = path.join(ROOT, 'dist');

type Manifest = {
  name: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  exports: Record<string, string | { types: string; import: string; default: string }>;
};
const manifest = JSON.parse(
  readFileSync(path.join(REPO, 'packages/kirua/package.json'), 'utf8'),
) as Manifest;
const root = JSON.parse(readFileSync(path.join(REPO, 'package.json'), 'utf8')) as Manifest;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

let files: string[] = [];
const code = () => files.filter((f) => f.endsWith('.js') || f.endsWith('.d.ts'));
const read = (file: string) => readFileSync(file, 'utf8');

/** Every module specifier in a file: static imports and re-exports, and `import()` types. */
function specifiers(text: string): string[] {
  const found: string[] = [];
  for (const pattern of [
    /^(?:import|export)\s[^;]*?\bfrom\s*(['"])([^'"]+)\1/gm,
    /^import\s*(['"])([^'"]+)\1/gm,
    /\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
  ]) {
    for (const match of text.matchAll(pattern)) found.push(match[2] ?? '');
  }
  return found;
}

/** `@radix-ui/react-slot/x` → `@radix-ui/react-slot`, `react/jsx-runtime` → `react`. */
const packageName = (specifier: string) =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/');

beforeAll(() => {
  rmSync(ROOT, { recursive: true, force: true });
  mkdirSync(ROOT, { recursive: true });
  writeFileSync(
    path.join(ROOT, 'package.json'),
    JSON.stringify({ name: manifest.name, type: 'module', exports: manifest.exports }),
  );
  execFileSync(process.execPath, [path.join(REPO, 'tools/build-lib.mjs'), '--out', DIST], {
    cwd: REPO,
    stdio: 'pipe',
  });
  files = walk(DIST);
}, 180_000);

describe('the published package', () => {
  it('leaves no `@/` alias in any emitted module or declaration', () => {
    const offenders = code().filter((file) =>
      specifiers(read(file)).some((s) => s.startsWith('@/')),
    );
    expect(offenders.map((f) => path.relative(DIST, f))).toEqual([]);
  });

  it('exports every value the barrel exports', async () => {
    const entry = manifest.exports['.'];
    if (typeof entry !== 'object') throw new Error('exports["."] must name types and import');
    const built = (await import(pathToFileURL(path.join(ROOT, entry.import)).href)) as Record<
      string,
      unknown
    >;
    expect(Object.keys(built).sort()).toEqual(Object.keys(barrel).sort());
  });

  it('ships declarations beside the entry', () => {
    const entry = manifest.exports['.'];
    if (typeof entry !== 'object') throw new Error('exports["."] must name types and import');
    expect(files).toContain(path.join(ROOT, entry.types));
  });

  it('contains no story, test, or module the barrel does not reach', () => {
    const relative = files.map((f) => path.relative(DIST, f));
    expect(
      relative.filter((f) =>
        /\.(stories|test)\.|(^|\/)contrast\.|^(board|patterns|foundations)\//.test(f),
      ),
    ).toEqual([]);
  });

  /**
   * Jest and Node's `require(esm)` resolve with the `require` and `default`
   * conditions, never `import`, so an exports map without `default` reads to
   * them as a package with no entry point.
   */
  it('resolves for a require-based resolver as well', () => {
    const entry = manifest.exports['.'];
    if (typeof entry !== 'object') throw new Error('exports["."] must name types and import');
    const require = createRequire(path.join(ROOT, 'package.json'));
    expect(require.resolve(manifest.name)).toBe(path.join(ROOT, entry.import));
  });

  /**
   * The source names its client modules in `server.node.test.tsx`; this checks
   * the directive survived the build into exactly those files and no other.
   */
  it('carries a "use client" directive in exactly the client modules', () => {
    const marked = files
      .filter((f) => f.endsWith('.js'))
      .filter((f) => /^\s*['"]use client['"]/.test(read(f)))
      .map((f) => path.relative(DIST, f))
      .sort();
    expect(marked).toEqual([
      'components/Calendar.js',
      'components/Combobox.js',
      'components/DatePicker.js',
    ]);
  });

  /**
   * Tailwind scans the emitted JavaScript, where the compiler prints every
   * string in double quotes. A class written with a double-quoted value, such
   * as `aria-[current="page"]`, arrives escaped as `aria-[current=\"page\"]`,
   * which is a different class: the rule is generated for a name nothing
   * renders. Unquoted (`aria-[current=page]`) or single-quoted values survive.
   */
  it('emits no class name with an escaped quote', () => {
    const offenders = files
      .filter((f) => f.endsWith('.js'))
      .flatMap((f) =>
        [...read(f).matchAll(/[\w-]-\[[^\s\]]*\\"[^\s]*/g)].map(
          (m) => `${path.relative(DIST, f)}: ${m[0]}`,
        ),
      );
    expect(offenders).toEqual([]);
  });

  it('names every Tailwind source the stylesheet entry points at', () => {
    const entry = manifest.exports['./styles.css'];
    if (typeof entry !== 'string') throw new Error('exports["./styles.css"] must be a path');
    const sheet = read(path.join(ROOT, entry));
    const sources = [...sheet.matchAll(/@source\s+'([^']+)'/g)].map((m) => m[1] ?? '');
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) {
      const dir = path.join(path.dirname(path.join(ROOT, entry)), path.dirname(source));
      expect(readdirSync(dir).some((f) => f.endsWith('.js'))).toBe(true);
    }
  });

  it('depends on exactly the packages its modules import', () => {
    const imported = new Set(
      code()
        .flatMap((file) => specifiers(read(file)))
        .filter((s) => !s.startsWith('.'))
        .map(packageName),
    );
    const peers = Object.keys(manifest.peerDependencies);
    const needed = [...imported].filter((name) => !peers.includes(name)).sort();
    expect(Object.keys(manifest.dependencies).sort()).toEqual(needed);
    expect(imported.has('react')).toBe(true);
  });

  /**
   * A utility newer than the peer floor generates no CSS on the older Tailwind
   * and nothing reports it, so the floor follows the minor the repository
   * builds with: `inset-s-*` needs 4.2 and `scrollbar-none` needs 4.3.
   */
  it('asks for the Tailwind minor the repository builds with', () => {
    const minor = (range: string | undefined) =>
      /^\^?(\d+)\.(\d+)/
        .exec(range ?? '')
        ?.slice(1, 3)
        .map(Number) ?? [];
    expect(minor(manifest.peerDependencies.tailwindcss)).toEqual(
      minor(root.devDependencies.tailwindcss),
    );
  });

  it('pins each dependency to the version the repository builds against', () => {
    for (const [name, version] of Object.entries(manifest.dependencies)) {
      expect({ name, version }).toEqual({ name, version: root.dependencies[name] });
    }
  });
});
