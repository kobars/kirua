import path from 'node:path';
import { defineConfig } from 'vite';
import { exampleConfig } from '../vite.shared.ts';

/**
 * The one app that passes `publicDir`. The hero reuses the character artwork
 * that lives in the repository's own `public/`, and copying 1.2 MB of PNG into
 * a second directory to serve the same two files would be a worse answer than
 * naming where they already are.
 */
export default defineConfig(
  exampleConfig('marketing', {
    publicDir: path.resolve(import.meta.dirname, '../../public'),
  }),
);
