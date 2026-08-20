import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { CheckIcon } from './icons';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Published', status: 'neutral', size: 'md' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['neutral', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'None of these states exist in the reference design — it is a single marketing screen with nothing to succeed or fail. They are invented, because a design system has to be able to say "this went wrong". Each badge carries a word as well as a colour, so the meaning survives greyscale and colour blindness.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} status="neutral">
        Draft
      </Badge>
      <Badge {...args} status="success" icon={<CheckIcon />}>
        Published
      </Badge>
      <Badge {...args} status="warning">
        Review needed
      </Badge>
      <Badge {...args} status="danger">
        Upload failed
      </Badge>
      <Badge {...args} status="info">
        Beta
      </Badge>
    </div>
  ),
};
