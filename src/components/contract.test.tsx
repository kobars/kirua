import {
  createRef,
  useLayoutEffect,
  useRef,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render } from '@/test/render';
import * as kirua from './index';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertTitle,
  AppBody,
  AppHeader,
  AppMain,
  AppRail,
  AppShell,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarStack,
  Badge,
  BarChart,
  BottomNav,
  BottomNavLink,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Calendar,
  Card,
  CardBody,
  CardContent,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Carousel,
  CarouselItem,
  Chart,
  ChartCaption,
  ChartLegend,
  Checkbox,
  Chip,
  Code,
  CodeBlock,
  CodeToken,
  Collapsible,
  CollapsibleContent,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Container,
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  CornerGlint,
  DatePicker,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DotGrid,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  EmptyState,
  Eyebrow,
  Field,
  FieldLegend,
  FieldSet,
  Grid,
  Heading,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  IconButton,
  Inline,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Kbd,
  Label,
  LineChart,
  Link,
  List,
  ListItem,
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MessageBubble,
  Meter,
  NavBar,
  NavBarLink,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NightSwatch,
  PageHeader,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pane,
  PaneBody,
  PaneFooter,
  PaneHeader,
  Placeholder,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Price,
  Progress,
  QuantityStepper,
  RadioGroup,
  RadioGroupItem,
  Rating,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  ScrollArea,
  ScrollBar,
  Section,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Skeleton,
  Slider,
  SparkleIcon,
  Sparkline,
  Spinner,
  Split,
  SpotlightContent,
  SpotlightMedia,
  SpotlightPanel,
  Stack,
  Stat,
  StatRow,
  Stepper,
  StepperItem,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Timeline,
  TimelineItem,
  TimelineTime,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Visible,
  VisuallyHidden,
  Wordmark,
} from './index';

afterEach(cleanup);

type Extra = Record<string, unknown>;
type Case = [name: string, render: (extra: Extra) => ReactElement, tag: string];

type AnyComponent = ComponentType<Record<string, unknown>>;
const barrel = kirua as unknown as Record<string, AnyComponent | undefined>;

/**
 * A context menu has no `open` prop: it opens on the event. Fired in a layout
 * effect, which `render` flushes, so the menu is open when the test reads it.
 */
function OpenContextMenu({ children }: { children: ReactNode }) {
  const trigger = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    trigger.current?.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 8, clientY: 8 }),
    );
  }, []);
  return (
    <ContextMenu>
      <ContextMenuTrigger ref={trigger}>Area</ContextMenuTrigger>
      {children}
    </ContextMenu>
  );
}

/** The three menus share their item parts; each part is a case per menu that exports it. */
function menuParts(prefix: string, open: (part: ReactElement) => ReactElement): Case[] {
  const parts: [string, (p: Extra, Part: AnyComponent) => ReactElement, string][] = [
    ['Item', (p, Part) => <Part {...p}>Save</Part>, 'DIV'],
    [
      'CheckboxItem',
      (p, Part) => (
        <Part checked {...p}>
          Pinned
        </Part>
      ),
      'DIV',
    ],
    [
      'RadioItem',
      (p, Part) => {
        const Group = barrel[`${prefix}RadioGroup`]!;
        return (
          <Group value="a">
            <Part value="a" {...p}>
              A
            </Part>
          </Group>
        );
      },
      'DIV',
    ],
    ['Label', (p, Part) => <Part {...p}>Post</Part>, 'DIV'],
    ['Separator', (p, Part) => <Part {...p} />, 'DIV'],
    ['Shortcut', (p, Part) => <Part {...p}>S</Part>, 'SPAN'],
  ];
  return parts.flatMap(([part, make, tag]): Case[] => {
    const Part = barrel[`${prefix}${part}`];
    return Part ? [[`${prefix}${part}`, (p) => open(make(p, Part)), tag]] : [];
  });
}

/**
 * One case per component the barrel exports, and the completeness test below
 * derives that set from the barrel itself, so a component added without a
 * case fails rather than passes by omission. A list with holes in it would
 * keep passing while a missing component dropped its ref.
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
    'DIV',
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
  [
    'CodeToken',
    (p) => (
      <CodeToken kind="keyword" {...p}>
        const
      </CodeToken>
    ),
    'SPAN',
  ],
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
  // The layout layer.
  ['Stack', (p) => <Stack {...p} />, 'DIV'],
  ['Inline', (p) => <Inline {...p} />, 'DIV'],
  ['Grid', (p) => <Grid {...p} />, 'DIV'],
  ['Split', (p) => <Split {...p} />, 'DIV'],
  ['Container', (p) => <Container {...p} />, 'DIV'],
  ['Section', (p) => <Section {...p} />, 'SECTION'],
  ['VisuallyHidden', (p) => <VisuallyHidden {...p}>Hidden</VisuallyHidden>, 'SPAN'],
  // A bare string is the one case `Visible` renders an element of its own.
  [
    'Visible',
    (p) => (
      <Visible from="sm" {...p}>
        Show
      </Visible>
    ),
    'SPAN',
  ],
  ['AppShell', (p) => <AppShell {...p} />, 'DIV'],
  ['AppHeader', (p) => <AppHeader {...p} />, 'HEADER'],
  ['AppBody', (p) => <AppBody {...p} />, 'DIV'],
  ['AppRail', (p) => <AppRail aria-label="Sections" {...p} />, 'ASIDE'],
  ['AppMain', (p) => <AppMain {...p} />, 'MAIN'],
  ['Pane', (p) => <Pane {...p} />, 'DIV'],
  ['PaneHeader', (p) => <PaneHeader {...p} />, 'DIV'],
  ['PaneBody', (p) => <PaneBody {...p} />, 'DIV'],
  ['PaneFooter', (p) => <PaneFooter {...p} />, 'DIV'],
  ['PageHeader', (p) => <PageHeader title="Orders" {...p} />, 'DIV'],
  ['Placeholder', (p) => <Placeholder {...p} />, 'DIV'],
  ['Price', (p) => <Price amount="$10.00" {...p} />, 'P'],
  ['Rating', (p) => <Rating value={4.5} {...p} />, 'P'],
  ['MessageBubble', (p) => <MessageBubble {...p}>Hi</MessageBubble>, 'DIV'],
  ['BottomNav', (p) => <BottomNav aria-label="Main" {...p} />, 'NAV'],
  [
    'BottomNavLink',
    (p) => (
      <ul>
        <BottomNavLink href="#/" icon={<SparkleIcon />} {...p}>
          Home
        </BottomNavLink>
      </ul>
    ),
    'A',
  ],
  [
    'Wordmark',
    (p) => (
      <Wordmark href="#/" icon={<SparkleIcon />} {...p}>
        Kirua
      </Wordmark>
    ),
    'A',
  ],
  ['CardContent', (p) => <CardContent {...p} />, 'DIV'],
  ['NightSwatch', (p) => <NightSwatch palette="ink" {...p} />, 'SPAN'],
  ['Sidebar', (p) => <Sidebar {...p} />, 'DIV'],
  ['SidebarHeader', (p) => <SidebarHeader {...p} />, 'DIV'],
  ['SidebarContent', (p) => <SidebarContent aria-label="Sections" {...p} />, 'NAV'],
  ['SidebarFooter', (p) => <SidebarFooter {...p} />, 'DIV'],
  ['SidebarGroup', (p) => <SidebarGroup {...p} />, 'DIV'],
  ['SidebarGroupLabel', (p) => <SidebarGroupLabel {...p}>Clinic</SidebarGroupLabel>, 'DIV'],
  ['SidebarLabel', (p) => <SidebarLabel {...p}>Patients</SidebarLabel>, 'SPAN'],
  ['SidebarMenu', (p) => <SidebarMenu {...p} />, 'UL'],
  [
    'SidebarMenuItem',
    (p) => (
      <SidebarMenu>
        <SidebarMenuItem {...p} />
      </SidebarMenu>
    ),
    'LI',
  ],
  [
    'SidebarMenuButton',
    (p) => <SidebarMenuButton {...p}>Patients</SidebarMenuButton>,
    'BUTTON',
  ],
  ['SidebarMenuAction', (p) => <SidebarMenuAction {...p} />, 'DIV'],
  ['SidebarMenuBadge', (p) => <SidebarMenuBadge {...p}>3</SidebarMenuBadge>, 'SPAN'],
  ['SidebarSeparator', (p) => <SidebarSeparator {...p} />, 'DIV'],

  // Text and content.
  [
    'Heading',
    (p) => (
      <Heading as="h2" {...p}>
        Orders
      </Heading>
    ),
    'H2',
  ],
  ['Text', (p) => <Text {...p}>Copy</Text>, 'P'],
  ['Eyebrow', (p) => <Eyebrow {...p}>New</Eyebrow>, 'P'],
  [
    'Link',
    (p) => (
      <Link href="#/guide" {...p}>
        Guide
      </Link>
    ),
    'A',
  ],
  ['Code', (p) => <Code {...p}>npm</Code>, 'CODE'],
  ['List', (p) => <List {...p} />, 'UL'],
  [
    'ListItem',
    (p) => (
      <List>
        <ListItem {...p}>One</ListItem>
      </List>
    ),
    'LI',
  ],
  ['DescriptionList', (p) => <DescriptionList {...p} />, 'DL'],
  [
    'DescriptionTerm',
    (p) => (
      <DescriptionList>
        <DescriptionTerm {...p}>MRN</DescriptionTerm>
      </DescriptionList>
    ),
    'DT',
  ],
  [
    'DescriptionDetails',
    (p) => (
      <DescriptionList>
        <DescriptionDetails {...p}>0042</DescriptionDetails>
      </DescriptionList>
    ),
    'DD',
  ],
  ['Timeline', (p) => <Timeline {...p} />, 'OL'],
  [
    'TimelineItem',
    (p) => (
      <Timeline>
        <TimelineItem {...p}>Admitted</TimelineItem>
      </Timeline>
    ),
    'LI',
  ],
  [
    'TimelineTime',
    (p) => (
      <TimelineTime dateTime="2026-03-12" {...p}>
        12 March
      </TimelineTime>
    ),
    'TIME',
  ],
  ['Stepper', (p) => <Stepper aria-label="Checkout" {...p} />, 'OL'],
  [
    'StepperItem',
    (p) => (
      <Stepper aria-label="Checkout">
        <StepperItem index={1} {...p}>
          Address
        </StepperItem>
      </Stepper>
    ),
    'LI',
  ],
  ['Item', (p) => <Item {...p} />, 'DIV'],
  ['ItemGroup', (p) => <ItemGroup {...p} />, 'DIV'],
  ['ItemMedia', (p) => <ItemMedia {...p} />, 'DIV'],
  ['ItemContent', (p) => <ItemContent {...p} />, 'DIV'],
  ['ItemTitle', (p) => <ItemTitle {...p}>Title</ItemTitle>, 'DIV'],
  ['ItemDescription', (p) => <ItemDescription {...p}>Copy</ItemDescription>, 'P'],
  ['ItemActions', (p) => <ItemActions {...p} />, 'DIV'],
  ['ItemSeparator', (p) => <ItemSeparator {...p} />, 'DIV'],
  ['Meter', (p) => <Meter value={40} label="Beds" {...p} />, 'DIV'],
  ['Chart', (p) => <Chart label="Visits" {...p} />, 'FIGURE'],
  ['ChartCaption', (p) => <ChartCaption {...p}>Per month</ChartCaption>, 'FIGCAPTION'],
  ['ChartLegend', (p) => <ChartLegend items={[{ label: 'Visits', series: 1 }]} {...p} />, 'UL'],
  ['BarChart', (p) => <BarChart data={[{ label: 'Jan', value: 1 }]} {...p} />, 'DIV'],
  ['LineChart', (p) => <LineChart data={[{ label: 'Jan', value: 1 }]} {...p} />, 'svg'],
  ['Sparkline', (p) => <Sparkline data={[{ label: 'Jan', value: 1 }]} {...p} />, 'svg'],

  // Forms.
  ['FieldSet', (p) => <FieldSet {...p} />, 'FIELDSET'],
  [
    'FieldLegend',
    (p) => (
      <FieldSet>
        <FieldLegend {...p}>Delivery</FieldLegend>
      </FieldSet>
    ),
    'LEGEND',
  ],
  ['InputGroup', (p) => <InputGroup {...p} />, 'DIV'],
  ['InputGroupInput', (p) => <InputGroupInput aria-label="Search" {...p} />, 'INPUT'],
  ['InputGroupAddon', (p) => <InputGroupAddon {...p} />, 'DIV'],
  ['InputGroupText', (p) => <InputGroupText {...p}>$</InputGroupText>, 'SPAN'],
  ['InputOTP', (p) => <InputOTP {...p} />, 'DIV'],
  ['InputOTPInput', (p) => <InputOTPInput aria-label="Code" {...p} />, 'INPUT'],
  ['InputOTPGroup', (p) => <InputOTPGroup {...p} />, 'DIV'],
  ['InputOTPSlot', (p) => <InputOTPSlot {...p} />, 'DIV'],
  ['InputOTPSeparator', (p) => <InputOTPSeparator {...p} />, 'DIV'],
  ['DatePicker', (p) => <DatePicker month={new Date(2026, 2, 1)} {...p} />, 'BUTTON'],
  [
    'ComboboxItem',
    (p) => (
      <ul>
        <ComboboxItem {...p}>Bandung</ComboboxItem>
      </ul>
    ),
    'LI',
  ],
  [
    'ComboboxEmpty',
    (p) => (
      <Combobox open onOpenChange={() => {}}>
        <ComboboxInput aria-label="Search" />
        <ComboboxEmpty {...p}>No match</ComboboxEmpty>
      </Combobox>
    ),
    'DIV',
  ],
  [
    'SelectTrigger',
    (p) => (
      <Select>
        <SelectTrigger aria-label="Clinic" {...p} />
      </Select>
    ),
    'BUTTON',
  ],
  [
    'SelectContent',
    (p) => (
      <Select open>
        <SelectTrigger aria-label="Clinic" />
        <SelectContent aria-label="Clinics" {...p}>
          <SelectItem value="one">One</SelectItem>
        </SelectContent>
      </Select>
    ),
    'DIV',
  ],
  [
    'SelectItem',
    (p) => (
      <Select open>
        <SelectTrigger aria-label="Clinic" />
        <SelectContent aria-label="Clinics">
          <SelectItem value="one" {...p}>
            One
          </SelectItem>
        </SelectContent>
      </Select>
    ),
    'DIV',
  ],
  [
    'SelectLabel',
    (p) => (
      <Select open>
        <SelectTrigger aria-label="Clinic" />
        <SelectContent aria-label="Clinics">
          <SelectGroup>
            <SelectLabel {...p}>General</SelectLabel>
            <SelectItem value="one">One</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    'DIV',
  ],
  [
    'SelectSeparator',
    (p) => (
      <Select open>
        <SelectTrigger aria-label="Clinic" />
        <SelectContent aria-label="Clinics">
          <SelectItem value="one">One</SelectItem>
          <SelectSeparator {...p} />
        </SelectContent>
      </Select>
    ),
    'DIV',
  ],

  // Navigation.
  [
    'NavBarLink',
    (p) => (
      <ul>
        <NavBarLink href="#/" {...p}>
          Home
        </NavBarLink>
      </ul>
    ),
    'A',
  ],
  [
    'BreadcrumbItem',
    (p) => (
      <BreadcrumbList>
        <BreadcrumbItem {...p} />
      </BreadcrumbList>
    ),
    'LI',
  ],
  [
    'BreadcrumbLink',
    (p) => (
      <BreadcrumbLink href="#/" {...p}>
        Home
      </BreadcrumbLink>
    ),
    'A',
  ],
  ['BreadcrumbPage', (p) => <BreadcrumbPage {...p}>Orders</BreadcrumbPage>, 'SPAN'],
  [
    'BreadcrumbSeparator',
    (p) => (
      <BreadcrumbList>
        <BreadcrumbSeparator {...p} />
      </BreadcrumbList>
    ),
    'LI',
  ],
  ['BreadcrumbEllipsis', (p) => <BreadcrumbEllipsis {...p} />, 'SPAN'],
  [
    'PaginationItem',
    (p) => (
      <PaginationContent>
        <PaginationItem {...p} />
      </PaginationContent>
    ),
    'LI',
  ],
  [
    'PaginationLink',
    (p) => (
      <PaginationLink href="#/2" {...p}>
        2
      </PaginationLink>
    ),
    'A',
  ],
  ['PaginationPrevious', (p) => <PaginationPrevious href="#/1" {...p} />, 'A'],
  ['PaginationNext', (p) => <PaginationNext href="#/3" {...p} />, 'A'],
  ['PaginationEllipsis', (p) => <PaginationEllipsis {...p} />, 'SPAN'],
  [
    'TabsList',
    (p) => (
      <Tabs defaultValue="one">
        <TabsList {...p} />
      </Tabs>
    ),
    'DIV',
  ],
  [
    'TabsTrigger',
    (p) => (
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one" {...p}>
            One
          </TabsTrigger>
        </TabsList>
      </Tabs>
    ),
    'BUTTON',
  ],
  [
    'TabsContent',
    (p) => (
      <Tabs defaultValue="one">
        <TabsContent value="one" {...p}>
          One
        </TabsContent>
      </Tabs>
    ),
    'DIV',
  ],
  ['NavigationMenu', (p) => <NavigationMenu {...p} />, 'NAV'],
  [
    'NavigationMenuList',
    (p) => (
      <NavigationMenu>
        <NavigationMenuList {...p} />
      </NavigationMenu>
    ),
    'UL',
  ],
  [
    'NavigationMenuTrigger',
    (p) => (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger {...p}>Products</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    'BUTTON',
  ],
  [
    'NavigationMenuContent',
    (p) => (
      <NavigationMenu value="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent {...p}>Panel</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    'DIV',
  ],
  [
    'NavigationMenuLink',
    (p) => (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#/" {...p}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    'A',
  ],
  ['ButtonGroup', (p) => <ButtonGroup aria-label="Filter" {...p} />, 'DIV'],
  ['ButtonGroupText', (p) => <ButtonGroupText {...p}>Show</ButtonGroupText>, 'DIV'],
  ['ButtonGroupSeparator', (p) => <ButtonGroupSeparator {...p} />, 'DIV'],
  ['ResizableGroup', (p) => <ResizableGroup orientation="horizontal" {...p} />, 'DIV'],
  [
    'ResizablePanel',
    (p) => (
      <ResizableGroup orientation="horizontal">
        <ResizablePanel {...p} />
      </ResizableGroup>
    ),
    'DIV',
  ],
  [
    'ResizableHandle',
    (p) => (
      <ResizableGroup orientation="horizontal">
        <ResizablePanel />
        <ResizableHandle {...p} />
        <ResizablePanel />
      </ResizableGroup>
    ),
    'DIV',
  ],

  // Tables.
  [
    'TableCaption',
    (p) => (
      <Table>
        <TableCaption {...p}>Visits</TableCaption>
      </Table>
    ),
    'CAPTION',
  ],
  [
    'TableHeader',
    (p) => (
      <Table>
        <TableHeader {...p} />
      </Table>
    ),
    'THEAD',
  ],
  [
    'TableFooter',
    (p) => (
      <Table>
        <TableFooter {...p} />
      </Table>
    ),
    'TFOOT',
  ],
  [
    'TableHead',
    (p) => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead {...p}>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    ),
    'TH',
  ],

  // Disclosure.
  ['Collapsible', (p) => <Collapsible {...p} />, 'DIV'],
  [
    'CollapsibleContent',
    (p) => (
      <Collapsible open>
        <CollapsibleContent {...p}>Panel</CollapsibleContent>
      </Collapsible>
    ),
    'DIV',
  ],
  [
    'AccordionItem',
    (p) => (
      <Accordion type="single">
        <AccordionItem value="one" {...p} />
      </Accordion>
    ),
    'DIV',
  ],
  [
    'AccordionTrigger',
    (p) => (
      <Accordion type="single">
        <AccordionItem value="one">
          <AccordionTrigger {...p}>Returns</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    ),
    'BUTTON',
  ],
  [
    'AccordionContent',
    (p) => (
      <Accordion type="single" value="one">
        <AccordionItem value="one">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent {...p}>Thirty days.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    'DIV',
  ],

  // Overlays, rendered open so the element exists.
  [
    'DialogContent',
    (p) => (
      <Dialog open>
        <DialogContent {...p}>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Copy</DialogDescription>
        </DialogContent>
      </Dialog>
    ),
    'DIV',
  ],
  [
    'DialogTitle',
    (p) => (
      <Dialog open>
        <DialogContent>
          <DialogTitle {...p}>Title</DialogTitle>
          <DialogDescription>Copy</DialogDescription>
        </DialogContent>
      </Dialog>
    ),
    'H2',
  ],
  [
    'DialogDescription',
    (p) => (
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription {...p}>Copy</DialogDescription>
        </DialogContent>
      </Dialog>
    ),
    'P',
  ],
  ['DialogFooter', (p) => <DialogFooter {...p} />, 'DIV'],
  [
    'SheetContent',
    (p) => (
      <Sheet open>
        <SheetContent {...p}>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Copy</SheetDescription>
        </SheetContent>
      </Sheet>
    ),
    'DIV',
  ],
  [
    'SheetTitle',
    (p) => (
      <Sheet open>
        <SheetContent>
          <SheetTitle {...p}>Title</SheetTitle>
          <SheetDescription>Copy</SheetDescription>
        </SheetContent>
      </Sheet>
    ),
    'H2',
  ],
  [
    'SheetDescription',
    (p) => (
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription {...p}>Copy</SheetDescription>
        </SheetContent>
      </Sheet>
    ),
    'P',
  ],
  ['SheetFooter', (p) => <SheetFooter {...p} />, 'DIV'],
  [
    'AlertDialogContent',
    (p) => (
      <AlertDialog open>
        <AlertDialogContent {...p}>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Copy</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    ),
    'DIV',
  ],
  [
    'AlertDialogTitle',
    (p) => (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle {...p}>Title</AlertDialogTitle>
          <AlertDialogDescription>Copy</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    ),
    'H2',
  ],
  [
    'AlertDialogDescription',
    (p) => (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription {...p}>Copy</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    ),
    'P',
  ],
  ['AlertDialogFooter', (p) => <AlertDialogFooter {...p} />, 'DIV'],
  [
    'HoverCardContent',
    (p) => (
      <HoverCard open>
        <HoverCardTrigger href="#/rin">Rin</HoverCardTrigger>
        <HoverCardContent {...p}>Profile</HoverCardContent>
      </HoverCard>
    ),
    'DIV',
  ],
  [
    'TooltipContent',
    (p) => (
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Save</TooltipTrigger>
          <TooltipContent {...p}>Save the draft</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    'DIV',
  ],
  [
    'DropdownMenuContent',
    (p) => (
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Post" {...p} />
      </DropdownMenu>
    ),
    'DIV',
  ],
  ...menuParts('DropdownMenu', (part) => (
    <DropdownMenu open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Post">{part}</DropdownMenuContent>
    </DropdownMenu>
  )),
  [
    'ContextMenuContent',
    (p) => (
      <OpenContextMenu>
        <ContextMenuContent {...p} />
      </OpenContextMenu>
    ),
    'DIV',
  ],
  ...menuParts('ContextMenu', (part) => (
    <OpenContextMenu>
      <ContextMenuContent>{part}</ContextMenuContent>
    </OpenContextMenu>
  )),
  ['Menubar', (p) => <Menubar {...p} />, 'DIV'],
  [
    'MenubarTrigger',
    (p) => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger {...p}>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    ),
    'BUTTON',
  ],
  [
    'MenubarContent',
    (p) => (
      <Menubar value="file">
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent {...p} />
        </MenubarMenu>
      </Menubar>
    ),
    'DIV',
  ],
  ...menuParts('Menubar', (part) => (
    <Menubar value="file">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>{part}</MenubarContent>
      </MenubarMenu>
    </Menubar>
  )),

  // Command palette and toast parts.
  ['CommandInput', (p) => <CommandInput aria-label="Search" {...p} />, 'INPUT'],
  ['CommandList', (p) => <CommandList aria-label="Results" {...p} />, 'UL'],
  [
    'CommandGroup',
    (p) => (
      <CommandList aria-label="Results">
        <CommandGroup heading="Patients" {...p} />
      </CommandList>
    ),
    'LI',
  ],
  [
    'CommandItem',
    (p) => (
      <ul>
        <CommandItem id="contract-command-item" {...p}>
          Find a patient
        </CommandItem>
      </ul>
    ),
    'LI',
  ],
  ['CommandEmpty', (p) => <CommandEmpty {...p}>No results</CommandEmpty>, 'DIV'],
  ['ToastDescription', (p) => <ToastDescription {...p}>Saved</ToastDescription>, 'P'],
  ['ToastClose', (p) => <ToastClose {...p} />, 'BUTTON'],
];

/**
 * Components with no case, each with the reason. A name here that the barrel
 * no longer exports, or that has gained a case, fails the run.
 */
const EXEMPT: Record<string, string> = {
  AvatarImage:
    'Radix mounts the <img> only once the file has loaded, so no element exists for a ref when render() returns. Avatar.stories.tsx covers it.',
  DropdownMenu:
    'Wraps the Radix root to change one default, and renders no element of its own.',
  Command:
    "A Dialog root: its props are the dialog's open state, and its className is forwarded to the panel, whose contract is DialogContent's.",
  ...Object.fromEntries(
    [
      'AlertDialog',
      'ContextMenu',
      'Dialog',
      'HoverCard',
      'MenubarMenu',
      'Popover',
      'Select',
      'Sheet',
      'Tooltip',
      'TooltipProvider',
    ].map((name) => [
      name,
      'A Radix root re-exported as it is. It renders no element, so there is nothing for a ref, a class or a data-slot to land on.',
    ]),
  ),
};

/**
 * Every component the barrel exports, read from the barrel: a capitalised
 * function. Every component here is a plain function, so a `forwardRef`
 * object is a Radix part re-exported as it is — a trigger or a group — and is
 * skipped; the Radix roots, which are functions, are exempt above. Icons
 * carry no `data-slot` and have their own suite in `icons.test.tsx`.
 */
const components = Object.entries(kirua)
  .filter(
    ([name, value]) =>
      /^[A-Z]/.test(name) && typeof value === 'function' && !name.endsWith('Icon'),
  )
  .map(([name]) => name);

describe('every exported component has a case', () => {
  const covered = new Set(cases.map(([name]) => name));

  it('finds the components at all, so an empty barrel cannot pass', () => {
    expect(components.length).toBeGreaterThan(100);
  });

  it.each(components)('%s', (name) => {
    expect(covered.has(name) || name in EXEMPT, `${name} has no case`).toBe(true);
  });

  it('has no stale exemption', () => {
    for (const name of Object.keys(EXEMPT)) {
      expect(components, `${name} is exempt but not an exported component`).toContain(name);
      expect(covered.has(name), `${name} is exempt and also has a case`).toBe(false);
    }
  });
});

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
/**
 * Cases whose `className` lands somewhere other than the root, each with the
 * reason. Asserted to land inside the root instead, so the deviation is a
 * recorded fact rather than a hole.
 */
const CLASS_INSIDE: Record<string, string> = {
  ResizablePanel:
    "react-resizable-panels applies a panel's className to a div inside it, so a consumer class cannot disturb the flex sizing it writes on the panel.",
};

describe('a consumer className wins', () => {
  it.each(cases.filter(([name]) => !(name in CLASS_INSIDE)))('%s', (_name, element) => {
    const ref = createRef<HTMLElement>();
    render(element({ ref, className: 'rounded-none' }));

    // The attribute, not `className`, which is an object on an SVG element.
    const classes = ref.current?.getAttribute('class')?.split(/\s+/) ?? [];
    expect(classes).toContain('rounded-none');
    expect(classes.filter((c) => c.startsWith('rounded-'))).toEqual(['rounded-none']);
  });
});

describe('a className that lands inside the root, by design', () => {
  it.each(Object.keys(CLASS_INSIDE))('%s', (name) => {
    const [, element] = cases.find(([caseName]) => caseName === name)!;
    const ref = createRef<HTMLElement>();
    render(element({ ref, className: 'consumer-class' }));

    expect(ref.current).not.toHaveClass('consumer-class');
    expect(ref.current?.querySelector('.consumer-class')).not.toBeNull();
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
