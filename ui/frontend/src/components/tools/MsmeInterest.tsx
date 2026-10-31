"use client";

import { useState, type FormEvent } from "react";

import { rbiBankRate } from "@/content/tools";
import { compareDates, formatCalendarDate, parseCalendarDate } from "@/domain/calendarDate";
import { formatPaise } from "@/domain/format";
import { amountErrorMessage, parseAmount } from "@/domain/money";
import { annualRateFor, BANK_RATE_MULTIPLE, MAX_AGREED_DAYS, msmeInterest } from "@/domain/msme";
import { CopyButton } from "./CopyButton";
import { SourceNote } from "./SourceNote";
import styles from "./ToolForm.module.css";

type Field = "principal" | "accepted" | "agreed" | "paid";

export function MsmeInterest() {
  const [principal, setPrincipal] = useState("");
  const [accepted, setAccepted] = useState("");
  const [hasAgreement, setHasAgreement] = useState(false);
  const [agreed, setAgreed] = useState("");
  const [paid, setPaid] = useState("");

  const parsedPrincipal = parseAmount(principal);
  const acceptedOn = parseCalendarDate(accepted);
  const paidOn = parseCalendarDate(paid);
  const agreedDays = /^\d{1,4}$/.test(agreed.trim()) ? Number(agreed.trim()) : null;

  const errors: Partial<Record<Field, string>> = {};
  if (principal.trim() && !parsedPrincipal.ok) errors.principal = amountErrorMessage[parsedPrincipal.error];
  if (accepted && !acceptedOn) errors.accepted = "Enter a real date.";
  if (paid && !paidOn) errors.paid = "Enter a real date.";
  if (acceptedOn && paidOn && compareDates(paidOn, acceptedOn) < 0) errors.paid = "Payment date cannot be before acceptance.";
  if (hasAgreement && agreed.trim() && agreedDays === null) errors.agreed = "Enter the agreed period in whole days.";

  const ready =
    parsedPrincipal.ok && acceptedOn && paidOn && !errors.paid && (!hasAgreement || agreedDays !== null);
  const result = ready
    ? msmeInterest({
        principal: parsedPrincipal.paise,
        acceptedOn,
        agreedDays: hasAgreement ? (agreedDays ?? undefined) : undefined,
        paidOn,
        bankRatePercent: rbiBankRate.percent,
      })
    : null;

  const order: Field[] = ["principal", "accepted", "agreed", "paid"];
  const ids: Record<Field, string> = { principal: "msme-principal", accepted: "msme-accepted", agreed: "msme-agreed", paid: "msme-paid" };
  const describedBy = (field: Field) => (errors[field] ? `${ids[field]}-error` : undefined);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing: Partial<Record<Field, boolean>> = {
      principal: !parsedPrincipal.ok,
      accepted: !acceptedOn,
      agreed: hasAgreement && agreedDays === null,
      paid: !paidOn || Boolean(errors.paid),
    };
    const first = order.find((field) => missing[field]);
    if (first) event.currentTarget.querySelector<HTMLElement>(`#${ids[first]}`)?.focus();
  };

  const working = result
    ? result.interest === 0
      ? `Paid on or before the deadline of ${formatCalendarDate(result.deadline)}: no interest is due.`
      : `${formatPaise(parsedPrincipal.ok ? parsedPrincipal.paise : 0)} x (1 + ${result.annualRatePercent}% / 12)^${result.wholeMonths} x (1 + ${result.annualRatePercent}% x ${result.remainingDays} / 365), less the principal = ${formatPaise(result.interest)}`
    : "";

  const error = (field: Field) =>
    errors[field] ? (
      <p id={`${ids[field]}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={ids.principal}>
            Amount due on the invoice (₹)
          </label>
          <input
            id={ids.principal}
            className={styles.input}
            inputMode="decimal"
            autoComplete="off"
            placeholder="1,00,000"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            aria-invalid={Boolean(errors.principal)}
            aria-describedby={describedBy("principal")}
          />
          {error("principal")}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.accepted}>
              Goods or services accepted on
            </label>
            <input
              id={ids.accepted}
              type="date"
              className={styles.input}
              value={accepted}
              onChange={(event) => setAccepted(event.target.value)}
              aria-invalid={Boolean(errors.accepted)}
              aria-describedby={describedBy("accepted")}
            />
            {error("accepted")}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.paid}>
              Paid on (or today)
            </label>
            <input
              id={ids.paid}
              type="date"
              className={styles.input}
              value={paid}
              onChange={(event) => setPaid(event.target.value)}
              aria-invalid={Boolean(errors.paid)}
              aria-describedby={describedBy("paid")}
            />
            {error("paid")}
          </div>
        </div>

        <label className={styles.check}>
          <input type="checkbox" checked={hasAgreement} onChange={(event) => setHasAgreement(event.target.checked)} />
          There is a written agreement on the payment period
        </label>

        {hasAgreement ? (
          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.agreed}>
              Agreed period (days)
            </label>
            <input
              id={ids.agreed}
              className={styles.input}
              inputMode="numeric"
              autoComplete="off"
              placeholder="45"
              value={agreed}
              onChange={(event) => setAgreed(event.target.value)}
              aria-invalid={Boolean(errors.agreed)}
              aria-describedby={errors.agreed ? `${ids.agreed}-error` : `${ids.agreed}-hint`}
            />
            {errors.agreed ? (
              error("agreed")
            ) : (
              <p id={`${ids.agreed}-hint`} className={styles.hint}>
                The Act caps an agreed period at {MAX_AGREED_DAYS} days.
              </p>
            )}
          </div>
        ) : null}

        <div>
          <p className={styles.label}>
            Interest rate: {BANK_RATE_MULTIPLE} x RBI Bank Rate of {rbiBankRate.percent}% = {annualRateFor(rbiBankRate.percent)}% a
            year
          </p>
          <SourceNote source={rbiBankRate.source} prefix="Bank Rate" />
        </div>
      </form>

      <div className={styles.result} aria-live="polite">
        {result ? (
          <div className={styles.resultBody} key={working}>
            <p className={styles.answer} data-testid="msme-interest">
              Interest due: {formatPaise(result.interest)}
            </p>
            <p className={styles.working}>{working}</p>
            <dl className={styles.figures}>
              <div>
                <dt>Payment deadline</dt>
                <dd>{formatCalendarDate(result.deadline)}</dd>
              </div>
              <div>
                <dt>Days overdue</dt>
                <dd>{result.daysOverdue}</dd>
              </div>
              <div>
                <dt>Whole months + days</dt>
                <dd>
                  {result.wholeMonths} + {result.remainingDays}
                </dd>
              </div>
              <div>
                <dt>Total payable</dt>
                <dd>{formatPaise(result.totalPayable)}</dd>
              </div>
            </dl>
            {result.agreedDaysCapped ? (
              <p className={styles.hint}>The agreed period was more than {MAX_AGREED_DAYS} days, so {MAX_AGREED_DAYS} days is used.</p>
            ) : null}
            <CopyButton
              text={`Payment deadline ${formatCalendarDate(result.deadline)}, ${result.daysOverdue} days overdue. ${working}. Total payable ${formatPaise(result.totalPayable)}.`}
            />
          </div>
        ) : (
          <p className={styles.empty}>Enter the amount and both dates to see the interest.</p>
        )}
      </div>

      <p className={`${styles.notice} ${styles.result}`}>
        An estimate for planning, not legal advice. Disputes go to the Micro and Small Enterprises Facilitation Council.
      </p>
    </div>
  );
}
