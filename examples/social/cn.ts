/**
 * TEMPORARY — see `experiment.tsx`.
 *
 * The design system's own `cn` is not exported from `kirua`: it is an internal
 * module, and an example application is a consumer. Joining two class strings
 * is all this needs, and it goes away with the experiment.
 */
export const cn = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');
