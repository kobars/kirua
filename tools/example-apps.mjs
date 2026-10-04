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

export const REPO = path.join(import.meta.dirname, '..');

/** The example app's source directory. */
export const EXAMPLES = path.join(REPO, 'examples');

/** The built app, which is what every tool measures. */
export const DIST = path.join(EXAMPLES, 'dist');

/**
 * Every route each section can show, without the section's prefix. `hub` is
 * the page at `#/`, which belongs to no section and has no prefix.
 *
 * Adding a route here adds it to every tool.
 */
export const SECTIONS = [
  { section: 'hub', prefix: '', routes: [''] },
  {
    section: 'shop',
    prefix: 'shop/',
    routes: [
      '',
      'products/round-glasses',
      'products/denim-jacket',
      'products/cabin-suitcase',
      'orders',
      'orders/DSK-24810',
      'sign-in',
      'checkout',
    ],
  },
  {
    section: 'his',
    prefix: 'his/',
    routes: [
      '',
      'patients',
      'schedule',
      'new-visit',
      'pharmacy',
      'lab',
      'patients/20418801',
      'patients/20418803',
    ],
  },
  {
    section: 'social',
    prefix: 'social/',
    routes: [
      '',
      'explore',
      'notifications',
      'messages',
      'profile/rin',
      'profile/maya',
      'profile/eko',
    ],
  },
  {
    section: 'assistant',
    prefix: 'assistant/',
    routes: [
      '',
      'tokens',
      'contrast',
      'rtl',
      'forced-colors',
      'dead-classes',
      'overlays',
      'usage',
    ],
  },
  {
    section: 'marketing',
    prefix: 'marketing/',
    routes: ['', 'pricing', 'story', 'guide', 'contact'],
  },
];

/** How many route views the whole sweep covers, for a tool's summary line. */
export const ROUTE_COUNT = SECTIONS.reduce((total, group) => total + group.routes.length, 0);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

/** A static server for the built app, on an ephemeral port. */
export function serve(root = DIST, { compress = false } = {}) {
  return new Promise((resolve) => {
    const server = createServer(async (request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const file = url.pathname === '/' ? '/index.html' : url.pathname;
      try {
        const body = await readFile(path.join(root, file));
        const gzip =
          compress &&
          /\bgzip\b/.test(request.headers['accept-encoding'] ?? '') &&
          /\.(html|js|css|svg)$/.test(file);
        response.writeHead(200, {
          'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
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
 * Opens a route and waits until its section has rendered.
 *
 * A section is a lazily loaded chunk, so `load` can fire before it arrives;
 * the loading state carries `data-section-loading` until it does. Entering a
 * different section starts from a blank page, so each section is measured in
 * a fresh document, as a visitor arriving by its link would see it, rather
 * than in whatever the previous section left behind.
 */
export async function open(page, url) {
  const section = (href) => new URL(href).hash.replace(/^#\/?/, '').split('/')[0];
  if (page.url() === 'about:blank' || section(page.url()) !== section(url)) {
    await page.goto('about:blank');
  }
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(
    () =>
      document.querySelector('[data-section-loading]') === null &&
      document.querySelector('#root > *') !== null,
  );
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
