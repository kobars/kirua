import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components';
import '@/index.css';
import { BoardApp } from './BoardApp';
import { choose, relativeTo } from './sources';

/**
 * The only place an optional root `board/` folder is read. Without one the
 * glob is empty and `choose` falls back to the committed sample. Vite resolves the glob at build time and hot
 * reloads when a card changes, which is what makes a server unnecessary: the
 * data is a folder of files, so there is nothing to fetch or cache.
 */
const board = relativeTo(
  '/board',
  import.meta.glob<string>('/board/**/*.md', { query: '?raw', import: 'default', eager: true }),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <BoardApp source={choose(board)} />
    </TooltipProvider>
  </StrictMode>,
);
