#!/usr/bin/env node
/**
 * Fails when the design system exports something no application ever places on
 * a screen.
 *
 * ## Why this is not the coverage gate
 *
 * `stories.test.ts` and `variants.test.tsx` decide what *test* coverage means
 * for a component, and every component here has a story. This asks a
 * different question: does any application put it on a real screen.
 *
 * A story renders a component alone on a blank page. An application puts it on
 * a real surface, beside other components, at every width, inside an axe run
 * over a composed screen. Those find different defects — landmarks, heading
 * order and contrast against a real ancestor only exist on a composed screen —
 * and the second kind only reaches what an application uses.
 *
 * ## How usage is decided
 *
 * Every example imports the bare specifier `@kobars/kirua`, exactly as an
 * outside consumer would, so the import lists *are* the usage. An imported
 * binding that is never rendered would fail `tsc` under `noUnusedLocals`
 * before it reached this tool, so an import is evidence of a use rather than a
 * claim of one.
 *
 * Only exported **values** count. `Corner` and `NamedPanel` are types — a type
 * has no runtime and cannot be placed on a screen.
 *
 * ## Exemptions
 *
 * An export with no home is telling you something, and the answer is usually a
 * screen rather than an entry in a list. Where it genuinely is not, the entry
 * below carries a reason, the way `dogfood-check` requires one in a comment. A
 * bare allow list becomes a place to hide.
 *
 *     node tools/component-usage.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { EXAMPLES, REPO, SECTIONS } from './example-apps.mjs';

const BARREL = path.join(REPO, 'src/components/index.ts');

/**
 * Exports that no application places, each with the reason.
 *
 * Keep this short and keep it argued. Every entry is a component the system
 * ships and nothing demonstrates, which is a cost — the reason has to be worth
 * more than the demonstration would have been.
 */
const EXEMPT = {
  buttonVariants:
    'A cva definition, not a component. Exported so a consumer can compose the button recipe; an application would import the component instead.',
  alertVariants: 'Same as buttonVariants — a recipe, not an element.',
  attachmentVariants: 'Same as buttonVariants.',
  attachmentGroupVariants: 'Same as buttonVariants.',
  avatarVariants: 'Same as buttonVariants.',
  buttonGroupVariants: 'Same as buttonVariants.',
  codeTokenVariants: 'Same as buttonVariants.',
  containerVariants: 'Same as buttonVariants.',
  descriptionListVariants: 'Same as buttonVariants.',
  headingVariants: 'Same as buttonVariants.',
  itemVariants: 'Same as buttonVariants.',
  itemGroupVariants: 'Same as buttonVariants.',
  kbdVariants: 'Same as buttonVariants.',
  linkVariants: 'Same as buttonVariants.',
  listVariants: 'Same as buttonVariants.',
  markerVariants: 'Same as buttonVariants.',
  messageVariants: 'Same as buttonVariants.',
  messageAvatarVariants: 'Same as buttonVariants.',
  meterVariants: 'Same as buttonVariants.',
  sectionVariants: 'Same as buttonVariants.',
  sheetContentVariants: 'Same as buttonVariants.',
  sidebarVariants: 'Same as buttonVariants.',
  statVariants: 'Same as buttonVariants.',
  statRowVariants: 'Same as buttonVariants.',
  textVariants: 'Same as buttonVariants.',
  toastVariants: 'Same as buttonVariants.',
  toggleVariants: 'Same as buttonVariants.',
  resolveGlints:
    'A helper the glint components call for the consumer. An application passes `glint` to Card or SpotlightPanel and never resolves corners itself.',
  CARD_RADIUS_PX:
    'A measured number CornerGlint needs because SVG cannot read CSS. Exported so a consumer drawing their own ornament matches the card; no screen reads it.',
  PANEL_RADIUS_PX: 'Same as CARD_RADIUS_PX.',
  ScrollBar:
    'ScrollArea renders both bars itself, for the orientation it was given. ' +
    'An application importing ScrollBar would be adding a third bar beside ' +
    'the two that are already there. It is exported only for a consumer who ' +
    'composes ScrollAreaPrimitive by hand and still wants the themed bar.',
  PANEL_GLINT_INSET_PX: 'Same as CARD_RADIUS_PX.',
  ScrollArea:
    'PaneBody is a ScrollArea, and every scrolling region in the app is the ' +
    'body of a Pane — a transcript, a thread list, a cart. A bare ScrollArea ' +
    'would be a region with no header or footer to stay put around it.',
  CornerGlint:
    'Card and SpotlightPanel draw it through their `glint` prop, which is ' +
    'how every glint in the app is placed. Exported for a surface that is ' +
    'neither.',
  StarIcon:
    'Rating renders it beside the value. A star of the app’s own would be a second rating.',
  ChevronUpIcon:
    'TableHead renders it for an ascending sort. The app sorts through `sort`, never by drawing the chevron.',
  ButtonGroupSeparator:
    'It divides a split action — a command beside the menu of its options — ' +
    'and no screen in the app has one. The pager the app does join needs no ' +
    'divider: its buttons’ own borders meet.',
};

/** Every `.ts`/`.tsx` under a directory, skipping build output. */
function sources(dir, out = [], { recursive = true } = {}) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'dist' || entry === 'node_modules') continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (recursive) sources(full, out);
    } else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
}

/** The exported names in one `{ … }` clause, minus the type-only ones: `a as b` places `a`. */
function valueNames(clause) {
  return clause
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== '' && !name.startsWith('type '))
    .map((name) => name.split(/\s+as\s+/)[0].trim());
}

/** Every value the barrel exports, following `export * from` one level. */
function exportedValues() {
  const source = readFileSync(BARREL, 'utf8');
  const names = new Set();

  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*'([^']+)'/g)) {
    for (const name of valueNames(match[1])) names.add(name);
  }

  for (const match of source.matchAll(/export\s*\*\s*from\s*'([^']+)'/g)) {
    const file = path.join(path.dirname(BARREL), `${match[1].replace(/^\.\//, '')}.tsx`);
    const starred = readFileSync(file, 'utf8');
    for (const hit of starred.matchAll(/export\s+(?:const|function)\s+([A-Za-z0-9_]+)/g)) {
      names.add(hit[1]);
    }
  }

  return [...names].sort();
}

/**
 * Which bindings each section imports from `@kobars/kirua`. The hub is the
 * files at the root of `examples/` — the entry, the router and the page at
 * `#/`.
 *
 * `examples/shared` counts for every section: `ThemeMenu` is one file that all
 * of them render, and scanning only `examples/<section>` would report
 * `SunIcon`, `MoonIcon` and `MonitorIcon` as placed by nobody.
 *
 * The clause pattern is `[^}]*` and not `[\s\S]*?` for a reason worth keeping:
 * lazy matching still crosses an intervening import, so in a `main.tsx` that
 * imports React first, the match would run from `import {` on line one to
 * `} from '@kobars/kirua'` on line three and swallow three modules into one
 * clause, reporting `TooltipProvider` unused while the app wraps itself in it.
 */
function usageBySection() {
  const shared = sources(path.join(EXAMPLES, 'shared'));
  const usage = new Map();
  for (const { section, prefix } of SECTIONS) {
    const own =
      prefix === ''
        ? sources(EXAMPLES, [], { recursive: false })
        : sources(path.join(EXAMPLES, section));
    const used = new Set();
    for (const file of [...own, ...shared]) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'@kobars\/kirua'/g)) {
        for (const name of valueNames(match[1])) used.add(name);
      }
    }
    usage.set(section, used);
  }
  return usage;
}

const exports_ = exportedValues();
const usage = usageBySection();

const rows = exports_.map((name) => {
  const sections = [...usage.entries()]
    .filter(([, used]) => used.has(name))
    .map(([section]) => section);
  return { name, sections };
});

const unused = rows.filter((row) => row.sections.length === 0 && !(row.name in EXEMPT));
const exempted = rows.filter((row) => row.sections.length === 0 && row.name in EXEMPT);
const stale = Object.keys(EXEMPT).filter((name) => {
  const row = rows.find((candidate) => candidate.name === name);
  return row === undefined || row.sections.length > 0;
});

console.log(
  `\ncomponent-usage: ${exports_.length} exported values, ` +
    `${rows.length - unused.length - exempted.length} used by an application, ` +
    `${exempted.length} exempt, ${unused.length} unused.`,
);

if (exempted.length > 0) {
  console.log('\nExempt, with the reason:\n');
  console.table(exempted.map(({ name }) => ({ name, reason: EXEMPT[name] })));
}

// An exemption that has found a home is a comment that has stopped being true.
if (stale.length > 0) {
  console.error('\ncomponent-usage: these exemptions are stale — remove them.\n');
  console.table(stale.map((name) => ({ name, why: 'now used, or no longer exported' })));
  process.exit(1);
}

if (unused.length > 0) {
  console.error('\ncomponent-usage: no application places these on a screen.\n');
  console.table(unused.map(({ name }) => ({ name })));
  console.error(
    '  Put each one on the screen that wants it, or exempt it with a reason in this file.\n',
  );
  process.exit(1);
}
