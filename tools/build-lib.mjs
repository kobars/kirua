#!/usr/bin/env node
/**
 * Builds the publishable package `@kobars/kirua` into `packages/kirua/dist`.
 *
 * - **JavaScript**: Vite library mode from the barrel, one ES module per source
 *   module. Every bare import stays external, so a consumer's bundler
 *   tree-shakes per component and each Radix package keeps its own
 *   `"use client"` boundary. With preserved modules, Rolldown keeps a source
 *   module's own directive at the top of its output file, so the few client
 *   modules stay client modules; the package test reads each one back.
 * - **Declarations**: `tsc -p tsconfig.lib.json`. TypeScript leaves `paths`
 *   specifiers as written, so every `@/` and every relative specifier is then
 *   rewritten to a relative `.js` path, which resolves under both `bundler`
 *   and `nodenext` module resolution.
 * - **Styles**: the token layers, copied as Tailwind source CSS, and a
 *   `styles.css` entry that names the emitted JavaScript as a Tailwind source.
 *   Beside it, `theme.css` (the token layers alone) and one `sources/<Module>.css`
 *   per component module, naming the files that module reaches, so a consumer
 *   can generate the classes of only the components they import.
 *
 * Only what the barrel reaches is emitted. Stories, tests and the browser-only
 * contrast module are never imported by it.
 *
 *     node tools/build-lib.mjs              # into packages/kirua/dist
 *     node tools/build-lib.mjs --out <dir>  # elsewhere; the package folder is untouched
 */
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const REPO = path.join(import.meta.dirname, '..');
const SRC = path.join(REPO, 'src');
const PACKAGE = path.join(REPO, 'packages/kirua');

const { values } = parseArgs({ options: { out: { type: 'string' } } });
const OUT = path.resolve(values.out ?? path.join(PACKAGE, 'dist'));

/** A bare specifier names a package; `@/` and relative paths are this repo's own modules. */
const isBare = (id) => !/^(\.|\/|@\/|\0)/.test(id) && !path.isAbsolute(id);

function files(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files(full, out);
    else out.push(full);
  }
  return out;
}

rmSync(OUT, { recursive: true, force: true });

await build({
  configFile: false,
  root: REPO,
  logLevel: 'warn',
  publicDir: false,
  plugins: [react()],
  resolve: { alias: { '@': SRC } },
  build: {
    outDir: OUT,
    emptyOutDir: true,
    copyPublicDir: false,
    // Modern ES output; the consumer's bundler applies its own browser targets.
    target: 'es2022',
    minify: false,
    lib: { entry: path.join(SRC, 'components/index.ts'), formats: ['es'] },
    rolldownOptions: {
      external: isBare,
      output: {
        preserveModules: true,
        preserveModulesRoot: SRC,
        entryFileNames: '[name].js',
      },
    },
  },
});

execFileSync(
  process.execPath,
  [
    path.join(REPO, 'node_modules/typescript/bin/tsc'),
    '-p',
    'tsconfig.lib.json',
    '--outDir',
    OUT,
  ],
  { cwd: REPO, stdio: 'inherit' },
);

/** `@/lib/cn` or `./Button` → `../lib/cn.js` or `./Button.js`, relative to `from`. */
function rewriteSpecifier(specifier, from) {
  if (isBare(specifier)) return specifier;
  const target = specifier.startsWith('@/')
    ? path.join(OUT, specifier.slice(2))
    : path.resolve(path.dirname(from), specifier.replace(/\.js$/, ''));
  const resolved = [`${target}.d.ts`, path.join(target, 'index.d.ts')].find(existsSync);
  if (!resolved) throw new Error(`${path.relative(OUT, from)}: cannot resolve '${specifier}'`);
  const relative = path.relative(path.dirname(from), resolved).replace(/\.d\.ts$/, '.js');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'"]+)\2/g;
for (const file of files(OUT).filter((f) => f.endsWith('.d.ts'))) {
  const text = readFileSync(file, 'utf8');
  const rewritten = text.replace(
    SPECIFIER,
    (_, lead, quote, specifier) =>
      `${lead}${quote}${rewriteSpecifier(specifier, file)}${quote}`,
  );
  if (rewritten !== text) writeFileSync(file, rewritten);
}

mkdirSync(path.join(OUT, 'styles'), { recursive: true });
for (const sheet of readdirSync(path.join(SRC, 'styles')).filter((f) => f.endsWith('.css'))) {
  copyFileSync(path.join(SRC, 'styles', sheet), path.join(OUT, 'styles', sheet));
}
writeFileSync(
  path.join(OUT, 'styles.css'),
  `/* kirua: the token layers, the Tailwind theme and the component sources.
 * Import after \`tailwindcss\`. The fonts are loaded by the host page. */
@import './styles/kirua.css';

@source './components/*.js';
@source './lib/*.js';
`,
);

writeFileSync(
  path.join(OUT, 'theme.css'),
  `/* kirua: the token layers and the Tailwind theme, with no component sources.
 * Import after \`tailwindcss\`, then one \`sources/<Module>.css\` per component
 * module you use. \`styles.css\` is this file plus every module. */
@import './styles/kirua.css';
`,
);

/**
 * Tailwind finds classes by reading files as text and never follows an import,
 * so each module's sources are its whole closure: every emitted file it
 * reaches through relative imports. `Dialog` needs `Button`'s classes because
 * it renders one.
 */
// `import "../lib/radius.js"` has no `from`: the build inlines a constant and
// keeps the bare import, and that file is still reached.
const RELATIVE_IMPORT = /^(?:import|export)\s(?:[^;]*?\bfrom\s*)?"(\.{1,2}\/[^"]+)"/gm;
function closure(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const [, specifier] of readFileSync(file, 'utf8').matchAll(RELATIVE_IMPORT)) {
    closure(path.resolve(path.dirname(file), specifier), seen);
  }
  return seen;
}
mkdirSync(path.join(OUT, 'sources'), { recursive: true });
const barrel = readFileSync(path.join(OUT, 'components/index.js'), 'utf8');
for (const [, name] of barrel.matchAll(/^import \{ [^}]+ \} from "\.\/([^"]+)\.js";$/gm)) {
  if (name.endsWith('.variants')) continue;
  const reached = [...closure(path.join(OUT, 'components', `${name}.js`))]
    .map((file) => path.relative(path.join(OUT, 'sources'), file))
    .sort();
  writeFileSync(
    path.join(OUT, 'sources', `${name}.css`),
    `/* The files ${name}.js reaches, for Tailwind to scan. */\n` +
      reached.map((file) => `@source '${file}';\n`).join(''),
  );
}

// The package keeps a NOTICE of its own, which covers only what the tarball holds.
if (!values.out) copyFileSync(path.join(REPO, 'LICENSE'), path.join(PACKAGE, 'LICENSE'));
