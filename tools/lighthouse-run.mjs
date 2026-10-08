/**
 * One Lighthouse run, in the Chromium that Playwright installs, so every tool
 * measures with the same browser and the same Lighthouse release.
 */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const LIGHTHOUSE = 'lighthouse@13.4.1';

/**
 * Runs Lighthouse against `url` and returns the parsed JSON report. With one
 * format in `outputs` the report is written to `reportPath`; with several,
 * Lighthouse writes `<reportPath>.report.<format>` for each.
 *
 * `desktop` selects Lighthouse's desktop preset; the default is its mobile
 * emulation with simulated throttling. `categories` limits the audit to those
 * categories.
 */
export async function lighthouse(
  url,
  reportPath,
  { desktop = false, categories = [], outputs = ['json'] } = {},
) {
  await new Promise((resolve, reject) => {
    const child = spawn(
      'pnpm',
      [
        'dlx',
        LIGHTHOUSE,
        url,
        '--quiet',
        '--chrome-flags=--headless --no-sandbox',
        ...outputs.map((format) => `--output=${format}`),
        `--output-path=${reportPath}`,
        ...(categories.length > 0 ? [`--only-categories=${categories.join(',')}`] : []),
        ...(desktop ? ['--preset=desktop'] : []),
      ],
      { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
    );
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code} for ${url}`)),
    );
  });
  const json = outputs.length === 1 ? reportPath : `${reportPath}.report.json`;
  const report = JSON.parse(await readFile(json, 'utf8'));
  if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
  return report;
}
