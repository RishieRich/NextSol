/**
 * The one place money, phone numbers and price bases are formatted.
 * Components never format these themselves.
 */

import type { Price } from "@/content/tally";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 67500 -> "₹67,500" (Indian digit grouping). */
export function formatInr(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`Cannot format an invalid amount: ${amount}`);
  }
  return inr.format(amount);
}

const basisSuffix: Record<Price["basis"], string> = {
  "one-time": "",
  "per-month": " a month",
  "per-year": " a year",
  "for-5-years": " for 5 years",
};

/** A price with its basis: "₹750 a month", "₹22,500". */
export function formatPrice(price: Price): string {
  return `${formatInr(price.amountInr)}${basisSuffix[price.basis]}`;
}

/** Whole years since a founding year, never negative. */
export function yearsSince(year: number, now: Date = new Date()): number {
  return Math.max(now.getFullYear() - year, 0);
}

const groupedRupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 11780000 paise -> "₹1,17,800.00" (Indian grouping, always two decimals, exact for integer paise). */
export function formatPaise(paise: number): string {
  if (!Number.isInteger(paise)) throw new RangeError(`Paise must be a whole number: ${paise}`);
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  return `${sign}₹${groupedRupees.format(Math.floor(abs / 100))}.${String(abs % 100).padStart(2, "0")}`;
}

/** 2125 thousandths -> "2.125", 10000 -> "10". */
export function formatQuantity(milli: number): string {
  const whole = Math.floor(milli / 1000);
  const fraction = String(milli % 1000).padStart(3, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : String(whole);
}

/** 1800 basis points -> "18%", 1250 -> "12.5%". */
export function formatPercent(basisPoints: number): string {
  return `${Number((basisPoints / 100).toFixed(2))}%`;
}

/** A rounded experience claim from the founding year: 11 years -> "10+". Never overstates. */
export function yearsClaim(foundedYear: number, now: Date = new Date()): number {
  const years = yearsSince(foundedYear, now);
  return years >= 10 ? Math.floor(years / 5) * 5 : years;
}

/** "919727671017" -> "tel:+919727671017" */
export function telHref(e164Digits: string): string {
  return `tel:+${e164Digits}`;
}
