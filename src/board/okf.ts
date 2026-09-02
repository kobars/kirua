/**
 * The reader half of the board's tooling, ported to TypeScript for the app.
 *
 * `board/tools/okf.mjs` is the original and stays the authority: it runs in a
 * pre-commit hook with zero dependencies, and *an enforcement layer that can
 * fail to run is not one*. This file reads the same subset of YAML the same
 * way — scalars, inline lists, block lists, one level of nested map — and
 * throws on anything else with a line number, so a field shape nobody planned
 * for is loud here too. If the two ever disagree, this one is wrong.
 */

export type YamlValue = string | null | YamlValue[] | { [key: string]: YamlValue };
export type Frontmatter = Record<string, YamlValue>;

export interface Document {
  /** Bundle-relative, always with a leading slash: `/tasks/field.md`. */
  resource: string;
  /** `index.md` and `log.md` are reserved by OKF and carry no frontmatter. */
  reserved: boolean;
  data: Frontmatter | null;
  body: string;
  error?: string;
}

export const RESERVED = ['index.md', 'log.md'] as const;

const KEY = /^([A-Za-z_][\w-]*):\s*(.*)$/;

function unquote(value: string): string {
  const m = value.match(/^(['"])(.*)\1$/);
  return m ? m[2]! : value;
}

function inlineMap(value: string, lineNo: number): { [key: string]: YamlValue } {
  const inner = value.replace(/^\{|\}$/g, '').trim();
  const map: { [key: string]: YamlValue } = {};
  for (const pair of inner
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)) {
    const idx = pair.indexOf(':');
    if (idx === -1) throw new Error(`line ${lineNo + 1}: bad inline map "${pair}"`);
    map[pair.slice(0, idx).trim()] = unquote(pair.slice(idx + 1).trim());
  }
  return map;
}

function scalarOrList(value: string): YamlValue {
  if (value === '') return null;
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => unquote(s.trim()));
  }
  if (value.startsWith('{')) return inlineMap(value, -1);
  return unquote(value);
}

/** Minimal YAML reader covering exactly the subset the bundle uses. */
export function parseYaml(src: string): Frontmatter {
  const out: Frontmatter = {};
  const lines = src.split('\n');
  let key: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    if (!raw.trim() || raw.trim().startsWith('#')) continue;

    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();

    if (indent === 0) {
      const m = line.match(KEY);
      if (!m) throw new Error(`line ${i + 1}: cannot parse "${line}"`);
      key = m[1]!;
      out[key] = scalarOrList(m[2]!);
      continue;
    }

    if (key === null) throw new Error(`line ${i + 1}: indented line with no key`);
    const current = out[key];

    if (line.startsWith('- ')) {
      const item = line.slice(2).trim();
      const list = Array.isArray(current) ? current : [];
      list.push(item.startsWith('{') ? inlineMap(item, i) : unquote(item));
      out[key] = list;
      continue;
    }

    const nested = line.match(KEY);
    if (!nested) throw new Error(`line ${i + 1}: cannot parse "${line}"`);
    if (Array.isArray(current)) {
      const last = current[current.length - 1];
      if (last && typeof last === 'object' && !Array.isArray(last)) {
        last[nested[1]!] = scalarOrList(nested[2]!);
        continue;
      }
    }
    const map =
      current && typeof current === 'object' && !Array.isArray(current) ? current : {};
    map[nested[1]!] = scalarOrList(nested[2]!);
    out[key] = map;
  }

  return out;
}

/** Splits one markdown file into frontmatter and body, never throwing: a bad
 *  file is a document with an `error`, so one broken card cannot blank the app. */
export function parseDocument(resource: string, text: string): Document {
  const name = resource.split('/').pop()!;
  const reserved = (RESERVED as readonly string[]).includes(name);
  if (reserved) return { resource, reserved, data: null, body: text };
  if (!text.startsWith('---\n')) {
    return { resource, reserved, data: null, body: text, error: 'no frontmatter block' };
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    return { resource, reserved, data: null, body: text, error: 'unterminated frontmatter' };
  }
  try {
    return {
      resource,
      reserved,
      data: parseYaml(text.slice(4, end)),
      body: text.slice(end + 4),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { resource, reserved, data: null, body: text, error: `${resource}: ${message}` };
  }
}

/** A bundle is the files of one root, keyed by bundle-relative resource. */
export function parseBundle(files: Record<string, string>): Document[] {
  return Object.entries(files)
    .map(([resource, text]) => parseDocument(resource, text))
    .sort((a, b) => a.resource.localeCompare(b.resource));
}
