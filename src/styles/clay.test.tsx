import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Button, ButtonGroup, Card } from '@/components';
import { CARD_EDGE_PX } from '@/lib/radius';
import NIGHTS from '@/styles/nights.json';
import { cleanup, render } from '@/test/render';

/**
 * The Clay shapes break in ways nothing else here would see: a shadow that
 * stops mirroring in a right-to-left page, a geometry that drifts between
 * light mode and one of the nights, a class override that strips the press,
 * a joined button group that starts reading as three buttons, and a hover
 * colour that sticks after a tap on a touch screen.
 */

const root = document.documentElement;

afterEach(() => {
  cleanup();
  root.classList.remove('dark');
  delete root.dataset['nightPalette'];
});

/** The x and y offsets of each outer shadow, in px. */
const offsets = (boxShadow: string) =>
  boxShadow === 'none'
    ? []
    : boxShadow
        .split(/,(?![^(]*\))/)
        .filter((shadow) => !shadow.includes('inset'))
        .map((shadow) => {
          const [x = Number.NaN, y = Number.NaN] = [
            ...shadow.replace(/\([^)]*\)/g, '').matchAll(/(-?[\d.]+)px/g),
          ].map((match) => Number(match[1]));
          return { x, y };
        });

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement;

function shadows(dir: 'ltr' | 'rtl') {
  const container = render(
    <div dir={dir}>
      <Card>Order</Card>
      <Button>Pay</Button>
    </div>,
  );
  const result = {
    card: offsets(getComputedStyle(slot(container, 'card')).boxShadow),
    button: offsets(getComputedStyle(slot(container, 'button')).boxShadow),
  };
  cleanup();
  return result;
}

const inEveryNight = (check: (night: string) => void) => {
  root.classList.add('dark');
  for (const night of NIGHTS) {
    if (night === NIGHTS[0]) delete root.dataset['nightPalette'];
    else root.dataset['nightPalette'] = night;
    check(night);
  }
};

describe('the offset shadow', () => {
  it('falls towards the end of the line, and mirrors in a right-to-left subtree', () => {
    const ltr = shadows('ltr');
    const rtl = shadows('rtl');

    expect(ltr.card).toEqual([{ x: 6, y: 6 }]);
    expect(ltr.button).toEqual([{ x: 4, y: 4 }]);
    expect(rtl.card).toEqual(ltr.card.map(({ x, y }) => ({ x: -x, y })));
    expect(rtl.button).toEqual(ltr.button.map(({ x, y }) => ({ x: -x, y })));
  });

  it('keeps one geometry in light mode and in every night', () => {
    const light = { ltr: shadows('ltr'), rtl: shadows('rtl') };
    inEveryNight((night) => {
      expect({ ltr: shadows('ltr'), rtl: shadows('rtl') }, night).toEqual(light);
    });
  });

  it('is cast only by the light card: a black or brand card stays flat', () => {
    const container = render(
      <>
        <Card variant="dark" />
        <Card variant="brand" />
        <Card variant="ghost" />
      </>,
    );
    const [dark, brand, ghost] = [...container.querySelectorAll('[data-slot="card"]')].map(
      (card) => getComputedStyle(card),
    );
    expect(offsets(dark!.boxShadow)).toEqual([]);
    expect(offsets(brand!.boxShadow)).toEqual([]);
    expect(dark!.borderTopWidth).toBe(`${CARD_EDGE_PX}px`);
    expect(brand!.borderTopWidth).toBe(`${CARD_EDGE_PX}px`);
    expect(ghost!.borderTopWidth).toBe('0px');
  });

  /**
   * The card's line and shade are mixed from the surface they sit on, and a
   * custom property is mixed where it is declared: a context that does not
   * declare them again hands its cards the white page's pale line.
   */
  it.each(['ctx-brand bg-brand', 'ctx-inverse bg-page'])(
    'gives a light card inside %s that surface’s line and shade, in light mode and dark',
    (contextClass) => {
      const check = (mode: string) => {
        const container = render(
          <>
            <Card>Page</Card>
            <div className={contextClass}>
              <Card>Context</Card>
            </div>
          </>,
        );
        const [page, inside] = [...container.querySelectorAll('[data-slot="card"]')].map(
          (card) => getComputedStyle(card),
        );
        expect(inside!.borderTopColor, mode).not.toBe(page!.borderTopColor);
        expect(inside!.borderTopColor, mode).not.toBe(inside!.backgroundColor);
        expect(inside!.boxShadow, mode).not.toBe(page!.boxShadow);
        cleanup();
      };
      check('light');
      inEveryNight(check);
    },
  );
});

describe('the Clay button', () => {
  const read = (button: Element) => {
    const computed = getComputedStyle(button);
    return [
      computed.borderTopWidth,
      computed.backgroundImage.startsWith('linear-gradient'),
      offsets(computed.boxShadow),
    ];
  };

  it('survives a class override that drops the variant colour', () => {
    const geometry = () => {
      const container = render(
        <>
          <Button>Plain</Button>
          {/* `cn` drops `bg-primary` for this class; the variant is still primary. */}
          <Button className="bg-ghost-hover">Restyled</Button>
        </>,
      );
      const [plain, restyled] = [...container.querySelectorAll('[data-slot="button"]')];
      expect(restyled?.classList.contains('bg-primary')).toBe(false);
      const result = { plain: read(plain!), restyled: read(restyled!) };
      cleanup();
      return result;
    };

    const light = geometry();
    expect(light.plain).toEqual([`${CARD_EDGE_PX}px`, true, [{ x: 4, y: 4 }]]);
    expect(light.restyled).toEqual(light.plain);
    inEveryNight((night) => expect(geometry(), night).toEqual(light));
  });

  it('keeps its edge width while loading or disabled, and drops the press', () => {
    const container = render(
      <>
        <Button loading>Saving</Button>
        <Button disabled variant="secondary">
          Closed
        </Button>
      </>,
    );
    for (const button of container.querySelectorAll('[data-slot="button"]')) {
      const [width, gradient, shadow] = read(button);
      expect(width).toBe(`${CARD_EDGE_PX}px`);
      expect(gradient).toBe(false);
      expect(shadow).toEqual([]);
    }
  });

  it('keeps the plain shape inside a joined group, so the group reads as one control', () => {
    const container = render(
      <ButtonGroup aria-label="View">
        <Button>Grid</Button>
        <Button variant="secondary">List</Button>
      </ButtonGroup>,
    );
    const [primary, secondary] = [...container.querySelectorAll('[data-slot="button"]')];
    expect(read(primary!)).toEqual(['0px', false, []]);
    expect(read(secondary!)).toEqual(['2px', false, []]);
    // The joined edge stays square.
    expect(getComputedStyle(primary!).borderEndEndRadius).toBe('0px');
    expect(getComputedStyle(secondary!).borderStartStartRadius).toBe('0px');
  });

  it('steps aside for the plain fill on a brand surface', () => {
    const container = render(
      <div className="ctx-brand">
        <Button>Start</Button>
      </div>,
    );
    const button = slot(container, 'button');
    const style = getComputedStyle(button);
    expect(style.backgroundImage).not.toMatch(/rgb\(/);
    expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('casts a brand surface’s own shade, not the page’s', () => {
    const container = render(
      <>
        <Button>Page</Button>
        <div className="ctx-brand">
          <Button>Panel</Button>
        </div>
      </>,
    );
    const [page, panel] = [...container.querySelectorAll('[data-slot="button"]')].map(
      (button) => getComputedStyle(button).boxShadow,
    );
    expect(panel).not.toBe(page);
  });

  it('lifts under the pointer and casts a longer shadow', async () => {
    const container = render(<Button>Lift</Button>);
    const button = slot(container, 'button');
    await userEvent.hover(button);
    // After the spring has settled.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const style = getComputedStyle(button);
    expect(style.translate).toBe('0px -2px');
    expect(offsets(style.boxShadow)).toEqual([{ x: 6, y: 6 }]);
  });
});

describe('a hover rule never sticks after a tap', () => {
  /**
   * After a tap on a touch screen `:hover` stays on the element, so any colour
   * a hover rule sets stays too. Every `:hover` rule in the shipped sheets must
   * therefore sit under `(hover: hover)`, which a touch screen does not match.
   */
  it('every :hover rule waits for a pointer that can hover', () => {
    const offenders: string[] = [];
    let hovering = 0;
    const walk = (rules: CSSRuleList, conditions: string[], selector: string) => {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          const full = rule.selectorText.includes('&')
            ? rule.selectorText.replaceAll('&', selector)
            : rule.selectorText;
          if (full.includes(':hover') && rule.style.length > 0) {
            hovering += 1;
            if (!conditions.some((condition) => /\(hover: ?hover\)/.test(condition)))
              offenders.push(full);
          }
          walk(rule.cssRules, conditions, full);
        } else if (rule instanceof CSSMediaRule) {
          walk(rule.cssRules, [...conditions, rule.conditionText], selector);
        } else if (rule instanceof CSSGroupingRule) {
          walk(rule.cssRules, conditions, selector);
        }
      }
    };
    for (const sheet of document.styleSheets) walk(sheet.cssRules, [], '');
    expect(hovering).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
