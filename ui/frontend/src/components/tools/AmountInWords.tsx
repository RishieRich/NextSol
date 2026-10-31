"use client";

import { useState, type FormEvent } from "react";

import { formatPaise } from "@/domain/format";
import { amountErrorMessage, parseAmount } from "@/domain/money";
import { amountInWords } from "@/domain/words";
import { CopyButton } from "./CopyButton";
import styles from "./ToolForm.module.css";

export function AmountInWords() {
  const [amount, setAmount] = useState("");
  const parsed = parseAmount(amount);
  const error = amount.trim() !== "" && !parsed.ok ? amountErrorMessage[parsed.error] : null;
  const words = parsed.ok ? amountInWords(parsed.paise) : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!parsed.ok) event.currentTarget.querySelector<HTMLElement>("#words-amount")?.focus();
  };

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="words-amount">
            Amount (₹)
          </label>
          <input
            id="words-amount"
            className={styles.input}
            inputMode="decimal"
            autoComplete="off"
            placeholder="1,17,800.50"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "words-amount-error" : "words-amount-hint"}
          />
          {error ? (
            <p id="words-amount-error" className={styles.error}>
              {error}
            </p>
          ) : (
            <p id="words-amount-hint" className={styles.hint}>
              Up to ₹99,99,99,999.99, with paise if you need them.
            </p>
          )}
        </div>
      </form>

      <div className={styles.result} aria-live="polite">
        {words && parsed.ok ? (
          <div className={styles.resultBody} key={words}>
            <p className={styles.working}>{formatPaise(parsed.paise)} in words:</p>
            <p className={styles.answer} data-testid="words-result">
              {words}
            </p>
            <CopyButton text={words} />
          </div>
        ) : (
          <p className={styles.empty}>Enter an amount to see it in words.</p>
        )}
      </div>
    </div>
  );
}
