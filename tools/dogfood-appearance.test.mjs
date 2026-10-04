import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { appearanceRecipes, findAppearanceCopies } from './dogfood-appearance.mjs';

const code = appearanceRecipes(
  readFileSync(new URL('../src/components/CodeBlock.tsx', import.meta.url), 'utf8'),
);
const group = appearanceRecipes(
  readFileSync(new URL('../src/components/ItemGroup.variants.ts', import.meta.url), 'utf8'),
);
const recipes = [...code, ...group];
const copy = 'rounded-md border border-line-subtle bg-sunken';

test('a reordered CodeBlock copy identifies its component and attribute line', () => {
  const findings = findAppearanceCopies(
    '<div\n  className="p-4 bg-sunken border-line-subtle border rounded-md" />',
    recipes,
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].owner, 'CodeBlock');
  assert.equal(findings[0].line, 2);
});

test('a variant decoration copied onto ItemGroup is caught', () => {
  const findings = findAppearanceCopies(
    '<ItemGroup className="rounded-lg border border-line-subtle" />',
    recipes,
  );
  assert.equal(findings[0]?.owner, 'ItemGroup');
});

test('sharing only part of a recipe does not fail', () => {
  assert.deepEqual(
    findAppearanceCopies('<div className="border border-line-subtle bg-sunken" />', code),
    [],
  );
});

test('comments, prose, and unrelated prop strings are ignored', () => {
  assert.deepEqual(
    findAppearanceCopies(
      `// <div className="${copy}" />\nconst prose = '<div className="${copy}" />';\nconst view = <div title="${copy}" />;`,
      recipes,
    ),
    [],
  );
});

test('cn and conditional alternatives are inspected without combining branches', () => {
  assert.equal(
    findAppearanceCopies(`<div className={cn('p-4', active && '${copy}')} />`, recipes).length,
    1,
  );
  assert.deepEqual(
    findAppearanceCopies(
      '<div className={active ? "rounded-md border" : "border-line-subtle bg-sunken"} />',
      code,
    ),
    [],
  );
});

test('a reason immediately above the element or attribute allows a copy', () => {
  for (const source of [
    `{/* dogfood-allow: intentional code-shaped teaching sample */}\n<div className="${copy}" />`,
    `<div\n// dogfood-allow: intentional code-shaped teaching sample\nclassName="${copy}" />`,
  ]) {
    assert.equal(
      findAppearanceCopies(source, recipes)[0]?.reason,
      'intentional code-shaped teaching sample',
    );
  }
});

test('an empty or remote exception does not allow a copy', () => {
  for (const comment of [
    '{/* dogfood-allow: */}',
    '// dogfood-allow:',
    '// dogfood-allow: earlier element\n<div />',
  ]) {
    assert.equal(
      findAppearanceCopies(`${comment}\n<div className="${copy}" />`, recipes)[0]?.reason,
      undefined,
    );
  }
});

test('changed component recipes are picked up from source', () => {
  const changed = appearanceRecipes(
    'function Panel() { return <div data-slot="panel" className="rounded-lg border bg-raised" />; }',
  );
  assert.equal(
    findAppearanceCopies('<div className="rounded-lg border bg-raised" />', changed)[0]?.owner,
    'Panel',
  );
  assert.deepEqual(findAppearanceCopies(`<div className="${copy}" />`, changed), []);
});
