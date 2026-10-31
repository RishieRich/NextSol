/**
 * Words on the home page, in Niket's own section order (his live site, read 31 October 2026).
 * Facts (years, clients, products) are read from business.ts, proof.ts and products.ts, not repeated here.
 */

import type { EmojiKey } from "./emoji";

/** Search and social description for the site and the home page. */
export const siteDescription =
  "TallyPrime, Tally on Cloud and Mobile, Saral billing and payroll, websites, design and IT for businesses in Vapi, from a local team at GIDC since 2015.";

export const hero = {
  /** His "Innovative IT Solutions." made specific. The blue full stop is added by the component. */
  title: "Innovative IT solutions for Vapi's businesses",
  lede: "Tally, billing and payroll software, cloud access, websites and IT, sold, set up and supported by a local team at GIDC, Vapi.",
  tickerLead: "We do",
  /** Replaces his "*** Tally Customization" line; rolls like a slot machine. */
  ticker: ["Tally customisation", "GST billing", "Tally on Cloud", "Payroll", "Websites and apps", "CCTV and computers"],
};

/** The six chips around the hero's circuit network. Each links to its product. */
export const heroChips: { label: string; emoji: EmojiKey; href: string }[] = [
  { label: "TallyPrime", emoji: "tally", href: "/tally-prime/" },
  { label: "Tally on Cloud", emoji: "cloud", href: "/tally-on-cloud/" },
  { label: "Tally on Mobile", emoji: "mobile", href: "/tally-on-mobile/" },
  { label: "GST billing", emoji: "gst", href: "/saral-billing/" },
  { label: "Payroll", emoji: "payroll", href: "/saral-payroll-software/" },
  { label: "WhatsApp marketing", emoji: "whatsapp", href: "/services/#bulk-whatsapp" },
];

/**
 * His `// services //` sentence: "NEXT Solutions is your one-stop shop for ...".
 * Strings are plain words; objects become pills with their emoji.
 */
export const statement: (string | { text: string; emoji: EmojiKey; href: string })[] = [
  "Next Solutions is your one-stop shop for",
  { text: "TallyPrime implementation", emoji: "tally", href: "/tally-prime/" },
  "and",
  { text: "Tally customisation,", emoji: "customisation", href: "/tally-prime/#customisation" },
  { text: "e-commerce", emoji: "web", href: "/services/" },
  "and",
  { text: "mobile apps,", emoji: "apps", href: "/services/" },
  { text: "payroll", emoji: "payroll", href: "/saral-payroll-software/" },
  "and",
  { text: "Saral software,", emoji: "saral", href: "/saral-billing/" },
  { text: "barcode solutions", emoji: "barcode", href: "/services/" },
  "and",
  { text: "computer sales and service.", emoji: "computers", href: "/services/" },
];

/** "Get powerful business insights": his three ideas, each with a live mini-demo. */
export const insights = {
  label: "business insights",
  title: "Get powerful business insights",
  items: [
    { id: "barcode", emoji: "barcode" as EmojiKey, title: "Barcode scanning", body: "Scan an item and the name, rate and tax fill in on the voucher." },
    { id: "gst", emoji: "gst" as EmojiKey, title: "Track GST", body: "See CGST and SGST split on every sale, ready for your returns." },
    { id: "integration", emoji: "sync" as EmojiKey, title: "Tally integration", body: "Your other software and Tally in sync, so every entry is made once." },
  ],
};

/** Marketing and design, plus the other services, as one grid (product slugs). */
export const servicesGrid = ["social-media-marketing", "design", "web-and-ecommerce", "barcode-solutions", "computers", "cctv"];

/** "Why Next Solutions": three reasons from real material. */
export const whyUs: { emoji: EmojiKey; title: string; body: string; withReview?: boolean; confirm?: boolean }[] = [
  {
    emoji: "location",
    title: "A local shop at GIDC, Vapi",
    body: "Walk in, call or WhatsApp. The people who set up your software are a short drive away.",
  },
  {
    emoji: "support",
    title: "After-sales support",
    body: "Customers mention our support more than anything else. One Google review says it in five words:",
    withReview: true,
  },
  {
    emoji: "check",
    title: "Tally certified support",
    body: "Licences, renewals, customisation and support from a Tally Certified Solution Partner.",
    confirm: true,
  },
];

/** About teaser, from his "We've Been Thriving In 10 Years." section, cleaned up. */
export const aboutTeaser = {
  label: "about us",
  title: "Thriving for 10+ years",
  body: [
    "Niket Naik started Next Solutions in Vapi in 2015 to sell, set up and support Tally for the businesses around him.",
    "The work grew with what those same businesses asked for next: billing and payroll software, cloud access, design, websites and IT.",
  ],
};
