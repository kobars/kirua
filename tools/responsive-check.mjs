#!/usr/bin/env node
/**
 * Opens every route of every example application at 375 pixels wide and fails
 * if the page scrolls sideways.
 *
 * The `storybook:*` projects run every story at three widths, but a story is
 * one component. They cannot catch a shell whose sticky header is wider than
 * the viewport, or a table that scrolls its page instead of itself.
 *
 * The measurement is `scrollWidth === clientWidth` on the scrolling element.
 * On a failure the widest offending element is named, with its `data-slot`.
 *
 *     pnpm build:examples && node tools/responsive-check.mjs
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const REPO = path.join(import.meta.dirname, '..');
const WIDTH = 375;
const HEIGHT = 812;

/** Every route each app can show. Hash routes, so one document each. */
const APPS = [
  { slug: 'claude', routes: ['', 'tokens', 'contrast', 'rtl'] },
  {
    slug: 'shop',
    routes: [
      '',
      'produk/kacamata-bulat',
      'produk/jaket-denim',
      'produk/koper-kabin',
      'pesanan',
      'pesanan/SNJ-24810',
      'masuk',
      'checkout',
    ],
  },
  {
    slug: 'simrs',
    routes: [
      '',
      'pasien',
      'jadwal',
      'kunjungan-baru',
      'farmasi',
      'lab',
      'pasien/RM-004128',
      'pasien/RM-004130',
    ],
  },
  {
    slug: 'social',
    routes: ['', 'jelajah', 'notifikasi', 'pesan', 'profil/rin', 'profil/maya', 'profil/eko'],
  },
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/** A static server for one app's `dist`, on an ephemeral port. */
function serve(root) {
  return new Promise((resolve) => {
    const server = createServer(async (request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const file = url.pathname === '/' ? '/index.html' : url.pathname;
      try {
        const body = await readFile(path.join(root, file));
        response.writeHead(200, {
          'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
        });
        response.end(body);
      } catch {
        response.writeHead(404).end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

const rows = [];
const failures = [];

for (const { slug, routes } of APPS) {
  const server = await serve(path.join(REPO, 'examples', slug, 'dist'));
  const { port } = server.address();

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${port}/#/${route}`, { waitUntil: 'load' });
    // A hash change does not reload the document, so give React a frame to
    // render the new route before measuring.
    await page.waitForTimeout(250);

    const result = await page.evaluate(() => {
      const root = document.scrollingElement ?? document.documentElement;
      // An element inside a horizontal scroller reports its full width from
      // `getBoundingClientRect` even though the page never scrolls for it, so
      // the widest box on the page is usually a table that is behaving. Skip
      // anything an ancestor clips, and what is left is the actual cause.
      const clipped = (el) => {
        for (
          let node = el.parentElement;
          node && node !== document.body;
          node = node.parentElement
        ) {
          const style = getComputedStyle(node);
          if (style.overflowX !== 'visible' || style.overflowY !== 'visible') return true;
        }
        return false;
      };

      const widest = [...document.querySelectorAll('body *')]
        .filter((el) => !clipped(el))
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          slot: el.getAttribute('data-slot'),
          right: Math.round(el.getBoundingClientRect().right),
        }))
        .filter((el) => el.right > root.clientWidth + 1)
        .sort((a, b) => b.right - a.right)[0];

      return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, widest };
    });

    const ok = result.scrollWidth === result.clientWidth;
    rows.push({
      app: slug,
      route: route === '' ? '(index)' : route,
      scrollWidth: result.scrollWidth,
      clientWidth: result.clientWidth,
      status: ok ? 'ok' : 'OVERFLOWS',
    });

    if (!ok) {
      const w = result.widest;
      failures.push(
        `${slug} #/${route}: scrollWidth ${result.scrollWidth} > clientWidth ${result.clientWidth}` +
          (w
            ? ` — widest is <${w.tag}${w.slot ? ` data-slot="${w.slot}"` : ''}> ending at ${w.right}px`
            : ''),
      );
    }
  }

  server.close();
}

await browser.close();

console.log(`\nEvery route at ${WIDTH}x${HEIGHT}, scrollWidth vs clientWidth:\n`);
console.table(rows);

if (failures.length > 0) {
  console.error('\nresponsive-check: a page scrolls sideways on a phone.\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\nresponsive-check: ${rows.length} routes, none scroll sideways.`);
