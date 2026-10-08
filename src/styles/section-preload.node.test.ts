import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { build, type Rolldown } from 'vite';
import { describe, expect, it } from 'vitest';
import { SECTIONS } from '../../examples/sections';

/**
 * The example app's `index.html` starts downloading the section the address
 * names before the entry has run. The list of files comes from the build, so
 * the test builds the app and runs the script as it ships.
 */

const EXAMPLES = path.join(import.meta.dirname, '../../examples');

async function builtHtml() {
  const previous = process.env['KIRUA_SOURCE'];
  process.env['KIRUA_SOURCE'] = '1';
  let output: Rolldown.RolldownOutput;
  try {
    output = (await build({
      configFile: path.join(EXAMPLES, 'vite.config.ts'),
      logLevel: 'silent',
      build: { write: false },
    })) as Rolldown.RolldownOutput;
  } finally {
    if (previous === undefined) delete process.env['KIRUA_SOURCE'];
    else process.env['KIRUA_SOURCE'] = previous;
  }
  const html = output.output.find((file) => file.fileName === 'index.html');
  if (html?.type !== 'asset') throw new Error('the build wrote no index.html');
  return {
    html: String(html.source),
    files: new Set(output.output.map((file) => file.fileName)),
  };
}

/** The hrefs the preload script appends for a given address. */
function preloads(html: string, hash: string) {
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1] ?? '')
    .find((body) => body.includes('sectionChunks'));
  if (!script) throw new Error('index.html has no preload script');
  const appended: { rel: string; href: string; crossOrigin: string | null }[] = [];
  runInNewContext(script, {
    URL,
    location: { hash },
    document: {
      baseURI: 'https://example.test/kirua/',
      createElement: () => ({ rel: '', href: '', crossOrigin: null }),
      head: { append: (link: (typeof appended)[number]) => appended.push(link) },
    },
  });
  return appended;
}

describe('section preload', () => {
  it('names every section’s own chunks, and nothing for the hub', async () => {
    const { html, files } = await builtHtml();
    for (const { id } of SECTIONS) {
      const links = preloads(html, `#/${id}/`);
      expect(links.length, id).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.rel).toBe('modulepreload');
        expect(link.crossOrigin).toBe('');
        const file = link.href.replace('https://example.test/kirua/', '');
        expect(files.has(file), `${id}: ${file}`).toBe(true);
      }
    }
    expect(preloads(html, '')).toEqual([]);
    expect(preloads(html, '#/nowhere')).toEqual([]);
    expect(preloads(html, '#/constructor')).toEqual([]);
  }, 60_000);
});
