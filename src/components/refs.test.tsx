import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import {
  AvatarStack,
  Badge,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Chip,
  CornerGlint,
  DotGrid,
  IconButton,
  NavBar,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stat,
  StatRow,
} from './index';

afterEach(cleanup);

/**
 * The contract is that a ref reaches the rendered root, and that the element it
 * reaches is the tag the component documents. Both halves matter: a ref that
 * silently lands on a wrapper measures the wrong box, and `ref.current !== null`
 * alone would not notice.
 *
 * Every hand-written component is listed. That is the point — the defect this
 * replaces was that not one of them accepted a ref, and a list with holes in it
 * would have passed then too.
 */
const cases: Array<[string, (ref: React.Ref<never>) => React.ReactElement, string]> = [
  ['Button', (ref) => <Button ref={ref}>Go</Button>, 'BUTTON'],
  [
    'IconButton',
    (ref) => (
      <IconButton ref={ref} aria-label="Search">
        i
      </IconButton>
    ),
    'BUTTON',
  ],
  ['Badge', (ref) => <Badge ref={ref}>New</Badge>, 'SPAN'],
  ['Chip', (ref) => <Chip ref={ref}>Tag</Chip>, 'SPAN'],
  ['AvatarStack', (ref) => <AvatarStack ref={ref} items={[{ name: 'Rin' }]} />, 'SPAN'],
  ['DotGrid', (ref) => <DotGrid ref={ref} />, 'SPAN'],
  ['CornerGlint', (ref) => <CornerGlint ref={ref} />, 'SPAN'],
  ['Card', (ref) => <Card ref={ref} />, 'DIV'],
  ['CardEyebrow', (ref) => <CardEyebrow ref={ref} />, 'P'],
  ['CardTitle', (ref) => <CardTitle ref={ref} />, 'H3'],
  ['CardBody', (ref) => <CardBody ref={ref} />, 'P'],
  ['CardFooter', (ref) => <CardFooter ref={ref} />, 'DIV'],
  ['Stat', (ref) => <Stat ref={ref} value="100k" label="Likes" />, 'DIV'],
  ['StatRow', (ref) => <StatRow ref={ref} />, 'DIV'],
  ['NavBar', (ref) => <NavBar ref={ref} items={[]} />, 'NAV'],
  ['SpotlightPanel', (ref) => <SpotlightPanel ref={ref} />, 'DIV'],
  ['SpotlightMedia', (ref) => <SpotlightMedia ref={ref} />, 'DIV'],
  ['SpotlightContent', (ref) => <SpotlightContent ref={ref} />, 'DIV'],
];

describe('every component passes its ref to the rendered root', () => {
  it.each(cases)('%s', (_name, element, tagName) => {
    const ref = createRef<HTMLElement>();
    render(element(ref as React.Ref<never>));

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe(tagName);
  });

  /**
   * `asChild` renders the child's tag, so at runtime the ref lands on an `<a>`.
   * The *type* still says `HTMLButtonElement`, because `ButtonProps` extends
   * `ComponentProps<'button'>` and `asChild` is a boolean, not a type parameter
   * — the same limitation Radix and shadcn have. A consumer needing the narrow
   * type casts. Asserted here so the gap is a recorded fact, not a surprise.
   */
  it('Button asChild puts the ref on the child, not on a button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/signup">Start now</a>
      </Button>,
    );

    expect(ref.current?.tagName).toBe('A');
    expect(ref.current?.getAttribute('href')).toBe('/signup');
  });

  it('the ref reaches the element carrying data-slot', () => {
    const ref = createRef<HTMLButtonElement>();
    const container = render(<Button ref={ref}>Go</Button>);

    expect(ref.current).toBe(container.querySelector('[data-slot="button"]'));
  });
});
