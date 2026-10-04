/**
 * The computed value a utility class produces, read from a probe placed where
 * the element under test sits, so a surface context or `.dark` applies to it
 * too. Comparing against this rather than a literal keeps an assertion true
 * when a token is retuned.
 */
export function utilityValue(
  className: string,
  property: 'color' | 'backgroundColor' | 'borderTopColor',
  parent: Element = document.body,
): string {
  const probe = document.createElement('span');
  probe.className = className;
  parent.appendChild(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
}
