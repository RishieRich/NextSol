import { describe, expect, it } from "vitest";

import { rbiBankRate } from "@/content/tools";
import { addMonths, parseCalendarDate, type CalendarDate } from "./calendarDate";
import { formatPaise } from "./format";
import { computeGst } from "./gst";
import { stateLabel, validateGstin } from "./gstin";
import { computeTaxInvoice } from "./invoice";
import { parseAmount, parsePercent, parseQuantity } from "./money";
import { msmeInterest } from "./msme";
import { amountInWords } from "./words";

const date = (iso: string): CalendarDate => {
  const parsed = parseCalendarDate(iso);
  if (!parsed) throw new Error(`bad test date ${iso}`);
  return parsed;
};
const rupees = (n: number) => Math.round(n * 100);

describe("parseAmount", () => {
  it.each([
    ["1,17,800", 11780000],
    ["117800.5", 11780050],
    [" 1 000 ", 100000],
    ["0", 0],
    [".5", 50],
    ["1000.", 100000],
    ["99,99,99,999.99", 99999999999],
    ["₹1,180.00", 118000],
  ])("accepts %s", (input, paise) => {
    expect(parseAmount(input)).toEqual({ ok: true, paise });
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["-5", "negative"],
    ["1.234", "too-many-decimals"],
    ["1000000000000", "too-large"],
    ["1000000000.00", "too-large"],
    ["12a", "invalid"],
    ["1.2.3", "invalid"],
    [".", "invalid"],
  ])("rejects %s as %s", (input, error) => {
    expect(parseAmount(input)).toEqual({ ok: false, error });
  });

  it("parses rates and quantities", () => {
    expect(parsePercent("18")).toEqual({ ok: true, basisPoints: 1800 });
    expect(parsePercent("12.5")).toEqual({ ok: true, basisPoints: 1250 });
    expect(parsePercent("101").ok).toBe(false);
    expect(parsePercent("1.234").ok).toBe(false);
    expect(parseQuantity("2.125")).toEqual({ ok: true, milli: 2125 });
    expect(parseQuantity("1.2345").ok).toBe(false);
    expect(parseQuantity("0").ok).toBe(false);
  });
});

describe("formatPaise", () => {
  it("uses Indian grouping and two decimals", () => {
    expect(formatPaise(11780000)).toBe("₹1,17,800.00");
    expect(formatPaise(118000)).toBe("₹1,180.00");
    expect(formatPaise(5)).toBe("₹0.05");
    expect(formatPaise(99999999999)).toBe("₹99,99,99,999.99");
    expect(formatPaise(-30)).toBe("-₹0.30");
  });
});

describe("computeGst", () => {
  it.each([
    ["add", 1000, 18, 1000, 180, 90, 90, 1180],
    ["add", 1000, 5, 1000, 50, 25, 25, 1050],
    ["add", 2500, 40, 2500, 1000, 500, 500, 3500],
    ["remove", 1180, 18, 1000, 180, 90, 90, 1180],
    ["remove", 1000, 5, 952.38, 47.62, 23.81, 23.81, 1000],
    ["remove", 1000, 18, 847.46, 152.54, 76.27, 76.27, 1000],
  ] as const)("%s %s at %s%%", (mode, amount, rate, base, tax, cgst, sgst, total) => {
    const result = computeGst({ mode, amountPaise: rupees(amount), rateBasisPoints: rate * 100 });
    expect(result).toMatchObject({
      base: rupees(base),
      tax: rupees(tax),
      cgst: rupees(cgst),
      sgst: rupees(sgst),
      igst: 0,
      total: rupees(total),
    });
  });

  it("puts all the tax in IGST for an inter-state supply", () => {
    const result = computeGst({ mode: "add", amountPaise: 100000, rateBasisPoints: 1800, supply: "inter" });
    expect(result).toMatchObject({ cgst: 0, sgst: 0, igst: 18000, total: 118000 });
  });

  it("gives SGST the odd paisa", () => {
    const result = computeGst({ mode: "add", amountPaise: 1001, rateBasisPoints: 500 });
    expect(result).toMatchObject({ tax: 50, cgst: 25, sgst: 25 });
    expect(computeGst({ mode: "add", amountPaise: 100, rateBasisPoints: 500 })).toMatchObject({ tax: 5, cgst: 3, sgst: 2 });
  });

  it("refuses rates outside 0 to 100", () => {
    expect(() => computeGst({ mode: "add", amountPaise: 100, rateBasisPoints: 10001 })).toThrow(RangeError);
    expect(() => computeGst({ mode: "add", amountPaise: 100, rateBasisPoints: -1 })).toThrow(RangeError);
  });
});

describe("validateGstin", () => {
  it("accepts a valid GSTIN and decodes it", () => {
    const report = validateGstin("24AQJPN0910D1ZD");
    expect(report.valid).toBe(true);
    expect(report.decoded).toEqual({ stateCode: "24", stateName: "Gujarat", pan: "AQJPN0910D", entityNumber: "1" });
  });

  it("normalises spaces and case", () => {
    expect(validateGstin(" 24aqjpn0910d1zd ").valid).toBe(true);
  });

  it("fails only the check digit", () => {
    expect(validateGstin("24AQJPN0910D1ZA").checks).toEqual({ length: true, pattern: true, stateCode: true, checkDigit: false });
  });

  it("fails length", () => {
    const report = validateGstin("24AQJPN0910D1Z");
    expect(report.checks.length).toBe(false);
    expect(report.valid).toBe(false);
  });

  it("fails state code", () => {
    const report = validateGstin("40AQJPN0910D1ZD");
    expect(report.checks.stateCode).toBe(false);
    expect(report.valid).toBe(false);
  });

  it("names unverified states by code only", () => {
    expect(stateLabel("07")).toBe("State code 07");
    expect(stateLabel("26")).toBe("Dadra and Nagar Haveli and Daman and Diu");
  });
});

describe("msmeInterest", () => {
  const bankRatePercent = rbiBankRate.percent;

  it("uses the Bank Rate from content", () => {
    expect(bankRatePercent).toBe(5.75);
  });

  it.each([
    [100000, "2026-06-01", undefined, "2026-10-31", "2026-06-16", 137, 6626],
    [100000, "2026-06-01", 60, "2026-10-31", "2026-07-16", 107, 5115],
    [100000, "2026-06-01", 30, "2026-06-30", "2026-07-01", 0, 0],
    [250000, "2026-08-10", 45, "2026-10-31", "2026-09-24", 37, 4433],
  ] as const)("₹%s accepted %s, agreed %s, paid %s", (principal, accepted, agreed, paid, deadline, overdue, interest) => {
    const result = msmeInterest({
      principal: rupees(principal),
      acceptedOn: date(accepted),
      agreedDays: agreed,
      paidOn: date(paid),
      bankRatePercent,
    });
    expect(result.deadline).toEqual(date(deadline));
    expect(result.daysOverdue).toBe(overdue);
    expect(result.interest).toBe(rupees(interest));
    expect(result.totalPayable).toBe(rupees(principal + interest));
    expect(result.annualRatePercent).toBe(17.25);
  });

  it("caps an agreed period above 45 days", () => {
    const result = msmeInterest({ principal: 100, acceptedOn: date("2026-06-01"), agreedDays: 60, paidOn: date("2026-06-01"), bankRatePercent });
    expect(result).toMatchObject({ periodDays: 45, agreedDaysCapped: true });
  });

  it("splits vector A into 4 whole months and 15 days", () => {
    const result = msmeInterest({ principal: 10000000, acceptedOn: date("2026-06-01"), paidOn: date("2026-10-31"), bankRatePercent });
    expect(result).toMatchObject({ wholeMonths: 4, remainingDays: 15 });
  });
});

describe("calendar dates", () => {
  it("clamps month ends", () => {
    expect(addMonths(date("2026-01-31"), 1)).toEqual(date("2026-02-28"));
    expect(addMonths(date("2028-01-31"), 1)).toEqual(date("2028-02-29"));
    expect(addMonths(date("2026-12-15"), 1)).toEqual(date("2027-01-15"));
  });

  it("counts whole months from a month-end deadline", () => {
    // Deadline 2026-01-31 (accepted 2026-01-16 + 15 days); paid 2026-02-28 is exactly one whole month.
    const result = msmeInterest({ principal: 10000000, acceptedOn: date("2026-01-16"), paidOn: date("2026-02-28"), bankRatePercent: 5.75 });
    expect(result.deadline).toEqual(date("2026-01-31"));
    expect(result).toMatchObject({ wholeMonths: 1, remainingDays: 0, daysOverdue: 28 });
  });

  it("rejects impossible dates", () => {
    expect(parseCalendarDate("2026-02-29")).toBeNull();
    expect(parseCalendarDate("2026-13-01")).toBeNull();
    expect(parseCalendarDate("31/01/2026")).toBeNull();
  });
});

describe("amountInWords", () => {
  it.each([
    [0, "Rupees Zero Only"],
    [101, "Rupees One Hundred One Only"],
    [21004, "Rupees Twenty One Thousand Four Only"],
    [117800, "Rupees One Lakh Seventeen Thousand Eight Hundred Only"],
    [100000000, "Rupees Ten Crore Only"],
    [1234.5, "Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only"],
    [
      999999999.99,
      "Rupees Ninety Nine Crore Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine and Ninety Nine Paise Only",
    ],
  ])("%s", (amount, words) => {
    expect(amountInWords(rupees(amount))).toBe(words);
  });
});

describe("computeTaxInvoice", () => {
  const line = { description: "Item", hsn: "8471", qtyMilli: 10000, unit: "Nos", ratePaise: 10000, gstBasisPoints: 1800 };

  it("splits CGST and SGST when seller and place of supply match", () => {
    const invoice = computeTaxInvoice([line], { sellerState: "24", placeOfSupply: "24" });
    expect(invoice).toMatchObject({ supply: "intra", taxable: 100000, cgst: 9000, sgst: 9000, igst: 0, roundOff: 0, grandTotal: 118000 });
    expect(invoice.inWords).toBe("Rupees One Thousand One Hundred Eighty Only");
  });

  it("charges IGST across states", () => {
    const invoice = computeTaxInvoice([line], { sellerState: "24", placeOfSupply: "27" });
    expect(invoice).toMatchObject({ supply: "inter", cgst: 0, sgst: 0, igst: 18000, grandTotal: 118000 });
  });

  it("summarises by rate, rounds qty x rate, and rounds off to the rupee", () => {
    const invoice = computeTaxInvoice(
      [
        { ...line, qtyMilli: 2125, ratePaise: 3333 }, // 70.82625 -> 70.83
        { ...line, qtyMilli: 1000, ratePaise: 10000, gstBasisPoints: 500 },
      ],
      { sellerState: "24", placeOfSupply: "24" },
    );
    expect(invoice.lines.map((l) => l.taxable)).toEqual([7083, 10000]);
    expect(invoice.summary.map((row) => [row.gstBasisPoints, row.taxable, row.tax])).toEqual([
      [500, 10000, 500],
      [1800, 7083, 1275],
    ]);
    expect(invoice.subtotal).toBe(18858);
    expect(invoice.roundOff).toBe(42);
    expect(invoice.grandTotal).toBe(18900);
  });

  it("matches the hero sample's totals", () => {
    const sample = [
      { qtyMilli: 40000, ratePaise: 31000 },
      { qtyMilli: 200000, ratePaise: 1800 },
      { qtyMilli: 40000, ratePaise: 4500 },
    ].map((l) => ({ ...line, ...l }));
    const invoice = computeTaxInvoice(sample, { sellerState: "24", placeOfSupply: "24" });
    expect([invoice.taxable, invoice.cgst, invoice.sgst, invoice.grandTotal]).toEqual([1780000, 160200, 160200, 2100400]);
  });
});
