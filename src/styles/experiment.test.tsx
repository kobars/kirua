/* oxlint-disable import/default -- Vite ?raw imports load source text, not a module. */
import experimentCss from './experiment.css?raw';
import styleExperimentSource from '../../examples/shared/styleExperiment.ts?raw';
import themeMenuSource from '../../examples/shared/ThemeMenu.tsx?raw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Button, Card } from '@/components';
import { cleanup, render } from '@/test/render';

/**
 * TEMPORARY, with `experiment.css`. Guards what breaks there without a visible
 * error: a hover colour that sticks after a tap, shadows that do not mirror,
 * night colours copied by hand, and button rules keyed to utility classes.
 */

const NIGHTS = ['navy', 'graphite', 'onyx', 'ink', 'carbon'] as const;

/** Every style rule in the sheet, with the conditions it sits under. */
function styleRules(): { rule: CSSStyleRule; conditions: string[] }[] {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(experimentCss);
  const found: { rule: CSSStyleRule; conditions: string[] }[] = [];
  const walk = (rules: CSSRuleList, conditions: string[]) => {
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) found.push({ rule, conditions });
      else if (rule instanceof CSSMediaRule)
        walk(rule.cssRules, [...conditions, rule.conditionText]);
      else if (rule instanceof CSSGroupingRule) walk(rule.cssRules, conditions);
    }
  };
  walk(sheet.cssRules, []);
  return found;
}

describe('the experiment stylesheet', () => {
  it('changes colour on hover only where the pointer can hover', () => {
    const hovering = styleRules().filter(({ rule }) => rule.selectorText.includes(':hover'));
    expect(hovering.length).toBeGreaterThan(0);
    for (const { rule, conditions } of hovering) {
      expect(
        conditions.some((condition) => /\(hover: ?hover\)/.test(condition)),
        rule.selectorText,
      ).toBe(true);
    }
  });

  it('selects buttons by data-variant, not by a utility class', () => {
    expect(experimentCss).not.toMatch(/\.bg-(primary|secondary|danger)\b/);
    const buttonRules = styleRules().filter(({ rule }) =>
      rule.selectorText.includes('data-slot="button"]'),
    );
    expect(
      buttonRules.some(({ rule }) => rule.selectorText.includes('data-variant="primary"')),
    ).toBe(true);
  });

  it('writes each night colour once, and nowhere else', () => {
    const palettes = styleRules().filter(({ rule }) =>
      rule.selectorText.includes('data-night-swatch'),
    );
    expect(
      palettes.map(({ rule }) => /data-night-swatch="([a-z]+)"/.exec(rule.selectorText)?.[1]),
    ).toEqual([...NIGHTS]);

    const declared = new Map<string, number>();
    for (const { rule } of palettes) {
      const names = [...rule.style].filter((name) => name.startsWith('--exp-night-'));
      expect(names).toHaveLength(7);
      for (const name of names) {
        const value = rule.style.getPropertyValue(name).trim().toLowerCase();
        declared.set(value, (declared.get(value) ?? 0) + 1);
      }
    }

    for (const [hex, palettesUsingIt] of declared) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
      // Pure black is three nights' shade; any other colour belongs to one.
      const inCss = experimentCss.toLowerCase().split(hex).length - 1;
      expect(inCss, hex).toBe(palettesUsingIt);
      expect(styleExperimentSource.toLowerCase(), hex).not.toContain(hex);
      expect(themeMenuSource.toLowerCase(), hex).not.toContain(hex);
    }
  });
});

describe('the experiment on a page', () => {
  const root = document.documentElement;
  let style: HTMLStyleElement;

  beforeAll(() => {
    style = document.createElement('style');
    style.textContent = experimentCss;
    document.head.append(style);
  });

  afterAll(() => style.remove());

  afterEach(() => {
    cleanup();
    delete root.dataset['styleExperiment'];
    delete root.dataset['nightPalette'];
    root.classList.remove('dark');
  });

  /** The x and y offsets of each outer shadow, in px. */
  const offsets = (boxShadow: string) =>
    boxShadow
      .split(/,(?![^(]*\))/)
      .filter((shadow) => !shadow.includes('inset'))
      .map((shadow) => {
        const [x = NaN, y = NaN] = [
          ...shadow.replace(/\([^)]*\)/g, '').matchAll(/(-?[\d.]+)px/g),
        ].map((match) => Number(match[1]));
        return { x, y };
      });

  function shadows(dir: 'ltr' | 'rtl') {
    const container = render(
      <div dir={dir}>
        <Card>Order</Card>
        <Button>Pay</Button>
      </div>,
    );
    const read = (slot: string) =>
      offsets(
        getComputedStyle(container.querySelector(`[data-slot="${slot}"]`) as Element).boxShadow,
      );
    const result = { card: read('card'), button: read('button') };
    cleanup();
    return result;
  }

  it.each(['clay', 'hybrid-clay'])(
    'mirrors %s shadows in a right-to-left subtree',
    (variant) => {
      root.dataset['styleExperiment'] = variant;
      const ltr = shadows('ltr');
      const rtl = shadows('rtl');

      expect(ltr.card[0]?.x).toBe(6);
      expect(ltr.button[0]?.x).toBe(4);
      expect(rtl.card).toEqual(ltr.card.map(({ x, y }) => ({ x: -x, y })));
      expect(rtl.button).toEqual(ltr.button.map(({ x, y }) => ({ x: -x, y })));
    },
  );

  it('keeps one shadow geometry for hybrid-clay in light mode and in every night', () => {
    root.dataset['styleExperiment'] = 'hybrid-clay';
    const light = { ltr: shadows('ltr'), rtl: shadows('rtl') };
    root.classList.add('dark');
    for (const night of NIGHTS) {
      if (night === 'navy') delete root.dataset['nightPalette'];
      else root.dataset['nightPalette'] = night;
      expect({ ltr: shadows('ltr'), rtl: shadows('rtl') }, night).toEqual(light);
    }
  });

  it('shows every night on its swatch while the page is light', () => {
    root.dataset['styleExperiment'] = 'hybrid-clay';
    const container = render(
      <>
        {NIGHTS.map((night) => (
          <span key={night} data-night-swatch={night} />
        ))}
      </>,
    );
    const colours = NIGHTS.map((night) => {
      const swatch = getComputedStyle(
        container.querySelector(`[data-night-swatch="${night}"]`) as Element,
      );
      return [
        swatch.getPropertyValue('--exp-night-page'),
        swatch.getPropertyValue('--exp-night-raised'),
      ];
    });
    for (const [page, raised] of colours) {
      expect(page).toMatch(/^#[0-9a-f]{6}$/);
      expect(raised).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(new Set(colours.map(([page]) => page)).size).toBe(NIGHTS.length);
  });

  it('keeps the Clay button when a class override drops the variant utility', () => {
    const geometry = () => {
      const container = render(
        <>
          <Button>Plain</Button>
          {/* `cn` drops `bg-primary` for this class; the variant is still primary. */}
          <Button className="bg-ghost-hover">Restyled</Button>
        </>,
      );
      const read = (button: Element) => {
        const computed = getComputedStyle(button);
        return [
          computed.borderTopWidth,
          computed.backgroundImage.startsWith('linear-gradient'),
          offsets(computed.boxShadow),
        ];
      };
      const [plain, restyled] = [...container.querySelectorAll('[data-slot="button"]')];
      expect(restyled?.classList.contains('bg-primary')).toBe(false);
      const result = { plain: read(plain as Element), restyled: read(restyled as Element) };
      cleanup();
      return result;
    };

    root.dataset['styleExperiment'] = 'hybrid-clay';
    const light = geometry();
    expect(light.plain).toEqual(['3px', true, [{ x: 4, y: 4 }]]);
    expect(light.restyled).toEqual(light.plain);

    root.classList.add('dark');
    for (const night of NIGHTS) {
      if (night === 'navy') delete root.dataset['nightPalette'];
      else root.dataset['nightPalette'] = night;
      expect(geometry(), night).toEqual(light);
    }
  });
});
