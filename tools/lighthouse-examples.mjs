/**
 * Local mobile/desktop lab measurements of the hub and each section's first
 * route. Timing scores are reported, not gated.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { SECTIONS, serve } from './example-apps.mjs';
import { lighthouse } from './lighthouse-run.mjs';
const output = process.env.KIRUA_REVIEW_OUTPUT ?? '/tmp/kirua-review';
await mkdir(output, { recursive: true });
const results = [];
const server = await serve(undefined, { compress: true });
try {
  for (const { section, prefix } of SECTIONS) {
    for (const device of ['mobile', 'desktop']) {
      const report = `${output}/lighthouse-${section}-${device}`;
      const data = await lighthouse(
        `http://127.0.0.1:${server.address().port}/#/${prefix}`,
        report,
        { desktop: device === 'desktop', outputs: ['json', 'html'] },
      );
      const score = (key) => Math.round(data.categories[key].score * 100);
      results.push({
        section,
        device,
        performance: score('performance'),
        accessibility: score('accessibility'),
        bestPractices: score('best-practices'),
        seo: score('seo'),
        LCP: Math.round(data.audits['largest-contentful-paint'].numericValue),
        CLS: data.audits['cumulative-layout-shift'].numericValue,
        TBT: Math.round(data.audits['total-blocking-time'].numericValue),
      });
      console.log(results.at(-1));
    }
  }
} finally {
  server.close();
}
await writeFile(`${output}/lighthouse-summary.json`, JSON.stringify(results, null, 2));
console.table(results);
