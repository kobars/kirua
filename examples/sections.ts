/**
 * The five sections of the example app, in the order the hub lists them.
 *
 * Each `id` is the first segment of the section's routes — `#/shop/orders` —
 * and `title` is the document title while the section is open.
 *
 * `tools/example-apps.mjs` reads this file too, so every check walks exactly
 * these sections. It compiles the file on its own, which is why it imports
 * nothing.
 */
export type SectionId = 'shop' | 'his' | 'social' | 'assistant' | 'marketing';

export interface Section {
  id: SectionId;
  /** The product the section pretends to be. */
  name: string;
  /** What kind of application it is. */
  kind: string;
  title: string;
  summary: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'shop',
    name: 'Dusk',
    kind: 'Shop',
    title: 'Dusk — a kirua example',
    summary: 'A storefront with filters, a product page, a cart, checkout and order history.',
  },
  {
    id: 'his',
    name: 'Larkspur',
    kind: 'Hospital system',
    title: 'Larkspur — a kirua example',
    summary:
      'Patients and coverage, appointments, visit registration, lab results and the pharmacy.',
  },
  {
    id: 'social',
    name: 'Commons',
    kind: 'Social app',
    title: 'Commons — a kirua example',
    summary: 'A mobile-first feed with replies, explore, notifications, messages and profiles.',
  },
  {
    id: 'assistant',
    name: 'Lumen',
    kind: 'Assistant',
    title: 'Lumen — a kirua example',
    summary: 'An assistant transcript, a composer, a searchable sidebar and a usage page.',
  },
  {
    id: 'marketing',
    name: 'Aozora',
    kind: 'Marketing site',
    title: 'Aozora — a kirua example',
    summary: 'A marketing site with pricing, a story, a guide and a contact form.',
  },
];

/** The title of the hub, and of any address that names no section. */
export const HUB_TITLE = 'Kirua examples';
