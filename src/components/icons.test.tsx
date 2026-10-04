import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@/test/render';
import { Badge } from './Badge';
import { Button } from './Button';
import { Chip } from './Chip';
import { IconButton } from './IconButton';
import { SparkleIcon } from './icons';

afterEach(cleanup);

const iconWidth = (container: HTMLElement) =>
  getComputedStyle(container.querySelector('svg') as SVGElement).width;

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const px = (rem: string) => `${Number.parseFloat(rem) * 16}px`;

describe('the icon size scale', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const)(
    'size="%s" resolves to its token',
    (size) => {
      const container = render(<SparkleIcon size={size} />);
      expect(iconWidth(container)).toBe(px(token(`--icon-${size}`)));
    },
  );

  it('falls back to md when nothing sets --icon-size', () => {
    const container = render(<SparkleIcon />);
    expect(iconWidth(container)).toBe(px(token('--icon-md')));
  });

  it('still takes a raw number, as the documented escape hatch', () => {
    const container = render(<SparkleIcon size={37} />);
    expect(iconWidth(container)).toBe('37px');
  });
});

/**
 * An icon inside a sized control must be sized *by the control*. A number
 * typed at the call site would mean that adding a size to any component meant
 * revisiting every icon inside it.
 */
describe('an unsized icon follows the control it sits in', () => {
  const cases: Array<[string, () => React.ReactElement, string]> = [
    [
      'Button sm',
      () => (
        <Button size="sm" leadingIcon={<SparkleIcon />}>
          Go
        </Button>
      ),
      '--icon-sm',
    ],
    [
      'Button md',
      () => (
        <Button size="md" leadingIcon={<SparkleIcon />}>
          Go
        </Button>
      ),
      '--icon-md',
    ],
    [
      'Button lg',
      () => (
        <Button size="lg" leadingIcon={<SparkleIcon />}>
          Go
        </Button>
      ),
      '--icon-lg',
    ],
    [
      'IconButton sm',
      () => (
        <IconButton size="sm" aria-label="Sparkle">
          <SparkleIcon />
        </IconButton>
      ),
      '--icon-md',
    ],
    [
      'IconButton lg',
      () => (
        <IconButton size="lg" aria-label="Sparkle">
          <SparkleIcon />
        </IconButton>
      ),
      '--icon-xl',
    ],
    [
      'Badge sm',
      () => (
        <Badge size="sm" icon={<SparkleIcon />}>
          New
        </Badge>
      ),
      '--icon-xs',
    ],
    [
      'Chip lg',
      () => (
        <Chip size="lg" leading={<SparkleIcon />}>
          Tag
        </Chip>
      ),
      '--icon-md',
    ],
  ];

  it.each(cases)('%s', (_name, element, expected) => {
    const container = render(element());
    expect(iconWidth(container)).toBe(px(token(expected)));
  });
});
