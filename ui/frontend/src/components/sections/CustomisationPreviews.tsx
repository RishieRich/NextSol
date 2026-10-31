import type { JSX } from "react";

import { Icon } from "@/components/ui/Icon";
import type { Customisation } from "@/content/tally";
import {
  ageingBuckets,
  sampleBarcodeScan,
  sampleInvoice,
  sampleOutstanding,
  sampleProduction,
  sampleStockEntry,
} from "@/content/samples";
import { computeInvoice, formatAmount } from "@/domain/invoice";
import { formatInr } from "@/domain/format";
import { assessProduction, checkStock, outstandingTotals } from "@/domain/reports";
import styles from "./CustomisationPreviews.module.css";

const invoice = computeInvoice([...sampleInvoice.lines], sampleInvoice.gstRatePercent);
const production = sampleProduction.map(assessProduction);
const stock = checkStock(sampleStockEntry.available, sampleStockEntry.requested);
const outstanding = outstandingTotals(sampleOutstanding);
const statusLabel = { short: "Short", "on-plan": "On plan", ahead: "Ahead" } as const;

function InvoicePreview() {
  return (
    <div className={styles.doc}>
      <div className={styles.invHead}>
        <span className={styles.mark}>{sampleInvoice.seller.initials}</span>
        <div>
          <p className={styles.strong}>{sampleInvoice.seller.name}</p>
          <p className={styles.muted}>GSTIN {sampleInvoice.seller.gstin}</p>
        </div>
        <p className={styles.invTitle}>Tax Invoice</p>
      </div>
      <ul className={styles.invLines}>
        {invoice.lines.map((line) => (
          <li key={line.item}>
            <span>{line.item}</span>
            <span className="tabular">{formatAmount(line.amount)}</span>
          </li>
        ))}
      </ul>
      <div className={styles.invFoot}>
        <span className={styles.chip}>Logo</span>
        <span className={styles.chip}>Bank details</span>
        <span className={styles.chip}>UPI QR</span>
        <span className={styles.chip}>Terms</span>
        <p className={styles.invTotal}>₹{formatAmount(invoice.total)}</p>
      </div>
    </div>
  );
}

function ProductionPreview() {
  return (
    <div className={styles.doc}>
      <p className={styles.docTitle}>Production against plan, today</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Plan</th>
            <th scope="col">Made</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {production.map((row) => (
            <tr key={row.item}>
              <td>
                {row.item}
                <span className={styles.bar} aria-hidden="true">
                  <span style={{ width: `${Math.min(row.percentOfPlan, 110) / 1.1}%` }} data-status={row.status} />
                </span>
              </td>
              <td>{row.planned}</td>
              <td>{row.produced}</td>
              <td>
                <span className={styles.status} data-status={row.status}>
                  {statusLabel[row.status]} {row.percentOfPlan}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarcodePreview() {
  const { code, item, unit, rate } = sampleBarcodeScan;
  return (
    <div className={styles.doc}>
      <p className={styles.docTitle}>Sales voucher</p>
      <div className={styles.scanField}>
        <Icon name="scan" size={22} />
        <span>{code}</span>
        <span className={styles.laser} aria-hidden="true" />
      </div>
      <div className={styles.scanResult}>
        <Icon name="check" size={18} />
        <div>
          <p className={styles.strong}>{item}</p>
          <p className={styles.muted}>
            1 {unit} at {formatAmount(rate)}, GST {sampleBarcodeScan.gstRatePercent}% applied
          </p>
        </div>
        <span className={styles.added}>Added</span>
      </div>
      <p className={styles.muted}>Item, rate and tax filled from the barcode. Nothing typed.</p>
    </div>
  );
}

function StockPreview() {
  const { voucher, item, unit, available, requested } = sampleStockEntry;
  return (
    <div className={styles.doc}>
      <p className={styles.docTitle}>{voucher}</p>
      <dl className={styles.entry}>
        <div>
          <dt>Item</dt>
          <dd>{item}</dd>
        </div>
        <div>
          <dt>Quantity entered</dt>
          <dd>
            {requested} {unit}
          </dd>
        </div>
        <div>
          <dt>In stock</dt>
          <dd>
            {available} {unit}
          </dd>
        </div>
      </dl>
      {stock.allowed ? null : (
        <div className={styles.alert}>
          <span className={styles.alertIcon} aria-hidden="true">
            !
          </span>
          <div>
            <p className={styles.strong}>Entry blocked</p>
            <p>
              This would take stock {stock.shortfall} {unit} below zero.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OutstandingPreview() {
  return (
    <div className={styles.doc}>
      <p className={styles.docTitle}>Outstanding by party and age</p>
      <ul className={styles.ageList}>
        {outstanding.rows.map((row) => (
          <li key={row.party}>
            <div className={styles.ageHead}>
              <span>{row.party}</span>
              <span>{formatInr(row.total)}</span>
            </div>
            <span className={styles.stack} style={{ width: `${row.shareOfMax * 100}%` }} aria-hidden="true">
              {row.buckets.map((value, index) =>
                value > 0 ? <span key={index} data-bucket={index} style={{ flexGrow: value }} /> : null,
              )}
            </span>
          </li>
        ))}
      </ul>
      <ul className={styles.legend}>
        {ageingBuckets.map((label, index) => (
          <li key={label}>
            <span data-bucket={index} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const previews: Record<Customisation["id"], () => JSX.Element> = {
  invoice: InvoicePreview,
  production: ProductionPreview,
  barcode: BarcodePreview,
  stock: StockPreview,
  outstanding: OutstandingPreview,
};

export function CustomisationPreview({ id }: { id: Customisation["id"] }) {
  const Preview = previews[id];
  return <Preview />;
}
