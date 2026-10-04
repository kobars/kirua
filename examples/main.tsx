import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from 'kirua';
import { App } from './App';
import 'kirua/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
