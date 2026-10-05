#!/usr/bin/env node
/**
 * Fails when the example app writes a raw HTML element that the design system
 * already exports a component for.
 *
 * ## What the example app is for
 *
 * The example app under `examples/`, five applications as five sections, is
 * the proof that this design system can be built with. It imports the bare
 * specifier `@kobars/kirua`, exactly as an outside consumer would, and cannot reach
 * into `src`. That only means anything while the app keeps using the system —
 * a screen that reaches past a component and writes the markup by hand is
 * measuring nothing, and it is the easiest thing in the world to do by
 * accident under time pressure.
 *
 * Raw markup mistakes it catches:
 *
 *   - A `Popover` of hand-rolled `<button>`s standing in for a menu. It looks
 *     right and answers no arrow key, no first letter and no Escape, and a
 *     screen reader announces buttons rather than a menu of items.
 *   - A raw `<label>` beside a `Label` in the same import.
 *
 * Neither is caught by types, by the linter, or by any test: raw HTML is valid
 * React and renders fine. It is only wrong against an intent nothing else
 * writes down.
 *
 * Static surface copies are checked too: complete recipes of at least three
 * border, radius, background, shadow or context utilities, read from component
 * className literals and cva variants. Layout and typography do not identify a
 * component. Computed strings, imported constants and recipes assembled across
 * multiple expressions are outside this check; it is not visual equivalence.
 *
 * ## The escape hatch, and why it is a comment rather than a list
 *
 * A raw element is sometimes right — `<fieldset>`, `<output>` and the landmark
 * elements have no component here, and a legitimate exception should be visible
 * where the code is rather than in a list on the other side of the repository.
 * Put `dogfood-allow: <reason>` in a comment on the line before, and the line
 * is skipped and the reason printed in the summary. An exception with no reason
 * is not accepted, because a bare allow list becomes a place to hide.
 *
 *     node tools/dogfood-check.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { REPO } from './example-apps.mjs';
import { appearanceRecipes, findAppearanceCopies } from './dogfood-appearance.mjs';

/**
 * The raw element, and what the system exports instead.
 *
 * Deliberately not exhaustive. Every entry here is an element whose component
 * carries behaviour the raw tag does not — keyboard handling, a `data-slot`, a
 * surface-aware colour — so replacing it is always an improvement rather than a
 * matter of taste. Elements with no component (`<output>`, `<main>`, `<nav>`)
 * are absent on purpose, not by oversight.
 */
const INSTEAD = {
  button: 'Button, IconButton or Toggle',
  input: 'Input, Checkbox, RadioGroupItem or Slider',
  select: 'Select',
  textarea: 'Textarea',
  label: 'Label',
  fieldset: 'FieldSet',
  legend: 'FieldLegend',
  table: 'Table',
  thead: 'TableHeader',
  tbody: 'TableBody',
  tr: 'TableRow',
  th: 'TableHead',
  td: 'TableCell',
  dialog: 'Dialog or AlertDialog',
  progress: 'Progress',
};

const EXAMPLES = path.join(REPO, 'examples');
/** The reason runs to the end of the line, minus whatever closes the comment. */
const ALLOW = /dogfood-allow:\s*(.+?)\s*(?:\*\/\}?|\})?\s*$/;

/** Every `.tsx` under `examples/`, skipping the built output. */
function sources(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'dist' || entry === 'node_modules') continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...sources(full));
    else if (entry.endsWith('.tsx')) found.push(full);
  }
  return found;
}

/**
 * Blanks out comments and string literals, keeping every byte's position.
 *
 * The scan is a regular expression over source text, so a component's own
 * explanation of why it does not use `<button>` would report itself as a
 * `<button>`. Replacing the characters with spaces rather than deleting them
 * keeps line and column numbers true, so a hit still points at the real line.
 */
function blankNonCode(source) {
  const blanked = source.split('');
  const spans = [
    /\/\*[\s\S]*?\*\//g, // block comments, JSX `{/* … */}` included
    /\/\/[^\n]*/g, // line comments
    /'(?:[^'\\\n]|\\.)*'/g, // single-quoted strings
    /"(?:[^"\\\n]|\\.)*"/g, // double-quoted strings
    /`(?:[^`\\]|\\.)*`/g, // template literals
  ];
  for (const pattern of spans) {
    for (const match of source.matchAll(pattern)) {
      for (let i = match.index; i < match.index + match[0].length; i += 1) {
        if (blanked[i] !== '\n') blanked[i] = ' ';
      }
    }
  }
  return blanked.join('');
}

const tags = Object.keys(INSTEAD).join('|');
const RAW = new RegExp(`<(${tags})(?=[\\s/>])`, 'g');

const findings = [];
const allowed = [];
const componentDir = path.join(REPO, 'src/components');
const recipes = readdirSync(componentDir)
  .filter((name) => /(?:\.tsx|\.variants\.ts)$/.test(name) && !/\.(test|stories)\./.test(name))
  .flatMap((name) => appearanceRecipes(readFileSync(path.join(componentDir, name), 'utf8')));

for (const file of sources(EXAMPLES)) {
  const source = readFileSync(file, 'utf8');
  const code = blankNonCode(source);
  const lines = source.split('\n');
  for (const copy of findAppearanceCopies(source, recipes)) {
    const where = `${path.relative(REPO, file)}:${copy.line}`;
    if (copy.reason) allowed.push({ where, tag: copy.owner, reason: copy.reason });
    else findings.push({ where, tag: copy.classes, instead: copy.owner });
  }

  for (const match of code.matchAll(RAW)) {
    const line = code.slice(0, match.index).split('\n').length;
    const previous = lines[line - 2] ?? '';
    const reason = ALLOW.exec(previous)?.[1]?.trim();
    const where = `${path.relative(REPO, file)}:${line}`;
    if (reason) allowed.push({ where, tag: match[1], reason });
    else findings.push({ where, tag: match[1], instead: INSTEAD[match[1]] });
  }
}

if (allowed.length > 0) {
  console.log('\nDogfood exceptions allowed on purpose:\n');
  console.table(allowed);
}

if (findings.length > 0) {
  console.error('\ndogfood-check: an example wrote markup the design system exports.\n');
  console.table(findings);
  console.error(
    '  Use the component, or put `dogfood-allow: <reason>` in a comment on the line above.\n',
  );
  process.exit(1);
}

console.log(
  `\ndogfood-check: ${sources(EXAMPLES).length} example files, ` +
    `no raw element or complete static surface recipe the system already covers.`,
);
