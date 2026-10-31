/**
 * Clients and reviews. Only real, attributable material goes here.
 * CONFIRM: ask Niket for permission to name each client, and for named testimonials
 * to replace the anonymous Google review excerpts below.
 */

export const clients: string[] = [
  "DS Finance",
  "IB",
  "Posina",
  "Live Creation",
  "Choki Moki",
  "Royal Lake City",
  "Humpty Dumpty",
];

/** CONFIRM: "1000+ clients" is claimed on his live site; check before launch. */
export const clientCountClaim = { value: 1000, suffix: "+", label: "clients" } as const;

/**
 * Client logo files for the marquee, in public/clients/. Empty until Niket supplies them
 * and confirms permission (CONFIRM); the marquee shows names only while this is empty.
 */
export const clientLogos: { name: string; src: string; width: number; height: number }[] = [];

export type Review ={ quote: string; attribution: string };

export const reviews: Review[] = [
  {
    quote: "Best after sale service provider.",
    attribution: "Google review",
  },
  {
    quote:
      "I used their services for my upcoming restaurants website and graphic designing and have been using their services for their ERP solutions in the past.",
    attribution: "Google review",
  },
];
