import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './Attachment';
import { Progress } from './Progress';
import { Spinner } from './Spinner';
import { CloseIcon, FileIcon, ImageIcon, MoreIcon } from './icons';

const LONG_NAME = 'referral-letter-cardiology-dr-okafor-2026-02-04.pdf';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Attachment',
  component: Attachment,
  args: { size: 'md', orientation: 'horizontal' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    status: { control: 'inline-radio', options: [undefined, 'uploading', 'error'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A file as a small card: media, the name and its size, and actions. An `AttachmentTrigger` around the name makes the whole card open the file while the actions stay separately clickable. `AttachmentGroup` is a list.',
      },
    },
  },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Attachment {...args}>
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>cbc-2026-03-12.pdf</AttachmentTitle>
          <AttachmentDescription>
            {args.status === 'error' ? 'Upload failed' : 'PDF · 214 kB'}
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf">
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <AttachmentGroup className="w-80">
      {(['sm', 'md'] as const).map((size) => (
        <Attachment key={size} size={size} data-testid={size}>
          <AttachmentMedia>
            <FileIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>cbc-2026-03-12.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const media = (id: string) =>
      canvas
        .getByTestId(id)
        .querySelector('[data-slot="attachment-media"]')!
        .getBoundingClientRect().width;
    await expect(media('sm')).toBeLessThan(media('md'));
  },
};

/**
 * A row puts the media beside the name; a tile puts it above, as a square
 * across the card, with the actions over its end corner.
 */
export const Orientations: Story = {
  render: () => (
    <AttachmentGroup layout="wrap" className="w-96">
      <Attachment orientation="horizontal" data-testid="horizontal">
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>cbc-2026-03-12.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf">
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical" data-testid="vertical">
        <AttachmentMedia>
          <ImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>chest-xray-pa.png</AttachmentTitle>
          <AttachmentDescription>PNG · 1.2 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove chest-xray-pa.png">
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const part = (id: string, slot: string) =>
      canvas
        .getByTestId(id)
        .querySelector(`[data-slot="attachment-${slot}"]`)!
        .getBoundingClientRect();

    // A row: the media beside the content, centred on it.
    const rowMedia = part('horizontal', 'media');
    const rowContent = part('horizontal', 'content');
    await expect(rowMedia.right).toBeLessThanOrEqual(rowContent.left);
    await expect(rowMedia.top).toBeLessThan(rowContent.bottom);

    // A tile: the media above the content, square, across the card's width.
    const tile = canvas.getByTestId('vertical').getBoundingClientRect();
    const tileMedia = part('vertical', 'media');
    const tileContent = part('vertical', 'content');
    await expect(tileMedia.bottom).toBeLessThanOrEqual(tileContent.top);
    await expect(Math.round(tileMedia.width)).toBe(Math.round(tileMedia.height));
    await expect(tileMedia.width).toBeGreaterThan(tile.width * 0.8);

    // In a wrapping group the tile keeps its own width; the row takes the fixed one.
    await expect(tile.width).toBe(144);

    // The tile's actions sit over the media, not below the name.
    const tileActions = part('vertical', 'actions');
    await expect(tileActions.bottom).toBeLessThanOrEqual(tileMedia.bottom);
  },
};

/**
 * `uploading` dashes the edge; the card cannot know how far the upload has
 * got, so the caller places the `Spinner` or `Progress` that does. `error`
 * replaces the media with an alert icon and says what went wrong in words.
 */
export const Statuses: Story = {
  render: () => (
    <AttachmentGroup className="w-80">
      <Attachment status="uploading" data-testid="spinner">
        <AttachmentMedia>
          <Spinner label="Uploading chest-xray-pa.png" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>chest-xray-pa.png</AttachmentTitle>
          <AttachmentDescription>Uploading…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment status="uploading">
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>cbc-2026-03-12.pdf</AttachmentTitle>
          <Progress value={64} aria-label="Uploading cbc-2026-03-12.pdf" />
        </AttachmentContent>
      </Attachment>
      <Attachment status="error" data-testid="error">
        <AttachmentMedia>
          <FileIcon data-testid="file-icon" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>discharge-summary.pdf</AttachmentTitle>
          <AttachmentDescription>Upload failed — the file is over 20 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove discharge-summary.pdf">
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const error = canvas.getByTestId('error');

    // Not colour alone: the alert icon is on screen, in place of the file icon.
    const alert = error.querySelector('[data-slot="attachment-error-icon"]') as SVGElement;
    await expect(getComputedStyle(alert).display).not.toBe('none');
    await expect(getComputedStyle(canvas.getByTestId('file-icon')).display).toBe('none');
    // The other cards keep the icon hidden.
    const calm = canvas.getByTestId('spinner');
    await expect(
      getComputedStyle(calm.querySelector('[data-slot="attachment-error-icon"]')!).display,
    ).toBe('none');

    // The edge is the danger colour, and the words are in the text.
    const danger = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-status-danger-solid')
      .trim();
    const probe = document.createElement('span');
    probe.style.color = danger;
    canvasElement.append(probe);
    await expect(getComputedStyle(error).borderTopColor).toBe(getComputedStyle(probe).color);
    probe.remove();
    await expect(error).toHaveTextContent('Upload failed');

    await expect(getComputedStyle(calm).borderTopStyle).toBe('dashed');
    // The spinner, a polite live region, carries the words for the wait.
    await expect(within(calm).getByRole('status')).toHaveTextContent(
      'Uploading chest-xray-pa.png',
    );
    await expect(
      canvas.getByRole('progressbar', { name: /Uploading cbc/ }),
    ).toBeInTheDocument();
  },
};

/**
 * The name is cut on screen, never in the text: the trigger around it takes
 * the whole name as its accessible name.
 */
export const LongNamesTruncate: Story = {
  render: () => (
    <div className="w-64">
      <Attachment>
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            <AttachmentTrigger>{LONG_NAME}</AttachmentTrigger>
          </AttachmentTitle>
          <AttachmentDescription>PDF · 88 kB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: LONG_NAME });
    // Really cut: the text is wider than the box that shows it.
    await expect(trigger.scrollWidth).toBeGreaterThan(trigger.clientWidth);
    await expect(getComputedStyle(trigger).textOverflow).toBe('ellipsis');
    // And the card did not grow to fit it.
    const card = canvasElement.querySelector('[data-slot="attachment"]')!;
    await expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(256);
  },
};

const open = fn();
const remove = fn();

/**
 * The whole card opens the file; the action beside it keeps its own click.
 * Hit-tested with `elementFromPoint`, which asks the browser what is really
 * on top, rather than dispatching an event at a chosen element.
 */
export const ActionsStayAboveTheTrigger: Story = {
  render: () => (
    <div className="w-80">
      <Attachment>
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            <AttachmentTrigger onClick={open}>cbc-2026-03-12.pdf</AttachmentTrigger>
          </AttachmentTitle>
          <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="More for cbc-2026-03-12.pdf">
            <MoreIcon />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf" onClick={remove}>
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
  play: async ({ canvasElement }) => {
    open.mockClear();
    remove.mockClear();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'cbc-2026-03-12.pdf' });
    const action = canvas.getByRole('button', { name: 'Remove cbc-2026-03-12.pdf' });

    // Every action has a name of its own.
    const actions = canvasElement.querySelectorAll('[data-slot="attachment-action"]');
    await expect(actions).toHaveLength(2);
    for (const button of actions) await expect(button).toHaveAccessibleName();

    const centre = (element: Element) => {
      const box = element.getBoundingClientRect();
      return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    };

    // The media is not inside the trigger, and still opens the file.
    const media = canvasElement.querySelector('[data-slot="attachment-media"]')!;
    await expect(trigger.contains(media)).toBe(false);
    await expect(centre(media)).toBe(trigger);

    // The action is on top of the stretched area.
    await expect(action.contains(centre(action))).toBe(true);

    await userEvent.click(action);
    await expect(remove).toHaveBeenCalledTimes(1);
    await expect(open).not.toHaveBeenCalled();

    await userEvent.click(trigger);
    await expect(open).toHaveBeenCalledTimes(1);
  },
};

/**
 * The trigger's own box is only the name, so the ring goes on the card: it is
 * the card that opens.
 */
export const TheFocusRingIsOnTheCard: Story = {
  render: () => (
    <div className="w-80">
      <Attachment>
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>
            <AttachmentTrigger>cbc-2026-03-12.pdf</AttachmentTrigger>
          </AttachmentTitle>
          <AttachmentDescription>PDF · 214 kB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove cbc-2026-03-12.pdf">
            <CloseIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('[data-slot="attachment"]') as HTMLElement;
    const trigger = canvas.getByRole('button', { name: 'cbc-2026-03-12.pdf' });

    await expect(getComputedStyle(card).outlineStyle).toBe('none');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(async () => {
      await expect(getComputedStyle(card).outlineStyle).toBe('solid');
    });
    await expect(getComputedStyle(card).outlineWidth).toBe('2px');

    // Focus on an action is the action's ring, not the card's.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /^Remove/ })).toHaveFocus();
    await expect(getComputedStyle(card).outlineStyle).toBe('none');
  },
};

/**
 * A list by default: each attachment is an item, so a screen reader says how
 * many files there are before reading the first.
 */
export const Group: Story = {
  render: () => (
    <AttachmentGroup layout="wrap" aria-label="Attached files" className="w-96">
      {[
        { name: 'cbc-2026-03-12.pdf', meta: 'PDF · 214 kB', icon: <FileIcon /> },
        { name: LONG_NAME, meta: 'PDF · 88 kB', icon: <FileIcon /> },
        { name: 'chest-xray-pa.png', meta: 'PNG · 1.2 MB', icon: <ImageIcon /> },
      ].map((file) => (
        <Attachment key={file.name} size="sm">
          <AttachmentMedia>{file.icon}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${file.name}`}>
              <CloseIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Attached files' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(3);
    // Each item holds exactly one card, so the card itself stays a <div>.
    for (const item of items) {
      await expect(item.querySelectorAll('[data-slot="attachment"]')).toHaveLength(1);
    }
    // `wrap` gives a row a fixed width, capped by the list's, so a long name
    // truncates rather than widening its item.
    const width = Math.min(288, list.getBoundingClientRect().width);
    for (const item of items) await expect(item.getBoundingClientRect().width).toBe(width);
  },
};
