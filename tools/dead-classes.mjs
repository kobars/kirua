#!/usr/bin/env node
/**
 * Fails when a component names a utility class that Tailwind does not generate.
 *
 * A misspelt class is silent. It stays in the markup, no tool objects, and the
 * declaration it was meant to produce is simply absent — so the component
 * renders, and renders wrong. `inset-block-0` is such a class: it is not a
 * Tailwind utility, so a sheet's `position: fixed` gets no offsets and the
 * panel sits at its static position, thousands of pixels down a long page.
 *
 * Tailwind itself is the authority here, not a list of prefixes: every
 * candidate token is written into a probe stylesheet, compiled against this
 * project's own entry point, and reported if it produces no rule. Custom
 * `@utility` rules and theme scales therefore resolve exactly as they do in a
 * real build.
 *
 *     node tools/dead-classes.mjs
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const REPO = path.join(import.meta.dirname, '..');
const ROOTS = ['src/components', 'src/patterns', 'src/board', 'examples'];

/**
 * The CLI brings its own compiler as an exact dependency, so it decides which
 * utilities exist. It is a pinned devDependency, run from this install rather
 * than fetched, and it must match the `tailwindcss` the build compiles with:
 * a newer one would pass a utility the build never generates.
 */
const version = (name) =>
  JSON.parse(readFileSync(path.join(REPO, 'node_modules', name, 'package.json'), 'utf8'))
    .version;
const CLI = path.join(REPO, 'node_modules/.bin/tailwindcss');
if (version('@tailwindcss/cli') !== version('tailwindcss')) {
  console.error(
    `dead-classes: @tailwindcss/cli ${version('@tailwindcss/cli')} does not match tailwindcss ${version('tailwindcss')}. Pin both to the same version.`,
  );
  process.exit(1);
}

/** Every `.ts`/`.tsx` under the roots, minus tests and stories. */
function sources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sources(full, out);
    else if (/\.tsx?$/.test(full) && !/\.(test|stories)\./.test(full)) out.push(full);
  }
  return out;
}

/** The character ranges of every `cn(...)` and `cva(...)` call. */
function callRanges(source) {
  const ranges = [];
  for (const match of source.matchAll(/\b(cn|cva)\(/g)) {
    let depth = 0;
    for (let i = match.index + match[0].length - 1; i < source.length; i += 1) {
      if (source[i] === '(') depth += 1;
      else if (source[i] === ')') {
        depth -= 1;
        if (depth === 0) {
          ranges.push([match.index, i]);
          break;
        }
      }
    }
  }
  return ranges;
}

/**
 * The character ranges of every `defaultVariants: { … }` object.
 *
 * Its values are variant *names*, not class lists. Most names have no hyphen
 * and would be skipped anyway; `Heading`'s are the type scale's own step
 * names, so `defaultVariants: { size: 'heading-md' }` looks exactly like a
 * class that generates nothing.
 */
function defaultVariantRanges(source) {
  const ranges = [];
  for (const match of source.matchAll(/\bdefaultVariants\s*:\s*\{/g)) {
    let depth = 0;
    for (let i = match.index + match[0].length - 1; i < source.length; i += 1) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          ranges.push([match.index, i]);
          break;
        }
      }
    }
  }
  return ranges;
}

/**
 * Class tokens, taken only from positions that really are class lists: a string
 * literal inside `cn()` or `cva()`, or a plain `className="..."`. Reading every
 * string in the file instead would flag product slugs and ARIA attribute names.
 *
 * A quoted **object key** is not a class list, and inside `cva()` it is the
 * name of a variant value. Most of them need no quotes, but `Heading.variants.ts`
 * names its sizes after the type scale's own steps (`'heading-lg'`,
 * `'display-md'`), which do, and would otherwise be reported as dead classes. A
 * key is a string with a colon straight after its closing quote.
 */
function classTokens(source) {
  const ranges = callRanges(source);
  const inCall = (index) => ranges.some(([start, end]) => index > start && index < end);
  const isKey = (endIndex) => /^\s*:/.test(source.slice(endIndex));
  const defaults = defaultVariantRanges(source);
  const isDefault = (index) => defaults.some(([start, end]) => index > start && index < end);
  const tokens = new Set();

  const take = (text) => {
    for (const token of text.split(/\s+/)) {
      if (token === '' || !/^[a-z[]/.test(token)) continue;
      // Arbitrary values and properties carry their own CSS and cannot be dead.
      if (token.includes('[') || token.includes('(')) continue;
      if (!token.includes('-')) continue;
      tokens.add(token);
    }
  };

  for (const match of source.matchAll(/'([^'\n]*)'/g)) {
    const end = match.index + match[0].length;
    if (inCall(match.index) && !isKey(end) && !isDefault(match.index)) take(match[1]);
  }
  for (const match of source.matchAll(/className="([^"\n]*)"/g)) take(match[1]);

  return tokens;
}

const used = new Map();
for (const root of ROOTS) {
  const dir = path.join(REPO, root);
  // A root that moved would otherwise be checked as empty and pass.
  if (!existsSync(dir)) {
    console.error(`dead-classes: ${root} does not exist. Update ROOTS.`);
    process.exit(1);
  }
  for (const file of sources(dir)) {
    for (const token of classTokens(readFileSync(file, 'utf8'))) {
      if (!used.has(token)) used.set(token, new Set());
      used.get(token).add(path.relative(REPO, file));
    }
  }
}

// Ask Tailwind which of them are real, using this project's own entry point.
//
// The probe lives inside the repository, not in the system temp directory: the
// Tailwind CLI resolves `@import 'tailwindcss'` relative to the input file, so
// a probe outside the tree cannot find it.
const probe = mkdtempSync(path.join(REPO, 'node_modules', '.kirua-classes-'));
try {
  writeFileSync(
    path.join(probe, 'probe.html'),
    `<div class="${[...used.keys()].join(' ')}"></div>`,
  );
  writeFileSync(
    path.join(probe, 'in.css'),
    `@import 'tailwindcss';\n@source '${probe}/probe.html';\n@import '${path.join(REPO, 'src/styles/kirua.css')}';\n`,
  );
  execFileSync(CLI, ['-i', path.join(probe, 'in.css'), '-o', path.join(probe, 'out.css')], {
    cwd: REPO,
    stdio: 'pipe',
  });

  const css = readFileSync(path.join(probe, 'out.css'), 'utf8');
  const defined = new Set(
    [...css.matchAll(/\.((?:\\.|[^\s{},:>+~[\]()])+)/g)].map((m) => m[1].replace(/\\/g, '')),
  );

  const dead = [...used.entries()]
    .filter(([token]) => {
      // A variant only qualifies the utility after the last colon.
      const bare = token.slice(token.lastIndexOf(':') + 1).replace(/^-/, '');
      return !defined.has(bare) && !defined.has(token);
    })
    .sort(([a], [b]) => a.localeCompare(b));

  console.log(`dead-classes: checked ${used.size} class tokens.`);
  if (dead.length > 0) {
    console.error('\ndead-classes: these generate no CSS, so they do nothing.\n');
    for (const [token, files] of dead) {
      console.error(`  ${token.padEnd(24)} ${[...files].join(', ')}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log('dead-classes: every class generates a rule.');
} finally {
  rmSync(probe, { recursive: true, force: true });
}
