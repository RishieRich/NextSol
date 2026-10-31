/**
 * Invoice arithmetic for the sample invoice and report mock-ups.
 * Amounts are computed here once; components only display the result.
 */

import { splitTax, taxOn, type GstSplit, type Supply } from "./gst";
import { divRoundHalfUp, mulDivRoundHalfUp } from "./money";
import { amountInWords } from "./words";

export type InvoiceLine = { item: string; hsn: string; qty: number; unit: string; rate: number };

export type InvoiceTotals = {
  lines: (InvoiceLine & { amount: number })[];
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
};

/** Intra-state supply: GST splits equally into CGST and SGST. Rounded to the rupee per line. */
export function computeInvoice(lines: InvoiceLine[], gstRatePercent: number): InvoiceTotals {
  if (gstRatePercent < 0 || gstRatePercent > 28) {
    throw new RangeError(`Unexpected GST rate: ${gstRatePercent}`);
  }
  const priced = lines.map((line) => ({ ...line, amount: Math.round(line.qty * line.rate) }));
  const taxable = priced.reduce((sum, line) => sum + line.amount, 0);
  const halfTax = Math.round((taxable * gstRatePercent) / 200);
  return { lines: priced, taxable, cgst: halfTax, sgst: halfTax, total: taxable + halfTax * 2 };
}

/** A line on a real tax invoice, in integer units: rate in paise, quantity in thousandths, GST in basis points. */
export type TaxInvoiceLine = {
  description: string;
  hsn: string;
  qtyMilli: number;
  unit: string;
  ratePaise: number;
  gstBasisPoints: number;
};

export type TaxSummaryRow = { gstBasisPoints: number; taxable: number; tax: number } & GstSplit;

export type TaxInvoice = {
  supply: Supply;
  lines: (TaxInvoiceLine & { taxable: number })[];
  summary: TaxSummaryRow[];
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  /** Taxable plus tax, before rounding. */
  subtotal: number;
  /** Signed paise added to reach the nearest rupee. */
  roundOff: number;
  grandTotal: number;
  inWords: string;
};

/**
 * Line taxable = qty x rate, rounded half up. Tax is worked out once per GST rate on that rate's taxable total.
 * Intra-state (seller state = place of supply) splits into CGST and SGST; otherwise IGST.
 */
export function computeTaxInvoice(
  lines: TaxInvoiceLine[],
  { sellerState, placeOfSupply }: { sellerState: string; placeOfSupply: string },
): TaxInvoice {
  const supply: Supply = sellerState === placeOfSupply ? "intra" : "inter";
  const priced = lines.map((line) => {
    if (!Number.isInteger(line.qtyMilli) || line.qtyMilli < 0 || !Number.isInteger(line.ratePaise) || line.ratePaise < 0) {
      throw new RangeError(`Invalid line: ${line.description}`);
    }
    return { ...line, taxable: mulDivRoundHalfUp(line.qtyMilli, line.ratePaise, 1000) };
  });

  const byRate = new Map<number, number>();
  for (const line of priced) byRate.set(line.gstBasisPoints, (byRate.get(line.gstBasisPoints) ?? 0) + line.taxable);
  const summary = [...byRate.entries()]
    .sort(([a], [b]) => a - b)
    .map(([gstBasisPoints, taxable]) => {
      const tax = taxOn(taxable, gstBasisPoints);
      return { gstBasisPoints, taxable, tax, ...splitTax(tax, supply) };
    });

  const sum = (pick: (row: TaxSummaryRow) => number) => summary.reduce((total, row) => total + pick(row), 0);
  const taxable = sum((row) => row.taxable);
  const subtotal = taxable + sum((row) => row.tax);
  const grandTotal = divRoundHalfUp(subtotal, 100) * 100;

  return {
    supply,
    lines: priced,
    summary,
    taxable,
    cgst: sum((row) => row.cgst),
    sgst: sum((row) => row.sgst),
    igst: sum((row) => row.igst),
    subtotal,
    roundOff: grandTotal - subtotal,
    grandTotal,
    inWords: amountInWords(grandTotal),
  };
}

const plain = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Invoice-style amount without the currency symbol: 21004 -> "21,004.00". */
export function formatAmount(amount: number): string {
  return plain.format(amount);
}
