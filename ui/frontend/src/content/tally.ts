/**
 * Everything the site says about Tally: services, editions, list prices and FAQs.
 * Prices carry their source and date, so the page can always show where a number came from.
 */

export type Source = { label: string; url: string; asOf: string };

export type Price = {
  /** Indian rupees, before GST. */
  amountInr: number;
  basis: "one-time" | "per-month" | "per-year" | "for-5-years";
  source: Source;
};

const tallyFaqSource: Source = {
  label: "Tally Solutions, TallyPrime FAQ",
  url: "https://tallysolutions.com/tally-prime-faq-guide/",
  asOf: "July 2026",
};

const tallyCostSource: Source = {
  label: "Tally Solutions, total cost of ownership guide",
  url: "https://tallysolutions.com/business-guides/tallyprime-total-cost-of-ownership-india/",
  asOf: "13 July 2026",
};

/** CONFIRM: Niket's own listed price on IndiaMART, not a Tally list price. */
const nextSolutionsListing: Source = {
  label: "Next Solutions price list",
  url: "https://www.indiamart.com/next-solutions-vapi/",
  asOf: "October 2026",
};

export type TallyService = {
  id: string;
  title: string;
  summary: string;
  detail: string[];
  startingPrice?: Price;
};

export const tallyServices: TallyService[] = [
  {
    id: "licences",
    title: "Licences and renewals",
    summary: "New TallyPrime licences, Silver to Gold upgrades, and yearly TSS renewals.",
    detail: [
      "Lifetime or rental licences, whichever suits your cash flow",
      "Silver to Gold upgrades without losing data",
      "TSS renewals so GST and e-invoice updates keep arriving",
    ],
  },
  {
    id: "customisation",
    title: "Customisation",
    summary: "Invoices, reports and controls built around the way your business runs.",
    detail: [
      "Invoice and voucher formats with your logo, bank details and terms",
      "Production, stock and outstanding reports you actually read",
      "Barcode billing and negative-stock control",
    ],
    startingPrice: { amountInr: 5500, basis: "one-time", source: nextSolutionsListing },
  },
  {
    id: "integration",
    title: "Integration",
    summary: "Tally connected to your other software, so every entry is made once.",
    detail: [
      "Billing, e-commerce and in-house software linked to Tally",
      "Data imports from Excel without retyping",
      "Custom reports that pull from more than one source",
    ],
  },
  {
    id: "support",
    title: "Setup, training and support",
    summary: "Installation, data migration, staff training, and a local team when something breaks.",
    detail: [
      "Installation and data migration from older versions",
      "Hands-on training for your accounts team",
      "Support from our shop at GIDC, Vapi",
    ],
  },
];

export type EditionId = "silver" | "gold";

export type Edition = {
  id: EditionId;
  name: string;
  fitsWhen: string;
  lifetime: Price;
  rentalFrom: Price;
  tssRenewal: Price;
};

export const editions: Record<EditionId, Edition> = {
  silver: {
    id: "silver",
    name: "TallyPrime Silver",
    fitsWhen: "One person uses Tally at a time, on one computer.",
    lifetime: { amountInr: 22500, basis: "one-time", source: tallyFaqSource },
    rentalFrom: { amountInr: 750, basis: "per-month", source: tallyFaqSource },
    tssRenewal: { amountInr: 4500, basis: "per-year", source: tallyCostSource },
  },
  gold: {
    id: "gold",
    name: "TallyPrime Gold",
    fitsWhen: "Several people use Tally at the same time on your office network.",
    lifetime: { amountInr: 67500, basis: "one-time", source: tallyFaqSource },
    rentalFrom: { amountInr: 2250, basis: "per-month", source: tallyFaqSource },
    tssRenewal: { amountInr: 13500, basis: "per-year", source: tallyCostSource },
  },
};

/** CONFIRM the tier: his Tally on Cloud page says "We are Tally Certified Solution Partner". */
export const partnerClaim = "Tally Certified Solution Partner";

/** Shown next to every list price. */
export const priceNote =
  "Tally's published list prices, before 18% GST. Offers and bundles change, so ask us for today's price.";

export type Customisation = {
  id: "invoice" | "production" | "barcode" | "stock" | "outstanding";
  tab: string;
  title: string;
  problem: string;
  outcome: string;
};

export const customisations: Customisation[] = [
  {
    id: "invoice",
    tab: "Invoice format",
    title: "An invoice that looks like your company",
    problem: "The standard invoice has no logo, no bank details and no space for your terms.",
    outcome: "Your logo, GSTIN, bank details, UPI QR and terms on every invoice, printed or shared as PDF.",
  },
  {
    id: "production",
    tab: "Production report",
    title: "Planned versus produced, by item",
    problem: "Production numbers live in a register, so shortfalls show up at month end.",
    outcome: "A daily report of what was planned, what was made, and where the gap is.",
  },
  {
    id: "barcode",
    tab: "Barcode billing",
    title: "Scan to bill and scan to receive",
    problem: "Typing item names at the counter is slow and picks the wrong item.",
    outcome: "Scan a barcode and the item, rate and tax fill in on purchase and sales vouchers.",
  },
  {
    id: "stock",
    tab: "Negative stock control",
    title: "Stop sales you cannot fulfil",
    problem: "Entries go through even when the stock is not there, and the books stop matching the godown.",
    outcome: "Tally blocks or warns on any voucher that would take an item below zero.",
  },
  {
    id: "outstanding",
    tab: "Outstanding report",
    title: "Who owes you, and for how long",
    problem: "Party-wise dues are spread across ledgers and nobody follows up in time.",
    outcome: "One report of dues by party and by age, ready to send before the 45-day mark.",
  },
];

export type Faq = { question: string; answer: string; source?: Source };

export const tallyFaqs: Faq[] = [
  {
    question: "Silver or Gold: which one do I need?",
    answer:
      "Silver is for one person using Tally at a time on one computer. Gold lets several people work at the same time on your office network. The features are the same; Gold costs more because of simultaneous access.",
    source: tallyFaqSource,
  },
  {
    question: "Can I start with Silver and upgrade later?",
    answer:
      "Yes. You pay the difference to move to Gold, and your company data stays as it is.",
    source: tallyFaqSource,
  },
  {
    question: "What is TSS and why renew it?",
    answer:
      "Tally Software Services brings statutory updates such as GST changes, remote access and support. Renewal is yearly: ₹4,500 for Silver and ₹13,500 for Gold, before GST.",
    source: tallyCostSource,
  },
  {
    question: "Can I rent Tally instead of buying it?",
    answer:
      "Yes. Rental starts at ₹750 a month for Silver and ₹2,250 a month for Gold, with TSS included while the rental is active. You can switch to a lifetime licence later.",
    source: tallyCostSource,
  },
  {
    question: "Can I use Tally from home or on a Mac?",
    answer:
      "Yes, through TallyPrime Cloud Access, which runs in a browser. It is a separate paid hosting service and needs a Tally licence. We set it up and move your data across.",
    source: tallyFaqSource,
  },
  {
    question: "Can you change Tally to fit our process?",
    answer:
      "Yes. Invoice formats, production and stock reports, barcode billing and stock controls are the most common. Customisations start at ₹5,500 each; we quote after seeing what you need.",
  },
];
