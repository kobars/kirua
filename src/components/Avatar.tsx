import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import type { VariantProps } from '@/lib/cva';
import { avatarVariants } from './Avatar.variants';

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {}

/**
 * One person, as a circle. The fallback is held back until the image has
 * actually failed or is still loading, so a slow image does not flash initials;
 * `delayMs` holds it back further.
 *
 * Leave `alt` empty when the name is already beside the avatar.
 *
 * @example
 * <Avatar size="md">
 *   <AvatarImage src={user.photo} alt="" />
 *   <AvatarFallback delayMs={300}>RK</AvatarFallback>
 * </Avatar>
 */
export function Avatar({ className, size, ring, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, ring }), className)}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('size-full object-cover', className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center bg-sunken font-text font-medium text-fg-secondary uppercase',
        className,
      )}
      {...props}
    />
  );
}
