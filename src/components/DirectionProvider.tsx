import { DirectionProvider as DirectionPrimitive } from '@radix-ui/react-direction';

/**
 * Tells every Radix-driven component which way the page reads.
 *
 * kirua's layout is logical, so it mirrors from the document's `dir` alone.
 * Radix's keyboard behaviour does not: each primitive asks for a `dir` prop,
 * then this provider, and otherwise assumes left-to-right. It never reads the
 * document. Without the provider a right-to-left page gets mirrored components
 * that answer the arrow keys backwards: a `Slider` grows towards the wrong end
 * and a submenu opens towards the wrong side.
 *
 * It is Radix's own provider, re-exported as it is, so it renders no element.
 * Wrap the app once, with the same value as the document's `dir`.
 *
 * @example
 * <html dir="rtl">
 *   …
 *   <DirectionProvider dir="rtl">
 *     <App />
 *   </DirectionProvider>
 */
export const DirectionProvider: typeof DirectionPrimitive = DirectionPrimitive;
