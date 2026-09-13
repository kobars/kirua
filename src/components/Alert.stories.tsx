import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Alert, AlertDescription, AlertTitle } from './Alert';
import { CheckIcon, CloseIcon, SparkleIcon } from './icons';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Alert',
  component: Alert,
  args: { status: 'neutral' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Inline feedback with a title and supporting text. Add role="status" for a dynamic update or role="alert" for an urgent error; static alerts do not announce themselves.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Alert {...args} icon={<SparkleIcon />} className="max-w-lg">
      <AlertTitle>New tools are available</AlertTitle>
      <AlertDescription>
        Explore the updated drawing workspace when you are ready.
      </AlertDescription>
    </Alert>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div className="grid max-w-xl gap-4">
      <Alert {...args} status="neutral">
        <AlertTitle>Draft saved</AlertTitle>
        <AlertDescription>You can return and finish it later.</AlertDescription>
      </Alert>
      <Alert {...args} status="info" icon={<SparkleIcon />}>
        <AlertTitle>Beta feature</AlertTitle>
        <AlertDescription>This workflow may change before release.</AlertDescription>
      </Alert>
      <Alert {...args} status="success" icon={<CheckIcon />}>
        <AlertTitle>Published</AlertTitle>
        <AlertDescription>Your changes are live.</AlertDescription>
      </Alert>
      <Alert {...args} status="warning">
        <AlertTitle>Review needed</AlertTitle>
        <AlertDescription>Confirm the attribution before publishing.</AlertDescription>
      </Alert>
      <Alert {...args} status="danger" icon={<CloseIcon />}>
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Check your connection and try again.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const AnnouncementIsOptIn: Story = {
  render: (args) => (
    <div className="grid max-w-xl gap-4">
      <Alert {...args} data-testid="static-alert">
        <AlertTitle>Before you continue</AlertTitle>
        <AlertDescription>Static guidance is not announced as a new event.</AlertDescription>
      </Alert>
      <Alert {...args} status="danger" role="alert" icon={<CloseIcon />}>
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>
          The urgent dynamic failure opts into an announcement.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId('static-alert')).not.toHaveAttribute('role');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Upload failed');
  },
};
