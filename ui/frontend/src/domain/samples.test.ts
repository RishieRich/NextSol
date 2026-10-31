import { describe, expect, it } from "vitest";

import { sampleInvoice, sampleOutstanding, sampleProduction } from "@/content/samples";
import { computeInvoice, formatAmount } from "./invoice";
import { assessProduction, checkStock, outstandingTotals } from "./reports";

describe("computeInvoice", () => {
  it("prices lines and splits 18% GST into CGST and SGST", () => {
    const totals = computeInvoice([...sampleInvoice.lines], sampleInvoice.gstRatePercent);
    expect(totals.lines.map((line) => line.amount)).toEqual([12400, 3600, 1800]);
    expect(totals.taxable).toBe(17800);
    expect(totals.cgst).toBe(1602);
    expect(totals.sgst).toBe(1602);
    expect(totals.total).toBe(21004);
  });

  it("rejects an impossible GST rate", () => {
    expect(() => computeInvoice([], 40)).toThrow(RangeError);
  });

  it("formats amounts the way Indian invoices print them", () => {
    expect(formatAmount(21004)).toBe("21,004.00");
    expect(formatAmount(117800)).toBe("1,17,800.00");
  });
});

describe("assessProduction", () => {
  it("classifies each row against plan", () => {
    const statuses = sampleProduction.map((row) => assessProduction(row).status);
    expect(statuses).toEqual(["short", "ahead", "short", "on-plan"]);
  });

  it("reports the gap and percent of plan", () => {
    expect(assessProduction({ item: "x", planned: 250, produced: 198 })).toMatchObject({ gap: -52, percentOfPlan: 79.2 });
  });

  it("refuses a zero plan instead of dividing by it", () => {
    expect(() => assessProduction({ item: "x", planned: 0, produced: 5 })).toThrow(RangeError);
  });
});

describe("checkStock", () => {
  it("blocks an entry that takes stock below zero and reports the shortfall", () => {
    expect(checkStock(42, 60)).toEqual({ allowed: false, shortfall: 18 });
  });

  it("allows an entry that stock covers exactly", () => {
    expect(checkStock(60, 60)).toEqual({ allowed: true, shortfall: 0 });
  });
});

describe("outstandingTotals", () => {
  it("totals each party and scales bars to the largest", () => {
    const result = outstandingTotals(sampleOutstanding);
    expect(result.rows.map((row) => row.total)).toEqual([60500, 38400, 31900]);
    expect(result.grandTotal).toBe(130800);
    expect(result.rows[0]?.shareOfMax).toBe(1);
  });
});
