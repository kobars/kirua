import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Every element a component puts classes on carries a `data-slot`, because a
 * slot name is the stable selector a consumer restyles by, and a classed
 * element without one can only be reached by its position in the tree.
 *
 * The rule is checked on the syntax tree: an intrinsic JSX element (lowercase
 * tag) or a Radix part rendered directly (`<SelectPrimitive.Viewport>`) with a
 * `className` attribute and no `data-slot` attribute is a finding. A component
 * of this repo is not checked where it is placed: it carries its own slot.
 * Three cases are exempt by rule:
 *
 * - an element nested inside an `<svg>` — the `<svg>` carries the slot, and a
 *   `<path>` or `<circle>` is drawing, not a part anyone restyles alone;
 * - the direct child of an element passed `asChild` — Radix `Slot` merges the
 *   props and resolves a conflict in the parent's favour, so a slot written
 *   there would be replaced and is a lie;
 * - an element whose line above holds `data-slot-allow: <reason>` in a comment.
 *   The reason is required.
 */

const COMPONENTS_DIR = path.join(import.meta.dirname);

/** A DOM element: `<div>`, `<span>`, `<svg>`. */
const INTRINSIC = /^[a-z]/;
/** A Radix part rendered directly — `<SelectPrimitive.ItemIndicator>` — which
 *  renders one element of its own and puts our classes on it. */
const PRIMITIVE = /^[A-Z]\w*Primitive\.\w+$/;

/** The reason runs to the end of the line, minus whatever closes the comment,
 *  and may not be empty. */
const ALLOW = /data-slot-allow:\s*(?!\*\/|\})(\S.*?)\s*(?:\*\/\}?|\})?\s*$/;

function attributeNames(attributes: ts.JsxAttributes): Set<string> {
  const names = new Set<string>();
  for (const attribute of attributes.properties) {
    if (ts.isJsxAttribute(attribute)) names.add(attribute.name.getText());
  }
  return names;
}

function openingOf(node: ts.Node): ts.JsxOpeningLikeElement | undefined {
  if (ts.isJsxElement(node)) return node.openingElement;
  if (ts.isJsxSelfClosingElement(node)) return node;
  return undefined;
}

/** Each classed intrinsic element without a slot, as `line: <tag>`. */
export function findUnslotted(source: string, file = 'component.tsx'): string[] {
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const lines = source.split('\n');
  const found: string[] = [];

  const visit = (node: ts.Node, insideSvg: boolean, parentHasAsChild: boolean) => {
    const opening = openingOf(node);
    if (!opening) {
      ts.forEachChild(node, (child) => visit(child, insideSvg, parentHasAsChild));
      return;
    }
    const tag = opening.tagName.getText(tree);
    const names = attributeNames(opening.attributes);
    if (
      (INTRINSIC.test(tag) || PRIMITIVE.test(tag)) &&
      !insideSvg &&
      !parentHasAsChild &&
      names.has('className') &&
      !names.has('data-slot')
    ) {
      const line = tree.getLineAndCharacterOfPosition(opening.getStart(tree)).line;
      const above = lines[line - 1] ?? '';
      if (!ALLOW.test(above)) found.push(`${line + 1}: <${tag}>`);
    }
    const childInsideSvg = insideSvg || tag === 'svg';
    const childParentHasAsChild = names.has('asChild');
    // Attribute expressions can hold JSX of their own, with no parent relation.
    ts.forEachChild(opening, (child) => visit(child, childInsideSvg, false));
    if (ts.isJsxElement(node)) {
      for (const child of node.children) visit(child, childInsideSvg, childParentHasAsChild);
    }
  };
  visit(tree, false, false);
  return found;
}

describe('data-slot on classed elements', () => {
  it('is present on every intrinsic element a component puts classes on', () => {
    const offenders = readdirSync(COMPONENTS_DIR)
      .filter((name) => name.endsWith('.tsx') && !/\.(test|stories)\.tsx$/.test(name))
      .flatMap((name) =>
        findUnslotted(readFileSync(path.join(COMPONENTS_DIR, name), 'utf8'), name).map(
          (found) => `${name}:${found}`,
        ),
      );
    expect(offenders).toEqual([]);
  });

  // Planted class names are not utilities: Tailwind scans this file's text.
  it('detects the defect it exists for', () => {
    expect(
      findUnslotted(
        [
          'export function Row({ className, ...props }) {',
          '  return (',
          '    <div data-slot="row" className={className} {...props}>',
          '      <span className="planted">{props.children}</span>',
          '      <svg data-slot="row-icon" className="planted"><path className="planted" /></svg>',
          '      <Trigger asChild><button className="planted" /></Trigger>',
          '      {/* data-slot-allow: a measuring probe, never visible */}',
          '      <i className="planted" />',
          '      {/* data-slot-allow: */}',
          '      <b className="planted" />',
          '      <Thing render={<em className="planted" />} />',
          '      <SelectPrimitive.Viewport className="planted" />',
          '      <Button className="planted" />',
          '    </div>',
          '  );',
          '}',
        ].join('\n'),
      ),
    ).toEqual(['4: <span>', '10: <b>', '11: <em>', '12: <SelectPrimitive.Viewport>']);
  });
});
