/**
 * GST arithmetic in integer paise and basis points (18% = 1800).
 * Add mode puts GST on top of a base amount; remove mode takes it out of an amount that includes it.
 */

import { divRoundHalfUp } from "./money";

export type GstMode = "add" | "remove";
export type Supply = "intra" | "inter";

export type GstSplit = { cgst: number; sgst: number; igst: number };

export type GstResult = GstSplit & {
  base: number;
  tax: number;
  total: number;
  rateBasisPoints: number;
  supply: Supply;
};

export function assertRate(rateBasisPoints: number): void {
  if (!Number.isInteger(rateBasisPoints) || rateBasisPoints < 0 || rateBasisPoints > 10000) {
    throw new RangeError(`GST rate must be 0 to 100%: ${rateBasisPoints / 100}`);
  }
}

/** Tax on a taxable amount, rounded half up to the paisa. */
export function taxOn(basePaise: number, rateBasisPoints: number): number {
  assertRate(rateBasisPoints);
  return divRoundHalfUp(basePaise * rateBasisPoints, 10000);
}

/** Intra-state: CGST is half the tax (rounded), SGST takes the rest. Inter-state: all IGST. */
export function splitTax(tax: number, supply: Supply): GstSplit {
  if (supply === "inter") return { cgst: 0, sgst: 0, igst: tax };
  const cgst = divRoundHalfUp(tax, 2);
  return { cgst, sgst: tax - cgst, igst: 0 };
}

export function computeGst(input: {
  mode: GstMode;
  amountPaise: number;
  rateBasisPoints: number;
  supply?: Supply;
}): GstResult {
  const { mode, amountPaise, rateBasisPoints, supply = "intra" } = input;
  assertRate(rateBasisPoints);
  if (!Number.isInteger(amountPaise) || amountPaise < 0) throw new RangeError(`Invalid amount: ${amountPaise}`);
  const base = mode === "add" ? amountPaise : divRoundHalfUp(amountPaise * 10000, 10000 + rateBasisPoints);
  const tax = mode === "add" ? taxOn(base, rateBasisPoints) : amountPaise - base;
  return { base, tax, total: base + tax, rateBasisPoints, supply, ...splitTax(tax, supply) };
}
