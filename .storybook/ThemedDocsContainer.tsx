import { useCallback, useEffect, useRef, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { useDocsGlobals, useDocumentMode } from './previewMode';
import { docsThemes } from './theme';

export function ThemedDocsContainer(props: PropsWithChildren<DocsContainerProps>) {
  const globals = useDocsGlobals(props.context);
  const host = useRef<HTMLDivElement>(null);
  useDocumentMode(globals.mode);
  const sync = useCallback(
    (frame: HTMLIFrameElement) => {
      frame.contentWindow?.postMessage(
        { type: 'kirua:docs-globals', globals },
        location.origin,
      );
    },
    [globals],
  );
  useEffect(() => {
    host.current?.querySelectorAll<HTMLIFrameElement>('iframe').forEach(sync);
  }, [sync]);
  return (
    <div
      ref={host}
      onLoadCapture={(event) => {
        if (event.target instanceof HTMLIFrameElement) sync(event.target);
      }}
    >
      <DocsContainer {...props} theme={docsThemes[globals.mode]} />
    </div>
  );
}
