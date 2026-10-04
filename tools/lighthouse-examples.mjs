/**
 * Local mobile/desktop lab measurements of the hub and each section's first
 * route. Timing scores are reported, not gated.
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { SECTIONS, serve } from './example-apps.mjs';
const output = process.env.KIRUA_REVIEW_OUTPUT ?? '/tmp/kirua-review';
await mkdir(output, { recursive: true });
const results = [];
const server = await serve(undefined, { compress: true });
try {
  for (const { section, prefix } of SECTIONS) {
    for (const device of ['mobile', 'desktop']) {
      const report = `${output}/lighthouse-${section}-${device}`;
      await new Promise((resolve, reject) => {
        const child = spawn(
          'pnpm',
          [
            'dlx',
            'lighthouse@13.4.1',
            `http://127.0.0.1:${server.address().port}/#/${prefix}`,
            '--quiet',
            '--chrome-flags=--headless --no-sandbox',
            '--output=json',
            '--output=html',
            `--output-path=${report}`,
            ...(device === 'desktop' ? ['--preset=desktop'] : []),
          ],
          { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
        );
        child.on('error', reject);
        child.on('exit', (code) =>
          code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code}`)),
        );
      });
      const data = JSON.parse(await readFile(`${report}.report.json`, 'utf8'));
      if (data.runtimeError) throw new Error(JSON.stringify(data.runtimeError));
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
