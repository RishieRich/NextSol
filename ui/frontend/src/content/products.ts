/**
 * Every product and service Next Solutions sells, in one place.
 * Sliders, the services page, the mega-menu, product pages, the guide and the footer all read from here.
 *
 * Content comes from Niket's own pages on nxtsolutions.in, read on 31 October 2026, with the wording cleaned up.
 * Vendor posters and artwork are not used: product names in text, our own visuals.
 * Prices appear only where a real, sourced price exists. Everything else says "Ask for today's price".
 */

import type { EmojiKey } from "./emoji";
import type { Faq, Price, Source } from "./tally";

export type ProductCategory = "accounting" | "cloud" | "billing" | "marketing" | "it";

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: "accounting", label: "Accounting and GST" },
  { id: "cloud", label: "Cloud and mobile" },
  { id: "billing", label: "Billing and payroll" },
  { id: "marketing", label: "Marketing and design" },
  { id: "it", label: "IT and hardware" },
];

export type ProductFeature = { emoji: EmojiKey; title: string; body: string };

export type ProductPrice = {
  label: string;
  price: Price;
  /** Shown under the price, e.g. "per device, plus GST". */
  note: string;
  highlight?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  emoji: EmojiKey;
  category: ProductCategory;
  kind: "product" | "service";
  /** Maker, where the product is someone else's software that Next Solutions sells and supports. */
  vendor?: string;
  oneLiner: string;
  /** Three short points for cards and sliders. */
  bullets: readonly [string, string, string];
  /** Route of its own page, when it has one. Products without a page link to WhatsApp instead. */
  page?: string;
  /** Product page only. */
  benefits?: readonly [string, string, string];
  features?: ProductFeature[];
  prices?: { items: ProductPrice[]; extra?: string; source: Source };
  faqs?: Faq[];
  referralCode?: string;
  related: string[];
  seo?: { title: string; description: string };
};

/** CONFIRM: prices on Niket's Tally on Mobile page. */
const bizAnalystSource: Source = {
  label: "Next Solutions, Tally on Mobile page",
  url: "https://nxtsolutions.in/tally-on-mobile/",
  asOf: "31 October 2026",
};

export const products: Product[] = [
  {
    slug: "tally-prime",
    name: "TallyPrime",
    emoji: "tally",
    category: "accounting",
    kind: "product",
    vendor: "Tally Solutions",
    oneLiner: "Accounting, inventory, GST and banking in one place, set up and customised for you.",
    bullets: ["GST invoices, e-invoice and e-way bill", "Invoices with your logo and layout", "Silver and Gold licences, rentals and renewals"],
    page: "/tally-prime/",
    benefits: ["GST, e-invoice and e-way bill", "Your logo and layout on invoices", "Local setup, training and support"],
    features: [
      { emoji: "chart", title: "Accounting and inventory", body: "Books, stock, banking, and cash and credit management in one place." },
      { emoji: "gst", title: "GST invoices", body: "GST invoices, e-invoices and e-way bills from the same voucher." },
      { emoji: "design", title: "Your invoice layout", body: "Invoices with your logo and layout, and your MSME Udyam number printed on them." },
      { emoji: "card", title: "Payment QR codes and links", body: "Put a payment QR code or link on the invoice so customers pay faster." },
      { emoji: "inventory", title: "Bill of Materials", body: "Track the parts that go into what you make." },
      { emoji: "location", title: "Multiple addresses", body: "Several billing and shipping addresses for the same party." },
      { emoji: "clipboard", title: "Order-based or direct", body: "Run purchase and sales through orders, or enter them directly." },
      { emoji: "customisation", title: "Customisation", body: "Reports, invoice formats and controls built around the way you work." },
    ],
    related: ["tally-on-cloud", "tally-on-mobile", "tally-autobackup", "tally-customisation"],
    seo: {
      title: "TallyPrime licences, customisation and support in Vapi",
      description:
        "Buy, renew, upgrade and customise TallyPrime in Vapi. Silver and Gold editions, rentals, TSS renewals, invoice customisation, training and local support.",
    },
  },
  {
    slug: "tally-customisation",
    name: "Tally customisation",
    emoji: "customisation",
    category: "accounting",
    kind: "service",
    oneLiner: "Invoices, reports and controls in Tally, built around the way your business runs.",
    bullets: ["Invoice formats with your logo and terms", "Production, stock and outstanding reports", "Barcode billing and stock controls"],
    page: "/tally-prime/#customisation",
    related: ["tally-prime", "barcode-solutions"],
  },
  {
    slug: "tally-on-mobile",
    name: "Tally on Mobile",
    emoji: "mobile",
    category: "cloud",
    kind: "product",
    vendor: "Biz Analyst",
    oneLiner: "Your Tally data on your phone: dues, sales, reports and entries, from anywhere.",
    bullets: ["Outstanding and follow-up reminders", "Sales, expense and ledger reports", "Data entry from the app"],
    page: "/tally-on-mobile/",
    benefits: ["Works with TallyPrime and Tally ERP 9", "8+ entry types from the app", "7-day free trial"],
    features: [
      { emoji: "rocket", title: "Work from anywhere", body: "Check dues, sales and ledgers away from the office." },
      { emoji: "link", title: "Official Tally integration", body: "Built on the official TallyPrime and Tally ERP 9 integration." },
      { emoji: "bell", title: "Outstanding reminders", body: "Remind customers about dues, and get follow-up reminders yourself." },
      { emoji: "chart", title: "Sales analysis", body: "Sales, purchase order and sales order analysis, and your top customers." },
      { emoji: "clipboard", title: "Data entry from the app", body: "More than eight entry types, straight from the phone." },
      { emoji: "search", title: "Reports", body: "Expense analysis, daybook and ledger reports, across multiple companies." },
      { emoji: "whatsapp", title: "Automatic invoice sharing", body: "Share invoices with customers automatically." },
    ],
    prices: {
      items: [
        {
          label: "Free trial",
          price: { amountInr: 0, basis: "one-time", source: bizAnalystSource },
          note: "7 days, to try it with your own data",
        },
        {
          label: "1 year",
          price: { amountInr: 3300, basis: "per-year", source: bizAnalystSource },
          note: "per device, plus GST",
        },
        {
          label: "5 years",
          price: { amountInr: 9900, basis: "for-5-years", source: bizAnalystSource },
          note: "per device, plus GST",
          highlight: true,
        },
      ],
      source: bizAnalystSource,
    },
    related: ["tally-prime", "tally-on-cloud", "tally-autobackup"],
    seo: {
      title: "Tally on Mobile (Biz Analyst) in Vapi",
      description:
        "Tally on your phone with Biz Analyst: outstanding reminders, sales analysis, reports and data entry, with official TallyPrime integration. Free trial, set up by Next Solutions.",
    },
  },
  {
    slug: "tally-on-cloud",
    name: "Tally on Cloud",
    emoji: "cloud",
    category: "cloud",
    kind: "product",
    oneLiner: "Open your Tally from the office, a branch or home, in a browser.",
    bullets: ["Access from office, branch and home", "Automatic scheduled backups", "Windows, Mac, Linux and iOS"],
    page: "/tally-on-cloud/",
    benefits: ["Browser access through a client portal", "Light on bandwidth", "Scheduled backups to your own storage"],
    features: [
      { emoji: "home", title: "Office, branch and home", body: "The same Tally data from wherever your team works." },
      { emoji: "rocket", title: "Lightweight", body: "Built to run well on low bandwidth." },
      { emoji: "customisation", title: "TDL customisations", body: "Your Tally customisations keep working on the cloud." },
      { emoji: "web", title: "Browser access", body: "Open Tally in a browser through a client portal." },
      { emoji: "backup", title: "Automatic backup", body: "Scheduled backups to Google Drive, OneDrive, Dropbox or Amazon S3." },
      { emoji: "computers", title: "Any device", body: "Works on Windows, Mac, Linux and iOS." },
    ],
    related: ["tally-prime", "tally-on-mobile", "tally-autobackup"],
    seo: {
      title: "Tally on Cloud in Vapi: TallyPrime from anywhere",
      description:
        "Run TallyPrime on the cloud: access from office, branch and home in a browser, low bandwidth, TDL customisation support and scheduled backups. Set up by Next Solutions, Vapi.",
    },
  },
  {
    slug: "tally-autobackup",
    name: "Tally Autobackup",
    emoji: "backup",
    category: "cloud",
    kind: "product",
    oneLiner: "Scheduled backups of your Tally data.",
    bullets: ["Scheduled data backup", "Your Tally data kept safe", "Ask for today's price"],
    related: ["tally-prime", "tally-on-cloud"],
  },
  {
    slug: "saral-billing",
    name: "Saral Billing and Accounts",
    emoji: "saral",
    category: "billing",
    kind: "product",
    vendor: "Relyon",
    oneLiner: "GST-ready billing and accounting for Indian businesses.",
    bullets: ["GSTR-1, GSTR-2B and GSTR-3B", "Serial number, batch and expiry", "E-way bill and e-invoice through API"],
    page: "/saral-billing/",
    benefits: ["GST returns ready", "Inventory by batch and expiry", "AMC and warranty tracking"],
    features: [
      { emoji: "gst", title: "GST-ready accounting", body: "Built for Indian GST, with GSTR-1, GSTR-2B and GSTR-3B." },
      { emoji: "sync", title: "Data sync and migration", body: "Bring your data across and keep it in sync." },
      { emoji: "inventory", title: "Inventory control", body: "Track stock by serial number, batch and expiry date." },
      { emoji: "clipboard", title: "Service invoicing", body: "Bill for services as easily as for goods." },
      { emoji: "ewaybill", title: "E-way bill and e-invoice", body: "Generate both through the API, from the bill." },
      { emoji: "calendar", title: "AMC and warranty tracking", body: "Know which contracts and warranties are coming up." },
    ],
    related: ["saral-payroll-software", "busy", "vyapar"],
    seo: {
      title: "Saral Billing and Saral Accounts in Vapi",
      description:
        "Saral Billing and Accounts by Relyon: GST-ready accounting, GSTR-1, 2B and 3B, batch and expiry inventory, e-way bill and e-invoice. Sold and supported by Next Solutions, Vapi.",
    },
  },
  {
    slug: "saral-payroll-software",
    name: "Saral PayPack",
    emoji: "payroll",
    category: "billing",
    kind: "product",
    vendor: "Relyon",
    oneLiner: "Payroll software: salaries, payslips, TDS and shifts.",
    bullets: ["Salary management and payslips", "TDS management", "Shift-based working"],
    page: "/saral-payroll-software/",
    benefits: ["Salaries and payslips", "TDS handled", "Shift-based working"],
    features: [
      { emoji: "payroll", title: "Salary management", body: "Run monthly salaries for your whole team." },
      { emoji: "clipboard", title: "Payslips", body: "Payslips for every employee, every month." },
      { emoji: "gst", title: "TDS management", body: "Work out and track TDS on salaries." },
      { emoji: "calendar", title: "Shift-based working", body: "Handle staff who work in shifts." },
    ],
    related: ["saral-billing", "tally-prime"],
    seo: {
      title: "Saral PayPack payroll software in Vapi",
      description:
        "Saral PayPack payroll software: salary management, payslips, TDS management and shift-based working. Sold, installed and supported by Next Solutions, Vapi.",
    },
  },
  {
    slug: "busy",
    name: "Busy",
    emoji: "busy",
    category: "billing",
    kind: "product",
    vendor: "Busy Infotech",
    oneLiner: "Accounting and billing made for retail shops and FMCG.",
    bullets: ["Made for retail shops", "Made for FMCG businesses", "Ask for today's price"],
    related: ["vyapar", "saral-billing"],
  },
  {
    slug: "vyapar",
    name: "Vyapar",
    emoji: "vyapar",
    category: "billing",
    kind: "product",
    vendor: "Vyapar",
    oneLiner: "Simple billing software for small businesses.",
    bullets: ["Billing software", "Use our referral code when you sign up", "Ask for today's price"],
    referralCode: "77WDW1",
    related: ["busy", "saral-billing"],
  },
  {
    slug: "real-estate-crm",
    name: "Real Estate CRM",
    emoji: "crm",
    category: "billing",
    kind: "product",
    oneLiner: "A CRM application for real estate businesses.",
    bullets: ["CRM application", "Made for real estate", "Ask for today's price"],
    related: ["bulk-whatsapp", "web-and-ecommerce"],
  },
  {
    slug: "bulk-whatsapp",
    name: "Bulk WhatsApp",
    emoji: "whatsapp",
    category: "marketing",
    kind: "product",
    oneLiner: "WhatsApp marketing software.",
    bullets: ["WhatsApp marketing software", "Message many customers at once", "Ask for today's price"],
    related: ["social-media-marketing", "real-estate-crm"],
  },
  {
    slug: "social-media-marketing",
    name: "Social media marketing",
    emoji: "marketing",
    category: "marketing",
    kind: "service",
    oneLiner: "Strategy, page management and advertising on social media.",
    bullets: ["Social media strategy", "Page management", "Advertising"],
    page: "/portfolio/",
    related: ["design", "bulk-whatsapp", "web-and-ecommerce"],
  },
  {
    slug: "design",
    name: "Designing",
    emoji: "design",
    category: "marketing",
    kind: "service",
    oneLiner: "Logos, packaging, brochures and visiting cards, designed in-house.",
    bullets: ["Logo design", "Packaging and brochures", "Visiting cards"],
    page: "/portfolio/",
    related: ["social-media-marketing", "web-and-ecommerce"],
  },
  {
    slug: "web-and-ecommerce",
    name: "Websites and e-commerce",
    emoji: "web",
    category: "marketing",
    kind: "service",
    oneLiner: "Business websites and online stores, built and looked after.",
    bullets: ["Business websites", "E-commerce development", "Ask for a quote"],
    related: ["mobile-apps", "social-media-marketing"],
  },
  {
    slug: "mobile-apps",
    name: "Mobile apps",
    emoji: "apps",
    category: "marketing",
    kind: "service",
    oneLiner: "Mobile app development for your business.",
    bullets: ["Mobile app development", "Android and iOS", "Ask for a quote"],
    related: ["web-and-ecommerce"],
  },
  {
    slug: "barcode-solutions",
    name: "Barcode solutions",
    emoji: "barcode",
    category: "it",
    kind: "service",
    oneLiner: "Barcode scanning and labels, linked to your billing in Tally.",
    bullets: ["Barcode scanning", "Barcode billing in Tally", "Barcode labels"],
    related: ["tally-customisation", "computers"],
  },
  {
    slug: "computers",
    name: "Computer sales and service",
    emoji: "computers",
    category: "it",
    kind: "service",
    oneLiner: "Computer sales and service for your business.",
    bullets: ["Computer sales", "Computer service", "Ask for a quote"],
    related: ["cctv", "barcode-solutions"],
  },
  {
    slug: "cctv",
    name: "CCTV",
    emoji: "cctv",
    category: "it",
    kind: "service",
    oneLiner: "CCTV cameras for your business.",
    bullets: ["CCTV cameras", "From our shop in GIDC, Vapi", "Ask for a quote"],
    related: ["computers"],
  },
];

export function getProduct(slug: string): Product {
  const product = products.find((item) => item.slug === slug);
  if (!product) throw new Error(`Unknown product ${slug}`);
  return product;
}

export function productsBySlugs(slugs: readonly string[]): Product[] {
  return slugs.map(getProduct);
}

/** Home sliders, in his order: billing software, then cloud services. */
export const erpSlider = productsBySlugs(["tally-prime", "saral-billing", "busy", "vyapar", "saral-payroll-software", "real-estate-crm"]);
export const cloudSlider = productsBySlugs(["tally-on-cloud", "tally-on-mobile", "tally-autobackup", "bulk-whatsapp"]);

/** Routes that have their own product page, for the sitemap and the mega-menu. */
export const productPages = products.filter((product) => product.page?.startsWith("/") && !product.page.includes("#") && product.page !== "/portfolio/");

/** Shown wherever a product has no published price. */
export const askForPrice = "Ask for today's price";
