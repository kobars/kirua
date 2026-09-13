import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'A navigation trail through a page hierarchy. Use links for ancestors and BreadcrumbPage for the current page; separators are decorative.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#patients">Patients</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Siti Rahayu</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const Collapsed: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Medical record</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const TheThreeRules: Story = {
  render: (args) => (
    <Breadcrumb {...args} label="Medical record">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Siti Rahayu</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. A named landmark.
    await expect(canvas.getByRole('navigation', { name: 'Medical record' })).toBeVisible();

    // 2. The current page is marked, and is not a link.
    const current = canvas.getByText('Siti Rahayu');
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: 'Siti Rahayu' })).toBeNull();

    // 3. The separator is not read out, and does not inflate the list count.
    const separator = canvasElement.querySelector('[data-slot="breadcrumb-separator"]')!;
    await expect(separator).toHaveAttribute('aria-hidden', 'true');
    await expect(separator).toHaveAttribute('role', 'presentation');
  },
};
