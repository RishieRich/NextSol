/**
 * Interest on delayed payments to micro and small enterprises (MSMED Act 2006, sections 15 and 16).
 * Deadline: 15 days from acceptance without a written agreement; an agreed period is capped at 45 days.
 * Interest: three times the RBI Bank Rate, compounded monthly; leftover days at simple interest.
 */

import { addDays, addMonths, compareDates, daysBetween, type CalendarDate } from "./calendarDate";

export const DEFAULT_PERIOD_DAYS = 15;
export const MAX_AGREED_DAYS = 45;
export const BANK_RATE_MULTIPLE = 3;

/** Section 16: three times the Bank Rate, as a percentage a year. */
export function annualRateFor(bankRatePercent: number): number {
  return Number((bankRatePercent * BANK_RATE_MULTIPLE).toFixed(4));
}

export type MsmeInput = {
  /** Paise. */
  principal: number;
  acceptedOn: CalendarDate;
  /** Days agreed in writing; leave out when there is no written agreement. */
  agreedDays?: number;
  paidOn: CalendarDate;
  bankRatePercent: number;
};

export type MsmeResult = {
  deadline: CalendarDate;
  periodDays: number;
  agreedDaysCapped: boolean;
  daysOverdue: number;
  wholeMonths: number;
  remainingDays: number;
  annualRatePercent: number;
  /** Paise, rounded to the rupee. */
  interest: number;
  totalPayable: number;
};

export function msmeInterest({ principal, acceptedOn, agreedDays, paidOn, bankRatePercent }: MsmeInput): MsmeResult {
  if (!Number.isInteger(principal) || principal < 0) throw new RangeError(`Invalid principal: ${principal}`);
  if (agreedDays !== undefined && (!Number.isInteger(agreedDays) || agreedDays < 0)) {
    throw new RangeError(`Invalid agreed period: ${agreedDays}`);
  }
  const periodDays = agreedDays === undefined ? DEFAULT_PERIOD_DAYS : Math.min(agreedDays, MAX_AGREED_DAYS);
  const deadline = addDays(acceptedOn, periodDays);
  const annualRatePercent = annualRateFor(bankRatePercent);
  const common = {
    deadline,
    periodDays,
    agreedDaysCapped: agreedDays !== undefined && agreedDays > MAX_AGREED_DAYS,
    annualRatePercent,
  };

  if (compareDates(paidOn, deadline) <= 0) {
    return { ...common, daysOverdue: 0, wholeMonths: 0, remainingDays: 0, interest: 0, totalPayable: principal };
  }

  let wholeMonths = 0;
  while (compareDates(addMonths(deadline, wholeMonths + 1), paidOn) <= 0) wholeMonths += 1;
  const remainingDays = daysBetween(addMonths(deadline, wholeMonths), paidOn);

  const annual = annualRatePercent / 100;
  const compounded = principal * (1 + annual / 12) ** wholeMonths;
  const amount = compounded * (1 + (annual * remainingDays) / 365);
  const interest = Math.round((amount - principal) / 100) * 100;

  return {
    ...common,
    daysOverdue: daysBetween(deadline, paidOn),
    wholeMonths,
    remainingDays,
    interest,
    totalPayable: principal + interest,
  };
}
