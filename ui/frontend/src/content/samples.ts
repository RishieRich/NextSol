/**
 * Sample data for the mock-ups on the site. Every company and figure here is invented
 * and the UI labels it as a sample. None of it is a real customer.
 */

import type { InvoiceLine } from "@/domain/invoice";

export const sampleInvoice = {
  seller: {
    name: "Shree Engineering Works",
    initials: "SE",
    address: "Plot 42, Phase 2, GIDC, Vapi 396195",
    gstin: "24XXXXX0000X1Z0",
  },
  buyer: { name: "Patel Polymers", city: "Vapi" },
  number: "SEW/26-27/0148",
  date: "27 Oct 2026",
  gstRatePercent: 18,
  lines: [
    { item: "MS flange 4 inch", hsn: "7307", qty: 40, unit: "Nos", rate: 310 },
    { item: "SS bolt M12 x 50", hsn: "7318", qty: 200, unit: "Nos", rate: 18 },
    { item: "Gasket set", hsn: "8484", qty: 40, unit: "Set", rate: 45 },
  ] satisfies InvoiceLine[],
  terms: "Interest at 18% a year on payments after 45 days. Subject to Vapi jurisdiction.",
} as const;

export const sampleProduction = [
  { item: "MS flange 4 inch", planned: 400, produced: 386 },
  { item: "Pipe clamp 2 inch", planned: 1200, produced: 1236 },
  { item: "Base plate 8 mm", planned: 250, produced: 198 },
  { item: "Bracket L-type", planned: 600, produced: 590 },
] as const;

export const sampleOutstanding = [
  { party: "Patel Polymers", buckets: [42000, 18500, 0, 0] },
  { party: "Desai Chem Industries", buckets: [12000, 0, 26400, 0] },
  { party: "Om Packaging", buckets: [8600, 9100, 0, 14200] },
] as const;

export const sampleBarcodeScan = {
  code: "8 901234 567890",
  item: "SS bolt M12 x 50",
  unit: "Nos",
  rate: 18,
  gstRatePercent: 18,
} as const;

export const sampleStockEntry = {
  voucher: "Sales voucher",
  item: "Base plate 8 mm",
  unit: "Nos",
  available: 42,
  requested: 60,
} as const;

/** Labels for the outstanding buckets above, oldest last. */
export const ageingBuckets = ["0 to 30 days", "31 to 45", "46 to 90", "Over 90"] as const;

/** The home page's "Track GST" demo: one sample sale, taxed at the sample item's rate. */
export const sampleGstSale = { amountPaise: 100_000 } as const;
