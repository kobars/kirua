import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Scanner } from '@tailwindcss/oxide';
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
/** Mirrors `NOT_SOURCES` in `tools/build-lib.mjs`. */
const NOT_SOURCES = ['lib/cn.js'];
const ROOT = path.join(REPO, 'node_modules/.tmp/kirua-package');
const DIST = path.join(ROOT, 'dist');

type Manifest = {
  name: string;
  module?: string;
  sideEffects?: unknown;
  main?: string;
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

/** The class candidates Tailwind's scanner finds in the given files, sorted. */
const candidatesOf = (list: string[]) =>
  new Scanner({})
    .scanFiles(list.map((file) => ({ content: read(file), extension: 'js' })))
    .sort();

/** The candidates a stylesheet lists in its one `@source inline("…")`. */
function inlined(sheet: string): string[] {
  const lists = [...sheet.matchAll(/@source\s+inline\("([^"]*)"\)/g)];
  expect(lists).toHaveLength(1);
  return (lists[0]?.[1] ?? '').split(' ').filter(Boolean);
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

  /**
   * Bundlers read `exports`; `module` is for tools that read only the
   * older entry fields and find nothing without it. There is no `main`:
   * pointing it at ESM would mislead a resolver that expects CommonJS.
   */
  it('names the ES entry as `module`, the same file as exports["."].import', () => {
    const entry = manifest.exports['.'];
    if (typeof entry !== 'object') throw new Error('exports["."] must name types and import');
    expect(manifest.module).toBe(entry.import);
    expect(manifest.main).toBeUndefined();
  });

  /**
   * `false`, not a list of the CSS files: no emitted module imports CSS, and a
   * stylesheet `@import`ed from CSS is not subject to the field. Without the
   * field a bundler keeps every module the barrel re-exports.
   * `tools/component-size.mjs` checks that no module does work on import,
   * which is what makes `false` true.
   */
  it('declares the package free of side effects', () => {
    expect(manifest.sideEffects).toBe(false);
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

  it('lists the class candidates of every emitted module in the stylesheet entry', () => {
    const entry = manifest.exports['./styles.css'];
    if (typeof entry !== 'string') throw new Error('exports["./styles.css"] must be a path');
    const emitted = files.filter(
      (f) =>
        f.endsWith('.js') &&
        /^(components|lib)\/[^/]+$/.test(path.relative(DIST, f)) &&
        !NOT_SOURCES.includes(path.relative(DIST, f)),
    );
    expect(inlined(read(path.join(ROOT, entry)))).toEqual(candidatesOf(emitted));
  });

  /**
   * Tailwind never follows an import, so a module's sources must hold the
   * candidates of every file it reaches. The reached files are walked here
   * from the module's own file, independently of the build's walk.
   *
   * `lib/cn.js` is the one file left out on purpose, by `NOT_SOURCES` in
   * `tools/build-lib.mjs`: it adds no class to any element, and its scale
   * names generated utilities nothing renders.
   */
  it('lists, per component module, the candidates of every file that module reaches', () => {
    const sources = path.join(DIST, 'sources');
    const modules = [
      ...read(path.join(DIST, 'components/index.js')).matchAll(
        /^import \{ [^}]+ \} from "\.\/([^"]+)\.js";$/gm,
      ),
    ]
      .map((m) => m[1] ?? '')
      .filter((name) => !name.endsWith('.variants'));
    expect(readdirSync(sources).sort()).toEqual(modules.map((name) => `${name}.css`).sort());

    const gaps: string[] = [];
    for (const name of modules) {
      const listed = new Set(inlined(read(path.join(sources, `${name}.css`))));
      const reached = new Set<string>();
      const visit = (file: string) => {
        if (reached.has(file) || NOT_SOURCES.includes(path.relative(DIST, file))) return;
        reached.add(file);
        for (const specifier of specifiers(read(file)).filter((s) => s.startsWith('.'))) {
          visit(path.resolve(path.dirname(file), specifier));
        }
      };
      visit(path.join(DIST, 'components', `${name}.js`));
      for (const file of reached) {
        for (const candidate of candidatesOf([file])) {
          if (!listed.has(candidate))
            gaps.push(`${name}: ${candidate} from ${path.relative(DIST, file)}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('leaves the files that are not class sources out of every stylesheet', () => {
    const others = new Set(
      candidatesOf(
        files.filter((f) => f.endsWith('.js') && !NOT_SOURCES.includes(path.relative(DIST, f))),
      ),
    );
    const only = candidatesOf(NOT_SOURCES.map((file) => path.join(DIST, file))).filter(
      (candidate) => !others.has(candidate),
    );
    expect(only.length).toBeGreaterThan(0);
    const sheets = [
      path.join(DIST, 'styles.css'),
      ...readdirSync(path.join(DIST, 'sources')).map((f) => path.join(DIST, 'sources', f)),
    ];
    for (const sheet of sheets) {
      const listed = new Set(inlined(read(sheet)));
      expect(only.filter((candidate) => listed.has(candidate))).toEqual([]);
    }
  });

  /**
   * Every `url()` in fonts.css must resolve to a file in the package, or a
   * consumer's bundler fails the build on it. The licenses travel with the
   * files they cover.
   */
  it('ships every font file fonts.css names, with both licenses', () => {
    const entry = manifest.exports['./fonts.css'];
    if (typeof entry !== 'string') throw new Error('exports["./fonts.css"] must be a path');
    const sheet = path.join(ROOT, entry);
    const urls = [...read(sheet).matchAll(/url\('([^']+)'\)/g)].map((m) => m[1] ?? '');
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(files).toContain(path.resolve(path.dirname(sheet), url));
    const fonts = path.join(DIST, 'styles/fonts');
    expect(read(path.join(fonts, 'OFL-Nunito.txt'))).toContain('SIL Open Font License');
    expect(read(path.join(fonts, 'LICENSE-LuckiestGuy.txt'))).toContain('Apache License');
  });

  it('keeps theme.css free of component sources', () => {
    const entry = manifest.exports['./theme.css'];
    if (typeof entry !== 'string') throw new Error('exports["./theme.css"] must be a path');
    expect(read(path.join(ROOT, entry))).not.toMatch(/@source/);
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

  /**
   * DirectionProvider writes a React context that each primitive reads from
   * its own copy of this package, so two copies are two contexts and the
   * provider silently stops reaching the components.
   *
   * Each primitive pins an exact version, and a consumer's install resolves
   * newer primitives than this lockfile holds. An exact pin here therefore
   * matched the repository and split every consumer: 0.4.0 asked for 1.1.4
   * while the primitives npm installed asked for 1.1.5, and a fresh install
   * held 12 copies. So the range is a caret, and its floor is the version the
   * primitives pin: npm keeps an installed copy that still satisfies the
   * range, so a floor below their pin left an upgrade from 0.4.0 on 1.1.4.
   * The primitives' own floors must pin that version too, or a consumer
   * whose lockfile holds a floor release gets the old copy beside the new.
   * `tools/consumer-install.mjs` installs the packed tarball, fresh and over
   * the previous release, and counts the copies a consumer actually gets.
   */
  it('asks for direction at the version every Radix primitive floor pins', () => {
    const ours = manifest.dependencies['@radix-ui/react-direction'] ?? '';
    const floor = /^\^(\d+\.\d+\.\d+)$/.exec(ours)?.[1];
    expect(floor, `expected a caret range, got ${ours}`).toBeDefined();
    const theirs = Object.keys(manifest.dependencies)
      .filter((name) => name.startsWith('@radix-ui/react-'))
      .flatMap((name) => {
        const pkg = JSON.parse(
          readFileSync(path.join(REPO, 'node_modules', name, 'package.json'), 'utf8'),
        ) as { version: string; dependencies?: Record<string, string> };
        const direction = pkg.dependencies?.['@radix-ui/react-direction'];
        return direction ? [{ name, floor: manifest.dependencies[name], pkg, direction }] : [];
      });

    expect(theirs.length).toBeGreaterThan(0);
    for (const { name, floor: range, pkg, direction } of theirs)
      expect({ name, range, direction }).toEqual({
        name,
        // The installed release is the floor, so its pin is the floor's pin.
        range: `^${pkg.version}`,
        direction: floor,
      });
  });

  it('pins each dependency to the version the repository builds against', () => {
    for (const [name, version] of Object.entries(manifest.dependencies)) {
      expect({ name, version }).toEqual({ name, version: root.dependencies[name] });
    }
  });
});
