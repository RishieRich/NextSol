import Link from "next/link";
import type { CSSProperties } from "react";

import { PlayOnView } from "@/components/motion/PlayOnView";
import { Emoji } from "@/components/ui/Emoji";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { insights } from "@/content/home";
import { sampleBarcodeScan, sampleGstSale } from "@/content/samples";
import { computeGst } from "@/domain/gst";
import { formatPaise, formatPercent } from "@/domain/format";
import styles from "./Insights.module.css";

/** Track GST demo: a sample sale at the sample item's GST rate, split with the same domain code as the free GST calculator. */
const gst = computeGst({ mode: "add", amountPaise: sampleGstSale.amountPaise, rateBasisPoints: sampleBarcodeScan.gstRatePercent * 100 });
const half = formatPercent((sampleBarcodeScan.gstRatePercent * 100) / 2);

const share = (part: number) => `${((part / gst.total) * 100).toFixed(2)}%`;

const [barcode, track, integration] = insights.items;

/** "Get powerful business insights": three tiles, each with a short live demo that plays once on view. */
export function Insights() {
  return (
    <section className={styles.section} aria-labelledby="insights-title">
      <div className="container">
        <SectionHeader id="insights-title" label={insights.label} title={insights.title} dot align="center" />

        <div className={styles.bento}>
          {barcode ? (
            <PlayOnView as="article" className={`fx-card ${styles.tile} ${styles.tileWide}`}>
              <div className={styles.tileText}>
                <Emoji name={barcode.emoji} size={56} />
                <h3>{barcode.title}</h3>
                <p>{barcode.body}</p>
              </div>
              <div className={styles.scanDemo} aria-hidden="true">
                <div className={styles.barcode}>
                  <span className={styles.bars} />
                  <span className={styles.laser} />
                  <span className={styles.code}>{sampleBarcodeScan.code}</span>
                </div>
                <div className={styles.voucherRow}>
                  <span>{sampleBarcodeScan.item}</span>
                  <span>{sampleBarcodeScan.unit}</span>
                  <span>GST {sampleBarcodeScan.gstRatePercent}%</span>
                </div>
              </div>
            </PlayOnView>
          ) : null}

          {track ? (
            <PlayOnView as="article" className={`fx-card ${styles.tile}`}>
              <div className={styles.tileText}>
                <Emoji name={track.emoji} size={56} />
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </div>
              <figure className={styles.gstDemo}>
                <div className={styles.split} aria-hidden="true">
                  <span className={styles.base} style={{ "--share": share(gst.base) } as CSSProperties} />
                  <span className={styles.cgst} style={{ "--share": share(gst.cgst) } as CSSProperties} />
                  <span className={styles.sgst} style={{ "--share": share(gst.sgst) } as CSSProperties} />
                </div>
                <figcaption className={styles.legend}>
                  <span>
                    <i className={styles.keyBase} /> Taxable {formatPaise(gst.base)}
                  </span>
                  <span>
                    <i className={styles.keyCgst} /> CGST {half} {formatPaise(gst.cgst)}
                  </span>
                  <span>
                    <i className={styles.keySgst} /> SGST {half} {formatPaise(gst.sgst)}
                  </span>
                </figcaption>
              </figure>
            </PlayOnView>
          ) : null}

          {integration ? (
            <PlayOnView as="article" className={`fx-card ${styles.tile}`}>
              <div className={styles.tileText}>
                <Emoji name={integration.emoji} size={56} />
                <h3>{integration.title}</h3>
                <p>{integration.body}</p>
              </div>
              <div className={styles.syncDemo} aria-hidden="true">
                <span className={styles.app}>
                  <Emoji name="web" size={36} shadow={false} />
                  Your app
                </span>
                <span className={styles.arrows}>
                  <span className={styles.arrowRight} />
                  <span className={styles.arrowLeft} />
                </span>
                <span className={styles.app}>
                  <Emoji name="tally" size={36} shadow={false} />
                  TallyPrime
                </span>
              </div>
            </PlayOnView>
          ) : null}

          <Link href="/tally-prime/#customisation" className={`fx-card ${styles.tile} ${styles.cta}`} data-spotlight="">
            <Emoji name="customisation" size={56} />
            <span className={styles.ctaTitle}>See what we can customise in Tally</span>
            <span className={styles.ctaLink}>
              Open the customisation explorer <Icon name="arrowRight" size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
