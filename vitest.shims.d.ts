/**
 * `@vitest/browser-playwright` re-exports `@vitest/browser/context`, which in
 * turn imports `./matchers.js` — and *that* is what declares `toMatchScreenshot`
 * on `expect(...)`. So this one reference carries the whole browser matcher
 * surface the `visual` project is built on.
 *
 * This file is only read because `tsconfig.app.json` names it in `include`. It
 * sits outside `src`, and `include: ["src"]` did not reach it — so it was inert
 * from the commit that added it until the commit that added that line. Deleting
 * either one now fails the build on `toMatchScreenshot`, which is how it should
 * have read all along.
 */
/// <reference types="@vitest/browser-playwright" />
