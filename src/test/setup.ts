import '@/index.css';

/**
 * React flushes synchronously inside `act` only when it is told it is in a test
 * environment. Without this flag every `act` call warns, and the DOM is read
 * before the render commits.
 */
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
