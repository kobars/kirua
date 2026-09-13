import type { PropsWithChildren } from 'react';
import { TooltipProvider } from '../src/components';
import { useDocumentMode, useEmbeddedGlobals } from './previewMode';
import type { Mode } from './theme';

export function StorySurface({
  children,
  mode,
  surface,
  bare,
  fixedMode,
  fixedSurface,
}: PropsWithChildren<{
  mode: Mode;
  surface: unknown;
  bare: boolean;
  fixedMode: boolean;
  fixedSurface: boolean;
}>) {
  const embedded = useEmbeddedGlobals();
  useDocumentMode(!fixedMode && embedded ? embedded.mode : mode);
  if (!fixedSurface && embedded) surface = embedded.surface;
  const surfaceClass =
    surface === 'brand'
      ? 'ctx-brand bg-brand'
      : surface === 'inverse'
        ? 'ctx-inverse bg-page'
        : 'bg-page';
  return (
    <TooltipProvider delayDuration={200}>
      {bare ? (
        children
      ) : (
        <div className={`${surfaceClass} min-h-40 rounded-xl p-4 text-fg sm:p-8`}>
          {children}
        </div>
      )}
    </TooltipProvider>
  );
}
