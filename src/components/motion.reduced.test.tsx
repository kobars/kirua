import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Card } from './Card';
import { Carousel } from './Carousel';

afterEach(cleanup);

/**
 * Reduced motion, emulated through the browser context — see the
 * `reduced-motion` project in `vite.config.ts`.
 *
 * `prefers-reduced-motion: reduce` is what a person sets when movement on a
 * screen makes them ill. Vestibular disorders are the usual reason, and the
 * symptoms are nausea and vertigo rather than mild annoyance. The base layer
 * answers it by flattening every animation and transition to `0.01ms`.
 *
 * That rule carries `!important` and lives in `@layer base`, which reads like a
 * mistake and is not: **importance reverses layer order**, so an `!important`
 * declaration in the *lowest* layer beats an `!important` declaration in a
 * higher one. It is the strongest thing in the cascade. The forced-colors rules
 * had to leave `base` entirely for exactly the opposite reason — they carry no
 * `!important`, so a plain utility outranked them.
 *
 * Nothing asserted any of this. The rule could have been deleted, moved out of
 * the media query, or lost its `!important`, and every other test here would
 * still pass — a `Dialog` that animates for 200ms looks correct to axe, to a
 * screenshot taken after it settles, and to a person who does not have the
 * preference set.
 */

it('the emulation is actually on, or every assertion below is vacuous', () => {
  expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
});

/**
 * Read in milliseconds. `getComputedStyle` reports these as a seconds string
 * — `"0.00001s"` — and comparing that text would break the first time a browser
 * chose to print it differently.
 */
const ms = (value: string) => Number.parseFloat(value) * 1000;

describe('every declared animation is flattened, not merely shortened', () => {
  /**
   * The five names are the whole `--animate-*` scale from `animations.css`, and
   * they are the exit animations Radix depends on: it keeps a node mounted on
   * `data-state="closed"` only for as long as a *named* animation runs.
   *
   * So the assertion is deliberately two-sided. The duration must collapse, and
   * the animation must still be **named** — a rule that set `animation: none`
   * would satisfy "no motion" and silently strand every closing overlay in the
   * DOM instead.
   *
   * The class strings are written out **literally**, and that is not style.
   * Tailwind finds classes by scanning source text, so a computed
   * `` `animate-${name}` `` is invisible to it and the utility is never
   * generated — the first draft of this file did exactly that and every
   * assertion read `animationName: none`, which looks identical to a rule that
   * stopped working.
   */
  const ANIMATIONS = [
    ['fade-in', 'animate-fade-in'],
    ['fade-out', 'animate-fade-out'],
    ['pop-in', 'animate-pop-in'],
    ['pop-out', 'animate-pop-out'],
    ['slide-down', 'animate-slide-down'],
  ] as const;

  it.each(ANIMATIONS)('animate-%s', (name, className) => {
    const style = getComputedStyle(
      render(<Card className={className} />).querySelector('[data-slot="card"]')!,
    );

    expect(style.animationName).toBe(name);
    expect(ms(style.animationDuration)).toBeLessThan(1);
    expect(style.animationIterationCount).toBe('1');
  });
});

describe('transitions are flattened too', () => {
  /**
   * Every interactive component in this system uses `transition-colors` for its
   * hover and focus states, so this is the single utility that would carry
   * motion into a hover if the rule stopped applying.
   */
  it('transition-colors collapses', () => {
    const style = getComputedStyle(
      render(<Card className="transition-colors duration-500" />).querySelector(
        '[data-slot="card"]',
      )!,
    );

    expect(ms(style.transitionDuration)).toBeLessThan(1);
  });
});

/**
 * **The other half of the proof lives in `src/styles/motion.test.ts`**, which
 * runs in the `unit:*` projects with no preference set and asserts that the very
 * same `transition-colors duration-500` computes to `0.5s` there.
 *
 * Neither half means much alone. A test that only ever sees the flattened value
 * cannot tell a working media query from a `duration-500` utility that never
 * generated — both read as "not 500ms". The pair is what pins the difference to
 * the preference, and the two files name each other so the link is not lost.
 */

it('the carousel does not animate scrolling when reduced motion is requested', () => {
  const carousel = render(<Carousel label="Artwork" />).querySelector(
    '[data-slot="carousel"]',
  )!;
  expect(getComputedStyle(carousel).scrollBehavior).toBe('auto');
});
