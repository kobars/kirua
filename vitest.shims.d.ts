/**
 * `@vitest/browser-playwright` re-exports `@vitest/browser/context`, which in
 * turn imports `./matchers.js` — and *that* is what declares `toMatchScreenshot`
 * on `expect(...)`. So this one reference carries the whole browser matcher
 * surface the `visual` project is built on.
 *
 * This file is only read because `tsconfig.app.json` names it in `include`: it
 * sits outside `src`, which `include: ["src"]` does not reach. Deleting either
 * one fails the build on `toMatchScreenshot`.
 */
/// <reference types="@vitest/browser-playwright" />

/** The custom browser commands `vite.config.ts` registers. */
declare module 'vitest/browser' {
  interface BrowserCommands {
    ariaSnapshot: (selector: string) => Promise<string>;
  }
}

export {};
