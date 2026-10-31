"use client";

import { useState, type CSSProperties } from "react";

import { sampleInvoice } from "@/content/samples";
import { computeInvoice, formatAmount } from "@/domain/invoice";
import styles from "./InvoiceDemo.module.css";

type Mode = "custom" | "standard";

const totals = computeInvoice([...sampleInvoice.lines], sampleInvoice.gstRatePercent);
const halfRate = sampleInvoice.gstRatePercent / 2;

/** A fixed 21x21 pattern that reads as a payment QR. Decorative only, it encodes nothing. */
const qrCells: boolean[] = (() => {
  const size = 21;
  let seed = 7;
  const cells: boolean[] = [];
  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (inFinder(x, y)) {
        const fx = x >= size - 7 ? x - (size - 7) : x;
        const fy = y >= size - 7 ? y - (size - 7) : y;
        const ring = Math.max(Math.abs(fx - 3), Math.abs(fy - 3));
        cells.push(ring !== 2);
      } else {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        cells.push(seed % 100 < 46);
      }
    }
  }
  return cells;
})();

function Qr() {
  return (
    <svg viewBox="0 0 21 21" className={styles.qr} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      {qrCells.map((on, index) =>
        on ? <rect key={index} x={index % 21} y={Math.floor(index / 21)} width="1" height="1" /> : null,
      )}
    </svg>
  );
}

/** Each element gets a build delay so the customised invoice assembles once on page load. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function InvoiceDemo() {
  const [mode, setMode] = useState<Mode>("custom");
  const { seller, buyer } = sampleInvoice;

  return (
    <figure className={styles.stage}>
      <div className={styles.toggle} role="group" aria-label="Invoice style">
        <button type="button" aria-pressed={mode === "standard"} onClick={() => setMode("standard")}>
          Standard Tally
        </button>
        <button type="button" aria-pressed={mode === "custom"} onClick={() => setMode("custom")}>
          Customised by us
        </button>
        <span className={styles.toggleThumb} data-mode={mode} aria-hidden="true" />
      </div>

      <div className={styles.paper} data-mode={mode}>
        <header className={styles.top}>
          <div className={`${styles.seller} ${styles.build}`} style={delay(250)}>
            <span className={styles.sellerMark} aria-hidden="true">
              {seller.initials}
            </span>
            <div>
              <p className={styles.sellerName}>{seller.name}</p>
              <p className={styles.small}>{seller.address}</p>
              <p className={styles.small}>GSTIN {seller.gstin}</p>
            </div>
          </div>
          <div className={`${styles.meta} ${styles.build}`} style={delay(450)}>
            <p className={styles.docTitle}>Tax Invoice</p>
            <p className={styles.small}>No. {sampleInvoice.number}</p>
            <p className={styles.small}>{sampleInvoice.date}</p>
          </div>
        </header>

        <p className={`${styles.billTo} ${styles.build}`} style={delay(600)}>
          <span className={styles.small}>Bill to</span>
          <strong>
            {buyer.name}, {buyer.city}
          </strong>
        </p>

        <table className={`${styles.table} tabular`}>
          <thead className={styles.build} style={delay(700)}>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Qty</th>
              <th scope="col">Rate</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {totals.lines.map((line, index) => (
              <tr key={line.item} className={styles.build} style={delay(820 + index * 120)}>
                <td>
                  {line.item}
                  <span className={styles.hsn}>HSN {line.hsn}</span>
                </td>
                <td>
                  {line.qty} {line.unit}
                </td>
                <td>{formatAmount(line.rate)}</td>
                <td>{formatAmount(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.bottom}>
          <div className={`${styles.pay} ${styles.build} ${styles.customOnly}`} style={delay(1350)}>
            <Qr />
            <div>
              <p className={styles.payTitle}>Scan to pay by UPI</p>
              <p className={styles.small}>{sampleInvoice.terms}</p>
            </div>
          </div>

          <dl className={`${styles.sums} ${styles.build}`} style={delay(1200)}>
            <div>
              <dt>Taxable value</dt>
              <dd>{formatAmount(totals.taxable)}</dd>
            </div>
            <div>
              <dt>CGST {halfRate}%</dt>
              <dd>{formatAmount(totals.cgst)}</dd>
            </div>
            <div>
              <dt>SGST {halfRate}%</dt>
              <dd>{formatAmount(totals.sgst)}</dd>
            </div>
            <div className={styles.grand}>
              <dt>Total</dt>
              <dd>₹{formatAmount(totals.total)}</dd>
            </div>
          </dl>
        </div>

        <footer className={`${styles.sign} ${styles.build} ${styles.customOnly}`} style={delay(1500)}>
          For {seller.name}
          <span className={styles.signLine}>Authorised signatory</span>
        </footer>

        <span className={styles.stamp} aria-hidden="true">
          Your format
        </span>
      </div>

      <figcaption className={styles.caption}>
        Sample invoice for an invented company. Switch styles to see what a customisation changes.
      </figcaption>
    </figure>
  );
}
