# Changelog

## 0.5.0

### Changed

- The package declares `"sideEffects": false`, so a bundler drops every
  module of it your app does not use, through the barrel as well as by
  path. The build checks that no module does work when it is imported. If
  you import `@kobars/kirua/styles.css` from JavaScript, import it from your
  CSS file instead, after `tailwindcss`: imported from JavaScript it never
  generated the components' classes, and a bundler may now drop it.

### Added

- `@kobars/kirua/fonts.css`: Nunito and Luckiest Guy as `@font-face` rules
  and woff2 files in the package, so the fonts load from your own origin.
  Import it after `styles.css` and remove the Google Fonts `<link>`, which
  blocks rendering until a stylesheet from another origin arrives. The
  files are the subsets Google Fonts serves, unmodified, split by script so
  a Latin page downloads one file per family. Both licenses ship beside the
  files.

### Fixed

- `sources/<Module>.css` generates only its module's classes. In 0.4.x,
  Tailwind's automatic source detection widened each file a stylesheet
  named in `node_modules` to its whole folder, so in an app every
  per-module stylesheet generated every component's classes: 18.80 kB
  gzipped, the same as `styles.css`. Each stylesheet now lists its classes
  inline. `Button` needs 7.78 kB, `Card` 7.03 kB and `Dialog` 7.96 kB.
- `styles.css` lists its classes the same way and is 18.41 kB gzipped in an
  app, as 0.4.1 stated; it was 18.80 kB.

## 0.4.1

### Fixed

- `DirectionProvider` reaches every Radix primitive again. 0.4.0 asked for
  exactly `@radix-ui/react-direction` 1.1.4 while the primitives a fresh
  install resolves ask for 1.1.5, so an install held 12 copies, and
  Accordion, menus, Select, Tabs, Slider, RadioGroup, ToggleGroup,
  ScrollArea and NavigationMenu did not follow its `dir`. The dependency is
  now `^1.1.5`, and the primitives that read it start at the releases that
  pin 1.1.5: Accordion 1.2.21, ContextMenu 2.3.8, DropdownMenu 2.1.25,
  Menubar 1.1.25, NavigationMenu 1.3.0, RadioGroup 1.4.8, ScrollArea 1.3.0,
  Select 2.3.8, Slider 1.5.0, Tabs 1.1.22 and ToggleGroup 1.1.20. A fresh
  install and an npm upgrade from 0.4.0 each hold one copy. If your app
  depends on one of those primitives directly at an older version,
  `npm ls @radix-ui/react-direction` lists more than one copy; update that
  primitive, or run `npm dedupe`.
- Every Radix dependency starts at its newest release, the versions a fresh
  install resolves, so this package is tested against what you install.
  Radix primitives pin their shared internals exactly, and a mix of older
  and newer primitives installs two copies of each.
- The package names its ES entry as `module` as well, so tools that do not
  read `exports`, such as Bundlephobia's exports analysis, find it.

### Changed

- The emitted JavaScript carries no JSDoc (the type declarations keep it),
  and `lib/cn.js` is no longer a Tailwind source. Tailwind had generated
  classes from those comments and names that nothing renders: `styles.css`
  goes from 18.84 to 18.41 kB gzipped, and `Button`'s styles from 8.23 to
  7.78 kB.
- The README's size figures are measured fully minified, as an app ships
  them, on a fresh install: `Button` is 12.05 kB, not the 13.74 kB 0.4.0
  stated.

## 0.4.0

### Changed

- `Button` with `asChild` and `loading` now shows the spinner in place of
  `leadingIcon`, as a `<button>` already did.

### Added

- `@kobars/kirua/theme.css` and `@kobars/kirua/sources/<Module>.css`: import
  the theme and one file per component module you use, instead of
  `styles.css`, to generate only those components' classes. `Button` alone
  needs 8.23 kB of CSS gzipped where `styles.css` is 18.84 kB. `styles.css` is
  unchanged.

### Fixed

- `Button` with `asChild` now renders `leadingIcon` and `trailingIcon` inside
  the child element, around its content. They were accepted and silently
  dropped.

## 0.3.0

### Added

- `DeviceFrame`, a page shown at a phone's size inside a phone's outline. It
  is an `iframe`, so the page inside gets its own window at the phone's width
  and its breakpoints, sticky bars and overlays behave as they do on a phone.
  `device` is `sm` (320 × 568), `md` (390 × 844) or `lg` (430 × 932).
- `CardIcon`, a payment card.

## 0.2.0

Some changes in this release can alter an existing screen, which is why it is
a minor version. They are listed first, under **Changed**.

### Changed

- `Calendar` and `DatePicker` no longer default `today` to the current date,
  which differed between the server and the browser across time zones and at
  midnight. Pass `today` to mark the day; without it no day is marked, and
  focus starts on the selection or the first day that can be chosen.
- `className` on `CollapsibleContent` and `AccordionContent` now lands on the
  root, beside the ref and the other props. The inner padding element has its
  own slots, `collapsible-content-inner` and `accordion-content-inner`.
- `BottomNavLinkProps` is a union: `href` is required unless `asChild` is set.
- `Calendar`, `DatePicker` and `Combobox` are client modules (`"use client"`).
  A Server Component file can still import them; they render on the client.
  Every other component still renders in a Server Component.
- `ToastViewport` is the live region (`aria-live="polite"`). Only a danger
  toast keeps a role, `alert`. Clicking a toast no longer dismisses an open
  dialog.
- `Text weight="normal"` uses the system's regular weight instead of
  Tailwind's 400.
- `CommandList` and `ComboboxList` require an accessible name in their types.
- A focused `Input`, `Textarea`, `InputGroup`, `SelectTrigger`, `DatePicker`,
  `Combobox` or `InputOTP` box draws one 2px ring over its border, not a
  recoloured border with a second ring outside it. The ring reads a new
  `field-focus-ring` token, which is black on a brand surface, where the
  system ring would be white on a white field. An invalid field's ring is the
  invalid colour.

### Added

- `asChild` on `Link`, `BottomNavLink` and `Wordmark`, and a `NavBarLink` part
  with `asChild`, so a client router's link component can be used. `NavBar`
  accepts `NavBarLink` children; `items` is optional.
- `NIGHT_PALETTES`, the night palettes of dark mode with the default first.
- `DropdownMenuShortcut`, and a `variant` on `MenubarItem`.
- `getValueText` on `Slider`, for a thumb that announces formatted text.
- `display` on `Rating`, for a value formatted by the caller.
- Avatar swatch tokens, used by `AvatarStack`, measured at 4.5:1 in light mode
  and on every night.
- `ref` on `ResizableGroup`, `ResizablePanel` and `ResizableHandle`, and their
  props types.
- The `default` export condition, so `require` and Jest can resolve the package.
- `NativeSelect`, `NativeSelectOption` and `NativeSelectOptGroup`: the
  browser's own `<select>`, drawn as a field. The open list is the operating
  system's, so it works without JavaScript and posts as a plain form field.
- `DirectionProvider`, Radix's provider re-exported. Radix primitives never
  read the document's `dir`, so a right-to-left page needs it once around the
  app or their arrow keys run left-to-right. It adds
  `@radix-ui/react-direction`, pinned to the version the primitives pin.
- The `Message` family — `MessageGroup`, `Message`, `MessageAvatar`,
  `MessageContent`, `MessageHeader`, `MessageFooter`, `MessageReactions` and
  `MessageReaction` — around `MessageBubble`: one sender's turn with an avatar,
  a name and time, a status line and read-only reactions, each reaction named
  in words.
- `Marker`, `MarkerIcon` and `MarkerContent`: a quiet line in a conversation or
  feed, such as a day break, in `plain`, `divider` and `border` variants.
- The `Attachment` family — `Attachment`, `AttachmentGroup`, `AttachmentMedia`,
  `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`,
  `AttachmentActions`, `AttachmentAction` and `AttachmentTrigger` — a file as a
  small card, with an `uploading` or `error` status, a vertical tile, and a
  trigger that makes the whole card open the file while its actions stay
  separate. `FileIcon`, `ImageIcon` and `AlertIcon` join the icons.
- `CodeToken`, one highlighted token inside a `CodeBlock`, and a `code` colour
  token family behind it, measured at 4.5:1 on the block in light mode, on
  every night and on a dark card. On a brand surface every kind is white. The
  package parses nothing: a highlighter, ideally run at build time, maps its
  token types to `kind`.
- A `data-slot` on every inner element that carries classes, 70 new names, so
  each part has a stable selector: for example `app-header-actions`,
  `nav-bar-list`, `page-header-actions`, `pane-body-content`, `dialog-overlay`,
  `select-viewport`, `stepper-item-marker` and `tooltip-arrow`. Each name is
  the owning component's slot followed by the part.

### Fixed

- A closed off-canvas `Sidebar` left its links in the tab order while invisible.
- `Field` treated `error={false}` and `error=""` as an error.
- A sortable `TableHead` submitted a surrounding form; `data-selected="false"`
  selected a `TableRow`.
- A disabled indeterminate `Checkbox` hid its dash.
- Charts: values below 1 now fill the plot, marks stay inside it, and repeated
  labels no longer share a key.
- `Progress` out of range now reads as indeterminate, matching its ARIA state.
- `Calendar` fell back to a Monday week start where the browser has no week
  information; it now follows the region.
- `SpotlightMedia side="start"` covered the headline.
- `Visible` threw on text with a value in it.
- A default `Card` inside a brand or inverse surface used the page's line and
  shadow; a brand surface now keeps its own page colour and focus-ring offset.
- `AlertDialog` had no edge or backdrop in forced-colors mode.
- `AvatarStack` initials failed contrast, and the brand `Chip` paired a surface
  colour with an action colour.
- `CommandGroup` headings with a space no longer break the group's name.
- `NavigationMenu`'s panel opened beneath a positioned block below it.
- `DialogTitle` ran under the close button.
- `List variant="plain"` keeps its list semantics in Safari.
- `cn()` now merges `font-regular`, `ease-out-soft` and the custom radius steps
  on every side and corner.
- The package no longer declares a Node engine range.
- The `CodeBlock` language label failed contrast on a brand surface; it now
  uses the secondary text colour.
- `SpotlightContent`'s `measure` counted the gutter beside the artwork as part
  of the copy's 44rem, so from `md` up the copy came out narrower than its
  measure and the headline wrapped early.

## 0.1.0

The first published version.

- Every component, icon and helper exported from the barrel, as ES modules with
  one file per source module and TypeScript declarations.
- `@kobars/kirua/styles.css`: the token layers, light and dark modes with five
  night palettes, the Tailwind theme and animations, as Tailwind v4 source CSS
  that names the package's components as a Tailwind source.
- Peer dependencies: `react` and `react-dom` 19, and `tailwindcss` 4.3 or later.
  The components use utilities that older Tailwind versions do not generate.
