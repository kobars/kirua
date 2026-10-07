#!/usr/bin/env node
/**
 * Installs the packed `@kobars/kirua` tarball the way a consumer does — npm,
 * an empty project, the newest versions its ranges allow — and fails when one
 * of kirua's own dependencies ends up with more than one copy.
 *
 *     pnpm check:install
 *
 * This repository cannot see that failure by itself. Its lockfile holds the
 * Radix versions it was built against, while a consumer resolves the newest
 * ones. 0.4.0 pinned `@radix-ui/react-direction` to exactly 1.1.4, every
 * primitive npm installed by then pinned 1.1.5, and a fresh install held 12
 * copies: twelve React contexts, so `DirectionProvider` reached none of the
 * primitives that read it. Every test here passed.
 *
 * It installs twice: into an empty project, and over the newest published
 * release below this one, as an upgrade does. The second case is not the
 * first one again. npm keeps an installed copy that still satisfies the new
 * range, so `^1.1.4` fixed a fresh install while an upgrade from 0.4.0 kept
 * its 1.1.4 and all 12 copies.
 *
 * Only kirua's direct dependencies fail the run: their ranges are kirua's to
 * change. A duplicate deeper in the tree is printed and left alone.
 *
 * It needs the npm registry, and `npm pack` runs the package build first.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO = path.join(import.meta.dirname, '..');
const PACKAGE = path.join(REPO, 'packages/kirua');
const WORK = path.join(REPO, 'node_modules/.tmp/kirua-consumer-install');
const manifest = JSON.parse(readFileSync(path.join(PACKAGE, 'package.json'), 'utf8'));
const root = JSON.parse(readFileSync(path.join(REPO, 'package.json'), 'utf8'));

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

const npm = (args, cwd) => execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: 'pipe' });

const tarball = path.join(
  WORK,
  npm(['pack', '--silent', '--pack-destination', WORK], PACKAGE).trim(),
);

// The peers at the versions this repository builds with, as a consumer would add them.
const peer = (name) => `${name}@${root.dependencies?.[name] ?? root.devDependencies?.[name]}`;
const peers = Object.keys(manifest.peerDependencies).map(peer);
const install = (app, specs) =>
  npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', ...specs], app);

/** Every installed copy under `app`, as `name → [{ version, where }]`. */
function installed(app) {
  const copies = new Map();
  function walk(dir) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.startsWith('.')) continue;
      if (entry.startsWith('@')) {
        for (const scoped of readdirSync(path.join(dir, entry)))
          visit(path.join(dir, entry, scoped));
      } else visit(path.join(dir, entry));
    }
  }
  function visit(dir) {
    if (!statSync(dir).isDirectory()) return;
    try {
      const { name, version } = JSON.parse(
        readFileSync(path.join(dir, 'package.json'), 'utf8'),
      );
      if (!copies.has(name)) copies.set(name, []);
      copies.get(name).push({ version, where: path.relative(app, dir) });
    } catch {
      // Not a package directory.
    }
    walk(path.join(dir, 'node_modules'));
  }
  walk(path.join(app, 'node_modules'));
  return copies;
}

const newer = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
/** The newest published release below this one, or none before the first publish. */
const previous = JSON.parse(npm(['view', manifest.name, 'versions', '--json'], WORK))
  .filter((version) => /^\d+\.\d+\.\d+$/.test(version) && newer(version, manifest.version) < 0)
  .sort(newer)
  .at(-1);

const cases = [{ label: 'fresh install', before: [] }];
if (previous)
  cases.push({ label: `upgrade from ${previous}`, before: [`${manifest.name}@${previous}`] });

let failed = false;
for (const { label, before } of cases) {
  const app = path.join(WORK, label.replace(/\W+/g, '-'));
  mkdirSync(app, { recursive: true });
  writeFileSync(
    path.join(app, 'package.json'),
    JSON.stringify({ name: 'consumer', private: true, type: 'module' }),
  );
  if (before.length > 0) install(app, [...before, ...peers]);
  install(app, [tarball, ...peers]);
  const copies = installed(app);

  const ours = copies.get(manifest.name);
  if (ours?.[0]?.version !== manifest.version) {
    // An empty or failed install would report no duplicates, which is the worst way for this to break.
    console.error(
      `consumer-install (${label}): ${manifest.name}@${manifest.version} is not in the installed tree.`,
    );
    failed = true;
    continue;
  }

  const duplicated = [...copies].filter(([, list]) => list.length > 1);
  const kirua = duplicated.filter(([name]) => name in manifest.dependencies);
  const deeper = duplicated.filter(([name]) => !(name in manifest.dependencies));

  console.log(`consumer-install (${label}): ${copies.size} packages.`);
  for (const [name, list] of deeper) {
    console.log(
      `  note: ${list.length} copies of ${name} (${list.map((c) => c.version).join(', ')}), not a kirua dependency`,
    );
  }
  if (kirua.length > 0) {
    failed = true;
    console.error(
      `\nconsumer-install (${label}): a kirua dependency is installed more than once.\n`,
    );
    for (const [name, list] of kirua) {
      console.error(
        `  - ${name}: ${list.length} copies, kirua asks for ${manifest.dependencies[name]}`,
      );
      for (const copy of list) console.error(`      ${copy.version}  ${copy.where}`);
    }
  }
}

if (failed) {
  console.error(
    '\nA package that holds a React context stops working across copies. Raise the\n' +
      'range in packages/kirua/package.json to the version the other packages pin.\n',
  );
  process.exit(1);
}
console.log('consumer-install: every kirua dependency is installed once.');
