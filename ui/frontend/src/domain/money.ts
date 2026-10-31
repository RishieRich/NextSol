/**
 * Money for the free tools: integer paise, rounded half up, parsed from what a visitor types.
 * Integer arithmetic only, so 18% of ₹1,000 is exactly ₹180.00 on every device.
 */

/** Largest amount the tools accept: ₹99,99,99,999.99. */
export const MAX_PAISE = 99_999_999_999;

export type AmountError = "empty" | "invalid" | "negative" | "too-many-decimals" | "too-large";

export type ParsedAmount = { ok: true; paise: number } | { ok: false; error: AmountError };

/** a / b rounded half up (away from zero), exact even when a * b would overflow a double. */
export function divRoundHalfUp(a: number, b: number): number {
  if (!(b > 0)) throw new RangeError("Divisor must be positive");
  const sign = a < 0 ? -1 : 1;
  const big = BigInt(Math.abs(Math.trunc(a)));
  const div = BigInt(Math.trunc(b));
  return sign * Number((big * 2n + div) / (div * 2n));
}

/** (a x b) / c rounded half up, multiplied in BigInt so large quantities times rates stay exact. */
export function mulDivRoundHalfUp(a: number, b: number, c: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) throw new RangeError("Expected non-negative integers");
  const div = BigInt(c);
  return Number((BigInt(a) * BigInt(b) * 2n + div) / (div * 2n));
}

/** "1,17,800", "117800.5", " 1 000 " -> paise. Rejects negatives, more than 2 decimals and amounts above MAX_PAISE. */
export function parseAmount(input: string): ParsedAmount {
  const cleaned = input.replace(/[\s,₹]/g, "");
  if (cleaned === "") return { ok: false, error: "empty" };
  if (cleaned.startsWith("-")) return { ok: false, error: "negative" };
  const match = /^(\d*)(?:\.(\d*))?$/.exec(cleaned);
  if (!match || ((match[1] ?? "") === "" && (match[2] ?? "") === "")) return { ok: false, error: "invalid" };
  const fraction = match[2] ?? "";
  if (fraction.length > 2) return { ok: false, error: "too-many-decimals" };
  const whole = (match[1] ?? "").replace(/^0+(?=\d)/, "") || "0";
  if (whole.length > 9) return { ok: false, error: "too-large" };
  const paise = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (paise > MAX_PAISE) return { ok: false, error: "too-large" };
  return { ok: true, paise };
}

export const amountErrorMessage: Record<AmountError, string> = {
  empty: "Enter an amount.",
  invalid: "Enter digits only, for example 1,17,800 or 1180.50.",
  negative: "Enter an amount of zero or more.",
  "too-many-decimals": "Use at most two digits after the decimal point.",
  "too-large": "Enter an amount up to ₹99,99,99,999.99.",
};

export type ParsedPercent = { ok: true; basisPoints: number } | { ok: false; error: string };

/** A rate from 0 to 100 with at most two decimals, as integer basis points: "18" -> 1800, "12.5" -> 1250. */
export function parsePercent(input: string): ParsedPercent {
  const cleaned = input.replace(/[\s%]/g, "");
  if (cleaned === "") return { ok: false, error: "Enter a rate." };
  if (!/^(\d+(\.\d{0,2})?|\.\d{1,2})$/.test(cleaned)) {
    return { ok: false, error: "Enter a rate from 0 to 100, with at most two decimals." };
  }
  const basisPoints = Math.round(Number(cleaned) * 100);
  if (basisPoints > 10000) return { ok: false, error: "Enter a rate from 0 to 100." };
  return { ok: true, basisPoints };
}

/** A quantity with at most three decimals, as thousandths: "2.5" -> 2500. */
export function parseQuantity(input: string): { ok: true; milli: number } | { ok: false; error: string } {
  const cleaned = input.replace(/[\s,]/g, "");
  if (!/^(\d+(\.\d{0,3})?|\.\d{1,3})$/.test(cleaned)) {
    return { ok: false, error: "Enter a quantity with at most three decimals." };
  }
  const milli = Math.round(Number(cleaned) * 1000);
  if (milli <= 0) return { ok: false, error: "Enter a quantity above zero." };
  if (milli > 999_999_999) return { ok: false, error: "Enter a smaller quantity." };
  return { ok: true, milli };
}
