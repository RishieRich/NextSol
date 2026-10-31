"use client";

import { useState, type FormEvent } from "react";

import { gstRates } from "@/content/tools";
import { formatPaise, formatPercent } from "@/domain/format";
import { computeGst, type GstMode, type Supply } from "@/domain/gst";
import { amountErrorMessage, parseAmount, parsePercent } from "@/domain/money";
import { CopyButton } from "./CopyButton";
import { SourceNote } from "./SourceNote";
import styles from "./ToolForm.module.css";

const OTHER = "other";

export function GstCalculator() {
  const [mode, setMode] = useState<GstMode>("add");
  const [amount, setAmount] = useState("");
  const [preset, setPreset] = useState<string>(String(gstRates.presets[1] ?? gstRates.presets[0]));
  const [otherRate, setOtherRate] = useState("");
  const [supply, setSupply] = useState<Supply>("intra");

  const parsedAmount = parseAmount(amount);
  const parsedRate = preset === OTHER ? parsePercent(otherRate) : parsePercent(preset);
  const amountError = amount.trim() !== "" && !parsedAmount.ok ? amountErrorMessage[parsedAmount.error] : null;
  const rateError = preset === OTHER && otherRate.trim() !== "" && !parsedRate.ok ? parsedRate.error : null;

  const result =
    parsedAmount.ok && parsedRate.ok
      ? computeGst({ mode, amountPaise: parsedAmount.paise, rateBasisPoints: parsedRate.basisPoints, supply })
      : null;

  const rate = result ? formatPercent(result.rateBasisPoints) : "";
  const half = result ? formatPercent(result.rateBasisPoints / 2) : "";
  const working = result
    ? mode === "add"
      ? `${formatPaise(result.base)} + ${rate} GST ${formatPaise(result.tax)} = ${formatPaise(result.total)}`
      : `${formatPaise(result.total)} includes ${rate} GST: ${formatPaise(result.base)} + GST ${formatPaise(result.tax)}`
    : "";
  const split = result
    ? supply === "intra"
      ? `CGST ${half} ${formatPaise(result.cgst)}, SGST ${half} ${formatPaise(result.sgst)}`
      : `IGST ${rate} ${formatPaise(result.igst)}`
    : "";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!parsedAmount.ok) form.querySelector<HTMLElement>("#gst-amount")?.focus();
    else if (!parsedRate.ok) form.querySelector<HTMLElement>("#gst-other")?.focus();
  };

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>What do you want to do?</legend>
          <div className={styles.choices}>
            {(
              [
                ["add", "Add GST to an amount"],
                ["remove", "Remove GST from an amount"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className={styles.choice}>
                <input type="radio" name="gst-mode" value={value} checked={mode === value} onChange={() => setMode(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="gst-amount">
            {mode === "add" ? "Amount before GST (₹)" : "Amount including GST (₹)"}
          </label>
          <input
            id="gst-amount"
            className={styles.input}
            inputMode="decimal"
            autoComplete="off"
            placeholder="1,000"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={Boolean(amountError)}
            aria-describedby={amountError ? "gst-amount-error" : undefined}
          />
          {amountError ? (
            <p id="gst-amount-error" className={styles.error}>
              {amountError}
            </p>
          ) : null}
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>GST rate</legend>
          <div className={styles.choices}>
            {gstRates.presets.map((value) => (
              <label key={value} className={styles.choice}>
                <input
                  type="radio"
                  name="gst-rate"
                  value={value}
                  checked={preset === String(value)}
                  onChange={() => setPreset(String(value))}
                />
                <span>{value}%</span>
              </label>
            ))}
            <label className={styles.choice}>
              <input type="radio" name="gst-rate" value={OTHER} checked={preset === OTHER} onChange={() => setPreset(OTHER)} />
              <span>Other</span>
            </label>
          </div>
          <SourceNote source={gstRates.source} prefix="Rates" />
        </fieldset>

        {preset === OTHER ? (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="gst-other">
              Other rate (%)
            </label>
            <input
              id="gst-other"
              className={styles.input}
              inputMode="decimal"
              autoComplete="off"
              placeholder="12"
              value={otherRate}
              onChange={(event) => setOtherRate(event.target.value)}
              aria-invalid={Boolean(rateError)}
              aria-describedby={rateError ? "gst-other-error" : undefined}
            />
            {rateError ? (
              <p id="gst-other-error" className={styles.error}>
                {rateError}
              </p>
            ) : null}
          </div>
        ) : null}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Where is the buyer?</legend>
          <div className={styles.choices}>
            {(
              [
                ["intra", "Same state (CGST + SGST)"],
                ["inter", "Another state (IGST)"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className={styles.choice}>
                <input type="radio" name="gst-supply" value={value} checked={supply === value} onChange={() => setSupply(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className={styles.result} aria-live="polite">
        {result ? (
          <div className={styles.resultBody} key={working + split}>
            <p className={styles.answer} data-testid="gst-working">
              {working}
            </p>
            <dl className={styles.figures}>
              <div>
                <dt>Before GST</dt>
                <dd>{formatPaise(result.base)}</dd>
              </div>
              {supply === "intra" ? (
                <>
                  <div>
                    <dt>CGST {half}</dt>
                    <dd>{formatPaise(result.cgst)}</dd>
                  </div>
                  <div>
                    <dt>SGST {half}</dt>
                    <dd>{formatPaise(result.sgst)}</dd>
                  </div>
                </>
              ) : (
                <div>
                  <dt>IGST {rate}</dt>
                  <dd>{formatPaise(result.igst)}</dd>
                </div>
              )}
              <div>
                <dt>Total</dt>
                <dd>{formatPaise(result.total)}</dd>
              </div>
            </dl>
            <CopyButton text={`${working}\n${split}`} />
          </div>
        ) : (
          <p className={styles.empty}>Enter an amount to see the GST.</p>
        )}
      </div>
    </div>
  );
}
