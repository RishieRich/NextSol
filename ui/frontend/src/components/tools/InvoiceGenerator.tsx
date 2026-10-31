"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { gstRates } from "@/content/tools";
import { formatPaise, formatPercent, formatQuantity } from "@/domain/format";
import { stateCodes, stateLabel, validateGstin } from "@/domain/gstin";
import { computeTaxInvoice, type TaxInvoiceLine } from "@/domain/invoice";
import { amountErrorMessage, parseAmount, parsePercent, parseQuantity } from "@/domain/money";
import { SourceNote } from "./SourceNote";
import form from "./ToolForm.module.css";
import styles from "./InvoiceGenerator.module.css";

const STORAGE_KEY = "ns-invoice-draft-v1";

type LineDraft = { id: number; description: string; hsn: string; qty: string; unit: string; rate: string; gst: string };

type Draft = {
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerState: string;
  buyerName: string;
  buyerAddress: string;
  buyerGstin: string;
  placeOfSupply: string;
  number: string;
  date: string;
  upiId: string;
  lines: LineDraft[];
};

const defaultRate = String(gstRates.presets[1] ?? gstRates.presets[0]);

const newLine = (id: number): LineDraft => ({ id, description: "", hsn: "", qty: "1", unit: "Nos", rate: "", gst: defaultRate });

const emptyDraft: Draft = {
  sellerName: "",
  sellerAddress: "",
  sellerGstin: "",
  sellerState: "24",
  buyerName: "",
  buyerAddress: "",
  buyerGstin: "",
  placeOfSupply: "24",
  number: "",
  date: "",
  upiId: "",
  lines: [newLine(1)],
};

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    return Array.isArray(parsed.lines) && parsed.lines.length > 0 ? { ...emptyDraft, ...parsed } : null;
  } catch {
    return null;
  }
}

type LineErrors = Partial<Record<"qty" | "rate" | "gst", string>>;

function lineErrors(line: LineDraft): LineErrors {
  const errors: LineErrors = {};
  const qty = parseQuantity(line.qty);
  if (line.qty.trim() && !qty.ok) errors.qty = qty.error;
  const rate = parseAmount(line.rate);
  if (line.rate.trim() && !rate.ok) errors.rate = amountErrorMessage[rate.error];
  const gst = parsePercent(line.gst);
  if (!gst.ok) errors.gst = gst.error;
  return errors;
}

function toLine(line: LineDraft): TaxInvoiceLine | null {
  const qty = parseQuantity(line.qty);
  const rate = parseAmount(line.rate);
  const gst = parsePercent(line.gst);
  if (!qty.ok || !rate.ok || !gst.ok) return null;
  return {
    description: line.description.trim(),
    hsn: line.hsn.trim(),
    qtyMilli: qty.milli,
    unit: line.unit.trim(),
    ratePaise: rate.paise,
    gstBasisPoints: gst.basisPoints,
  };
}

export function InvoiceGenerator() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Restore the saved draft once, after hydration, so the static HTML matches the first render.
  useEffect(() => {
    const saved = readDraft();
    if (saved) setDraft(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage blocked or full: the tool keeps working, the draft just is not kept.
    }
  }, [draft, loaded]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const setLine = (id: number, key: keyof LineDraft, value: string) =>
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) => (line.id === id ? { ...line, [key]: value } : line)),
    }));
  const addLine = () =>
    setDraft((current) => ({ ...current, lines: [...current.lines, newLine(Math.max(0, ...current.lines.map((l) => l.id)) + 1)] }));
  const removeLine = (id: number) =>
    setDraft((current) => ({ ...current, lines: current.lines.length > 1 ? current.lines.filter((line) => line.id !== id) : current.lines }));
  const clear = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setDraft(emptyDraft);
  };

  const sellerGstin = draft.sellerGstin.trim() ? validateGstin(draft.sellerGstin) : null;
  const buyerGstin = draft.buyerGstin.trim() ? validateGstin(draft.buyerGstin) : null;
  const errorsByLine = new Map(draft.lines.map((line) => [line.id, lineErrors(line)]));
  const validLines = draft.lines.map(toLine).filter((line): line is TaxInvoiceLine => line !== null);
  const invoice = computeTaxInvoice(validLines, { sellerState: draft.sellerState, placeOfSupply: draft.placeOfSupply });

  const print = () => {
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    if (validLines.length === 0) {
      formRef.current?.querySelector<HTMLElement>('[name="rate"]')?.focus();
      return;
    }
    window.print();
  };

  const field = (id: string, label: string, key: keyof Draft, props: { optional?: boolean; error?: string | null; textarea?: boolean } = {}) => (
    <div className={form.field}>
      <label className={form.label} htmlFor={id}>
        {label} {props.optional ? <span className={form.optional}>(optional)</span> : null}
      </label>
      {props.textarea ? (
        <textarea id={id} className={form.input} rows={2} value={draft[key] as string} onChange={(e) => set(key, e.target.value as never)} />
      ) : (
        <input
          id={id}
          className={form.input}
          autoComplete="off"
          value={draft[key] as string}
          onChange={(e) => set(key, e.target.value as never)}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? `${id}-error` : undefined}
        />
      )}
      {props.error ? (
        <p id={`${id}-error`} className={form.error}>
          {props.error}
        </p>
      ) : null}
    </div>
  );

  const stateSelect = (id: string, label: string, key: "sellerState" | "placeOfSupply") => (
    <div className={form.field}>
      <label className={form.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={form.input} value={draft[key]} onChange={(e) => set(key, e.target.value)}>
        {stateCodes.map((code) => (
          <option key={code} value={code}>
            {code} {stateLabel(code) === `State code ${code}` ? "" : `- ${stateLabel(code)}`}
          </option>
        ))}
      </select>
    </div>
  );

  const gstinError = (report: ReturnType<typeof validateGstin> | null) =>
    report && !report.valid ? "This GSTIN fails the format or check digit." : null;

  return (
    <div className={styles.layout}>
      <form ref={formRef} className={`${form.card} ${form.form} ${styles.formPane}`} onSubmit={(e) => { e.preventDefault(); print(); }} noValidate>
        <fieldset className={form.fieldset}>
          <legend className={form.legend}>Your business</legend>
          <div className={form.form}>
            {field("inv-seller-name", "Business name", "sellerName")}
            {field("inv-seller-address", "Address", "sellerAddress", { textarea: true })}
            <div className={form.row}>
              {field("inv-seller-gstin", "GSTIN", "sellerGstin", { optional: true, error: gstinError(sellerGstin) })}
              {stateSelect("inv-seller-state", "Your state code", "sellerState")}
            </div>
          </div>
        </fieldset>

        <fieldset className={form.fieldset}>
          <legend className={form.legend}>Bill to</legend>
          <div className={form.form}>
            {field("inv-buyer-name", "Customer name", "buyerName")}
            {field("inv-buyer-address", "Address", "buyerAddress", { textarea: true, optional: true })}
            <div className={form.row}>
              {field("inv-buyer-gstin", "Customer GSTIN", "buyerGstin", { optional: true, error: gstinError(buyerGstin) })}
              {stateSelect("inv-place", "Place of supply", "placeOfSupply")}
            </div>
          </div>
        </fieldset>

        <div className={form.row}>
          {field("inv-number", "Invoice number", "number")}
          <div className={form.field}>
            <label className={form.label} htmlFor="inv-date">
              Invoice date
            </label>
            <input id="inv-date" type="date" className={form.input} value={draft.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>

        <fieldset className={form.fieldset}>
          <legend className={form.legend}>Items</legend>
          <ol className={styles.lines}>
            {draft.lines.map((line, index) => {
              const errors = errorsByLine.get(line.id) ?? {};
              const id = (key: string) => `inv-line-${line.id}-${key}`;
              const input = (key: keyof LineDraft, label: string, extra: { decimal?: boolean; error?: string } = {}) => (
                <div className={form.field}>
                  <label className={form.label} htmlFor={id(key)}>
                    {label}
                  </label>
                  <input
                    id={id(key)}
                    name={key}
                    className={form.input}
                    autoComplete="off"
                    inputMode={extra.decimal ? "decimal" : undefined}
                    value={line[key] as string}
                    onChange={(e) => setLine(line.id, key, e.target.value)}
                    aria-invalid={Boolean(extra.error)}
                    aria-describedby={extra.error ? `${id(key)}-error` : undefined}
                  />
                  {extra.error ? (
                    <p id={`${id(key)}-error`} className={form.error}>
                      {extra.error}
                    </p>
                  ) : null}
                </div>
              );
              return (
                <li key={line.id} className={styles.line} aria-label={`Item ${index + 1}`}>
                  <div className={styles.lineGrid}>
                    <div className={styles.wide}>{input("description", `Item ${index + 1} description`)}</div>
                    {input("hsn", "HSN / SAC")}
                    {input("qty", "Qty", { decimal: true, error: errors.qty })}
                    {input("unit", "Unit")}
                    {input("rate", "Rate (₹)", { decimal: true, error: errors.rate })}
                    {input("gst", "GST %", { decimal: true, error: errors.gst })}
                  </div>
                  {draft.lines.length > 1 ? (
                    <button type="button" className={styles.remove} onClick={() => removeLine(line.id)}>
                      Remove item {index + 1}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <Button variant="secondary" icon="plus" onClick={addLine}>
            Add item
          </Button>
          <SourceNote source={gstRates.source} prefix={`Common GST rates ${gstRates.presets.join("%, ")}%`} />
        </fieldset>

        {field("inv-upi", "UPI ID", "upiId", { optional: true })}

        <div className={form.actions}>
          <Button icon="printer" onClick={print}>
            Print or save as PDF
          </Button>
          <Button variant="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
        <p className={form.hint}>Your draft is kept in this browser only. Nothing is sent anywhere.</p>
        <p className={form.notice}>If your business must issue e-invoices, generate them through the IRP or Tally.</p>
      </form>

      <div className={styles.previewPane} aria-live="polite">
        <article className={styles.paper} data-print-root aria-label="Invoice preview">
          <header className={styles.top}>
            <div>
              <p className={styles.sellerName}>{draft.sellerName || "Your business name"}</p>
              {draft.sellerAddress ? <p className={styles.small}>{draft.sellerAddress}</p> : null}
              {draft.sellerGstin ? <p className={styles.small}>GSTIN {draft.sellerGstin.trim().toUpperCase()}</p> : null}
            </div>
            <div className={styles.meta}>
              <p className={styles.docTitle}>Tax Invoice</p>
              {draft.number ? <p className={styles.small}>No. {draft.number}</p> : null}
              {draft.date ? <p className={styles.small}>{draft.date.split("-").reverse().join("-")}</p> : null}
            </div>
          </header>

          <div className={styles.parties}>
            <div>
              <p className={styles.small}>Bill to</p>
              <p className={styles.strong}>{draft.buyerName || "Customer name"}</p>
              {draft.buyerAddress ? <p className={styles.small}>{draft.buyerAddress}</p> : null}
              {draft.buyerGstin ? <p className={styles.small}>GSTIN {draft.buyerGstin.trim().toUpperCase()}</p> : null}
            </div>
            <div className={styles.meta}>
              <p className={styles.small}>Place of supply</p>
              <p className={styles.strong}>{stateLabel(draft.placeOfSupply)}</p>
              <p className={styles.small}>{invoice.supply === "intra" ? "Intra-state: CGST + SGST" : "Inter-state: IGST"}</p>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Qty</th>
                <th scope="col">Rate</th>
                <th scope="col">GST</th>
                <th scope="col">Taxable</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {invoice.lines.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.small}>
                    Add an item with a rate to see it here.
                  </td>
                </tr>
              ) : (
                invoice.lines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      {line.description || `Item ${index + 1}`}
                      {line.hsn ? <span className={styles.hsn}>HSN/SAC {line.hsn}</span> : null}
                    </td>
                    <td>
                      {formatQuantity(line.qtyMilli)} {line.unit}
                    </td>
                    <td>{formatPaise(line.ratePaise)}</td>
                    <td>{formatPercent(line.gstBasisPoints)}</td>
                    <td>{formatPaise(line.taxable)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <dl className={styles.sums}>
            <div>
              <dt>Taxable value</dt>
              <dd>{formatPaise(invoice.taxable)}</dd>
            </div>
            {invoice.summary.map((row) =>
              invoice.supply === "intra" ? (
                <div key={row.gstBasisPoints} className={styles.pair}>
                  <div>
                    <dt>CGST {formatPercent(row.gstBasisPoints / 2)}</dt>
                    <dd>{formatPaise(row.cgst)}</dd>
                  </div>
                  <div>
                    <dt>SGST {formatPercent(row.gstBasisPoints / 2)}</dt>
                    <dd>{formatPaise(row.sgst)}</dd>
                  </div>
                </div>
              ) : (
                <div key={row.gstBasisPoints}>
                  <dt>IGST {formatPercent(row.gstBasisPoints)}</dt>
                  <dd>{formatPaise(row.igst)}</dd>
                </div>
              ),
            )}
            {invoice.roundOff !== 0 ? (
              <div>
                <dt>Round off</dt>
                <dd>{formatPaise(invoice.roundOff)}</dd>
              </div>
            ) : null}
            <div className={styles.grand}>
              <dt>Total</dt>
              <dd data-testid="invoice-total">{formatPaise(invoice.grandTotal)}</dd>
            </div>
          </dl>

          <p className={styles.words}>{invoice.inWords}</p>
          {draft.upiId.trim() ? <p className={styles.strong}>Pay by UPI: {draft.upiId.trim()}</p> : null}

          <footer className={styles.sign}>
            For {draft.sellerName || "your business"}
            <span className={styles.signLine}>Authorised signatory</span>
          </footer>
        </article>
      </div>
    </div>
  );
}
