#!/usr/bin/env node
/**
 * Fails when the example app styles anything itself.
 *
 * The example app is built only from the design system's components and their
 * props. A `className` or a `style` on a screen is styling the system does not
 * offer — a gap in the system written down in the one place nobody will look
 * for it — so every one is reported with its file and line, grouped by the
 * section it is in.
 *
 * The app's stylesheet is held to the same rule: it imports the system and
 * names the sources Tailwind scans, which is what a consumer writes, and
 * nothing else. Any other statement is a rule of the app's own.
 *
 * Attributes are found in the TypeScript syntax tree, not by matching text, so
 * a mention in a comment or a string is not a finding and a prop spread across
 * lines still is.
 *
 *     node tools/no-classname-check.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { EXAMPLES, REPO } from './example-apps.mjs';

const PROPS = new Set(['className', 'style']);

/** The statements a consumer's stylesheet may hold. */
const ALLOWED_AT_RULES = /^@(?:import|source|custom-variant)\b/;

/** Every file under `examples/` with one of the extensions, skipping build output. */
function sources(dir, extension, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'dist' || entry === 'node_modules') continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sources(full, extension, out);
    else if (full.endsWith(extension)) out.push(full);
  }
  return out;
}

/**
 * Which part of the app a file belongs to, for the report: its section's
 * directory, `shared`, or `hub` for the files at the root.
 */
function groupOf(file) {
  const [first, ...rest] = path.relative(EXAMPLES, file).split(path.sep);
  return rest.length === 0 ? 'hub' : first;
}

/**
 * The top-level statements of a stylesheet: each ends at a `;` or at the `}`
 * closing its block. A quoted string may hold either character — a glob such
 * as `*.{ts,tsx}` does — so quotes are tracked.
 */
function statements(code) {
  const found = [];
  let start = 0;
  let depth = 0;
  let quote = null;
  for (let i = 0; i < code.length; i += 1) {
    const char = code[i];
    if (quote !== null) {
      if (char === '\\') i += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}') depth -= 1;
    if ((char === ';' && depth === 0) || (char === '}' && depth === 0)) {
      const raw = code.slice(start, i + 1);
      const text = raw.trim();
      if (text !== '') found.push({ text, offset: start + raw.indexOf(text) });
      start = i + 1;
    }
  }
  const rest = code.slice(start).trim();
  if (rest !== '') found.push({ text: rest, offset: code.indexOf(rest, start) });
  return found;
}

const findings = [];

for (const file of sources(EXAMPLES, '.tsx')) {
  const source = readFileSync(file, 'utf8');
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const report = (node, what) => {
    const { line } = tree.getLineAndCharacterOfPosition(node.getStart(tree));
    findings.push({
      group: groupOf(file),
      where: `${path.relative(REPO, file)}:${line + 1}`,
      what,
    });
  };
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && PROPS.has(node.name.getText(tree))) {
      report(node, `${node.name.getText(tree)}=`);
    }
    // The same prop reaching an element through a spread: `{...{ className }}`,
    // or an object built first and spread later.
    if (
      (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
      PROPS.has(node.name.getText(tree).replace(/^['"]|['"]$/g, ''))
    ) {
      report(node, `${node.name.getText(tree)}: in an object`);
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}

for (const file of sources(EXAMPLES, '.css')) {
  const source = readFileSync(file, 'utf8');
  // Comments become spaces, so a statement keeps its line number.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));
  for (const { text, offset } of statements(code)) {
    if (ALLOWED_AT_RULES.test(text)) continue;
    findings.push({
      group: groupOf(file),
      where: `${path.relative(REPO, file)}:${code.slice(0, offset).split('\n').length}`,
      what: text.split('\n')[0].slice(0, 60),
    });
  }
}

const files = sources(EXAMPLES, '.tsx').length + sources(EXAMPLES, '.css').length;

if (findings.length === 0) {
  console.log(
    `\nno-classname-check: ${files} example files, no className, no style and no stylesheet rule of the app's own.`,
  );
  process.exit(0);
}

const counts = new Map();
for (const { group } of findings) counts.set(group, (counts.get(group) ?? 0) + 1);

console.error('\nno-classname-check: the example app styles something itself.\n');
for (const { where, what } of findings) console.error(`  ${where}  ${what}`);
console.error('\nBy section:\n');
console.table([...counts].map(([group, count]) => ({ section: group, findings: count })));
console.error(
  '  Build the screen from components and their props. If no component or prop covers it, the system is missing one.\n',
);
process.exit(1);
