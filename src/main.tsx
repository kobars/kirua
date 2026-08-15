import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components';
import { AnimeHero } from '@/patterns/AnimeHero';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <AnimeHero />
    </TooltipProvider>
  </StrictMode>,
);
