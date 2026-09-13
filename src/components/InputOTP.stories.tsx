import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
} from './InputOTP';
import { Label } from './Label';

const meta = {
  tags: ['autodocs'],
  title: 'Components/InputOTP',
  component: InputOTP,
  parameters: {
    docs: {
      description: {
        component:
          'A single input presented as separate character slots. It preserves native paste and autocomplete. Provide a visible label and configure the expected length and input mode.',
      },
    },
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

const LENGTH = 6;

function Code({
  length = LENGTH,
  invalid = false,
  disabled = false,
  initial = '',
}: {
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  initial?: string;
}) {
  const [code, setCode] = useState(initial);

  return (
    <InputOTP>
      <InputOTPInput
        value={code}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-label="One-time code"
        maxLength={length}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, length))}
      />
      <InputOTPGroup>
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot key={index} char={code[index]} isActive={code.length === index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="otp">Verification code</Label>
      <Code />
    </div>
  ),
};

export const Grouped: Story = {
  render: function Render() {
    const [code, setCode] = useState('');

    return (
      <InputOTP>
        <InputOTPInput
          value={code}
          aria-label="Voucher code"
          maxLength={6}
          onChange={(event) => setCode(event.target.value.toUpperCase().slice(0, 6))}
        />
        <InputOTPGroup>
          {[0, 1, 2].map((index) => (
            <InputOTPSlot key={index} char={code[index]} isActive={code.length === index} />
          ))}
          <InputOTPSeparator />
          {[3, 4, 5].map((index) => (
            <InputOTPSlot key={index} char={code[index]} isActive={code.length === index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Code length={4} initial="12" />
      <Code length={4} initial="1234" invalid />
      <Code length={4} initial="12" disabled />
    </div>
  ),
};

export const OneRealFieldUnderSixPaintedBoxes: Story = {
  render: () => <Code />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fields = canvas.getAllByRole('textbox');
    await expect(fields).toHaveLength(1);

    const input = fields[0] as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.paste('483920');

    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]');
    await expect(slots).toHaveLength(6);
    await expect([...slots].map((slot) => slot.textContent).join('')).toBe('483920');

    const group = canvasElement.querySelector('[data-slot="input-otp-group"]') as HTMLElement;
    await expect(group).toHaveAttribute('aria-hidden', 'true');

    // Transparent, not hidden: a field a password manager cannot see is the
    // failure this component exists to avoid.
    const box = input.getBoundingClientRect();
    await expect(box.width).toBeGreaterThan(0);
    await expect(box.height).toBeGreaterThan(0);
    await expect(getComputedStyle(input).visibility).toBe('visible');
  },
};

export const ItKeepsOnlyDigitsAndOnlyAsManyAsFit: Story = {
  render: () => <Code />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox') as HTMLInputElement;

    await userEvent.click(input);
    await userEvent.paste('12ab34');
    await expect(input.value).toBe('1234');

    await userEvent.paste('56789');
    await expect(input.value).toBe('123456');
  },
};
