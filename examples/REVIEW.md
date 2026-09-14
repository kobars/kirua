# Example usability review — 14 September 2026

The five applications use Kirua's public exports and semantic styles consistently enough to serve as consumer examples. Their initial screens passed the existing checks, but that did not establish that their controls worked. This review added interaction coverage and corrected the failures it exposed. No new example application was needed.

## Corrections

| Application | Failure                                                                         | Result                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assistant   | Sending discarded the text; Enter bypassed the busy state                       | Turns and an explicitly local demo reply appear in the selected conversation; a busy composer retains its draft                                            |
| Assistant   | Suggest and Copy had no behavior                                                | Suggestions populate and focus the composer without submitting; Copy reports success or failure                                                            |
| Shop        | Empty carts could submit; delivery choices never changed totals                 | Empty checkout has a catalogue action; delivery is controlled and reflected in totals; completed orders cannot submit again; submission focuses its result |
| Shop        | Added-to-cart toast covered the sheet's Checkout button                         | Opening the cart clears the notification                                                                                                                   |
| Shop        | Repeated additions exceeded stock; cart promised nonexistent persistence        | Quantities clamp to stock; copy describes session-only storage                                                                                             |
| Shop        | Slider hit area crowded its accordion heading                                   | Additional space separates the controls                                                                                                                    |
| SIMRS       | Field labels/errors landed on Select and Combobox wrappers                      | Field now wraps the actual trigger/input, so names and error descriptions reach the controls                                                               |
| SIMRS       | Clear left controlled values/errors behind; changing clinic retained the doctor | Reset clears both native and controlled state; clinic changes clear the doctor; submission focuses its result                                              |
| SIMRS       | An empty diagnosis search could leave an invalid active index                   | Selection and arrow-key state recover after an empty result                                                                                                |
| Commons     | No primary navigation between 640 and 767px                                     | Bottom navigation and sidebar now switch at the same breakpoint                                                                                            |
| Commons     | Send, replies, sharing and several post actions were inert                      | Local posts/replies, like counts, copy feedback, pin/report feedback and follow toggles respond to input                                                   |
| Commons     | Long messages could overflow or extend the phone conversation indefinitely      | Text wraps and a bounded Kirua ScrollArea provides keyboard-accessible scrolling; new replies scroll into view and each conversation keeps its own draft   |
| Commons     | Profile links crowded adjacent controls                                         | Links have a minimum 24px height                                                                                                                           |
| Marketing   | Required name accepted an empty value; success implied a real delivery          | Name validation is enforced and the receipt identifies the demo behavior                                                                                   |

These are local demonstrations. They have no authentication, payment, messaging, moderation or persistence service. Follow/mute/pin/report states are local UI demonstrations, not account-wide services. Fixed sample counts, illustrations and records remain sample content.

## Repeatable checks

- `pnpm check:examples`: builds all apps and checks raw-element reuse, exported-component usage, responsive layout/target spacing, composed-screen axe results, bundle budgets and complete user journeys.
- `pnpm check:journeys`: runs the journeys alone after building. Covers five apps at 375, 700 and 1280px in light/dark mode; 700px uses reduced motion. Includes open cart animation, Escape dismissal, invalid and successful submissions, posting/replying and long messages. Runtime errors and accessibility failures fail the command.
- `pnpm check:lighthouse`: builds and runs pinned Lighthouse 13.4.1 on each app's home page with mobile and desktop profiles. The local server enables gzip for this measurement. Timing scores are reported rather than enforced.
- `pnpm check`: types, dead classes, lint, format, component/story/browser/coverage tests and WebKit.

Journey screenshots and Lighthouse HTML/JSON reports default to `/tmp/kirua-review`; set `KIRUA_REVIEW_OUTPUT` to retain them elsewhere. They are generated evidence, not visual baselines. Initial phone/desktop home pages were also inspected visually. Screenshots use placeholder product and post media intentionally.

The responsive check now measures a small target's distance to a neighboring control's actual rectangle, as well as to other small targets' circles. The previous center-only comparison missed a slider immediately below a wide accordion trigger. CSS coverage now survives route navigation so the reported union includes every route, rather than just the last document.

## Measured results

Validation passed 180 responsive route views, 144 initial-page axe views with zero violations, and 30 complete interaction flows with additional state-specific axe checks. The full project gate passed 3,212 tests and 680 WebKit tests. Storybook's build and theme/navigation/portal checks passed. The initial visual run timed out waiting for a stable screenshot during concurrent browser work; the complete rerun passed without replacing any baseline.

Lighthouse 13.4.1, local gzip delivery, one mobile and one desktop run per application:

| App       | Mobile performance | Desktop performance | Accessibility / best practices / SEO | Mobile LCP | Mobile CLS | Mobile TBT |
| --------- | ------------------ | ------------------- | ------------------------------------ | ---------- | ---------- | ---------- |
| claude    | 98                 | 100                 | 100 / 100 / 100                      | 2.01s      | 0.0000     | 4ms        |
| shop      | 98                 | 100                 | 100 / 100 / 100                      | 1.99s      | 0.0001     | 24ms       |
| simrs     | 98                 | 100                 | 100 / 100 / 100                      | 1.97s      | 0.0000     | 0ms        |
| social    | 98                 | 100                 | 100 / 100 / 100                      | 1.98s      | 0.0008     | 3ms        |
| marketing | 98                 | 100                 | 100 / 100 / 100                      | 1.95s      | 0.0514     | 0ms        |

## Limits and next work

Lighthouse is a local lab measurement of the home routes, with real Google Fonts requests and simulated throttling. It does not establish deployed-host performance, field INP, or every route's Lighthouse score. Gzip matters: the first uncompressed-server run scored 74–82 on mobile. Do not compare those figures with compressed delivery as if application code alone produced the difference.

The next board task remains the copied-appearance gate: markup reuse checks do not detect a consumer recreating a component's styling. A dedicated component root/variant signature check still needs a narrowly defined rule and a planted regression. Further product work should replace local demo state with explicit service contracts before presenting these applications as production products.

## Component-level follow-up

A separate component review reproduced five failures in the design system itself before applying fixes:

| Component                       | Reproduction                                                                                                | Component fix                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Calendar                        | Click either month navigation button while Calendar is inside a form; the form submits                      | Built-in month buttons use button actions                                             |
| QuantityStepper                 | Increment/decrement inside a form; the form submits                                                         | Built-in adjustment buttons use button actions                                        |
| ToastClose                      | Dismiss a toast rendered within a form; the form submits                                                    | Dismiss defaults to a button action, while explicit consumer props remain overridable |
| Slider                          | Give a vertical slider 200px of height; its track is only 6px high and the range uses horizontal dimensions | Root, track and range dimensions follow orientation                                   |
| Carousel / shared motion styles | Emulate reduced motion; computed scroll behavior remains smooth                                             | The reduced-motion stylesheet also disables smooth scrolling                          |

The initial browser probe had **5 failing and 8 passing assertions**. The focused verification afterward passed 19 tests, including the vertical-slider Storybook interaction. The full component gate then passed **3,234 tests plus 686 WebKit tests**. Production build and Storybook checks also passed; no visual baselines were replaced.

[Component regressions](../src/components/composition.test.tsx) check that internal actions invoke their handlers without submitting, the explicit Save action still submits, both slider orientations fill the correct fraction of their track, and normal-motion carousels retain smooth scrolling. The reduced-motion project checks the opposite scroll behavior under actual browser emulation. These regressions also run in the existing Chromium viewport matrix and WebKit project where applicable.

The shop product quantity picker now sits inside its Add-to-cart form. The example journey adjusts quantity and verifies that nothing was added, then submits explicitly. It also checks the product carousel's motion preference. The new **Components / Slider / Vertical** story demonstrates one-thumb and range sliders and verifies keyboard adjustment.

The final example gate passed 180 responsive views, 144 accessibility views, all five size budgets and 30 journeys. The follow-up Lighthouse run measured 97–98 mobile and 99–100 desktop performance, with 100 accessibility, best-practices and SEO scores. These are local gzip lab measurements; the earlier table above records the previous example-review run.

This follow-up covers built-in form actions, slider orientation and reduced-motion scrolling; it is not an exhaustive proof of every component behavior.
