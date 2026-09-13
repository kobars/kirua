import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup';
import { IconButton } from './IconButton';
import { ChevronEndIcon, ChevronStartIcon, GridIcon, MenuIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Visually join related buttons. Give the group an aria-label explaining their shared purpose. Use ToggleGroup when the controls represent persistent choices.',
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="View">
      <Button variant="secondary">List</Button>
      <Button variant="secondary">Board</Button>
      <Button variant="secondary">Calendar</Button>
    </ButtonGroup>
  ),
};

export const Orientations: Story = {
  render: (args) => (
    <div className="flex items-start gap-8">
      <ButtonGroup {...args} orientation="horizontal" aria-label="Alignment">
        <Button variant="secondary">Start</Button>
        <Button variant="secondary">Centre</Button>
        <Button variant="secondary">End</Button>
      </ButtonGroup>
      <ButtonGroup {...args} orientation="vertical" aria-label="Row action">
        <Button variant="secondary">Duplicate</Button>
        <Button variant="secondary">Archive</Button>
        <Button variant="secondary">Export</Button>
      </ButtonGroup>
    </div>
  ),
};

export const IconsOnly: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Layout">
      <IconButton aria-label="Grid" variant="secondary">
        <GridIcon />
      </IconButton>
      <IconButton aria-label="List" variant="secondary">
        <MenuIcon />
      </IconButton>
    </ButtonGroup>
  ),
};

export const WithAText: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Pagination">
      <IconButton aria-label="Previous page" variant="secondary">
        <ChevronStartIcon />
      </IconButton>
      <ButtonGroupText>3 of 12</ButtonGroupText>
      <IconButton aria-label="Next page" variant="secondary">
        <ChevronEndIcon />
      </IconButton>
    </ButtonGroup>
  ),
};

export const WithASeparator: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Publish">
      <Button variant="secondary">Publish</Button>
      <ButtonGroupSeparator />
      <IconButton aria-label="Publishing options" variant="secondary">
        <MenuIcon />
      </IconButton>
    </ButtonGroup>
  ),
};

export const TheInnerCornersAreSquared: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Alignment">
      <Button variant="secondary" data-testid="first">
        Start
      </Button>
      <Button variant="secondary" data-testid="middle">
        Centre
      </Button>
      <Button variant="secondary" data-testid="last">
        End
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radius = (id: string) => getComputedStyle(canvas.getByTestId(id));

    await expect(radius('first').borderStartStartRadius).not.toBe('0px');
    await expect(radius('first').borderStartEndRadius).toBe('0px');
    await expect(radius('middle').borderStartStartRadius).toBe('0px');
    await expect(radius('middle').borderStartEndRadius).toBe('0px');
    await expect(radius('last').borderStartStartRadius).toBe('0px');
    await expect(radius('last').borderStartEndRadius).not.toBe('0px');
  },
};

export const AFocusedButtonIsNotClipped: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Alignment">
      <Button variant="secondary">Start</Button>
      <Button variant="secondary">Centre</Button>
      <Button variant="secondary">End</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="button-group"]') as HTMLElement;

    await expect(getComputedStyle(group).isolation).toBe('isolate');
  },
};
