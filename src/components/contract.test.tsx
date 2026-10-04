import { createRef, type ReactElement } from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render } from '@/test/render';
import {
  Alert,
  AlertDescription,
  AspectRatio,
  Avatar,
  AvatarFallback,
  Breadcrumb,
  Calendar,
  Carousel,
  CarouselItem,
  CodeBlock,
  Combobox,
  ComboboxInput,
  ComboboxList,
  BreadcrumbList,
  Checkbox,
  EmptyState,
  AlertTitle,
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
  Kbd,
  Pagination,
  QuantityStepper,
  PaginationContent,
  Progress,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Label,
  NavBar,
  ScrollArea,
  ScrollBar,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Slider,
  Switch,
  Spinner,
  Stat,
  StatRow,
  Textarea,
  Toast,
  ToastTitle,
  ToastViewport,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from './index';

afterEach(cleanup);

type Extra = Record<string, unknown>;
type Case = [name: string, render: (extra: Extra) => ReactElement, tag: string];

/**
 * Every hand-written component is listed. That is the point — the defect this
 * file replaces was that not one of them accepted a ref, and a list with holes
 * in it would have passed then too.
 *
 * `AvatarImage` is deliberately absent: Radix does not mount the `<img>` until
 * the file has loaded, so no element exists for a ref to reach when `render()`
 * returns. Its behaviour is covered by `Avatar.stories.tsx`.
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
  ['Alert', (p) => <Alert {...p}>Saved</Alert>, 'DIV'],
  ['AlertTitle', (p) => <AlertTitle {...p}>Saved</AlertTitle>, 'P'],
  [
    'AlertDescription',
    (p) => <AlertDescription {...p}>Your changes are live.</AlertDescription>,
    'P',
  ],
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
  ['Avatar', (p) => <Avatar {...p} />, 'SPAN'],
  [
    'AvatarFallback',
    (p) => (
      <Avatar>
        <AvatarFallback {...p}>RK</AvatarFallback>
      </Avatar>
    ),
    'SPAN',
  ],
  ['AspectRatio', (p) => <AspectRatio ratio={1} {...p} />, 'DIV'],
  ['Separator', (p) => <Separator {...p} />, 'DIV'],
  ['Skeleton', (p) => <Skeleton {...p} />, 'DIV'],
  // `OUTPUT`: an <output> is already a polite live region.
  ['Spinner', (p) => <Spinner {...p} />, 'OUTPUT'],
  ['Kbd', (p) => <Kbd {...p}>K</Kbd>, 'KBD'],
  ['Checkbox', (p) => <Checkbox {...p} />, 'BUTTON'],
  ['Table', (p) => <Table {...p} />, 'TABLE'],
  ['Calendar', (p) => <Calendar month={new Date(2026, 2, 1)} {...p} />, 'DIV'],
  ['Carousel', (p) => <Carousel label="Photos" {...p} />, 'DIV'],
  [
    'CarouselItem',
    (p) => (
      <Carousel label="Photos">
        <CarouselItem {...p} />
      </Carousel>
    ),
    'DIV',
  ],
  ['CodeBlock', (p) => <CodeBlock {...p}>code</CodeBlock>, 'DIV'],
  ['Combobox', (p) => <Combobox {...p} />, 'DIV'],
  // Both parts are positioned by the root's popover, so they render inside it.
  [
    'ComboboxInput',
    (p) => (
      <Combobox>
        <ComboboxInput aria-label="Search" {...p} />
      </Combobox>
    ),
    'INPUT',
  ],
  [
    'ComboboxList',
    (p) => (
      <Combobox>
        <ComboboxInput aria-label="Search" />
        <ComboboxList aria-label="Results" {...p} />
      </Combobox>
    ),
    'UL',
  ],
  ['QuantityStepper', (p) => <QuantityStepper label="Quantity" value={1} {...p} />, 'DIV'],
  [
    'TableBody',
    (p) => (
      <Table>
        <TableBody {...p} />
      </Table>
    ),
    'TBODY',
  ],
  [
    'TableRow',
    (p) => (
      <Table>
        <TableBody>
          <TableRow {...p} />
        </TableBody>
      </Table>
    ),
    'TR',
  ],
  [
    'TableCell',
    (p) => (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell {...p} />
          </TableRow>
        </TableBody>
      </Table>
    ),
    'TD',
  ],
  ['Breadcrumb', (p) => <Breadcrumb {...p} />, 'NAV'],
  ['BreadcrumbList', (p) => <BreadcrumbList {...p} />, 'OL'],
  ['Pagination', (p) => <Pagination {...p} />, 'NAV'],
  ['PaginationContent', (p) => <PaginationContent {...p} />, 'UL'],
  // `SECTION`: a <section> with a name is already a region.
  ['ToastViewport', (p) => <ToastViewport {...p} />, 'SECTION'],
  ['Toast', (p) => <Toast {...p} />, 'DIV'],
  ['ToastTitle', (p) => <ToastTitle {...p}>Saved</ToastTitle>, 'P'],
  ['Slider', (p) => <Slider defaultValue={[10]} aria-label="Volume" {...p} />, 'SPAN'],
  ['EmptyState', (p) => <EmptyState title="Nothing here" {...p} />, 'DIV'],
  [
    'PopoverContent',
    (p) => (
      <Popover defaultOpen>
        <PopoverTrigger>open</PopoverTrigger>
        {/* `aria-label` is required in the type — a role="dialog" with no
            accessible name is an axe failure, so the build fails first. */}
        <PopoverContent aria-label="Panel" {...p}>
          Panel
        </PopoverContent>
      </Popover>
    ),
    'DIV',
  ],
  ['RadioGroup', (p) => <RadioGroup {...p} />, 'DIV'],
  [
    'RadioGroupItem',
    (p) => (
      <RadioGroup>
        <RadioGroupItem value="one" {...p} />
      </RadioGroup>
    ),
    'BUTTON',
  ],
  ['Switch', (p) => <Switch {...p} />, 'BUTTON'],
  ['Progress', (p) => <Progress value={40} aria-label="Loading" {...p} />, 'DIV'],
  ['Toggle', (p) => <Toggle aria-label="Bold" {...p} />, 'BUTTON'],
  ['ToggleGroup', (p) => <ToggleGroup type="single" aria-label="Layout" {...p} />, 'DIV'],
  [
    'ToggleGroupItem',
    (p) => (
      <ToggleGroup type="single" aria-label="Layout">
        <ToggleGroupItem value="one" aria-label="One" {...p} />
      </ToggleGroup>
    ),
    'BUTTON',
  ],
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

/**
 * `data-variant` and `data-size` are public, like `data-slot`: a consumer
 * styling a variant from outside selects on them rather than on a utility
 * class, so they must be present on the root on every path, defaults included.
 */
describe('Button and IconButton mirror their variant on the root', () => {
  it('states the default variant and size', () => {
    const button = createRef<HTMLButtonElement>();
    const icon = createRef<HTMLButtonElement>();
    render(
      <>
        <Button ref={button}>Save</Button>
        <IconButton ref={icon} aria-label="Search">
          <svg />
        </IconButton>
      </>,
    );

    expect(button.current?.dataset).toMatchObject({ variant: 'primary', size: 'md' });
    expect(icon.current?.dataset).toMatchObject({ variant: 'ghost', size: 'md' });
  });

  it('states an explicit variant and size, also through asChild', () => {
    const button = createRef<HTMLButtonElement>();
    const icon = createRef<HTMLButtonElement>();
    render(
      <>
        <Button ref={button} asChild variant="secondary" size="sm">
          <a href="/next">Next</a>
        </Button>
        <IconButton ref={icon} asChild aria-label="Home" variant="primary" size="lg">
          <a href="/" aria-label="Home">
            <svg />
          </a>
        </IconButton>
      </>,
    );

    expect(button.current?.tagName).toBe('A');
    expect(button.current?.dataset).toMatchObject({ variant: 'secondary', size: 'sm' });
    expect(icon.current?.dataset).toMatchObject({ variant: 'primary', size: 'lg' });
  });

  it('keeps the ref and the ARIA state when loading through asChild', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild loading ref={ref}>
        <a href="/save">Save</a>
      </Button>,
    );

    expect(ref.current?.tagName).toBe('A');
    expect(ref.current?.getAttribute('aria-disabled')).toBe('true');
    expect(ref.current?.getAttribute('aria-busy')).toBe('true');
  });

  it('opts out of double-tap zoom, so fast repeated taps stay taps', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Add</Button>);
    expect(getComputedStyle(ref.current as HTMLElement).touchAction).toBe('manipulation');
  });
});

describe('Combobox open state', () => {
  it('takes `open` only together with `onOpenChange`', () => {
    // @ts-expect-error -- a controlled list that cannot hear Escape or a press outside.
    const unheard = <Combobox open />;
    const controlled = <Combobox open onOpenChange={() => {}} />;
    const radixOwned = <Combobox />;
    expect([unheard, controlled, radixOwned]).toHaveLength(3);
  });
});
