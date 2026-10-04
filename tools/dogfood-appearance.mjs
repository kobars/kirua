import ts from 'typescript';

// Match a complete, static surface recipe, not any three shared utilities.
// Layout, typography and state variants are too common to identify a component.
const SURFACE = /^(?:rounded(?:-|$)|border(?:-|$)|bg-|shadow(?:-|$)|ctx-)/;
const surface = (value) =>
  [...new Set(value.split(/\s+/).filter((token) => SURFACE.test(token)))].sort();
const parse = (source) =>
  ts.createSourceFile('source.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const nameOf = (node) => node?.text ?? '';

function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

/** Collect literal class alternatives without combining mutually exclusive branches. */
function literals(node, out = []) {
  if (!node) return out;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) out.push(node);
  else if (ts.isJsxExpression(node) || ts.isParenthesizedExpression(node))
    literals(node.expression, out);
  else if (ts.isConditionalExpression(node)) {
    literals(node.whenTrue, out);
    literals(node.whenFalse, out);
  } else if (ts.isBinaryExpression(node)) literals(node.right, out);
  else if (ts.isCallExpression(node) && /^(cn|clsx)$/.test(node.expression.getText()))
    node.arguments.forEach((argument) => literals(argument, out));
  else if (ts.isArrayLiteralExpression(node))
    node.elements.forEach((element) => literals(element, out));
  return out;
}

/** Recipes come from shipped className literals and cva definitions, not a copied list. */
export function appearanceRecipes(source) {
  const root = parse(source);
  const recipes = [];
  function add(owner, value) {
    const classes = surface(value);
    if (classes.length >= 3) recipes.push({ owner, classes });
  }
  walk(root, (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attrs = node.attributes.properties;
      const slot = attrs.find((attr) => nameOf(attr.name) === 'data-slot');
      if (!slot?.initializer || !ts.isStringLiteral(slot.initializer)) return;
      const owner = slot.initializer.text.replace(/(^|-)(\w)/g, (_, __, char) =>
        char.toUpperCase(),
      );
      const classes = attrs.find((attr) => nameOf(attr.name) === 'className');
      literals(classes?.initializer).forEach((literal) => add(owner, literal.text));
    }
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === 'cva'
    ) {
      const owner = node.name
        .getText()
        .replace(/Variants$/, '')
        .replace(/^./, (c) => c.toUpperCase());
      const [base, options] = node.initializer.arguments;
      literals(base).forEach((literal) => add(owner, literal.text));
      if (!options || !ts.isObjectLiteralExpression(options)) return;
      const variants = options.properties.find((prop) => nameOf(prop.name) === 'variants');
      if (!variants?.initializer) return;
      walk(variants.initializer, (child) => {
        if (ts.isPropertyAssignment(child))
          literals(child.initializer).forEach((literal) => add(owner, literal.text));
      });
    }
  });
  return recipes;
}

/** Scan actual JSX attributes; comments and prose cannot impersonate className. */
export function findAppearanceCopies(source, recipes) {
  const root = parse(source);
  const lines = source.split('\n');
  const findings = [];
  walk(root, (node) => {
    if (!ts.isJsxAttribute(node) || nameOf(node.name) !== 'className') return;
    const line = root.getLineAndCharacterOfPosition(node.getStart(root)).line + 1;
    const element = node.parent.parent;
    const elementLine = root.getLineAndCharacterOfPosition(element.getStart(root)).line + 1;
    // Accept the existing escape hatch immediately above the attribute or element.
    const previous = [lines[line - 2] ?? '', lines[elementLine - 2] ?? ''];
    const reason = previous
      .map((text) =>
        /(?:\/\/|\/\*)\s*dogfood-allow:\s*(.*?)\s*(?:\*\/\}?)?\s*$/.exec(text)?.[1]?.trim(),
      )
      .find(Boolean);
    const seen = new Set();
    for (const literal of literals(node.initializer)) {
      const classes = new Set(surface(literal.text));
      for (const recipe of recipes) {
        if (recipe.classes.every((token) => classes.has(token)) && !seen.has(recipe.owner)) {
          seen.add(recipe.owner);
          findings.push({
            line,
            owner: recipe.owner,
            classes: recipe.classes.join(' '),
            reason,
          });
        }
      }
    }
  });
  return findings;
}
