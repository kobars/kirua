import { describe, expect, it } from 'vitest';

/**
 * "Adding a story adds a test" is the whole testing model: `@storybook/addon-vitest`
 * turns every story export into a browser test with an axe assertion. So a
 * component with no story has no test and no accessibility check — and until
 * this file existed, that rule lived in prose, which is how three components
 * slipped past it.
 *
 * `import.meta.glob` is resolved by Vite at build time, so this reads the real
 * directory rather than a list somebody has to remember to update.
 */
const componentFiles = Object.keys(import.meta.glob('./*.tsx')).filter(
  (path) => !path.endsWith('.stories.tsx') && !path.endsWith('.test.tsx'),
);
const storyFiles = new Set(Object.keys(import.meta.glob('./*.stories.tsx')));

describe('every component file has a story file', () => {
  it('finds the component files at all, so an empty glob cannot pass', () => {
    expect(componentFiles.length).toBeGreaterThan(10);
  });

  it.each(componentFiles)('%s', (path) => {
    expect(storyFiles).toContain(path.replace(/\.tsx$/, '.stories.tsx'));
  });
});
