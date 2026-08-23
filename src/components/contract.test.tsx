import { createRef, type ReactElement } from 'react';
import { describe, expect, it, afterEach } from 'vitest';
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
  Field,
  IconButton,
  Input,
  Label,
  NavBar,
  ScrollArea,
  ScrollBar,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stat,
  StatRow,
  Textarea,
} from './index';

afterEach(cleanup);

type Extra = Record<string, unknown>;
type Case = [name: string, render: (extra: Extra) => ReactElement, tag: string];

/**
 * Every hand-written component is listed. That is the point — the defect this
 * file replaces was that not one of them accepted a ref, and a list with holes
 * in it would have passed then too.
 */
const cases: Case[] = [
  ['Button', (p) => <Button {...p}>Go</Button>, 'BUTTON'],
  [
    'IconButton',
    (p) => (
      <IconButton aria-label="Search" {...p}>
        i
      </IconButton>
    ),
    'BUTTON',
  ],
  ['Badge', (p) => <Badge {...p}>New</Badge>, 'SPAN'],
  ['Chip', (p) => <Chip {...p}>Tag</Chip>, 'SPAN'],
  ['AvatarStack', (p) => <AvatarStack items={[{ name: 'Rin' }]} {...p} />, 'SPAN'],
  ['DotGrid', (p) => <DotGrid {...p} />, 'SPAN'],
  [
    'Label',
    (p) => (
      <Label htmlFor="contract-label" {...p}>
        Name
      </Label>
    ),
    'LABEL',
  ],
  ['Input', (p) => <Input {...p} />, 'INPUT'],
  ['Textarea', (p) => <Textarea {...p} />, 'TEXTAREA'],
  [
    'Field',
    (p) => (
      <Field controlId="contract-field" label="Contract field" {...p}>
        <input />
      </Field>
    ),
    'DIV',
  ],
  ['CornerGlint', (p) => <CornerGlint {...p} />, 'SPAN'],
  ['Card', (p) => <Card {...p} />, 'DIV'],
  ['CardEyebrow', (p) => <CardEyebrow {...p} />, 'P'],
  ['CardTitle', (p) => <CardTitle {...p} />, 'H3'],
  ['CardBody', (p) => <CardBody {...p} />, 'P'],
  ['CardFooter', (p) => <CardFooter {...p} />, 'DIV'],
  ['Stat', (p) => <Stat value="100k" label="Likes" {...p} />, 'DIV'],
  ['StatRow', (p) => <StatRow {...p} />, 'DIV'],
  ['NavBar', (p) => <NavBar items={[]} {...p} />, 'NAV'],
  ['SpotlightPanel', (p) => <SpotlightPanel {...p} />, 'DIV'],
  ['SpotlightMedia', (p) => <SpotlightMedia {...p} />, 'DIV'],
  ['SpotlightContent', (p) => <SpotlightContent {...p} />, 'DIV'],
  ['ScrollArea', (p) => <ScrollArea {...p} />, 'DIV'],
  [
    'ScrollBar',
    (p) => (
      <ScrollArea orientation="horizontal">
        <ScrollBar forceMount {...p} />
      </ScrollArea>
    ),
    'DIV',
  ],
];

describe('the ref reaches the rendered root', () => {
  it.each(cases)('%s', (_name, element, tagName) => {
    const ref = createRef<HTMLElement>();
    render(element({ ref }));

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
});

/**
 * One element is "the root". A ref, an `id`, a `data-*` attribute and a
 * `className` must all land on the same node — otherwise a consumer who
 * measures the element the ref gave them is not measuring the element they
 * styled. A wrapper element is easy to add and impossible to see from outside.
 */
describe('props spread onto the element carrying data-slot', () => {
  it.each(cases)('%s', (_name, element) => {
    const ref = createRef<HTMLElement>();
    render(element({ ref, id: 'the-root', 'data-probe': 'yes' }));

    expect(ref.current?.id).toBe('the-root');
    expect(ref.current?.getAttribute('data-probe')).toBe('yes');
    expect(ref.current?.getAttribute('data-slot')).not.toBeNull();
  });
});

/**
 * `className` merges last through `cn()`, so a consumer can always override.
 * Asserted with a radius, because most of these set one for themselves — which
 * makes this a test of the merge and not just of concatenation.
 */
describe('a consumer className wins', () => {
  it.each(cases)('%s', (_name, element) => {
    const ref = createRef<HTMLElement>();
    render(element({ ref, className: 'rounded-none' }));

    const classes = ref.current?.className.split(/\s+/) ?? [];
    expect(classes).toContain('rounded-none');
    expect(classes.filter((c) => c.startsWith('rounded-'))).toEqual(['rounded-none']);
  });
});
