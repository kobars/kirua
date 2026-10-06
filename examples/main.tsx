import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DirectionProvider, TooltipProvider } from '@kobars/kirua';
import { App } from './App';
import '@kobars/kirua/styles.css';

const RELOADED = 'kirua-preload-reload';

// A redeploy replaces the hashed chunk names, so a page opened before it asks
// for files that are gone. A fresh document names the current ones. At most
// once a minute, so a chunk that truly cannot load reaches the section's error
// screen instead of reloading forever.
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem(RELOADED) ?? 0);
    if (Date.now() - last < 60_000) return;
    sessionStorage.setItem(RELOADED, String(Date.now()));
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Radix never reads the document's `dir`, so its keyboard behaviour is
        told the same direction the layout already follows. */}
    <DirectionProvider dir={document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'}>
      <TooltipProvider delayDuration={200}>
        <App />
      </TooltipProvider>
    </DirectionProvider>
  </StrictMode>,
);
