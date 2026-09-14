/**
 * The five example applications, and how to serve their builds.
 *
 * Three tools walk the same routes — `responsive-check`, `a11y-check` and
 * `perf-check`. The table is here rather than in any one of them because a
 * copied list goes stale the moment a route is added to one tool and not the
 * others, and a route nothing visits is a route nothing checks.
 *
 * Every app is a hash-routed single page, so one document serves every route.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export const REPO = path.join(import.meta.dirname, '..');

/** Every route each app can show. Adding a route here adds it to all three tools. */
export const APPS = [
  {
    slug: 'claude',
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
    slug: 'shop',
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
    slug: 'simrs',
    routes: [
      '',
      'patients',
      'schedule',
      'new-visit',
      'pharmacy',
      'lab',
      'patients/RM-004128',
      'patients/RM-004130',
    ],
  },
  {
    slug: 'social',
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
    slug: 'marketing',
    routes: ['', 'pricing', 'story', 'guide', 'contact'],
  },
];

/** How many route views the whole sweep covers, for a tool's summary line. */
export const ROUTE_COUNT = APPS.reduce((total, app) => total + app.routes.length, 0);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

/** A static server for one app's `dist`, on an ephemeral port. */
export function serve(root, { compress = false } = {}) {
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

/** The built `dist` for one app, which is what every tool measures. */
export const distOf = (slug) => path.join(REPO, 'examples', slug, 'dist');

/**
 * Serves each app in turn and calls `visit` once per route with a ready URL.
 *
 * The server is closed before the next app starts, so at most one is listening
 * and a tool cannot leak a port when a route throws.
 */
export async function eachRoute(visit) {
  for (const { slug, routes } of APPS) {
    const server = await serve(distOf(slug));
    const { port } = server.address();
    try {
      for (const route of routes) {
        await visit({
          slug,
          route,
          label: route === '' ? '(index)' : route,
          url: `http://127.0.0.1:${port}/#/${route}`,
        });
      }
    } finally {
      server.close();
    }
  }
}
