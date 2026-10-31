/**
 * The free tools: what each one is called, what it is for, which service it leads to,
 * and every rate the tools use, with where it came from and when.
 * Change a GST preset or the Bank Rate here; the pages and the arithmetic follow.
 */

import type { Source } from "./tally";

export type ToolId = "gst-calculator" | "gst-invoice-generator" | "gstin-checker" | "msme-payment-interest" | "amount-in-words";

export type Tool = {
  id: ToolId;
  slug: string;
  name: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  relatedService: { label: string; href: string };
  pitch: string;
  /** "How this is calculated", one step per line. */
  method: string[];
};

export const tools: Tool[] = [
  {
    id: "gst-calculator",
    slug: "gst-calculator",
    name: "GST calculator",
    summary: "Add GST to a price or take it out of an inclusive amount, with the CGST and SGST split.",
    seoTitle: "GST calculator: add or remove GST, with CGST and SGST",
    seoDescription:
      "Free GST calculator for Indian businesses. Add or remove GST at 5%, 18%, 40% or any rate, and see the CGST, SGST or IGST split. Works in your browser.",
    relatedService: { label: "Tally setup and GST training", href: "/tally-prime/" },
    pitch: "Tally does this on every voucher. We set it up with the right tax ledgers and train your team to use it.",
    method: ["Add GST: tax = amount x rate / 100, rounded to the paisa; total = amount + tax.", "Remove GST: base = amount / (1 + rate / 100), rounded to the paisa; tax = amount - base.", "Within your state the tax splits into CGST (half, rounded) and SGST (the rest). Across states it is all IGST."],
  },
  {
    id: "gst-invoice-generator",
    slug: "gst-invoice-generator",
    name: "GST invoice generator",
    summary: "Make a GST tax invoice with HSN codes, a tax summary and amount in words, then print or save it as PDF.",
    seoTitle: "Free GST invoice generator: print or save as PDF",
    seoDescription:
      "Free GST invoice generator. Add items with HSN or SAC codes, get CGST, SGST or IGST worked out, amount in words, and print or save as PDF. Nothing leaves your browser.",
    relatedService: { label: "Tally invoice customisation", href: "/tally-prime/" },
    pitch: "Want this format, with your logo and a UPI QR, on every invoice from Tally? We customise Tally invoices from Vapi.",
    method: ["Each line: taxable value = quantity x rate, rounded to the paisa.", "Tax is worked out once per GST rate, on the taxable total at that rate.", "Same state for seller and place of supply: CGST and SGST. Different states: IGST.", "The grand total is rounded to the nearest rupee, and the round-off is shown as its own line."],
  },
  {
    id: "gstin-checker",
    slug: "gstin-checker",
    name: "GSTIN checker",
    summary: "Check a GSTIN's format and check digit, and read its state code and PAN.",
    seoTitle: "GSTIN validator: check format and check digit",
    seoDescription:
      "Free GSTIN validator. Checks the 15-character format, state code and check digit of any GSTIN, and shows the PAN inside it. Works offline in your browser.",
    relatedService: { label: "Tally setup and support", href: "/tally-prime/" },
    pitch: "Wrong GSTINs on party ledgers break GST returns. We clean up masters and set Tally up so they are caught at entry.",
    method: ["A GSTIN has 15 characters: a 2-digit state code, the 10-character PAN, an entity number, the letter Z, and a check character.", "The check character is computed from the first 14 with a mod-36 checksum. A typo almost always breaks it.", "This checks the format and check digit only. To confirm a business is registered and active, search it on gst.gov.in."],
  },
  {
    id: "msme-payment-interest",
    slug: "msme-payment-interest",
    name: "MSME delayed payment interest",
    summary: "Work out the interest a buyer owes a micro or small enterprise for paying late, under the MSMED Act.",
    seoTitle: "MSME delayed payment interest calculator (MSMED Act s.16)",
    seoDescription:
      "Free MSME delayed payment interest calculator. Finds the payment deadline under section 15 and the interest at three times the RBI Bank Rate, compounded monthly.",
    relatedService: { label: "Tally outstanding reports", href: "/tally-prime/" },
    pitch: "Know who is past 45 days before it costs you. We build outstanding-by-age reports in Tally.",
    method: ["Deadline (section 15): 15 days from acceptance with no written agreement, or the agreed period, which cannot exceed 45 days.", "Interest (section 16): three times the RBI Bank Rate a year, compounded monthly from the deadline.", "Whole calendar months compound; leftover days add simple interest on the compounded amount. Interest is rounded to the rupee."],
  },
  {
    id: "amount-in-words",
    slug: "amount-in-words",
    name: "Amount in words",
    summary: "Turn a rupee amount into words in the Indian system, for invoices and cheques.",
    seoTitle: "Amount in words in Indian rupees (lakh and crore)",
    seoDescription:
      "Free amount in words converter for Indian rupees. Writes any amount up to 99 crore in lakh and crore, with paise, ready for invoices and cheques.",
    relatedService: { label: "Tally invoice customisation", href: "/tally-prime/" },
    pitch: "Tally prints amounts in words on invoices too. We design invoice formats that look like your company.",
    method: ["Indian system: Crore (1,00,00,000), Lakh (1,00,000), Thousand and Hundred.", "Paise are written after \"and\", then \"Only\", as on invoices and cheques."],
  },
];

export function toolHref(tool: Pick<Tool, "slug">): string {
  return `/tools/${tool.slug}/`;
}

export function getTool(id: ToolId): Tool {
  const tool = tools.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool ${id}`);
  return tool;
}

export const toolsHub = {
  title: "Free tools for GST, invoices and payments",
  lede: "Calculators and checks for small businesses that run on Tally. Everything works in your browser; nothing you type is sent anywhere.",
  seoTitle: "Free GST and business tools",
  seoDescription:
    "Free tools for Indian small businesses: GST calculator, GST invoice generator, GSTIN checker, MSME delayed payment interest and amount in words. No sign-up, runs in your browser.",
};

export const gstRateSource: Source = {
  label: "Business Standard, GST rates from 22 Sep 2025",
  url: "https://www.business-standard.com/economy/news/gst-reforms-new-rates-slab-reduction-tax-cuts-exemptions-september-22-125092200171_1.html",
  asOf: "22 September 2025",
};

/** GST presets in percent. Visitors can also type any other rate. */
export const gstRates = { presets: [5, 18, 40], source: gstRateSource } as const;

export const rbiBankRate = {
  percent: 5.75,
  source: { label: "Reserve Bank of India, current rates", url: "https://www.rbi.org.in/", asOf: "October 2026" } satisfies Source,
} as const;

export const msmedSource = {
  label: "DC-MSME, MSMED Act legal framework",
  url: "https://www.dcmsme.gov.in/publications/LegalFramework.pdf",
};

export const gstPortalUrl = "https://www.gst.gov.in/";

export type ExternalResource = { name: string; url: string; note: string };

/** Other free resources worth linking from the hub. Empty until each one is checked. */
export const externalResources: ExternalResource[] = [];
