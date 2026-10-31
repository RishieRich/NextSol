"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import { buildEnquiry, enquiryNeeds, whatsappUrl, type EnquiryField, type EnquiryInput } from "@/domain/enquiry";
import styles from "./EnquiryForm.module.css";

const empty: EnquiryInput = { name: "", business: "", phone: "", need: "", message: "" };
const fieldOrder: EnquiryField[] = ["name", "business", "phone", "need", "message"];

type Status = { kind: "idle" } | { kind: "sent"; url: string };

/**
 * Validates in the domain layer, then opens WhatsApp with the message typed in.
 * Nothing is stored or sent anywhere else: the visitor presses Send in WhatsApp.
 */
export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<EnquiryField, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: EnquiryField) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = buildEnquiry(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = fieldOrder.find((field) => result.errors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const url = whatsappUrl(business.whatsappE164, result.text);
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus({ kind: "sent", url });
  };

  const describedBy = (field: EnquiryField, hint?: string) =>
    [errors[field] ? `${field}-error` : null, hint ?? null].filter(Boolean).join(" ") || undefined;

  if (status.kind === "sent") {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.sentIcon} aria-hidden="true">
          <Icon name="check" size={26} />
        </span>
        <h3>WhatsApp is open with your message</h3>
        <p>Press send in WhatsApp and we will reply during working hours: {business.hours.display}.</p>
        <p className={styles.sentLinks}>
          <a href={status.url} target="_blank" rel="noopener noreferrer">
            WhatsApp did not open? Use this link
          </a>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => {
              setValues(empty);
              setStatus({ kind: "idle" });
            }}
          >
            Write another message
          </button>
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="enq-name">Your name</label>
          <input
            id="enq-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            required
          />
          {errors.name ? (
            <p id="name-error" className={styles.error}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="enq-business">
            Business name <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="enq-business"
            name="business"
            autoComplete="organization"
            value={values.business}
            onChange={update("business")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="enq-phone">
            Mobile number <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
          {errors.phone ? (
            <p id="phone-error" className={styles.error}>
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="enq-need">What do you need?</label>
          <select
            id="enq-need"
            name="need"
            value={values.need}
            onChange={update("need")}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={describedBy("need")}
            required
          >
            <option value="" disabled>
              Choose one
            </option>
            {enquiryNeeds.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
          {errors.need ? (
            <p id="need-error" className={styles.error}>
              {errors.need}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="enq-message">
          Anything we should know? <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
        />
        {errors.message ? (
          <p id="message-error" className={styles.error}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.submit}>
        <Button type="submit" size="lg" icon="chat">
          Send on WhatsApp
        </Button>
        <p className={styles.hint}>Opens WhatsApp with your message ready. Nothing is stored on this site.</p>
      </div>
    </form>
  );
}
