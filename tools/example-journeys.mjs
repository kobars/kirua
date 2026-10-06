/** Complete consumer flows against the production build. Run after build:examples. */
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { chromium } from 'playwright';
import { APP_SECTIONS, DIST, HUB_TITLE, SECTIONS, open, serve } from './example-apps.mjs';

const require = createRequire(import.meta.url);
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const output = process.env.KIRUA_REVIEW_OUTPUT ?? '/tmp/kirua-review';
await mkdir(output, { recursive: true });
const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
for (const { id, night } of APP_SECTIONS)
  assert(html.includes(`"${id}":"${night}"`), `index.html is missing the ${id} night`);

const browser = await chromium.launch();
let checks = 0;
async function eventually(check) {
  for (let n = 0; n < 50; n++) {
    try {
      await check();
      return;
    } catch (error) {
      if (n === 49) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
async function visible(locator) {
  await eventually(async () => assert(await locator.isVisible()));
}
async function select(page, name) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option').first().click();
}
async function audit(page, label) {
  // Read the settled surface, after enabled/disabled and overlay transitions.
  await page.waitForTimeout(250);
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
      })
    ).violations.map((v) => ({ rule: v.id, nodes: v.nodes.map((n) => n.target) })),
  );
  assert.deepEqual(violations, [], label);
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    `${label}: overflow`,
  );
}
/** Where focus is, as the tag and text of the focused element. */
async function focused(page) {
  return page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    text: document.activeElement?.textContent?.trim(),
  }));
}
const server = await serve();
try {
  for (const { section: slug, prefix } of SECTIONS) {
    for (const width of [375, 700, 1280]) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          colorScheme: theme,
          reducedMotion: width === 700 ? 'reduce' : 'no-preference',
        });
        const page = await context.newPage();
        page.setDefaultTimeout(8000);
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const base = `http://127.0.0.1:${server.address().port}/#/${prefix}`;
        const go = (route = '') => open(page, base + route);
        if (slug === 'hub') {
          // Each card opens its section, which loads its own chunk, names
          // the document, and starts at the top of the page.
          for (const { id: section, name, title } of APP_SECTIONS) {
            await go();
            // Scrolled at once rather than by the wheel, whose smooth scroll
            // can still be moving the page after the section has opened.
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.getByRole('link', { name: `Open ${name}` }).click();
            await eventually(async () => assert.equal(await page.title(), title));
            await page.waitForFunction(
              () => document.querySelector('[data-section-loading]') === null,
            );
            assert.match(page.url(), new RegExp(`#/${section}/$`));
            assert.equal(await page.evaluate(() => window.scrollY), 0);
            await visible(page.getByRole('main'));
          }
          await go();
          assert.equal(await page.title(), HUB_TITLE);
          const menu = async () => {
            await page.getByRole('button', { name: 'Theme', exact: true }).click();
            await visible(page.getByRole('menu'));
          };
          const pick = async (name) => {
            await menu();
            await page.getByRole('menuitemradio', { name }).click();
            // The menu closes with an animation; open it again once it has.
            await page.getByRole('menu').waitFor({ state: 'detached' });
          };
          if (theme === 'light') {
            // A night colours dark mode only, so a light page lists none.
            const nights = () => page.getByRole('menuitemradio', { name: /^Ink/ }).count();
            await menu();
            assert.equal(await nights(), 0, 'a light page lists no nights');
            await page.keyboard.press('Escape');
            await page.getByRole('menu').waitFor({ state: 'detached' });
            await pick(/^Dark/);
            await pick(/^Ink/);
            await visible(page.locator('html.dark[data-night-palette="ink"]'));
            await pick(/^System/);
            await visible(page.locator('html:not(.dark)'));
            await menu();
            assert.equal(await nights(), 0, 'a light page lists no nights');
            await page.keyboard.press('Escape');
            await page.getByRole('menu').waitFor({ state: 'detached' });
          } else {
            // Each section opens in its own night, on a fresh load and on a
            // move from another section, and a night picked in one section
            // stays in that section.
            const night = () =>
              page.evaluate(() => document.documentElement.dataset.nightPalette ?? 'navy');
            const move = async (id) => {
              await page.evaluate((hash) => (location.hash = hash), `#/${id}/`);
              await page.locator(`[data-route="${id}/"]`).waitFor();
            };
            for (const { id, night: own } of APP_SECTIONS) {
              await go(`${id}/`);
              await eventually(async () => assert.equal(await night(), own, `${id} on load`));
            }
            for (const { id, night: own } of APP_SECTIONS) {
              await move(id);
              await eventually(async () => assert.equal(await night(), own, `${id} on a move`));
            }
            await go('shop/');
            await pick(/^Ink/);
            await eventually(async () => assert.equal(await night(), 'ink'));
            await move('his');
            await eventually(async () => assert.equal(await night(), 'graphite'));
            await move('shop');
            await eventually(async () => assert.equal(await night(), 'ink'));
            await page.evaluate(() => (location.hash = '#/'));
            await eventually(async () => assert.equal(await night(), 'navy'));
          }
        } else if (slug === 'marketing') {
          await go('contact');
          await page.getByRole('button', { name: 'Send message' }).click();
          await visible(page.getByText('Enter your name.', { exact: true }));
          // Focus goes to the first field to fix, not back to the page.
          assert.equal(await page.evaluate(() => document.activeElement?.id), 'contact-name');
          await audit(page, 'contact invalid');
          await page.getByLabel('Your name').fill('Example Reader');
          await page
            .getByRole('textbox', { name: 'Email', exact: true })
            .fill('reader@example.com');
          await page
            .getByRole('textbox', { name: 'Message', exact: true })
            .fill('Please explain the studio plan.');
          await page.getByRole('button', { name: 'Send message' }).click();
          await visible(page.getByText('Demo message received'));
        } else if (slug === 'shop') {
          // An address with no screen says so, rather than showing the
          // catalogue in its place.
          await page.goto(`${base}products/no-such-product`);
          await visible(page.getByRole('heading', { level: 1, name: 'Page not found' }));
          await eventually(async () =>
            assert.equal(await page.title(), 'Page not found · Dusk — a kirua example'),
          );
          await go('checkout');
          await visible(page.getByText('Your cart is empty', { exact: true }));
          await go('products/round-glasses');
          // A route change inside a section behaves like a page load: the
          // title names the new screen and focus is on its heading.
          assert.equal(await page.title(), 'Round Glasses · Dusk — a kirua example');
          assert.deepEqual(await focused(page), { tag: 'H1', text: 'Round Glasses' });
          await page.getByRole('button', { name: 'Increase quantity', exact: true }).click();
          assert.equal(await page.getByText('Added to cart', { exact: true }).count(), 0);
          await page.getByRole('button', { name: 'Decrease quantity', exact: true }).click();
          // At either end of the range the button is marked unavailable and
          // keeps focus, rather than disabling itself out from under it.
          for (const name of ['Increase quantity', 'Decrease quantity']) {
            const stepper = page.getByRole('button', { name, exact: true });
            await stepper.focus();
            for (let n = 0; n < 40; n++) {
              if ((await stepper.getAttribute('aria-disabled')) === 'true') break;
              await page.keyboard.press('Enter');
            }
            assert.equal(await stepper.getAttribute('aria-disabled'), 'true', name);
            assert.equal(
              await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
              name,
            );
          }
          const scrollBehavior = await page
            .locator('[data-slot="carousel"]')
            .evaluate((el) => getComputedStyle(el).scrollBehavior);
          assert.equal(scrollBehavior, width === 700 ? 'auto' : 'smooth');
          // The size chosen is the size in the cart.
          await page.getByRole('radio', { name: 'M', exact: true }).click();
          await page.getByRole('button', { name: /Add to cart/i }).click();
          await page.getByRole('button', { name: 'Cart', exact: true }).click();
          await visible(page.getByRole('dialog'));
          await visible(page.getByRole('dialog').getByText(/^Size M · /));
          const animation = await page.getByRole('dialog').evaluate((el) => ({
            name: getComputedStyle(el).animationName,
            duration: getComputedStyle(el).animationDuration,
          }));
          if (width === 700) assert(parseFloat(animation.duration) <= 0.001);
          else assert.notEqual(animation.name, 'none');
          await audit(page, 'cart open');
          await page.keyboard.press('Escape');
          await eventually(async () => assert.equal(await page.getByRole('dialog').count(), 0));
          await page.getByRole('button', { name: 'Cart', exact: true }).click();
          await page.getByRole('button', { name: 'Checkout', exact: true }).click();
          await page.getByRole('button', { name: 'Pay', exact: true }).click();
          await visible(page.getByText('4 fields need fixing'));
          assert.equal(
            await page.evaluate(() => document.activeElement?.getAttribute('role')),
            'alert',
          );
          await audit(page, 'checkout invalid');
          // Each summary entry moves focus to its field.
          await page
            .getByRole('link', {
              name: 'A phone number starts with 0 and has 9 to 13 digits.',
            })
            .click();
          assert.equal(await page.evaluate(() => document.activeElement?.id), 'phone');
          await page.getByLabel('Recipient name').fill('Demo Buyer');
          // Once sent back, the form re-validates as it changes.
          await visible(page.getByText('3 fields need fixing'));
          await page.getByLabel('Phone', { exact: true }).fill('081234567890');
          await page.getByLabel('Address', { exact: true }).fill('123 Example Street, Bandung');
          await page.getByRole('radio', { name: /Express/ }).click();
          await visible(page.getByText('Rp 50,000', { exact: true }));
          await page.getByRole('radio', { name: 'Collect in store' }).click();
          await visible(page.getByText('Free', { exact: true }));
          await page.getByRole('checkbox', { name: 'I accept the delivery terms' }).click();
          await page.getByRole('button', { name: 'Pay', exact: true }).click();
          await visible(page.getByText('Order received', { exact: true }));
          assert.equal(await page.getByRole('button', { name: 'Pay', exact: true }).count(), 0);
          if (width === 1280) {
            // The empty result's way out clears what emptied it, here the
            // header search, and the whole catalogue is back — every product,
            // the dearest included.
            await go();
            await page.getByRole('textbox', { name: 'Search products' }).fill('zzz');
            await visible(page.getByText('Nothing matches', { exact: true }));
            await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
            await visible(page.getByRole('heading', { level: 1, name: 'Catalogue (24)' }));
            assert.equal(
              await page.getByRole('textbox', { name: 'Search products' }).inputValue(),
              '',
            );
          }
          await go('sign-in');
          const phone = page.getByLabel('Phone number');
          await phone.fill('812 3456 7890');
          // Enter submits the step, and the code field takes the focus.
          await phone.press('Enter');
          const code = page.getByRole('textbox', { name: 'One-time code', exact: true });
          await eventually(async () =>
            assert.equal(await page.evaluate(() => document.activeElement?.id), 'otp'),
          );
          await page.keyboard.type('123456');
          await visible(
            page.getByRole('alert').filter({ hasText: 'That code does not match' }),
          );
          await audit(page, 'sign-in wrong code');
          // The real caret is pinned to the end, where the boxes draw it, so
          // Backspace after ArrowLeft removes the last digit.
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.press('Backspace');
          assert.equal(await code.inputValue(), '12345');
        } else if (slug === 'his') {
          await go('new-visit');
          await page.getByRole('button', { name: 'Schedule the visit' }).click();
          await visible(page.getByText('5 fields need attention'));
          await page.getByRole('link', { name: 'A department is required.' }).click();
          assert.equal(await page.evaluate(() => document.activeElement?.id), 'department');
          assert.equal(
            await page
              .getByRole('combobox', { name: 'Patient', exact: true })
              .getAttribute('aria-invalid'),
            'true',
          );
          await audit(page, 'visit invalid');
          await select(page, 'Patient');
          await visible(page.getByText('4 fields need attention'));
          // Choosing a patient reads their coverage back under the field.
          await visible(page.getByText(/^Cardinal Mutual PPO · eligibility active/));
          await select(page, 'Department');
          await select(page, 'Provider');
          const language = page.getByRole('combobox', { name: 'Preferred language' });
          await language.selectOption('Tagalog');
          await page.getByRole('combobox', { name: 'Diagnosis (ICD-10-CM)' }).fill('zzzz');
          await page.keyboard.press('ArrowDown');
          await page.getByRole('combobox', { name: 'Diagnosis (ICD-10-CM)' }).fill('J06');
          await page.keyboard.press('Enter');
          await page.getByRole('button', { name: 'Clear', exact: true }).click();
          assert.equal(
            await page.getByRole('combobox', { name: 'Diagnosis (ICD-10-CM)' }).inputValue(),
            '',
          );
          // A native select is reset by the form itself, with no state to clear.
          assert.equal(await language.inputValue(), 'English');
          assert(
            await page.getByRole('combobox', { name: 'Provider', exact: true }).isDisabled(),
          );
          assert.equal(await page.getByRole('alert').count(), 0);
          await select(page, 'Patient');
          await select(page, 'Department');
          await page.getByRole('combobox', { name: 'Visit date', exact: true }).click();
          await page.locator('[data-slot="calendar-day"]').first().click();
          // A combobox reads its text as its value, so the chosen date is
          // announced after the label.
          const dateSnapshot = await page
            .getByRole('combobox', { name: 'Visit date', exact: true })
            .ariaSnapshot();
          assert.match(dateSnapshot, /combobox "Visit date".*2026/);
          await page.getByLabel('Reason for visit').fill('Routine demonstration visit');
          await page.getByRole('checkbox', { name: 'Consent to treat is signed' }).click();
          await page.getByRole('button', { name: 'Schedule the visit' }).click();
          await visible(page.getByText('Visit scheduled', { exact: true }));
          assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'OUTPUT');
          // The confirmation describes the form as sent; a language change
          // after it books a different interpreter, so it is withdrawn.
          await language.selectOption('Tagalog');
          assert.equal(await page.getByText('Visit scheduled', { exact: true }).count(), 0);
        } else if (slug === 'social') {
          await go();
          assert(await page.getByRole('navigation', { name: 'Main', exact: true }).isVisible());
          await page
            .getByLabel('Write a post')
            .fill('A usable design system needs working examples.');
          // Sent from the keyboard: the button empties the box and stays
          // focused, unavailable until there is something to send again.
          await page.getByRole('button', { name: 'Send', exact: true }).press('Enter');
          assert.equal(
            await page.evaluate(() => document.activeElement?.textContent?.trim()),
            'Send',
          );
          await visible(
            page.getByText('A usable design system needs working examples.', { exact: true }),
          );
          assert.equal(await page.getByLabel('Write a post').inputValue(), '');
          await page
            .getByRole('button', { name: 'Reply to post', exact: true })
            .first()
            .click();
          await page
            .getByRole('textbox', { name: 'Write a reply', exact: true })
            .fill('A local reply.');
          await page.getByRole('button', { name: 'Reply', exact: true }).click();
          await visible(page.getByText('A local reply.', { exact: true }));
          await audit(page, 'post replies');
          await go('messages');
          const reply = page
            .getByRole('textbox', { name: /^Reply to/ })
            .filter({ visible: true });
          await reply.fill('LongMessage'.repeat(30));
          await reply.press('Enter');
          await visible(
            page.getByText('LongMessage'.repeat(30), { exact: true }).filter({ visible: true }),
          );
        } else {
          await go('tokens');
          await page.getByRole('button', { name: 'Suggest a prompt' }).click();
          const composer = page.getByLabel('Message the assistant');
          assert.notEqual(await composer.inputValue(), '');
          await composer.fill('Review this example interaction.');
          await composer.press('Enter');
          await visible(page.getByText('Review this example interaction.', { exact: true }));
          await composer.fill('Keep this draft while busy.');
          await composer.press('Enter');
          assert.equal(await composer.inputValue(), 'Keep this draft while busy.');
          await visible(page.getByText(/^This is a local demo reply\./));
        }
        await audit(page, `${slug}/${width}/${theme}`);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `${output}/${slug}-${width}-${theme}.png`,
          fullPage: true,
        });
        assert.deepEqual(errors, [], `${slug}: runtime errors`);
        console.log(`journey: ${slug} ${width}px ${theme} passed`);
        checks++;
        await context.close();
      }
    }
  }
} finally {
  server.close();
  await browser.close();
}
console.log(`example-journeys: ${checks} flows passed; screenshots in ${output}`);
