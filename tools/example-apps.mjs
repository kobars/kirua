/**
 * The example app, its sections, and how to serve its build.
 *
 * Every tool that visits the app walks the same routes — `responsive-check`,
 * `a11y-check`, `perf-check` and `example-journeys`. The table is here rather
 * than in any one of them because a copied list goes stale the moment a route
 * is added to one tool and not the others, and a route nothing visits is a
 * route nothing checks.
 *
 * The app is one hash-routed page, so one document serves every route. The
 * first segment of the hash names the section — `#/shop/orders` — and a report
 * names the section a failure is in.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';

export const REPO = path.join(import.meta.dirname, '..');

/** The example app's source directory. */
export const EXAMPLES = path.join(REPO, 'examples');

/** The built app, which is what every tool measures. */
export const DIST = path.join(EXAMPLES, 'dist');

/**
 * The app's own list of sections, `examples/sections.ts`, read rather than
 * restated: the ids, names and titles the tools use are the ones the app
 * renders. It imports nothing, so its compiled text is a complete module.
 */
const sectionsSource = await readFile(path.join(EXAMPLES, 'sections.ts'), 'utf8');
const { SECTIONS: APP_SECTIONS, HUB_TITLE } = await import(
  `data:text/javascript,${encodeURIComponent(
    ts.transpileModule(sectionsSource, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  )}`
);

/** Each section as the app declares it: `id`, `name`, `kind`, `title`, `summary`. */
export { APP_SECTIONS, HUB_TITLE };

/**
 * Every route each section can show, without the section's prefix: one of each
 * screen, and more than one where a screen's layout depends on its record.
 * Routes that name a record by id fail the walk once the id stops existing,
 * because the section then shows its not-found screen.
 */
const ROUTES = new Map([
  [
    'shop',
    [
      '',
      'products/round-glasses',
      'products/denim-jacket',
      'products/cabin-suitcase',
      'orders',
      'orders/DSK-24810',
      'sign-in',
      'checkout',
    ],
  ],
  [
    'his',
    [
      '',
      'patients',
      'schedule',
      'new-visit',
      'pharmacy',
      'lab',
      'patients/20418801',
      'patients/20418803',
    ],
  ],
  [
    'social',
    ['', 'explore', 'notifications', 'messages', 'profile/rin', 'profile/maya', 'profile/eko'],
  ],
  [
    'mobile',
    [
      '',
      'activity',
      'activity/tx-1042',
      'activity/tx-1038',
      'send',
      'send/maya',
      'cards',
      'profile',
      'goals/lisbon',
      'profile/verify',
      'profile/help',
    ],
  ],
  [
    'assistant',
    ['', 'tokens', 'contrast', 'rtl', 'forced-colors', 'dead-classes', 'overlays', 'usage'],
  ],
  ['marketing', ['', 'pricing', 'story', 'guide', 'contact']],
]);

// A section the app has and this table does not would go unvisited by every
// tool while each of them reported success, so the mismatch is fatal.
const appIds = APP_SECTIONS.map((section) => section.id);
const unvisited = appIds.filter((id) => !ROUTES.has(id));
const unknown = [...ROUTES.keys()].filter((id) => !appIds.includes(id));
if (unvisited.length > 0 || unknown.length > 0) {
  throw new Error(
    `tools/example-apps.mjs: the route table and examples/sections.ts disagree. ` +
      `No routes for: ${unvisited.join(', ') || 'none'}. No such section: ${unknown.join(', ') || 'none'}.`,
  );
}

/**
 * Every section's routes, in the order the hub lists the sections. `hub` is
 * the page at `#/`, which belongs to no section and has no prefix.
 *
 * Adding a route here adds it to every tool.
 */
export const SECTIONS = [
  { section: 'hub', prefix: '', routes: [''] },
  ...appIds.map((id) => ({ section: id, prefix: `${id}/`, routes: ROUTES.get(id) })),
];

/**
 * Google Fonts responses, fetched once per run and then answered from memory.
 *
 * Every tool opens the app hundreds of times, each in a fresh context with an
 * empty cache, and Google Fonts slows down when one address asks that often —
 * at times for longer than a test's whole budget. Its stylesheet holds back the
 * app's script, so a slow answer looks exactly like an app that never loads.
 * The pages still render in the real typefaces; they are just asked for once.
 */
const fontResponses = new Map();

/** A browser context whose Google Fonts requests are answered from `fontResponses`. */
export async function newContext(browser, options) {
  const context = await browser.newContext(options);
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    if (!fontResponses.has(url)) {
      fontResponses.set(
        url,
        route.fetch().then(async (response) => {
          // The body arrives decoded, so the headers must not claim otherwise.
          const headers = { ...response.headers() };
          delete headers['content-encoding'];
          delete headers['content-length'];
          return { status: response.status(), headers, body: await response.body() };
        }),
      );
    }
    try {
      await route.fulfill(await fontResponses.get(url));
    } catch {
      // A failed first fetch is not kept: the next page asks Google again.
      fontResponses.delete(url);
      await route.continue().catch(() => {});
    }
  });
  return context;
}

/** How many route views the whole sweep covers, for a tool's summary line. */
export const ROUTE_COUNT = SECTIONS.reduce((total, group) => total + group.routes.length, 0);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

/**
 * A static server for the built app, on an ephemeral port.
 *
 * `files` adds paths served from memory, as `{ type, body }`, ahead of the
 * folder. `rewrite(file, body)` may change a file from the folder before it is
 * sent.
 */
export function serve(root = DIST, { compress = false, files = new Map(), rewrite } = {}) {
  return new Promise((resolve) => {
    const server = createServer(async (request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const file = url.pathname === '/' ? '/index.html' : url.pathname;
      try {
        const extra = files.get(file);
        const read = extra ? extra.body : await readFile(path.join(root, file));
        const body = !extra && rewrite ? rewrite(file, read) : read;
        const gzip =
          compress &&
          /\bgzip\b/.test(request.headers['accept-encoding'] ?? '') &&
          /\.(html|js|css|svg)$/.test(file);
        response.writeHead(200, {
          'content-type':
            extra?.type ?? TYPES[path.extname(file)] ?? 'application/octet-stream',
          ...(gzip ? { 'content-encoding': 'gzip', vary: 'Accept-Encoding' } : {}),
        });
        response.end(gzip ? gzipSync(body) : body);
      } catch {
        response.writeHead(404).end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

/**
 * Opens a route and waits until the screen for that route has rendered, and
 * throws if it does not.
 *
 * Every screen marks its `main` with `data-route`, the path after `#/`, so the
 * wait is for this route's screen and not for whatever is already on the page:
 * within a section a hash change keeps the previous screen until React renders
 * the next. A section is a lazily loaded chunk, so the mark also waits out the
 * download. A stale route — a record id that no longer exists — lands on the
 * section's not-found screen, and a section that fails to load lands on its
 * error screen; both are failures, not screens to sweep.
 *
 * Entering a different section starts from a blank page, so each section is
 * measured in a fresh document, as a visitor arriving by its link would see
 * it, rather than in whatever the previous section left behind.
 */
export async function open(page, url, { timeout = 10_000 } = {}) {
  const pathOf = (href) => new URL(href).hash.replace(/^#\/?/, '');
  const section = (href) => pathOf(href).split('/')[0];
  if (page.url() === 'about:blank' || section(page.url()) !== section(url)) {
    await page.goto('about:blank');
  }
  await page.goto(url, { waitUntil: 'load' });
  const route = pathOf(url);
  const screen = `[data-route="${route}"]`;
  try {
    await page.waitForFunction(
      (selector) =>
        document.querySelector(selector) !== null ||
        document.querySelector('[data-section-error]') !== null,
      screen,
      { timeout },
    );
  } catch {
    throw new Error(`#/${route}: no screen marked data-route="${route}" rendered`);
  }
  const state = await page.evaluate(
    (selector) =>
      document.querySelector('[data-section-error]')
        ? 'error'
        : document.querySelector(`${selector} [data-not-found]`)
          ? 'not-found'
          : 'ok',
    screen,
  );
  if (state === 'error') throw new Error(`#/${route}: the section failed to load`);
  if (state === 'not-found')
    throw new Error(`#/${route}: the section has no screen for this route (stale id?)`);
  // A `DeviceFrame` is a second document. The route is not on screen until the
  // page inside it has drawn its own screen too.
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    try {
      await frame.waitForSelector(screen, { state: 'attached', timeout });
    } catch {
      throw new Error(`#/${route}: the page inside the device frame drew no screen`);
    }
  }
  // The screen is in the document; let its effects run and any entrance
  // animation finish, so nothing is measured mid-fade. Endless animations — a
  // spinner, a skeleton's pulse — are not waited for.
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}

/**
 * Serves the app and calls `visit` once per route with a ready URL.
 *
 * The server is closed when the walk ends, so a tool cannot leak a port when a
 * route throws.
 */
export async function eachRoute(visit) {
  const server = await serve();
  const { port } = server.address();
  try {
    for (const { section, prefix, routes } of SECTIONS) {
      for (const route of routes) {
        const hash = `#/${prefix}${route}`;
        await visit({ section, route, label: hash, url: `http://127.0.0.1:${port}/${hash}` });
      }
    }
  } finally {
    server.close();
  }
}
