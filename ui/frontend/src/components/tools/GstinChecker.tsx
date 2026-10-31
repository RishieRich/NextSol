"use client";

import { useState, type FormEvent } from "react";

import { gstPortalUrl } from "@/content/tools";
import { validateGstin, type GstinCheck } from "@/domain/gstin";
import { CopyButton } from "./CopyButton";
import styles from "./ToolForm.module.css";

const checkLabels: Record<GstinCheck, string> = {
  length: "Has 15 characters",
  pattern: "Follows the GSTIN pattern (state code, PAN, entity number, Z, check character)",
  stateCode: "State code is 01 to 38, 97 or 99",
  checkDigit: "Check character matches the first 14 characters",
};

export function GstinChecker() {
  const [value, setValue] = useState("");
  const report = value.trim() ? validateGstin(value) : null;
  const errorId = report && !report.valid ? "gstin-error" : undefined;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!report?.valid) event.currentTarget.querySelector<HTMLElement>("#gstin-input")?.focus();
  };

  const summary = report?.decoded
    ? `GSTIN ${report.normalised} has a valid format and check digit. State: ${report.decoded.stateName}. PAN: ${report.decoded.pan}. Entity number: ${report.decoded.entityNumber}.`
    : "";

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="gstin-input">
            GSTIN
          </label>
          <input
            id="gstin-input"
            className={styles.input}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={20}
            placeholder="24AAAAA0000A1Z5"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={Boolean(errorId)}
            aria-describedby={errorId ?? "gstin-hint"}
          />
          {errorId ? (
            <p id={errorId} className={styles.error}>
              This is not a valid GSTIN. See which check failed below.
            </p>
          ) : (
            <p id="gstin-hint" className={styles.hint}>
              Spaces and lower case are fine; they are cleaned up for you.
            </p>
          )}
        </div>
      </form>

      <div className={styles.result} aria-live="polite">
        {report ? (
          <div className={styles.resultBody} key={report.normalised}>
            <p className={styles.answer} data-testid="gstin-verdict">
              {report.valid ? "Valid format and check digit" : "Not a valid GSTIN"}
            </p>
            <ul className={styles.checklist}>
              {(Object.keys(checkLabels) as GstinCheck[]).map((check) => (
                <li key={check}>
                  <span className={report.checks[check] ? styles.pass : styles.fail}>
                    {report.checks[check] ? "Pass" : "Fail"}
                  </span>
                  {checkLabels[check]}
                </li>
              ))}
            </ul>
            {report.decoded ? (
              <>
                <dl className={styles.figures}>
                  <div>
                    <dt>State</dt>
                    <dd>
                      {report.decoded.stateName} ({report.decoded.stateCode})
                    </dd>
                  </div>
                  <div>
                    <dt>PAN</dt>
                    <dd>{report.decoded.pan}</dd>
                  </div>
                  <div>
                    <dt>Entity number</dt>
                    <dd>{report.decoded.entityNumber}</dd>
                  </div>
                </dl>
                <CopyButton text={summary} />
              </>
            ) : null}
          </div>
        ) : (
          <p className={styles.empty}>Enter a GSTIN to check it.</p>
        )}
      </div>

      <p className={`${styles.notice} ${styles.result}`}>
        This checks the format and check digit only. To confirm a business is registered and active, search it on{" "}
        <a href={gstPortalUrl} target="_blank" rel="noopener noreferrer">
          gst.gov.in
        </a>
        .
      </p>
    </div>
  );
}
