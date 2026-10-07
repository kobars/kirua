#!/usr/bin/env node
/**
 * What importing one component from `@kobars/kirua` costs a consumer:
 * tree-shaken, minified and gzipped, measured on the package output in
 * `packages/kirua/dist` rather than on any application.
 *
 *     pnpm size:components                       # build the package, then measure
 *     node tools/component-size.mjs --dist <dir> # measure a package built elsewhere
 *
 * Each family is one source module of the barrel — `Dialog` is every export of
 * `Dialog.js` — and is bundled alone, with Vite in library mode and its own
 * minifier, from an entry that re-exports those names from `index.js`. Two
 * figures:
 *
 * - **kirua only**: every npm package stays outside the bundle. What this
 *   package adds by itself.
 * - **with dependencies**: only React and ReactDOM stay outside, because a
 *   consumer already ships them. What the first import really costs.
 *
 * ## It reports sizes and fails on tree-shaking
 *
 * A component that legitimately grows must not break the build, so no size is
 * a limit. What does fail is the property every size here depends on: a
 * family imported through the barrel must reach exactly the modules it reaches
 * when imported from its own file. Compared as module lists, not bytes —
 * the two bundles of `Button` are byte-identical but in a different order, and
 * gzip alone put 123 bytes between them.
 *
 * The stylesheet is measured once, because it does not depend on what is
 * imported: `styles.css` names every emitted component as a Tailwind source.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';

const REPO = path.join(import.meta.dirname, '..');
const { values } = parseArgs({ options: { dist: { type: 'string' } } });
const DIST = path.resolve(values.dist ?? path.join(REPO, 'packages/kirua/dist'));
const INDEX = path.join(DIST, 'components/index.js');

/** The peers a consumer already ships. `react/jsx-runtime` is part of `react`. */
const isPeer = (id) => /^(react|react-dom)(\/|$)/.test(id);
const isBare = (id) => !/^(\.|\/|\0)/.test(id) && !path.isAbsolute(id);
const ENTRY = 'virtual:size-entry';

let barrel;
try {
  barrel = readFileSync(INDEX, 'utf8');
} catch {
  console.error(`component-size: no package found at ${DIST}. Run \`pnpm build:lib\` first.`);
  process.exit(1);
}

const COMPONENT_IMPORT = /^import \{ ([^}]+) \} from "\.\/([^"]+)\.js";$/;
/** The constants and helpers in `lib/` are a few hundred bytes and not a component. */
const LIB_IMPORT = /^import \{ [^}]+ \} from "\.\.\/lib\/[^"]+\.js";$/;

/** `import { Card, CardTitle } from "./Card.js"` → `{ name: 'Card', exports: [...] }`. */
const families = barrel
  .split('\n')
  .map((line) => line.match(COMPONENT_IMPORT))
  .filter(Boolean)
  .map(([, names, name]) => ({ name, exports: names.split(', ') }))
  // A `*Variants` definition is measured inside the component that uses it.
  .filter((family) => !family.name.endsWith('.variants'));

/**
 * Imports read together, because the README states what they cost together:
 * `cn()` and the Radix packages they share are paid once.
 */
const COMBINATIONS = [
  ['Button', 'Card', 'Dialog'],
  ['Dialog', 'Sheet', 'AlertDialog'],
];

// A line neither pattern reads would drop a family from the table while the
// gate still passed — an import printed over two lines, say.
const unread = barrel
  .split('\n')
  .filter((line) => line.startsWith('import'))
  .filter((line) => !COMPONENT_IMPORT.test(line) && !LIB_IMPORT.test(line));

async function bundle(entry, { kiruaOnly }) {
  const [result] = await build({
    configFile: false,
    root: REPO,
    logLevel: 'silent',
    publicDir: false,
    plugins: [
      {
        name: 'size-entry',
        enforce: 'pre',
        resolveId: (id) => (id.endsWith(ENTRY) ? `\0${ENTRY}` : null),
        load: (id) => (id === `\0${ENTRY}` ? entry : null),
      },
    ],
    build: {
      write: false,
      minify: true,
      target: 'es2022',
      lib: { entry: ENTRY, formats: ['es'], fileName: 'entry' },
      rolldownOptions: {
        external: (id) => isPeer(id) || (kiruaOnly && isBare(id) && !id.endsWith(ENTRY)),
      },
    },
  });
  const chunks = result.output.filter((item) => item.type === 'chunk');
  const code = chunks.map((chunk) => chunk.code).join('');
  const modules = chunks
    .flatMap((chunk) => chunk.moduleIds)
    .filter((id) => !id.startsWith('\0'));
  return { gzip: gzipSync(code).byteLength, modules };
}

/** `…/node_modules/.pnpm/x/node_modules/@radix-ui/react-slot/dist/index.mjs` → `@radix-ui/react-slot`. */
function packages(modules) {
  const names = modules
    .map((id) => id.match(/.*node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1])
    .filter(Boolean);
  return [...new Set(names)];
}

const reexport = (names, from) =>
  `export { ${names.join(', ')} } from ${JSON.stringify(from)};`;
const kb = (bytes) => `${(bytes / 1000).toFixed(2)} kB`;

if (families.length === 0) {
  // An empty match reports every family as fine, which is the worst way for this to break.
  console.error(`component-size: found no component module in ${INDEX}.`);
  process.exit(1);
}

/** What makes the measurement itself untrustworthy, as opposed to a tree-shaking failure. */
const broken = unread.map((line) => `${path.relative(REPO, INDEX)}: cannot read \`${line}\``);
const failures = [];
const rows = [];
for (const family of families) {
  const viaBarrel = reexport(family.exports, INDEX);
  const own = await bundle(viaBarrel, { kiruaOnly: true });
  const all = await bundle(viaBarrel, { kiruaOnly: false });
  const file = path.join(DIST, `components/${family.name}.js`);
  const direct = await bundle(reexport(family.exports, file), { kiruaOnly: false });

  const extra = all.modules.filter((id) => !direct.modules.includes(id));
  if (extra.length > 0) {
    const named = extra.slice(0, 3).map((id) => path.relative(REPO, id));
    failures.push(
      `${family.name}: through the barrel it also reaches ${extra.length} more modules, ` +
        `starting with ${named.join(', ')}`,
    );
  }
  rows.push({
    family: family.name,
    own: own.gzip,
    all: all.gzip,
    packages: packages(all.modules),
  });
}

const floor = await bundle(
  `export { cn } from ${JSON.stringify(path.join(DIST, 'lib/cn.js'))};`,
  { kiruaOnly: false },
);

/** Both figures for one entry, as one row of the second table. */
async function both(entry) {
  const own = await bundle(entry, { kiruaOnly: true });
  const all = await bundle(entry, { kiruaOnly: false });
  return { 'kirua only': kb(own.gzip), 'with dependencies': kb(all.gzip) };
}

const together = {};
for (const names of COMBINATIONS) {
  const exports = names.flatMap((name) => {
    const family = families.find((candidate) => candidate.name === name);
    if (!family) broken.push(`COMBINATIONS names ${name}, which is not a family`);
    return family?.exports ?? [];
  });
  together[names.join(' + ')] = await both(reexport(exports, INDEX));
}
together['every export'] = await both(`export * from ${JSON.stringify(INDEX)};`);

rows.sort((a, b) => b.all - a.all);
console.table(
  Object.fromEntries(
    rows.map((row) => [
      row.family,
      {
        'kirua only': kb(row.own),
        'with dependencies': kb(row.all),
        'npm packages': row.packages.length,
      },
    ]),
  ),
);
console.log(
  `\nEvery family above includes cn() — clsx and tailwind-merge — once: ${kb(floor.gzip)} gzip.\n`,
);
console.table(together);

// The stylesheet, compiled the way a consumer's two `@import`s compile it.
const CSS_ROOT = path.join(REPO, 'node_modules/.tmp/kirua-size');
mkdirSync(CSS_ROOT, { recursive: true });
writeFileSync(
  path.join(CSS_ROOT, 'consumer.css'),
  `@import 'tailwindcss';\n@import ${JSON.stringify(path.join(DIST, 'styles.css'))};\n@source not '.';\n`,
);
const css = await build({
  configFile: false,
  root: CSS_ROOT,
  logLevel: 'silent',
  publicDir: false,
  plugins: [tailwindcss()],
  build: {
    write: false,
    cssMinify: true,
    rolldownOptions: { input: path.join(CSS_ROOT, 'consumer.css') },
  },
});
const sheet = css.output.find(
  (item) => item.type === 'asset' && item.fileName.endsWith('.css'),
);
if (!sheet) {
  broken.push('styles.css: compiling it emitted no stylesheet — the check found nothing');
} else {
  console.log(
    `styles.css, whatever is imported: ${kb(gzipSync(sheet.source).byteLength)} gzip ` +
      '(it names every component as a Tailwind source).',
  );
}

if (broken.length > 0) {
  console.error('\ncomponent-size: the measurement cannot be trusted.\n');
  for (const problem of broken) console.error(`  - ${problem}`);
}
if (failures.length > 0) {
  console.error('\ncomponent-size: tree-shaking through the barrel is broken.\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    '\nA module the barrel reaches is no longer dropped when unused. Look for a\n' +
      'top-level side effect, or a `sideEffects` change in packages/kirua/package.json.\n',
  );
}
if (broken.length > 0 || failures.length > 0) process.exit(1);
console.log('component-size: every family tree-shakes through the barrel.');
