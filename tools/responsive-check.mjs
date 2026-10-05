#!/usr/bin/env node
/**
 * Opens every route of the example app at five widths and fails on either of
 * two defects: a page that scrolls sideways, or a control too small to hit
 * with a finger.
 *
 * The `storybook:*` projects run every story at three widths, but a story is
 * one component. They cannot catch a shell whose sticky header is wider than
 * the viewport, or a table that scrolls its page instead of itself.
 *
 * ## Why five widths and not one
 *
 * A single width tests the size a phone *usually* is and none of the sizes
 * where a layout actually changes. A responsive shell does not stretch — it
 * swaps at a breakpoint, and a swap is where a layout breaks. The five widths
 * here are each a distinct question:
 *
 *   - **320** — the real floor. A Galaxy Fold's cover screen and an iPhone SE
 *     in a larger text size both land here, and 55 pixels below 375 is enough
 *     to overrun a row of `shrink-0` buttons that fits at 375.
 *   - **375** — the most common phone width.
 *   - **768** — `md`. Rails expand, drawers become sidebars.
 *   - **1024** — `lg`. The second column appears.
 *   - **1440** — a laptop. Catches a `max-w` that was never set, so a line of
 *     text runs the full width of the screen.
 *
 * ## The two assertions
 *
 * **Sideways scroll** is `scrollWidth === clientWidth` on the scrolling
 * element. On a failure the widest offending element is named, with its
 * `data-slot`.
 *
 * **Target size** is WCAG 2.5.8 (AA, 2.2): an interactive control must be at
 * least 24x24 CSS pixels, unless another target's centre is 24 pixels away or
 * it is an inline link in a sentence. Checked at the two phone widths only,
 * because the criterion is about a finger and a pointer is exempt. It is a
 * separate assertion from sideways scroll because the fixes are opposite: a
 * layout that overflows is usually fixed by making something smaller, and this
 * is fixed by making something bigger.
 *
 *     pnpm build:examples && node tools/responsive-check.mjs
 */
import { chromium } from 'playwright';
import { eachRoute, open, ROUTE_COUNT } from './example-apps.mjs';

const WIDTHS = [
  { width: 320, height: 812, phone: true },
  { width: 375, height: 812, phone: true },
  { width: 768, height: 1024, phone: false },
  { width: 1024, height: 800, phone: false },
  { width: 1440, height: 900, phone: false },
];

/** WCAG 2.5.8 Target Size (Minimum), AA in WCAG 2.2. */
const MIN_TARGET = 24;

const browser = await chromium.launch();
const rows = [];
const overflows = [];
const targets = [];

for (const size of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.phone ? 2 : 1,
    isMobile: size.phone,
    hasTouch: size.phone,
  });
  const page = await context.newPage();

  await eachRoute(async ({ section, label, url }) => {
    await open(page, url);
    // A hash change does not reload the document, so give React a frame to
    // render the new route before measuring.
    await page.waitForTimeout(200);

    const result = await page.evaluate(
      ({ minTarget, checkTargets }) => {
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

        const small = [];
        if (checkTargets) {
          const CONTROLS =
            'a[href], button, input, select, textarea, [role="button"], [tabindex]';

          // Everything a finger can actually aim at, which is not everything
          // that matches the selector. Three kinds are excluded, and each
          // exclusion is a rule rather than a convenience:
          //
          //  - **Hidden from the accessibility tree.** Radix renders a real
          //    `<select>` behind its own listbox so a form still submits. It is
          //    `aria-hidden` and 1x1, and nobody taps it.
          //  - **A label that owns a control.** Clicking a `<label>` activates
          //    its input, so a 20-pixel checkbox beside a 40-pixel label is one
          //    40-pixel target, not a 20-pixel one.
          //  - **An inline link in a sentence**, which WCAG 2.5.8 exempts by
          //    name: its height is the line height of the prose around it and
          //    cannot be raised without respacing the paragraph.
          const hidden = (el) => el.closest('[aria-hidden="true"]') !== null;

          const inSentence = (el) => {
            if (el.tagName !== 'A') return false;
            if (!getComputedStyle(el).display.startsWith('inline')) return false;
            const parent = el.parentElement;
            if (!parent) return false;
            // Text in the parent that is not this link's own — a sentence.
            return parent.textContent.replace(el.textContent, '').trim().length > 0;
          };

          // The control and its label as one rectangle: the union of the two,
          // with every edge the spacing test below reads.
          const boxOf = (el) => {
            const own = el.getBoundingClientRect();
            const label = el.id
              ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
              : null;
            const wrapping = el.closest('label');
            const partner = label ?? wrapping;
            if (!partner) return own;
            const both = partner.getBoundingClientRect();
            const left = Math.min(own.left, both.left);
            const top = Math.min(own.top, both.top);
            const right = Math.max(own.right, both.right);
            const bottom = Math.max(own.bottom, both.bottom);
            return {
              left,
              top,
              right,
              bottom,
              x: left,
              y: top,
              width: right - left,
              height: bottom - top,
            };
          };

          const aimed = [];
          for (const el of document.querySelectorAll(CONTROLS)) {
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            if (hidden(el) || inSentence(el)) continue;
            const box = boxOf(el);
            // Off the screen entirely — a closed drawer, or an `sr-only` label.
            if (box.width === 0 || box.height === 0) continue;
            aimed.push({ el, box });
          }

          // WCAG 2.5.8's spacing exception: an undersized target still passes
          // when a 24-pixel circle centred on it touches no other target's
          // circle OR actual rectangle. Comparing centres alone misses a
          // small slider immediately below a wide accordion trigger.
          const centre = (b) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
          for (const { el, box } of aimed) {
            if (box.width >= minTarget && box.height >= minTarget) continue;
            const a = centre(box);
            const crowded = aimed.some(({ el: other, box: otherBox }) => {
              if (other === el) return false;
              const b = centre(otherBox);
              const nearestX = Math.max(otherBox.left, Math.min(a.x, otherBox.right));
              const nearestY = Math.max(otherBox.top, Math.min(a.y, otherBox.bottom));
              return (
                Math.hypot(a.x - nearestX, a.y - nearestY) < minTarget / 2 ||
                ((otherBox.width < minTarget || otherBox.height < minTarget) &&
                  Math.hypot(a.x - b.x, a.y - b.y) < minTarget)
              );
            });
            if (!crowded) continue;
            small.push({
              tag: el.tagName.toLowerCase(),
              slot: el.getAttribute('data-slot'),
              name: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 32),
              w: Math.round(box.width),
              h: Math.round(box.height),
            });
          }
        }

        return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, widest, small };
      },
      { minTarget: MIN_TARGET, checkTargets: size.phone },
    );

    const ok = result.scrollWidth === result.clientWidth;
    rows.push({
      section,
      route: label,
      width: size.width,
      scrollWidth: result.scrollWidth,
      small: result.small.length,
      status: ok ? 'ok' : 'OVERFLOWS',
    });

    if (!ok) {
      const w = result.widest;
      overflows.push(
        `${section} ${label} at ${size.width}px: scrollWidth ${result.scrollWidth} > clientWidth ${result.clientWidth}` +
          (w
            ? ` — widest is <${w.tag}${w.slot ? ` data-slot="${w.slot}"` : ''}> ending at ${w.right}px`
            : ''),
      );
    }

    for (const s of result.small) {
      targets.push(
        `${section} ${label} at ${size.width}px: <${s.tag}${s.slot ? ` data-slot="${s.slot}"` : ''}>` +
          ` "${s.name}" is ${s.w}x${s.h}, under ${MIN_TARGET}x${MIN_TARGET}`,
      );
    }
  });

  await context.close();
}

await browser.close();

console.log(
  `\n${ROUTE_COUNT} routes at ${WIDTHS.map((w) => w.width).join(', ')} pixels wide:\n`,
);
console.table(rows.filter((r) => r.status !== 'ok' || r.small > 0));

if (overflows.length > 0) {
  console.error('\nresponsive-check: a page scrolls sideways.\n');
  for (const failure of overflows) console.error(`  - ${failure}`);
}

if (targets.length > 0) {
  console.error(
    `\nresponsive-check: a control is under ${MIN_TARGET}x${MIN_TARGET} on a phone.\n`,
  );
  // The same control on every route is one defect, so collapse by description.
  for (const failure of [...new Set(targets.map((t) => t.replace(/#\/\S+/, '#/…')))]) {
    console.error(`  - ${failure}`);
  }
}

if (overflows.length > 0 || targets.length > 0) process.exit(1);

console.log(
  `\nresponsive-check: ${rows.length} route views, none scroll sideways, ` +
    `every control at least ${MIN_TARGET}x${MIN_TARGET} on a phone.`,
);
