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
 *   `styles.css` entry that lists the class candidates in the emitted
 *   JavaScript. Beside it, `theme.css` (the token layers alone) and one
 *   `sources/<Module>.css` per component module, listing the class candidates
 *   in the files that module reaches, so a consumer can generate the classes
 *   of only the components they import.
 * - **Fonts**: `fonts.css` and the font files and licenses it points at, in
 *   `styles/fonts/`.
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
  cpSync,
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
import { Scanner } from '@tailwindcss/oxide';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const REPO = path.join(import.meta.dirname, '..');

/**
 * Emitted files that are never a Tailwind source. `lib/cn.js` holds
 * tailwind-merge's scale names and adds no class to any element, but its
 * strings still generate three utilities nothing renders, 0.09 to 0.55 kB
 * on a single module's stylesheet. Mirrored in `package.node.test.ts`.
 */
const NOT_SOURCES = ['lib/cn.js'];
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
        // Tailwind scans the emitted JS as text, so a class named in a JSDoc
        // example generated CSS nothing renders. The JSDoc stays in the
        // declarations, where editors read it; `@__PURE__` must stay for
        // the consumer's tree-shaking.
        comments: { legal: true, annotation: true, jsdoc: false },
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

/**
 * Every stylesheet that generates component classes lists them inline, as the
 * class candidates found in the files it covers, rather than naming the files.
 * With automatic source detection on, which is Tailwind's default, an
 * `@source` that names a file inside `node_modules` is widened to that file's
 * whole directory. A file list would then generate every component's classes,
 * plus utilities named only in the `.d.ts` comments beside them. The
 * candidates come from the scanner the Tailwind plugins use, so the generated
 * CSS is the same as scanning only those files.
 */
const unsafe = [];
function inlineSource(label, files) {
  const candidates = new Scanner({})
    .scanFiles(
      files
        .filter((file) => !NOT_SOURCES.includes(path.relative(OUT, file)))
        .map((file) => ({ content: readFileSync(file, 'utf8'), extension: 'js' })),
    )
    .sort();
  // `inline()` expands braces like a shell, and its argument is a CSS string,
  // where a double quote ends it and a backslash starts an escape.
  for (const candidate of candidates.filter((c) => /["{}\\]/.test(c))) {
    unsafe.push(`${label}: ${candidate}`);
  }
  return `@source inline("${candidates.join(' ')}");\n`;
}

mkdirSync(path.join(OUT, 'styles'), { recursive: true });
for (const sheet of readdirSync(path.join(SRC, 'styles')).filter((f) => f.endsWith('.css'))) {
  copyFileSync(path.join(SRC, 'styles', sheet), path.join(OUT, 'styles', sheet));
}
cpSync(path.join(SRC, 'styles', 'fonts'), path.join(OUT, 'styles', 'fonts'), {
  recursive: true,
});
const emitted = ['components', 'lib'].flatMap((dir) =>
  readdirSync(path.join(OUT, dir))
    .filter((file) => file.endsWith('.js'))
    .map((file) => path.join(OUT, dir, file)),
);
writeFileSync(
  path.join(OUT, 'styles.css'),
  `/* kirua: the token layers, the Tailwind theme and the component classes.
 * Import after \`tailwindcss\`. The fonts are in \`fonts.css\`. */
@import './styles/kirua.css';

${inlineSource('styles.css', emitted)}`,
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
 * Tailwind never follows an import, so each module's sources are its whole
 * closure: every emitted file it reaches through relative imports. `Dialog`
 * needs `Button`'s classes because it renders one.
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
  const reached = [...closure(path.join(OUT, 'components', `${name}.js`))];
  writeFileSync(
    path.join(OUT, 'sources', `${name}.css`),
    `/* The class candidates in the files ${name}.js reaches. */\n` +
      inlineSource(`sources/${name}.css`, reached),
  );
}
if (unsafe.length > 0) {
  throw new Error(
    `cannot write these candidates into @source inline():\n  ${unsafe.join('\n  ')}`,
  );
}

// The package keeps a NOTICE of its own, which covers only what the tarball holds.
if (!values.out) copyFileSync(path.join(REPO, 'LICENSE'), path.join(PACKAGE, 'LICENSE'));
