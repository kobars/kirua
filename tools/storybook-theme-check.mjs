import assert from 'node:assert/strict';
import path from 'node:path';
import { chromium } from 'playwright';
import { REPO, serve } from './example-apps.mjs';

const server = await serve(path.join(REPO, 'storybook-static'));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const docs = page.frameLocator('#storybook-preview-iframe');
const specimen = docs.frameLocator('iframe').first();
const background = (locator) =>
  locator.evaluate((element) => getComputedStyle(element).backgroundColor);

async function chooseMode(mode) {
  await page.getByRole('button', { name: /^Colour mode / }).click();
  await page.getByText(mode === 'dark' ? 'Dark' : 'Light', { exact: true }).click();
  await documentMode(docs, mode);
}

async function documentMode(frame, mode) {
  await frame.locator(mode === 'dark' ? 'html.dark' : 'html:not(.dark)').waitFor();
}

try {
  await page.goto(`${base}/?path=/docs/components-aspectratio--docs`);
  await docs.locator('.sbdocs-content').waitFor();
  await specimen.locator('[data-slot="aspect-ratio"]').waitFor();
  const lightDocs = await background(docs.locator('.sbdocs-wrapper'));
  const lightShell = await background(page.locator('body'));
  const lightPreview = await background(specimen.locator('body'));
  await chooseMode('dark');
  await documentMode(specimen, 'dark');
  assert.notEqual(
    await background(docs.locator('.sbdocs-wrapper')),
    lightDocs,
    'Docs background must follow Mode',
  );
  assert.notEqual(
    await background(page.locator('body')),
    lightShell,
    'Manager background must follow Mode',
  );
  assert.notEqual(
    await background(specimen.locator('body')),
    lightPreview,
    'Preview background must follow Mode',
  );
  assert.equal(
    await specimen.locator('html').evaluate((root) => root.scrollHeight <= innerHeight),
    true,
    'Default AspectRatio preview must fit without a vertical scrollbar',
  );
  assert.equal(
    await docs
      .locator('table')
      .first()
      .evaluate((table) => table.clientWidth >= table.parentElement.clientWidth * 0.95),
    true,
    'Props table must fill its available width',
  );
  await page.getByRole('button', { name: /^Surface context / }).click();
  await page.getByText('Brand (ctx-brand)', { exact: true }).click();
  await specimen.locator('#storybook-root > .ctx-brand').waitFor();
  await documentMode(docs, 'dark');
  await documentMode(specimen, 'dark');
  await page.getByRole('button', { name: /^Surface context / }).click();
  await page.getByText('Page (default)', { exact: true }).click();

  await chooseMode('light');
  await documentMode(specimen, 'light');
  assert.equal(await background(docs.locator('.sbdocs-wrapper')), lightDocs);
  assert.equal(await background(specimen.locator('body')), lightPreview);

  await chooseMode('dark');
  await page.getByRole('link', { name: 'Introduction', exact: true }).click();
  await docs.locator('.sbdocs-content h1').filter({ hasText: 'kirua' }).waitFor();
  await documentMode(docs, 'dark');
  await page.reload();
  await docs.locator('.sbdocs-content h1').filter({ hasText: 'kirua' }).waitFor();
  await documentMode(docs, 'dark');

  await page.goto(`${base}/?path=/docs/components-dialog--docs&globals=mode:light`);
  await specimen.getByRole('button', { name: 'Enroll Now', exact: true }).click();
  const dialog = specimen.getByRole('dialog', { name: 'Join the anime class' });
  await dialog.waitFor();
  const lightDialog = await background(dialog);
  await chooseMode('dark');
  await documentMode(specimen, 'dark');
  // Storybook remounts docs on global changes; open the new specimen's portal.
  await specimen.getByRole('button', { name: 'Enroll Now', exact: true }).click();
  await dialog.waitFor();
  assert.notEqual(await background(dialog), lightDialog, 'Docs portal must follow Mode');

  await page.goto(`${base}/?path=/story/components-dialog--default&globals=mode:light`);
  await docs.getByRole('button', { name: 'Enroll Now', exact: true }).click();
  const openDialog = docs.getByRole('dialog', { name: 'Join the anime class' });
  await openDialog.waitFor();
  const lightStoryDialog = await background(openDialog);
  await chooseMode('dark');
  assert.notEqual(
    await background(openDialog),
    lightStoryDialog,
    'Open story portal must change mode without losing its state',
  );
  await chooseMode('light');
  assert.equal(await background(openDialog), lightStoryDialog);

  await page.goto(`${base}/?path=/docs/patterns-anime-hero--docs&globals=mode:dark`);
  await documentMode(docs, 'dark');
  await documentMode(docs.frameLocator('iframe[title="Light"]'), 'light');
  await documentMode(docs.frameLocator('iframe[title="Dark"]'), 'dark');

  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(
    `${base}/iframe.html?id=components-aspectratio--docs&viewMode=docs&globals=mode:dark`,
  );
  await documentMode(page, 'dark');
  await page.locator('.sbdocs-content').waitFor();
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
    'Docs must fit a phone viewport',
  );
  await documentMode(page.frameLocator('iframe').first(), 'dark');
  assert.deepEqual(errors, [], 'Documentation must not produce browser errors');
  console.log(
    'storybook-theme-check: mode toggles, docs navigation/reload, isolated previews, open portals, fixed-mode stories and phone layout passed.',
  );
} catch (error) {
  console.error('Browser errors:', errors);
  console.error('Page:', page.url());
  throw error;
} finally {
  await browser.close();
  server.close();
}
