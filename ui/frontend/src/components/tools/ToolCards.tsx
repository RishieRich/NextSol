import Link from "next/link";

import { Icon, type IconName } from "@/components/ui/Icon";
import { toolHref, type Tool, type ToolId } from "@/content/tools";
import styles from "./ToolCards.module.css";

export const toolIcons: Record<ToolId, IconName> = {
  "gst-calculator": "calculator",
  "gst-invoice-generator": "invoice",
  "gstin-checker": "idBadge",
  "msme-payment-interest": "hourglass",
  "amount-in-words": "words",
};

/** Cards for the hub and related tools ("grid"), or one compact row for the home page ("strip"). */
export function ToolCards({ items, variant = "grid", headingLevel = 2 }: { items: Tool[]; variant?: "grid" | "strip"; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  if (variant === "strip") {
    return (
      <ul className={styles.strip}>
        {items.map((tool) => (
          <li key={tool.id}>
            <Link href={toolHref(tool)} className={styles.stripLink}>
              <Icon name={toolIcons[tool.id]} size={22} />
              <span>{tool.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.grid}>
      {items.map((tool) => (
        <li key={tool.id} className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name={toolIcons[tool.id]} size={26} />
          </span>
          <Heading className={styles.name}>{tool.name}</Heading>
          <p className={styles.summary}>{tool.summary}</p>
          <Link href={toolHref(tool)} className={styles.open} aria-label={`Open tool: ${tool.name}`}>
            Open tool
            <span aria-hidden="true"> →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
