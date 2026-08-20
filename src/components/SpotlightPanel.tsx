import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { resolveGlints, type Corner } from '@/lib/glint';
import { PANEL_GLINT_INSET_PX, PANEL_RADIUS_PX } from '@/lib/radius';
import { CornerGlint } from './CornerGlint';

const panel = cva(['relative isolate', 'rounded-xl', 'ctx-brand'], {
  variants: {
    tone: {
      /** blue-600 — white body text is 4.67:1 here. Safe for copy. */
      default: 'bg-brand',
      /** blue-500, the measured reference colour. White body copy is 3.65:1 and
       *  fails AA — display type only, where AA Large's 3:1 applies. */
      vivid: 'bg-brand-vivid',
      inverse: 'ctx-inverse bg-page',
    },
    padding: {
      md: 'px-5 py-7 md:px-8 md:py-10',
      lg: 'px-6 py-8 md:px-12 md:py-14',
      xl: 'px-6 py-9 md:px-16 md:py-20',
    },
  },
  defaultVariants: { tone: 'default', padding: 'lg' },
});

export interface SpotlightPanelProps extends ComponentProps<'div'>, VariantProps<typeof panel> {
  /**
   * Sizes `SpotlightMedia` AND reserves matching space on the content
   * side, so a long headline can never run underneath the artwork. Leave unset
   * for a panel with no media.
   */
  mediaWidth?: string;
  /** Defaults to the two corners the reference panel carries, which are also the
   *  two the artwork never covers. */
  glint?: Corner | Corner[] | false;
}

/**
 * The signature layout of the reference design: a brand-coloured panel whose
 * artwork deliberately breaks out past its own edges.
 *
 * It does not clip its children, and `isolate` gives it a stacking context so
 * the media can overhang while the content stays layered above.
 *
 * Sub-components are named exports rather than static properties on
 * `SpotlightPanel`. A module marked `"use client"` reaches a Server Component as
 * an opaque reference, and static properties do not survive that — `.Content`
 * would resolve to `undefined` and the build would fail on an invalid element
 * type. Named exports cannot hit it.
 *
 * @example
 * <SpotlightPanel>
 *   <SpotlightMedia side="end" overhang="both">
 *     <img src={character} alt="" />
 *   </SpotlightMedia>
 *   <SpotlightContent>
 *     <h1 className="font-display text-display-xl">Bring your anime worlds to life</h1>
 *   </SpotlightContent>
 * </SpotlightPanel>
 */
export function SpotlightPanel({
  className,
  tone,
  padding,
  mediaWidth,
  glint = ['top-start', 'bottom-start'],
  style,
  children,
  ...props
}: SpotlightPanelProps) {
  return (
    <div
      data-slot="spotlight-panel"
      className={cn(panel({ tone, padding }), className)}
      style={{ '--spotlight-media-width': mediaWidth ?? '0px', ...style } as CSSProperties}
      {...props}
    >
      {/* z-ornament keeps the blade above overhanging artwork. The panel's corner is
          32, but the reference reuses the same 14px-arc blade it uses on the
          22px cards rather than scaling it up, so the inset absorbs the
          difference: 32 - 18 = 14. Same mirror-of-CSS-in-JavaScript as
          `CARD_RADIUS_PX`, and asserted the same way. */}
      {resolveGlints(glint).map((corner) => (
        <CornerGlint
          key={corner}
          corner={corner}
          radius={PANEL_RADIUS_PX}
          inset={PANEL_GLINT_INSET_PX}
          className="z-ornament"
        />
      ))}
      {children}
    </div>
  );
}

export interface SpotlightMediaProps extends ComponentProps<'div'> {
  side?: 'start' | 'end';
  /** Which panel edges the artwork is allowed to cross. */
  overhang?: 'top' | 'bottom' | 'both' | 'none';
  /**
   * Overrides the parent panel's `mediaWidth`. Prefer setting `mediaWidth` on
   * the panel instead — only that reserves matching space for the content.
   */
  width?: string;
}

const overhangClasses = {
  top: '-top-16 bottom-0',
  bottom: 'top-0 -bottom-16',
  both: '-top-16 -bottom-16',
  none: 'top-0 bottom-0',
} as const;

/** Sits behind the content layer, so a long headline never disappears under the
 *  image. Always decorative — pass `alt=""` inside and keep the meaning in text. */
export function SpotlightMedia({
  side = 'end',
  overhang = 'both',
  width = 'var(--spotlight-media-width)',
  className,
  style,
  children,
  ...props
}: SpotlightMediaProps) {
  return (
    <div
      data-slot="spotlight-media"
      aria-hidden="true"
      className={cn(
        // Decorative, and there is no room for it beside the text on a phone.
        'pointer-events-none absolute z-base hidden items-end justify-center md:flex',
        side === 'end' ? 'inset-e-0' : 'inset-s-0',
        overhangClasses[overhang],
        className,
      )}
      style={{ width, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

/** Right padding tracks the panel's `mediaWidth` plus a gutter, so text stops
 *  before the artwork begins however long it runs. */
export function SpotlightContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="spotlight-content"
      className={cn(
        'relative z-raised flex flex-col items-start',
        'md:pe-[calc(var(--spotlight-media-width,0px)+var(--spacing)*4)]',
        className,
      )}
      {...props}
    />
  );
}
