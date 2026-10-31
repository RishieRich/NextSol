import styles from "./ToolForm.module.css";

type SourceLike = { label: string; url: string; asOf?: string };

/** "Source: Reserve Bank of India, current rates, October 2026", next to the figure it backs. */
export function SourceNote({ source, prefix = "Source" }: { source: SourceLike; prefix?: string }) {
  return (
    <p className={styles.source}>
      {prefix}:{" "}
      <a href={source.url} target="_blank" rel="noopener noreferrer">
        {source.label}
        {source.asOf ? `, ${source.asOf}` : ""}
      </a>
    </p>
  );
}
