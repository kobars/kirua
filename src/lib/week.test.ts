import { afterEach, describe, expect, it } from 'vitest';
import { firstWeekday } from './week';

const proto = Intl.Locale.prototype;
const saved = {
  getWeekInfo: Object.getOwnPropertyDescriptor(proto, 'getWeekInfo'),
  weekInfo: Object.getOwnPropertyDescriptor(proto, 'weekInfo'),
};

/** Shadows an accessor on the prototype, as an engine without it would. */
function stub(name: keyof typeof saved, descriptor: PropertyDescriptor) {
  Object.defineProperty(proto, name, { configurable: true, ...descriptor });
}

afterEach(() => {
  for (const [name, descriptor] of Object.entries(saved)) {
    if (descriptor === undefined) Reflect.deleteProperty(proto, name);
    else Object.defineProperty(proto, name, descriptor);
  }
});

describe('firstWeekday', () => {
  it('converts Intl numbering to Date.getDay numbering', () => {
    stub('getWeekInfo', { value: () => ({ firstDay: 7 }) });
    expect(firstWeekday('en-US')).toBe(0);
    stub('getWeekInfo', { value: () => ({ firstDay: 1 }) });
    expect(firstWeekday('en-GB')).toBe(1);
  });

  it('reads the older weekInfo getter when getWeekInfo is missing', () => {
    stub('getWeekInfo', { value: undefined });
    stub('weekInfo', { get: () => ({ firstDay: 6 }) });
    expect(firstWeekday('ar-EG')).toBe(6);
  });

  it('falls back by region when neither accessor exists', () => {
    stub('getWeekInfo', { value: undefined });
    stub('weekInfo', { get: () => undefined });
    expect(firstWeekday('en-US')).toBe(0);
    expect(firstWeekday('en')).toBe(0);
    expect(firstWeekday('ja-JP')).toBe(0);
    expect(firstWeekday('en-GB')).toBe(1);
    expect(firstWeekday('de-DE')).toBe(1);
  });

  it('starts on Monday for a tag that is not a locale', () => {
    expect(firstWeekday('not a tag')).toBe(1);
  });
});
