import { SectionHeader } from "@/components/ui/SectionHeader";
import { editions, priceNote, type Source } from "@/content/tally";
import { formatPrice } from "@/domain/format";
import styles from "./EditionsTable.module.css";

const rows = [
  { label: "Who it fits", get: (id: "silver" | "gold") => editions[id].fitsWhen },
  { label: "Lifetime licence", get: (id: "silver" | "gold") => formatPrice(editions[id].lifetime) },
  { label: "Rental", get: (id: "silver" | "gold") => `From ${formatPrice(editions[id].rentalFrom)}` },
  { label: "TSS renewal", get: (id: "silver" | "gold") => formatPrice(editions[id].tssRenewal) },
] as const;

/** Every distinct source behind the prices in this table, listed once each. */
const sources: Source[] = [
  ...new Map(
    Object.values(editions)
      .flatMap((edition) => [edition.lifetime.source, edition.rentalFrom.source, edition.tssRenewal.source])
      .map((source) => [source.url, source]),
  ).values(),
];

export function EditionsTable() {
  return (
    <section className={styles.section} aria-labelledby="editions-title">
      <div className="container">
        <SectionHeader id="editions-title" title="TallyPrime editions side by side" />
        <div className={styles.wrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <td />
                <th scope="col">{editions.silver.name}</th>
                <th scope="col">{editions.gold.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.get("silver")}</td>
                  <td>{row.get("gold")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          {priceNote} Sources:{" "}
          {sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 ? "; " : null}
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}, {source.asOf}
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
