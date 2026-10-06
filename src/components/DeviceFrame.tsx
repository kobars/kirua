import type { ComponentProps } from 'react';
import type { VariantProps } from '@/lib/cva';
import { cn } from '@/lib/cn';
import { deviceFrameVariants } from './DeviceFrame.variants';

export interface DeviceFrameProps
  extends ComponentProps<'iframe'>, VariantProps<typeof deviceFrameVariants> {
  /** Required: a frame is announced by its title, and an untitled one is a nameless region. */
  title: string;
}

/**
 * A page shown at a phone's size, inside a phone's outline, for previewing a
 * phone layout on a wide screen.
 *
 * It is an `iframe`, and that is the point. Media queries answer to the
 * window, so a phone layout drawn in a narrow box on a desktop still gets the
 * desktop's breakpoints: a `BottomNav` hides itself and the padding grows.
 * Inside the frame the page has its own window at the phone's width, so every
 * breakpoint, sticky bar and overlay behaves as it does on the phone.
 *
 * The page inside is a separate document. It loads its own stylesheet and
 * keeps its own focus, history and scroll.
 *
 * @example
 * <DeviceFrame src="./#/mobile/" title="Pouch at the size of a phone" device="md" />
 */
export function DeviceFrame({ device, title, className, ...props }: DeviceFrameProps) {
  return (
    <iframe
      data-slot="device-frame"
      title={title}
      className={cn(deviceFrameVariants({ device }), className)}
      {...props}
    />
  );
}
